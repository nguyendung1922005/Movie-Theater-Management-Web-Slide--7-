/**
 * Screen 1 — Financial Dashboard (Accountant's Home Page)
 * KPI summary cards · 30-day Area Chart · Revenue Pie · Recent Transactions
 */

import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Ticket, Popcorn,
  Film, DollarSign, ArrowUpRight, ArrowDownRight,
  CreditCard, Smartphone, Banknote, ChevronRight,
  Clock, Users, Loader2,
} from "lucide-react";
import { FinanceLayout, FC } from "../components/FinanceLayout";
import { FinanceReportPrint } from "../components/FinanceReportPrint";
import { computeProfitSnapshot, distributorFeeBaseVnd, formatVndFull, totalSnackSalesVnd } from "../lib/financeAccounting";
import { loadVoidBookingRefs } from "../lib/financeLedger";
import { DISTRIBUTOR_FEE_RATE, SNACK_COGS_RATE } from "../lib/commerceData";

/* ══════════════════════════════════
   DETERMINISTIC CHART DATA
   (seeded — no Math.random in render)
══════════════════════════════════ */
const rng = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// 30 days from April 9 → May 8, 2026
const CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 3, 9 + i);
  const dow = d.getDay();
  const isWknd = [0, 5, 6].includes(dow);
  const base = 42 + i * 0.55;
  const mult = isWknd ? 1.48 : 1;
  const noise = rng(i * 13) * 0.32 - 0.12;
  const total = Math.round(base * mult * (1 + noise));
  const tickets = Math.round(total * 0.74);
  const combos  = total - tickets;
  return {
    date:    `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`,
    label:   d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total:   total,   // in millions ₫
    tickets: tickets,
    combos:  combos,
  };
});

const todayData = CHART_DATA[29];
const yesterdayData = CHART_DATA[28];

/* ══════════════════════════════════
   PIE DATA
══════════════════════════════════ */
const PIE_DATA = [
  { name: "Ticket Revenue", value: 74, amount: 634_200_000, color: "#e8192c" },
  { name: "Combo Sales",    value: 20, amount: 171_400_000, color: "#f97316" },
  { name: "Premium Extras", value:  6, amount:  51_400_000, color: "#8b5cf6" },
];

const PIE_TOTAL = PIE_DATA.reduce((s, d) => s + d.amount, 0);

/* ══════════════════════════════════
   RECENT TRANSACTIONS
══════════════════════════════════ */
const PAYMENT_ICONS: Record<string, React.ReactNode> = {
  "Visa":    <CreditCard size={11} />,
  "Momo":    <Smartphone size={11} />,
  "ZaloPay": <Smartphone size={11} />,
  "Cash":    <Banknote size={11} />,
};

const RECENT_TXN = [
  { id:"TXN-A4F2E891", ticketId:"TKT260508-00892", customer:"Nguyen T. Anh",   movie:"Your Name",    hall:"IMAX",        time:"14:32", amount:360_000, method:"Momo",    status:"completed" },
  { id:"TXN-B3C7D245", ticketId:"TKT260508-00891", customer:"Tran M. Khoa",    movie:"Neon Horizon", hall:"Hall 1",      time:"14:28", amount:180_000, method:"Visa",    status:"completed" },
  { id:"TXN-F9A1E320", ticketId:"TKT260508-00890", customer:"Le Q. Hung",      movie:"Code Black",   hall:"Dolby Atmos", time:"14:15", amount:300_000, method:"ZaloPay", status:"completed" },
  { id:"TXN-C2B8F671", ticketId:"TKT260508-00889", customer:"Pham T. Lan",     movie:"Your Name",    hall:"IMAX",        time:"13:55", amount:449_000, method:"Visa",    status:"completed" },
  { id:"TXN-E5D4A983", ticketId:"TKT260508-00888", customer:"Vo H. Dung",      movie:"Iron Legacy",  hall:"Hall 3",      time:"13:42", amount:270_000, method:"Cash",    status:"completed" },
  { id:"TXN-G7F6B104", ticketId:"TKT260508-00887", customer:"Hoang T. Minh",   movie:"Dark Hollow",  hall:"Hall 2",      time:"13:30", amount:145_000, method:"Momo",    status:"refunded"  },
  { id:"TXN-H8C9A215", ticketId:"TKT260508-00886", customer:"Dang K. Nam",     movie:"Void Runner",  hall:"IMAX",        time:"13:11", amount:539_000, method:"Visa",    status:"completed" },
  { id:"TXN-I1B0D326", ticketId:"TKT260508-00885", customer:"Bui T. Thu",      movie:"Neon Horizon", hall:"4DX",         time:"12:58", amount:220_000, method:"ZaloPay", status:"completed" },
  { id:"TXN-J2A3E437", ticketId:"TKT260508-00884", customer:"Nguyen V. Long",  movie:"Code Black",   hall:"Dolby Atmos", time:"12:44", amount:150_000, method:"Cash",    status:"pending"   },
  { id:"TXN-K4D5F548", ticketId:"TKT260508-00883", customer:"Ly T. Hoa",       movie:"Your Name",    hall:"IMAX",        time:"12:22", amount:360_000, method:"Momo",    status:"completed" },
];

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function vnd(n: number, decimals = 0): string {
  if (n >= 1_000_000_000) return `₫${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `₫${(n / 1_000_000).toFixed(decimals)}M`;
  return `₫${n.toLocaleString()}`;
}

function pct(now: number, prev: number) {
  const d = ((now - prev) / prev) * 100;
  return { val: Math.abs(d).toFixed(1), up: d >= 0 };
}

/* ══════════════════════════════════
   CUSTOM CHART TOOLTIP
══════════════════════════════════ */
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "#0f0f1e",
      border: `1px solid ${FC.borderHi}`,
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
      minWidth: 180,
    }}>
      <p style={{ fontSize: "0.7rem", color: FC.muted, marginBottom: 6 }}>{payload[0]?.payload?.label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 3 }}>
          <span style={{ fontSize: "0.72rem", color: p.color }}>{p.name}</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>₫{p.value}M</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════
   CUSTOM PIE LABEL
══════════════════════════════════ */
function PieLabelLine({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  return null; // use legend only
}

/* ══════════════════════════════════
   KPI CARD
══════════════════════════════════ */
function KpiCard({
  label, value, sub, icon, iconBg, iconColor, change, up, mono,
}: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; iconBg: string; iconColor: string;
  change?: string; up?: boolean; mono?: boolean;
}) {
  return (
    <div style={{
      flex: "1 1 0",
      backgroundColor: FC.card,
      border: `1px solid ${FC.border}`,
      borderRadius: 16, padding: "18px 20px",
      position: "relative", overflow: "hidden",
      animation: "fcSlideUp .3s both",
      transition: "background-color 200ms ease, border-color 200ms ease",
    }}>
      {/* Top gradient line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${iconColor}70,transparent)` }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 8 }}>{label}</p>
          <p style={{ fontSize: "1.55rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, fontVariantNumeric: mono ? "tabular-nums" : undefined }}>{value}</p>
          {sub && <p style={{ fontSize: "0.68rem", color: FC.muted, marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: iconColor }}>
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${FC.border}` }}>
          {up
            ? <ArrowUpRight size={13} color={FC.green} />
            : <ArrowDownRight size={13} color={FC.red} />
          }
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: up ? FC.green : FC.red }}>{change}</span>
          <span style={{ fontSize: "0.68rem", color: FC.dim }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   PAGE
══════════════════════════════════ */
export function FinanceDashboard() {
  const [voidRefs, setVoidRefs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [acctTick, setAcctTick] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setAcctTick((n) => n + 1), 2500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setIsSyncing(true);
    const t = window.setTimeout(() => setIsSyncing(false), 700);
    return () => window.clearTimeout(t);
  }, [acctTick]);

  const profitSnap = useMemo(() => {
    void acctTick;
    return computeProfitSnapshot();
  }, [acctTick]);

  useEffect(() => {
    const loadVoidData = async () => {
      try {
        setLoading(true);
        const refs = await loadVoidBookingRefs();
        setVoidRefs(refs);
      } catch (error) {
        console.error('Error loading void booking refs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVoidData();
  }, []);

  const todayChange = pct(todayData.total, yesterdayData.total);
  const ticketChange = pct(todayData.tickets, yesterdayData.tickets);

  // Totals for today
  const todayRevenue     = todayData.total * 1_000_000;
  const todayTicketRev   = todayData.tickets * 1_000_000;
  const yesterdayRevenue = yesterdayData.total * 1_000_000;

  return (
    <FinanceLayout
      activeNav="dashboard"
      title="Financial Dashboard"
      subtitle="Today · Friday, May 8, 2026 · All figures in VND"
      actions={
        <FinanceReportPrint title="Financial Dashboard Export" subtitle="Reconciliation · Distributor · COGS · Gross profit">
          <section style={{ marginTop: 12 }}>
            <h3 style={{ fontSize: 12, fontWeight: 900, margin: "0 0 8px", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
              Sales reconciliation
            </h3>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 0" }}>Online (catalog TICKETS)</td>
                  <td style={{ padding: "4px 0", textAlign: "right", fontWeight: 700 }}>{formatVndFull(profitSnap.onlineRevenueVnd)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>Counter (POS localStorage)</td>
                  <td style={{ padding: "4px 0", textAlign: "right", fontWeight: 700 }}>{formatVndFull(profitSnap.counterRevenueVnd)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #0f172a" }}>
                  <td style={{ padding: "6px 0", fontWeight: 900 }}>Total revenue</td>
                  <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 900 }}>{formatVndFull(profitSnap.totalRevenueVnd)}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section style={{ marginTop: 14 }}>
            <h3 style={{ fontSize: 12, fontWeight: 900, margin: "0 0 8px", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
              Margin model
            </h3>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 0" }}>Distributor fee base (tickets)</td>
                  <td style={{ textAlign: "right" }}>{formatVndFull(feeBase)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>Distributor ({Math.round(DISTRIBUTOR_FEE_RATE * 100)}%)</td>
                  <td style={{ textAlign: "right", color: "#b91c1c", fontWeight: 700 }}>−{formatVndFull(profitSnap.distributorFeesVnd)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>Snack sales (combos + counter)</td>
                  <td style={{ textAlign: "right" }}>{formatVndFull(snackSales)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>Snack COGS ({Math.round(SNACK_COGS_RATE * 100)}%)</td>
                  <td style={{ textAlign: "right", color: "#b91c1c", fontWeight: 700 }}>−{formatVndFull(profitSnap.snackCogsVnd)}</td>
                </tr>
                <tr style={{ borderTop: "1px solid #0f172a" }}>
                  <td style={{ padding: "6px 0", fontWeight: 900 }}>Gross profit</td>
                  <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 900, color: "#0369a1" }}>{formatVndFull(profitSnap.grossProfitVnd)}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </FinanceReportPrint>
      }
    >
      <div style={{ padding: "24px 28px 36px" }}>

        {/* ── KPI CARDS ── */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <KpiCard
            label="Today's Revenue"
            value={vnd(todayRevenue)}
            sub={`₫${todayData.total}M total`}
            icon={<DollarSign size={18} />}
            iconBg={FC.redSoft} iconColor={FC.red}
            change={`${todayChange.val}% (₫${Math.abs(todayData.total - yesterdayData.total)}M)`}
            up={todayChange.up}
            mono
          />
          <KpiCard
            label="Tickets Sold Today"
            value="1,248"
            sub="across 5 halls"
            icon={<Ticket size={18} />}
            iconBg={FC.greenSoft} iconColor={FC.green}
            change="+87 tickets"
            up
          />
          <KpiCard
            label="Most Popular Movie"
            value="Your Name"
            sub="94% occupancy · IMAX"
            icon={<Film size={18} />}
            iconBg={FC.blueSoft} iconColor={FC.blue}
          />
          <KpiCard
            label="Top Combo"
            value="Classic Combo"
            sub="148 units · ₫89,000 each"
            icon={<Popcorn size={18} />}
            iconBg={"rgba(249,115,22,0.1)"} iconColor={FC.orange}
          />
        </div>

        {/* ── RECONCILIATION + GROSS PROFIT (live POS + catalog) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              backgroundColor: FC.card,
              border: `1px solid rgba(6,182,212,0.22)`,
              borderRadius: 16,
              padding: "20px 22px",
              boxShadow: "0 0 40px rgba(6,182,212,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", color: "#22d3ee", textTransform: "uppercase", margin: 0 }}>
                Sales reconciliation
              </p>
              {isSyncing && (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full animate-pulse"
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "#67e8f9",
                    border: "1px solid rgba(6,182,212,0.35)",
                    backgroundColor: "rgba(6,182,212,0.1)",
                  }}
                >
                  <Loader2 size={11} className="animate-spin" style={{ opacity: 0.9 }} />
                  Syncing…
                </span>
              )}
            </div>
            <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", marginBottom: 12 }}>Online vs counter</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: FC.muted }}>Online revenue (TICKETS)</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#e0f2fe", fontVariantNumeric: "tabular-nums" }}>
                    {formatVndFull(profitSnap.onlineRevenueVnd)}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${profitSnap.totalRevenueVnd ? Math.min(100, (profitSnap.onlineRevenueVnd / profitSnap.totalRevenueVnd) * 100) : 0}%`,
                      borderRadius: 99,
                      background: "linear-gradient(90deg,#38bdf8,#2563eb)",
                    }}
                  />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: FC.muted }}>Counter revenue (POS)</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#bae6fd", fontVariantNumeric: "tabular-nums" }}>
                    {formatVndFull(profitSnap.counterRevenueVnd)}
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${profitSnap.totalRevenueVnd ? Math.min(100, (profitSnap.counterRevenueVnd / profitSnap.totalRevenueVnd) * 100) : 0}%`,
                      borderRadius: 99,
                      background: "linear-gradient(90deg,#f97316,#e8192c)",
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${FC.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: FC.dim, letterSpacing: "0.08em" }}>TOTAL REVENUE</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {isSyncing && <Loader2 size={18} className="animate-spin" style={{ color: "#22d3ee", opacity: 0.85 }} />}
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                  {formatVndFull(profitSnap.totalRevenueVnd)}
                </span>
              </span>
            </div>
            <p style={{ fontSize: "0.65rem", color: FC.dim, marginTop: 10, lineHeight: 1.5 }}>
              Counter total reads <code style={{ color: "#67e8f9" }}>loadPosIssuedTickets()</code>; voided refs excluded. Online uses non-cancelled{" "}
              <code style={{ color: "#67e8f9" }}>TICKETS</code>.
            </p>
          </div>

          <div
            style={{
              backgroundColor: FC.card,
              border: `1px solid ${FC.border}`,
              borderRadius: 16,
              padding: "20px 22px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#22d3ee,transparent)" }} />
            <p style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", color: FC.dim, textTransform: "uppercase", marginBottom: 6 }}>
              Net margin (demo model)
            </p>
            <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#fff", marginBottom: 10 }}>Gross profit</p>
            <p style={{ fontSize: "0.72rem", color: FC.muted, lineHeight: 1.55, marginBottom: 12 }}>
              <abbr title="Share owed to film distributors on ticket sales (demo rate)." style={{ textDecoration: "underline dotted", textUnderlineOffset: 3, cursor: "help" }}>
                Distributor fee
              </abbr>{" "}
              <span style={{ color: FC.red, fontWeight: 800 }}>{Math.round(DISTRIBUTOR_FEE_RATE * 100)}%</span> on ticket sales ·{" "}
              <abbr title="Cost of goods sold — estimated wholesale cost of snacks/combos." style={{ textDecoration: "underline dotted", textUnderlineOffset: 3, cursor: "help" }}>
                Snack COGS
              </abbr>{" "}
              <span style={{ color: FC.red, fontWeight: 800 }}>{Math.round(SNACK_COGS_RATE * 100)}%</span> of snack revenue (combos + counter snacks).
            </p>
            <div style={{ fontSize: "0.74rem", color: FC.muted, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span title="Sum of online ticket prices + counter ticket subtotals used for the fee calculation.">Ticket fee base</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>{formatVndFull(feeBase)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span title="Distributor share per finance policy.">Distributor fees</span>
                <span style={{ color: FC.red, fontWeight: 700 }}>−{formatVndFull(profitSnap.distributorFeesVnd)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span title="Snack COGS = COGS rate × snack revenue.">Snack COGS</span>
                <span style={{ color: FC.red, fontWeight: 700 }}>−{formatVndFull(profitSnap.snackCogsVnd)}</span>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${FC.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, color: "#22d3ee", fontSize: "0.78rem" }} title="Total revenue minus distributor fees and snack COGS.">
                GROSS PROFIT
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {isSyncing && <Loader2 size={20} className="animate-spin" style={{ color: "#22d3ee", opacity: 0.85 }} />}
                <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#e0f2fe", fontVariantNumeric: "tabular-nums" }}>
                  {formatVndFull(profitSnap.grossProfitVnd)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── CHARTS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 24 }}>

          {/* Area chart */}
          <div style={{ backgroundColor: FC.card, border: `1px solid ${FC.border}`, borderRadius: 16, padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim }}>Revenue Growth</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
                  ₫{CHART_DATA.reduce((s, d) => s + d.total, 0).toLocaleString()}M
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {[
                  { label: "Total",   color: FC.red    },
                  { label: "Tickets", color: "#ff6b7a" },
                  { label: "Combos",  color: FC.orange  },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: l.color, display: "inline-block" }} />
                    <span style={{ fontSize: "0.62rem", color: FC.muted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: "0.65rem", color: FC.dim, marginBottom: 16 }}>Last 30 days · Apr 9 – May 8, 2026</p>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e8192c" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#e8192c" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ff6b7a" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#ff6b7a" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="gradCombos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={FC.orange} stopOpacity={0.14} />
                    <stop offset="95%" stopColor={FC.orange} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}
                  tickLine={false} axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `₫${v}M`}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="total"   name="Total"   stroke="#e8192c" strokeWidth={2} fill="url(#gradTotal)"   dot={false} activeDot={{ r: 5, fill: "#e8192c", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="tickets" name="Tickets" stroke="#ff6b7a" strokeWidth={1.5} fill="url(#gradTickets)" dot={false} activeDot={{ r: 4, fill: "#ff6b7a", strokeWidth: 0 }} />
                <Area type="monotone" dataKey="combos"  name="Combos"  stroke={FC.orange} strokeWidth={1.5} fill="url(#gradCombos)"  dot={false} activeDot={{ r: 4, fill: FC.orange,  strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div style={{ backgroundColor: FC.card, border: `1px solid ${FC.border}`, borderRadius: 16, padding: "20px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 2 }}>Revenue Breakdown</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
              {vnd(PIE_TOTAL)}
            </p>
            <p style={{ fontSize: "0.65rem", color: FC.dim, marginBottom: 10 }}>Today's total · May 8, 2026</p>

            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: "#0f0f1e", border: `1px solid ${FC.borderHi}`, borderRadius: 10, padding: "8px 12px" }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: d.color }}>{d.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "#fff", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{vnd(d.amount)}</p>
                        <p style={{ fontSize: "0.68rem", color: FC.muted }}>{d.value}% of total</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {PIE_DATA.map((d, i) => (
                <div
                  key={d.name}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px", borderRadius: 10,
                    backgroundColor: activeIndex === i ? `${d.color}12` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${activeIndex === i ? `${d.color}30` : FC.border}`,
                    cursor: "pointer",
                    transition: "background-color 200ms ease, border-color 200ms ease",
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.72rem", color: FC.muted }}>{d.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{vnd(d.amount)}</p>
                    <p style={{ fontSize: "0.58rem", color: d.color, fontWeight: 700 }}>{d.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECENT TRANSACTIONS ── */}
        <div style={{ backgroundColor: FC.card, border: `1px solid ${FC.border}`, borderRadius: 16, overflow: "hidden" }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderBottom: `1px solid ${FC.border}`,
            backgroundColor: "rgba(255,255,255,0.015)",
          }}>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>Recent Transactions</p>
              <p style={{ fontSize: "0.62rem", color: FC.dim }}>Last 10 purchases · live feed</p>
            </div>
            <a href="/finance/transactions" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", color: FC.red, textDecoration: "none", fontWeight: 600 }}>
              View all <ChevronRight size={12} />
            </a>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "130px 1fr 120px 120px 90px 100px 90px",
            padding: "8px 20px",
            borderBottom: `1px solid ${FC.border}`,
            backgroundColor: "rgba(255,255,255,0.01)",
          }}>
            {["Transaction ID","Customer","Movie","Hall","Time","Amount","Status"].map(h => (
              <span key={h} style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: FC.dim }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {RECENT_TXN.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr 120px 120px 90px 100px 90px",
                padding: "11px 20px",
                borderBottom: i < RECENT_TXN.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                alignItems: "center",
                backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)",
                transition: "background-color 200ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(232,25,44,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)"; }}
            >
              {/* Trans ID */}
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: FC.blue, fontFamily: "monospace" }}>{t.id}</span>

              {/* Customer */}
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#fff" }}>{t.customer}</p>
                <p style={{ fontSize: "0.6rem", color: FC.dim }}>{t.ticketId}</p>
              </div>

              {/* Movie */}
              <span style={{ fontSize: "0.72rem", color: FC.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.movie}</span>

              {/* Hall */}
              <span style={{ fontSize: "0.72rem", color: FC.muted }}>{t.hall}</span>

              {/* Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={10} color={FC.dim} />
                <span style={{ fontSize: "0.7rem", color: FC.muted, fontVariantNumeric: "tabular-nums" }}>{t.time}</span>
              </div>

              {/* Amount */}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {PAYMENT_ICONS[t.method]}
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>₫{t.amount.toLocaleString()}</span>
              </div>

              {/* Status */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 8px", borderRadius: 20,
                fontSize: "0.58rem", fontWeight: 700,
                backgroundColor: t.status === "completed"
                  ? "rgba(16,185,129,0.12)"
                  : t.status === "refunded"
                    ? "rgba(232,25,44,0.12)"
                    : "rgba(245,158,11,0.12)",
                color: t.status === "completed" ? FC.green : t.status === "refunded" ? FC.red : FC.amber,
                border: `1px solid ${t.status === "completed" ? "rgba(16,185,129,0.25)" : t.status === "refunded" ? "rgba(232,25,44,0.25)" : "rgba(245,158,11,0.25)"}`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "currentColor" }} />
                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </FinanceLayout>
  );
}
