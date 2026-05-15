/**
 * Reconciliation, distributor settlement, snack COGS — used by Finance Dashboard & export.
 */

import { TICKETS, loadPosIssuedTickets, type TicketRecord } from "./ticketsData";
import { loadVoidBookingRefs, loadVoidTxnIds } from "./financeLedger";
import { TXN_DATA } from "./financeTransactionsSeed";
import { DISTRIBUTOR_FEE_RATE, SNACK_COGS_RATE } from "./commerceData";

function normRef(s: string) {
  return s.trim().toUpperCase();
}

/** Online catalog revenue (mock web bookings) — excludes cancelled & voided */
export function sumOnlineTicketCatalogRevenueVnd(voids: Set<string>): number {
  return TICKETS.filter((t) => t.status !== "cancelled" && !voids.has(normRef(t.bookingRef))).reduce((s, t) => s + t.price, 0);
}

/** Counter POS gross — excludes voided booking refs */
export function sumCounterPosGrossVnd(voids: Set<string>): number {
  return loadPosIssuedTickets()
    .filter((t) => !voids.has(normRef(t.bookingRef)))
    .reduce((s, t) => s + t.price, 0);
}

export interface ReconciliationSnapshot {
  onlineRevenueVnd: number;
  counterRevenueVnd: number;
  totalRevenueVnd: number;
}

export function computeReconciliation(): ReconciliationSnapshot {
  const voids = loadVoidBookingRefs();
  const onlineRevenueVnd = sumOnlineTicketCatalogRevenueVnd(voids);
  const counterRevenueVnd = sumCounterPosGrossVnd(voids);
  return {
    onlineRevenueVnd,
    counterRevenueVnd,
    totalRevenueVnd: onlineRevenueVnd + counterRevenueVnd,
  };
}

/** Ticket-only base for 50% distributor fee: online full ticket price + counter ticket subtotal */
export function distributorFeeBaseVnd(voids: Set<string>): number {
  const onlineTickets = sumOnlineTicketCatalogRevenueVnd(voids);
  const counterTickets = loadPosIssuedTickets()
    .filter((t) => !voids.has(normRef(t.bookingRef)))
    .reduce((s, t) => s + (t.posTicketRevenue ?? t.price), 0);
  return onlineTickets + counterTickets;
}

/** Snack / concession revenue: gateway combos (completed) + counter snack lines */
export function totalSnackSalesVnd(voids: Set<string>, voidTxnIds?: Set<string>): number {
  const txnVoid = voidTxnIds ?? loadVoidTxnIds();
  const gatewaySnack = TXN_DATA.filter(
    (t) => t.status === "completed" && !txnVoid.has(t.id),
  ).reduce((s, t) => s + t.comboAmt, 0);
  const counterSnack = loadPosIssuedTickets()
    .filter((t) => !voids.has(normRef(t.bookingRef)))
    .reduce((s, t) => s + (t.posSnackRevenue ?? 0), 0);
  return gatewaySnack + counterSnack;
}

export interface ProfitSnapshot extends ReconciliationSnapshot {
  distributorFeesVnd: number;
  snackCogsVnd: number;
  grossProfitVnd: number;
}

export function computeProfitSnapshot(): ProfitSnapshot {
  const voids = loadVoidBookingRefs();
  const voidTxn = loadVoidTxnIds();
  const rec = computeReconciliation();
  const feeBase = distributorFeeBaseVnd(voids);
  const distributorFeesVnd = Math.round(feeBase * DISTRIBUTOR_FEE_RATE);
  const snackRev = totalSnackSalesVnd(voids, voidTxn);
  const snackCogsVnd = Math.round(snackRev * SNACK_COGS_RATE);
  const grossProfitVnd = rec.totalRevenueVnd - distributorFeesVnd - snackCogsVnd;
  return {
    ...rec,
    distributorFeesVnd,
    snackCogsVnd,
    grossProfitVnd,
  };
}

export type SaleChannelBadge = "online-paid" | "counter-cash" | "counter-card";

export function badgeForPosPay(m: TicketRecord["posPayMethod"]): SaleChannelBadge {
  if (m === "cash") return "counter-cash";
  return "counter-card";
}

export function badgeForTxnMethod(method: string): SaleChannelBadge {
  if (method === "Cash") return "counter-cash";
  return "online-paid";
}

export function formatVndFull(n: number) {
  return `₫${n.toLocaleString("vi-VN")}`;
}
