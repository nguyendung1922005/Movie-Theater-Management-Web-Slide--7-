/**
 * Screen 3 — Ticket & Transaction Traceability
 * Searchable transaction history focused on Ticket ID / invoice verification.
 * Click any row to open a detailed invoice panel with QR code.
 */

import { useState, useEffect, useMemo } from 'react';
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  Search, X, CheckCircle2, AlertCircle, Clock,
  CreditCard, Smartphone, Banknote, Receipt,
  Film, MapPin, Hash, Users,
  ChevronRight, Download, Printer,
} from "lucide-react";
import { FinanceLayout, FC } from "../components/FinanceLayout";
import { FinanceReportPrint } from "../components/FinanceReportPrint";
import { TICKETS, loadPosIssuedTickets, type TicketRecord } from "../lib/ticketsData";
import { loadVoidBookingRefs, loadVoidTxnIds, markBookingRefVoid, markTxnVoid } from "../lib/financeLedger";
import { badgeForPosPay, badgeForTxnMethod, formatVndFull, type SaleChannelBadge } from "../lib/financeAccounting";
import { TXN_DATA, type PayMethod, type Transaction, type TxnStatus } from "../lib/financeTransactionsSeed";

type LedgerRow = {
  key: string;
  source: string;
  ref: string;
  movie: string;
  amountVnd: number;
  badge: SaleChannelBadge;
  voided: boolean;
  refundKind: "booking" | "txn";
  refundId: string;
};

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
const STATUS_CFG: Record<TxnStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", color: FC.green, bg: "rgba(16,185,129,0.12)",  icon: <CheckCircle2 size={12} /> },
  refunded:  { label: "Refunded",  color: FC.amber, bg: "rgba(245,158,11,0.12)", icon: <AlertCircle  size={12} /> },
  pending:   { label: "Pending",   color: FC.blue,  bg: "rgba(59,130,246,0.12)",  icon: <Clock        size={12} /> },
  failed:    { label: "Failed",    color: FC.red,   bg: "rgba(232,25,44,0.12)",   icon: <AlertCircle  size={12} /> },
};

const BADGE_LABEL: Record<SaleChannelBadge, string> = {
  "online-paid": "Online-Paid",
  "counter-cash": "Counter-Cash",
  "counter-card": "Counter-Card",
};

const METHOD_ICON: Record<PayMethod, React.ReactNode> = {
  Visa:       <CreditCard  size={13} />,
  Mastercard: <CreditCard  size={13} />,
  Momo:       <Smartphone  size={13} />,
  ZaloPay:    <Smartphone  size={13} />,
  Cash:       <Banknote    size={13} />,
};

/* ══════════════════════════════════
   INVOICE PANEL
══════════════════════════════════ */
function InvoicePanel({ txn }: { txn: Transaction }) {
  const sc = STATUS_CFG[txn.status];

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      backgroundColor: FC.card,
      border: `1px solid ${FC.border}`,
      borderRadius: 16, overflow: "hidden",
      animation: "fcFadeIn .22s both",
    }}>
      {/* Top accent */}
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

      {/* Invoice header */}
      <div style={{
        padding: "20px 22px 16px",
        borderBottom: `1px solid ${FC.border}`,
        backgroundColor: "rgba(255,255,255,0.015)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FC.dim }}>Invoice</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", fontFamily: "monospace", letterSpacing: "0.04em" }}>{txn.invoiceNo}</p>
          </div>
          <span style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 8,
            backgroundColor: sc.bg, color: sc.color,
            fontSize: "0.65rem", fontWeight: 800,
          }}>
            {sc.icon} {sc.label}
          </span>
        </div>

        {/* QR Code */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            padding: 8, borderRadius: 10,
            backgroundColor: "#fff",
            border: `2px solid ${FC.border}`,
            flexShrink: 0,
          }}>
            <QRCodeSVG
              value={`${txn.ticketId}|${txn.invoiceNo}|${txn.customer}|${txn.movie}`}
              size={72}
              bgColor="#ffffff"
              fgColor="#0a0a0f"
              level="M"
            />
          </div>
          <div>
            <p style={{ fontSize: "0.58rem", color: FC.dim, marginBottom: 3 }}>Ticket ID</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 900, color: "#fff", fontFamily: "monospace", letterSpacing: "0.04em" }}>{txn.ticketId}</p>
            <p style={{ fontSize: "0.6rem", color: FC.dim, marginTop: 6 }}>Auth Code</p>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: FC.amber, fontFamily: "monospace" }}>{txn.authCode}</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px", scrollbarWidth: "none" }}>

        {/* Customer */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FC.dim, marginBottom: 6 }}>Customer</p>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{txn.customer}</p>
          <p style={{ fontSize: "0.68rem", color: FC.muted, marginTop: 2 }}>{txn.email}</p>
          <p style={{ fontSize: "0.68rem", color: FC.muted }}>{txn.phone}</p>
        </div>

        {/* Booking */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FC.dim, marginBottom: 6 }}>Booking Details</p>
          {[
            { icon: <Film size={12} />,     label: "Movie",    value: txn.movie    },
            { icon: <MapPin size={12} />,   label: "Hall",     value: txn.hall     },
            { icon: <Clock size={12} />,    label: "Showtime", value: `${txn.showtime} · ${txn.displayDate}` },
            { icon: <Users size={12} />,    label: "Seats",    value: txn.seats.join(", ") },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              padding: "6px 10px", borderRadius: 8, marginBottom: 3,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: `1px solid ${FC.border}`,
            }}>
              <span style={{ color: FC.dim, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "0.58rem", color: FC.dim }}>{label}</span>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#fff", marginTop: 1 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FC.dim, marginBottom: 6 }}>Pricing Breakdown</p>
          <div style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: `1px solid ${FC.border}`,
            borderRadius: 10, overflow: "hidden",
          }}>
            {[
              { label: `${txn.tickets}× Ticket (${txn.hall})`, value: txn.ticketAmt },
              ...(txn.combos > 0 ? [{ label: `${txn.combos}× Combo`,       value: txn.comboAmt }] : []),
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 12px",
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
              }}>
                <span style={{ fontSize: "0.72rem", color: FC.muted }}>{item.label}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>₫{item.value.toLocaleString()}</span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 12px",
              backgroundColor: "rgba(232,25,44,0.06)",
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>TOTAL</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 900, color: FC.red, fontVariantNumeric: "tabular-nums" }}>₫{txn.gross.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <p style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: FC.dim, marginBottom: 6 }}>Payment</p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.02)",
            border: `1px solid ${FC.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: FC.muted }}>
              {METHOD_ICON[txn.method]}
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>{txn.method}</span>
            </div>
            <span style={{ fontSize: "0.65rem", color: FC.dim, fontFamily: "monospace" }}>AUTH: {txn.authCode}</span>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: "12px 22px",
        borderTop: `1px solid ${FC.border}`,
        display: "flex", gap: 8,
      }}>
        <button style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px", borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.04)",
          border: `1px solid ${FC.border}`,
          color: FC.muted, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
        }}>
          <Printer size={13} /> Print
        </button>
        <button style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "8px", borderRadius: 10,
          background: "linear-gradient(135deg,#e8192c,#c8111f)",
          border: "none",
          color: "#fff", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(232,25,44,0.3)",
        }}>
          <Download size={13} /> Export PDF
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   PAGE
══════════════════════════════════ */

function buildLedgerRows(voidRefs: Set<string>, voidTxn: Set<string>, posTickets: TicketRecord[]) {
  const rows: LedgerRow[] = [];
  for (const t of TICKETS) {
    if (t.status === "cancelled") continue;
    const norm = t.bookingRef.trim().toUpperCase();
    const voided = voidRefs.has(norm);
    rows.push({
      key: t.id,
      source: "Online",
      ref: t.bookingRef,
      movie: t.movie,
      amountVnd: t.price,
      badge: "online-paid",
      voided,
      refundKind: "booking",
      refundId: t.bookingRef,
    });
  }
  for (const p of posTickets) {
    const norm = p.bookingRef.trim().toUpperCase();
    const voided = voidRefs.has(norm);
    rows.push({
      key: p.id,
      source: "Counter POS",
      ref: p.bookingRef,
      movie: p.movie,
      amountVnd: p.posTicketRevenue ?? 0,
      badge: badgeForPosPay(p.posPayMethod),
      voided,
      refundKind: "booking",
      refundId: p.bookingRef,
    });
  }
  for (const x of TXN_DATA) {
    const voided = voidTxn.has(x.id) || x.status === "refunded";
    rows.push({
      key: `txn-${x.id}`,
      source: "Gateway",
      ref: x.id,
      movie: x.movie,
      amountVnd: x.gross,
      badge: badgeForTxnMethod(x.method),
      voided,
      refundKind: "txn",
      refundId: x.id,
    });
  }
  return rows.sort((a, b) => b.amountVnd - a.amountVnd);
}

export function FinanceTransactions() {
  const [search, setSearch] = useState("");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [voidRefs, setVoidRefs] = useState<Set<string>>(new Set());
  const [voidTxn, setVoidTxn] = useState<Set<string>>(new Set());
  const [posTickets, setPosTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TxnStatus | "All">("All");
  const [selected,    setSelected]    = useState<Transaction | null>(TXN_DATA[0]);
  const [ledgerTick,  setLedgerTick]  = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [refs, txnIds, tickets] = await Promise.all([
          loadVoidBookingRefs(),
          loadVoidTxnIds(),
          loadPosIssuedTickets()
        ]);
        setVoidRefs(refs);
        setVoidTxn(txnIds);
        setPosTickets(tickets);
      } catch (error) {
        console.error('Error loading finance data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const ledgerRows = useMemo(() => {
    void ledgerTick;
    return buildLedgerRows(voidRefs, voidTxn, posTickets);
  }, [ledgerTick, voidRefs, voidTxn, posTickets]);

  const filtered = useMemo(() =>
    TXN_DATA.filter(t => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.ticketId.toLowerCase().includes(q) ||
        t.invoiceNo.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.movie.toLowerCase().includes(q) ||
        t.authCode.toLowerCase().includes(q)
      );
    }),
    [search, statusFilter]
  );

  const STATUS_TABS: Array<{ id: TxnStatus | "All"; label: string }> = [
    { id: "All",       label: `All (${TXN_DATA.length})`                                       },
    { id: "completed", label: `Completed (${TXN_DATA.filter(t=>t.status==="completed").length})`},
    { id: "refunded",  label: `Refunded (${TXN_DATA.filter(t=>t.status==="refunded").length})`  },
    { id: "pending",   label: `Pending (${TXN_DATA.filter(t=>t.status==="pending").length})`    },
    { id: "failed",    label: `Failed (${TXN_DATA.filter(t=>t.status==="failed").length})`      },
  ];

  function onRefundLedger(row: LedgerRow) {
    if (row.voided) return;
    if (row.refundKind === "booking") markBookingRefVoid(row.refundId);
    else markTxnVoid(row.refundId);
    setLedgerTick((n) => n + 1);
    toast.success("Transaction voided", { description: `${row.ref} · removed from active revenue.` });
  }

  return (
    <FinanceLayout
      activeNav="transactions"
      title="Transaction Traceability"
      subtitle="Ticket verification · Invoice lookup · Audit trail"
      actions={
        <FinanceReportPrint title="Transaction ledger export" subtitle={`${ledgerRows.length} line items`}>
          <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #cbd5e1" }}>
                {["Source", "Reference", "Movie", "Amount", "Channel", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "4px 2px", color: "#475569", fontWeight: 800 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledgerRows.slice(0, 60).map((r) => (
                <tr key={r.key} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "4px 2px" }}>{r.source}</td>
                  <td style={{ padding: "4px 2px", fontFamily: "monospace", fontSize: 9 }}>{r.ref}</td>
                  <td style={{ padding: "4px 2px" }}>{r.movie}</td>
                  <td style={{ padding: "4px 2px", fontWeight: 700 }}>{formatVndFull(r.amountVnd)}</td>
                  <td style={{ padding: "4px 2px" }}>{BADGE_LABEL[r.badge]}</td>
                  <td style={{ padding: "4px 2px" }}>{r.voided ? "Void" : "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FinanceReportPrint>
      }
    >
      <div style={{ padding: "20px 28px 36px", display: "flex", flexDirection: "column", gap: 16, minHeight: "calc(100vh - 100px)" }}>

        {/* ── UNIFIED LEDGER ── */}
        <div style={{ backgroundColor: FC.card, border: `1px solid ${FC.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${FC.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Individual sale lines</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.68rem", color: FC.dim }}>
                Catalog + POS localStorage + gateway seed · Accountant refund marks Void in browser storage
              </p>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#22d3ee", fontWeight: 700 }}>{ledgerRows.length} rows</span>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 280 }}>
            {ledgerRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6" style={{ color: FC.dim }}>
                <Receipt size={40} style={{ opacity: 0.25, marginBottom: 12 }} />
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>No data available</p>
                <p style={{ fontSize: "0.78rem", marginTop: 6, textAlign: "center", maxWidth: 320 }}>
                  No catalog, POS, or gateway rows match current filters. Run a counter sale or refresh seed data.
                </p>
              </div>
            ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem" }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${FC.border}` }}>
                  {["Source", "Reference", "Title", "Amount", "Channel", "Status", "Accountant"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === "Accountant" ? "right" : "left",
                        padding: "8px 14px",
                        fontSize: "0.58rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        color: FC.dim,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ledgerRows.map((r, i) => (
                  <tr
                    key={r.key}
                    style={{
                      backgroundColor: i % 2 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderBottom: `1px solid rgba(255,255,255,0.04)`,
                      transition: "background-color 200ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(6,182,212,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = i % 2 ? "rgba(255,255,255,0.02)" : "transparent";
                    }}
                  >
                    <td style={{ padding: "8px 14px", color: FC.muted }}>{r.source}</td>
                    <td style={{ padding: "8px 14px", fontFamily: "monospace", color: "#7dd3fc", fontSize: "0.7rem" }}>{r.ref}</td>
                    <td style={{ padding: "8px 14px", color: "#fff", fontWeight: 600 }}>{r.movie}</td>
                    <td style={{ padding: "8px 14px", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>₫{r.amountVnd.toLocaleString()}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "3px 8px",
                          borderRadius: 999,
                          fontSize: "0.58rem",
                          fontWeight: 800,
                          border: `1px solid ${
                            r.badge === "online-paid"
                              ? "rgba(6,182,212,0.35)"
                              : r.badge === "counter-cash"
                                ? "rgba(245,158,11,0.35)"
                                : "rgba(139,92,246,0.35)"
                          }`,
                          color: r.badge === "online-paid" ? "#22d3ee" : r.badge === "counter-cash" ? FC.amber : "#c4b5fd",
                          backgroundColor:
                            r.badge === "online-paid"
                              ? "rgba(6,182,212,0.1)"
                              : r.badge === "counter-cash"
                                ? "rgba(245,158,11,0.1)"
                                : "rgba(139,92,246,0.1)",
                        }}
                      >
                        {BADGE_LABEL[r.badge]}
                      </span>
                    </td>
                    <td style={{ padding: "8px 14px" }}>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color: r.voided ? FC.red : FC.green,
                        }}
                      >
                        {r.voided ? "Void" : "Active"}
                      </span>
                    </td>
                    <td style={{ padding: "8px 14px", textAlign: "right" }}>
                      {!r.voided ? (
                        <button
                          type="button"
                          onClick={() => onRefundLedger(r)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: 8,
                            border: `1px solid rgba(232,25,44,0.35)`,
                            backgroundColor: FC.redSoft,
                            color: FC.red,
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Refund
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.62rem", color: FC.dim }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>

        {/* ── LEFT PANEL (list) ── */}
        <div style={{
          width: 460, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12,
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "0 14px", height: 44, borderRadius: 14,
            backgroundColor: FC.card,
            border: `1px solid ${search ? "rgba(255,255,255,0.15)" : FC.border}`,
          }}>
            <Search size={14} color={FC.dim} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Ticket ID, Transaction ID, customer…"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: "0.83rem", caretColor: FC.red,
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: FC.dim, padding: 0 }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <div style={{ display: "flex", gap: 4, padding: "4px", borderRadius: 12, backgroundColor: FC.card, border: `1px solid ${FC.border}` }}>
            {STATUS_TABS.map(tab => {
              const active = statusFilter === tab.id;
              const sc = tab.id !== "All" ? STATUS_CFG[tab.id] : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    flex: 1, padding: "6px 4px", borderRadius: 9,
                    backgroundColor: active ? (sc?.bg ?? FC.redSoft) : "transparent",
                    border: `1px solid ${active ? (sc?.color ?? FC.red) + "35" : "transparent"}`,
                    color: active ? (sc?.color ?? FC.red) : FC.dim,
                    fontSize: "0.58rem", fontWeight: active ? 700 : 500,
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "background-color 200ms ease, color 200ms ease, border-color 200ms ease",
                  }}
                >{tab.label}</button>
              );
            })}
          </div>

          {/* Result count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.68rem", color: FC.dim }}>
              <strong style={{ color: "#fff" }}>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""}
            </span>
            {search && (
              <button onClick={() => setSearch("")} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.65rem", color: FC.dim, background: "none", border: "none", cursor: "pointer" }}>
                <X size={9} /> Clear
              </button>
            )}
          </div>

          {/* Transaction list */}
          <div style={{
            flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4,
            scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.07) transparent",
          }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <Receipt size={32} color={FC.dimmer} style={{ margin: "0 auto 12px" }} />
                <p style={{ color: FC.dim, fontSize: "0.85rem" }}>No transactions found</p>
                <p style={{ color: FC.dimmer, fontSize: "0.72rem", marginTop: 4 }}>Try a different search term</p>
              </div>
            ) : (
              filtered.map(t => {
                const sc  = STATUS_CFG[t.status];
                const sel = selected?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 12, textAlign: "left",
                      backgroundColor: sel ? FC.redSoft : "rgba(255,255,255,0.02)",
                      border: `1px solid ${sel ? "rgba(232,25,44,0.3)" : FC.border}`,
                      cursor: "pointer",
                      transition: "background-color 200ms ease, border-color 200ms ease",
                    }}
                  >
                    {/* Status dot */}
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      backgroundColor: sc.color,
                      boxShadow: sel ? `0 0 6px ${sc.color}` : "none",
                    }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: sel ? FC.red : "#fff", fontFamily: "monospace" }}>
                          {t.ticketId}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                          ₫{t.gross.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        <span style={{ fontSize: "0.68rem", color: FC.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.customer} · {t.movie}
                        </span>
                        <span style={{ fontSize: "0.62rem", color: FC.dim, flexShrink: 0, marginLeft: 6 }}>{t.showtime}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: "0.58rem", color: FC.dim, fontFamily: "monospace" }}>{t.id}</span>
                        <span style={{ fontSize: "0.58rem", color: sc.color, fontWeight: 700 }}>{sc.label}</span>
                      </div>
                    </div>

                    <ChevronRight size={12} color={sel ? FC.red : FC.dimmer} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL (invoice detail) ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {selected ? (
            <InvoicePanel key={selected.id} txn={selected} />
          ) : (
            <div style={{
              height: "100%",
              backgroundColor: FC.card,
              border: `1px solid ${FC.border}`,
              borderRadius: 16,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <Receipt size={40} color={FC.dimmer} />
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: FC.dim }}>Select a transaction</p>
              <p style={{ fontSize: "0.72rem", color: FC.dimmer }}>Click any record on the left to view its invoice details</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </FinanceLayout>
  );
}
