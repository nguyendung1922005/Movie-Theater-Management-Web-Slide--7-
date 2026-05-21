/**
 * AdminRevenue.tsx — Revenue & Analytics
 *
 * Sections:
 *   1. Header actions  (Date Range Picker · Export Report)
 *   2. KPI cards × 4  (Gross Revenue · Tickets · Concession · Net Profit)
 *      each with an inline sparkline chart
 *   3. Charts row      (Daily AreaChart 2/3  ·  Format Donut 1/3)
 *   4. Top-5 Movies    (horizontal bars)
 *   5. Recent Transactions table (filterable)
 */

import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Download, CalendarDays, ChevronDown, TrendingUp, TrendingDown,
  Ticket, DollarSign, ShoppingBag, BarChart3, Film,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Search,
  CreditCard, Smartphone, Banknote, CheckCircle2, Clock,
  AlertCircle, ChevronRight, Star, Filter, Zap,
} from "lucide-react";

/* ════════════════════════════════════════
   COLOUR PALETTE
════════════════════════════════════════ */
const C = {
  bg:        "#0a0a0f",
  surface:   "#0f0f18",
  card:      "#13131e",
  cardHi:    "#171728",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(255,255,255,0.13)",
  red:       "#e8192c",
  redSoft:   "rgba(232,25,44,0.12)",
  redGlow:   "rgba(232,25,44,0.28)",
  green:     "#10b981",
  greenSoft: "rgba(16,185,129,0.12)",
  amber:     "#f59e0b",
  amberSoft: "rgba(245,158,11,0.12)",
  blue:      "#3b82f6",
  blueSoft:  "rgba(59,130,246,0.12)",
  purple:    "#8b5cf6",
  purpleSoft:"rgba(139,92,246,0.12)",
  orange:    "#f97316",
  cyan:      "#06b6d4",
  text:      "#ffffff",
  muted:     "rgba(255,255,255,0.45)",
  dim:       "rgba(255,255,255,0.22)",
  dimmer:    "rgba(255,255,255,0.1)",
};

/* ════════════════════════════════════════
   SEEDED RNG — deterministic mock data
════════════════════════════════════════ */
const rng = (n: number) => {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

/* ════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════ */

// 30-day daily revenue (Apr 9 → May 8, 2026)
const DAILY_DATA = Array.from({ length: 30 }, (_, i) => {
  const d   = new Date(2026, 3, 9 + i);
  const dow = d.getDay();
  const wknd = [0, 5, 6].includes(dow);
  const base = 22 + i * 0.55;
  const mult = wknd ? 1.54 : 1;
  const n    = rng(i * 13 + 7) * 0.3 - 0.1;
  const tickets    = Math.round(base * mult * (1 + n));
  const concession = Math.round(tickets * 0.265 + rng(i * 3) * 2);
  return {
    date:        `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
    label:       d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tickets,
    concession,
    total:       tickets + concession,
  };
});

// KPI sparkline data (7 trailing weekly points)
const SPARK = {
  revenue:    [730, 690, 762, 708, 798, 822, 850],
  tickets:    [10_200, 9_850, 11_150, 10_620, 11_780, 12_100, 12_450],
  concession: [96, 89, 104, 98, 114, 117, 120],
  profit:     [231, 217, 249, 237, 262, 275, 284],
};

// Revenue by cinema format (Pie / Donut)
const FORMAT_DATA = [
  { name: "IMAX",     pct: 37, revenue: 315, color: C.red    },
  { name: "Standard", pct: 32, revenue: 272, color: C.blue   },
  { name: "4DX",      pct: 18, revenue: 153, color: C.orange },
  { name: "Dolby",    pct:  9, revenue:  77, color: C.purple },
  { name: "3D",       pct:  4, revenue:  33, color: C.cyan   },
];

// Top 5 movies by revenue
const TOP_MOVIES = [
  { title: "Your Name",    revenue: 245, tickets: 2_840, pct: 29, color: C.red    },
  { title: "Neon Horizon", revenue: 198, tickets: 2_290, pct: 23, color: C.blue   },
  { title: "Iron Legacy",  revenue: 156, tickets: 1_820, pct: 18, color: C.orange },
  { title: "Code Black",   revenue: 132, tickets: 1_560, pct: 16, color: C.purple },
  { title: "Void Runner",  revenue: 119, tickets: 1_380, pct: 14, color: C.cyan   },
];

// Recent high-value transactions
const TRANSACTIONS = [
  { id:"TXN-A4F2E891", customer:"Nguyen T. Anh",  av:"NA", movie:"Your Name",    time:"14:32", amount:1_254_000, method:"Mastercard", status:"completed" },
  { id:"TXN-H8C9A215", customer:"Dang K. Nam",    av:"DN", movie:"Void Runner",  time:"13:11", amount:985_000,   method:"Visa",       status:"completed" },
  { id:"TXN-F9A1E320", customer:"Le Q. Hung",     av:"LH", movie:"Code Black",   time:"14:15", amount:656_000,   method:"ZaloPay",    status:"completed" },
  { id:"TXN-C2B8F671", customer:"Pham T. Lan",    av:"PL", movie:"Your Name",    time:"13:55", amount:718_000,   method:"Visa",       status:"pending"   },
  { id:"TXN-K4D5F548", customer:"Ly T. Hoa",      av:"LH", movie:"Your Name",    time:"12:22", amount:627_000,   method:"Momo",       status:"completed" },
  { id:"TXN-I1B0D326", customer:"Bui T. Thu",     av:"BT", movie:"Neon Horizon", time:"12:58", amount:358_000,   method:"ZaloPay",    status:"completed" },
  { id:"TXN-E5D4A983", customer:"Vo H. Dung",     av:"VD", movie:"Iron Legacy",  time:"13:42", amount:309_000,   method:"Cash",       status:"completed" },
  { id:"TXN-J2A3E437", customer:"Nguyen V. Long", av:"NL", movie:"Code Black",   time:"12:44", amount:239_000,   method:"Cash",       status:"pending"   },
  { id:"TXN-B3C7D245", customer:"Tran M. Khoa",   av:"TK", movie:"Neon Horizon", time:"14:28", amount:179_000,   method:"Visa",       status:"completed" },
  { id:"TXN-G7F6B104", customer:"Hoang T. Minh",  av:"HM", movie:"Dark Hollow",  time:"13:30", amount:90_000,    method:"Momo",       status:"refunded"  },
];

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
function fmtVND(n: number): string {
  if (n >= 1_000_000_000) return `₫${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `₫${(n / 1_000_000).toFixed(0)}M`;
  return `₫${n.toLocaleString()}`;
}

const STATUS_CFG = {
  completed: { label: "Completed", color: C.green,  bg: C.greenSoft, icon: <CheckCircle2 size={11} /> },
  pending:   { label: "Pending",   color: C.amber,  bg: C.amberSoft, icon: <Clock        size={11} /> },
  refunded:  { label: "Refunded",  color: C.red,    bg: C.redSoft,   icon: <AlertCircle  size={11} /> },
} as const;
type TxnStatus = keyof typeof STATUS_CFG;

const METHOD_ICON: Record<string, React.ReactNode> = {
  Visa:       <CreditCard  size={12} />,
  Mastercard: <CreditCard  size={12} />,
  Momo:       <Smartphone  size={12} />,
  ZaloPay:    <Smartphone  size={12} />,
  Cash:       <Banknote    size={12} />,
};

/* ════════════════════════════════════════
   SPARKLINE (tiny area chart, no axes)
════════════════════════════════════════ */
function Sparkline({ data, color, uid }: { data: number[]; color: string; uid: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.38} />
            <stop offset="95%" stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.8}
          fill={`url(#sp-${uid})`}
          dot={false} activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ════════════════════════════════════════
   KPI CARD
════════════════════════════════════════ */
interface KpiProps {
  uid:       string;
  label:     string;
  value:     string;
  sub:       string;
  change:    string;
  up:        boolean;
  sparkData: number[];
  sparkColor:string;
  icon:      React.ReactNode;
  iconBg:    string;
  iconColor: string;
  accentBar: string;
}
function KpiCard({
  uid, label, value, sub, change, up,
  sparkData, sparkColor,
  icon, iconBg, iconColor, accentBar,
}: KpiProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        backgroundColor: hovered ? C.cardHi : C.card,
        border: `1px solid ${hovered ? C.borderHi : C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "background .2s, border-color .2s, box-shadow .2s",
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${accentBar}22` : "none",
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, transparent, ${accentBar}90, transparent)`,
        opacity: hovered ? 1 : 0.55,
        transition: "opacity .2s",
      }} />

      <div style={{ padding: "16px 18px 0" }}>
        {/* Top row: label + icon */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: C.dim, marginBottom: 6,
            }}>{label}</p>
            <p style={{
              fontSize: "1.65rem", fontWeight: 900, color: C.text,
              letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums",
            }}>{value}</p>
            <p style={{ fontSize: "0.68rem", color: C.muted, marginTop: 4 }}>{sub}</p>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            backgroundColor: iconBg, color: iconColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${iconColor}25`,
          }}>
            {icon}
          </div>
        </div>

        {/* Delta badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            padding: "3px 8px", borderRadius: 20,
            backgroundColor: up ? C.greenSoft : C.redSoft,
            border: `1px solid ${up ? "rgba(16,185,129,0.25)" : "rgba(232,25,44,0.25)"}`,
            color: up ? C.green : C.red,
            fontSize: "0.65rem", fontWeight: 800,
          }}>
            {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {change}
          </span>
          <span style={{ fontSize: "0.62rem", color: C.dim }}>vs last period</span>
        </div>
      </div>

      {/* Sparkline — flush to card edges */}
      <div style={{ margin: "0 -1px -1px" }}>
        <Sparkline data={sparkData} color={sparkColor} uid={uid} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   AREA CHART CUSTOM TOOLTIP
════════════════════════════════════════ */
function AreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const t = payload.find((p: any) => p.dataKey === "tickets");
  const c = payload.find((p: any) => p.dataKey === "concession");
  return (
    <div style={{
      backgroundColor: "#0f0f1c",
      border: `1px solid ${C.borderHi}`,
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 16px 40px rgba(0,0,0,0.75)",
      minWidth: 190,
    }}>
      <p style={{ fontSize: "0.68rem", color: C.muted, marginBottom: 8 }}>{payload[0]?.payload?.label}</p>
      {t && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 3, borderRadius: 2, backgroundColor: C.red, display: "inline-block" }} />
            <span style={{ fontSize: "0.7rem", color: C.muted }}>Ticket Rev.</span>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums" }}>₫{t.value}M</span>
        </div>
      )}
      {c && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 3, borderRadius: 2, backgroundColor: C.orange, display: "inline-block" }} />
            <span style={{ fontSize: "0.7rem", color: C.muted }}>Concession</span>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums" }}>₫{c.value}M</span>
        </div>
      )}
      {t && c && (
        <div style={{
          display: "flex", justifyContent: "space-between",
          paddingTop: 6, borderTop: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.text }}>Total</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 900, color: C.red, fontVariantNumeric: "tabular-nums" }}>₫{t.value + c.value}M</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   FORMAT PIE CUSTOM TOOLTIP
════════════════════════════════════════ */
function FormatTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      backgroundColor: "#0f0f1c",
      border: `1px solid ${d.color}35`,
      borderRadius: 10, padding: "8px 12px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.7)",
    }}>
      <p style={{ fontSize: "0.75rem", fontWeight: 800, color: d.color }}>{d.name}</p>
      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: C.text, fontVariantNumeric: "tabular-nums" }}>₫{d.revenue}M</p>
      <p style={{ fontSize: "0.65rem", color: C.muted }}>{d.pct}% of total</p>
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION HEADER
════════════════════════════════════════ */
function SectionHeader({
  title, sub, action,
}: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <p style={{ fontSize: "0.95rem", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>{title}</p>
        {sub && <p style={{ fontSize: "0.68rem", color: C.dim, marginTop: 2 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ════════════════════════════════════════
   DATE RANGE PICKER (MOCK)
════════════════════════════════════════ */
function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const PRESETS = ["Today","Last 7 days","Last 30 days","Last 90 days","This year"];
  const [sel, setSel] = useState("Last 30 days");
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 14px", borderRadius: 10,
          backgroundColor: open ? C.redSoft : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(232,25,44,0.35)" : C.border}`,
          color: C.text, cursor: "pointer",
          fontSize: "0.78rem", fontWeight: 600,
          transition: "all .15s",
        }}
      >
        <CalendarDays size={13} color={open ? C.red : C.muted} />
        <span>{sel}</span>
        <ChevronDown size={12} color={C.dim} style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            zIndex: 101, borderRadius: 14, overflow: "hidden",
            backgroundColor: "#0f0f1c",
            border: `1px solid ${C.borderHi}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            minWidth: 180,
            animation: "arRevPanelIn .2s both",
          }}>
            <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { setSel(p); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "10px 14px",
                  background: "none",
                  borderBottom: `1px solid rgba(255,255,255,0.04)`,
                  color: sel === p ? C.red : C.muted,
                  fontSize: "0.8rem", fontWeight: sel === p ? 700 : 500,
                  cursor: "pointer", textAlign: "left",
                  backgroundColor: sel === p ? C.redSoft : "transparent",
                  transition: "background .1s",
                }}
              >
                {p}
                {sel === p && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.red }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   TOP MOVIE CARD
════════════════════════════════════════ */
function TopMovieCard({ m, i }: { m: any; i: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: hov ? C.cardHi : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? m.color + "35" : C.border}`,
        borderRadius: 14, padding: "14px 16px",
        cursor: "pointer",
        transition: "all .18s",
        boxShadow: hov ? `0 4px 20px ${m.color}18` : "none",
      }}
    >
      {/* Rank badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 8,
          backgroundColor: i === 0 ? "rgba(232,25,44,0.18)" : "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.62rem", fontWeight: 900,
          color: i === 0 ? C.red : C.dim,
          border: `1px solid ${i === 0 ? "rgba(232,25,44,0.3)" : "transparent"}`,
        }}>#{i + 1}</span>
        {i === 0 && <Star size={12} fill={C.amber} color={C.amber} />}
      </div>

      <p style={{
        fontSize: "0.82rem", fontWeight: 800, color: C.text,
        marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{m.title}</p>
      <p style={{ fontSize: "0.68rem", color: C.muted, marginBottom: 10 }}>
        {m.tickets.toLocaleString()} tickets
      </p>

      {/* Revenue */}
      <p style={{
        fontSize: "1.1rem", fontWeight: 900, color: C.text,
        letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
      }}>₫{m.revenue}M</p>

      {/* Progress bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ height: 4, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 4, width: `${m.pct}%`, backgroundColor: m.color, boxShadow: hov ? `0 0 6px ${m.color}` : "none", transition: "box-shadow .18s" }} />
        </div>
        <p style={{ fontSize: "0.6rem", color: m.color, fontWeight: 700, marginTop: 4 }}>{m.pct}% of total</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export function AdminRevenue() {
  const [txnFilter, setTxnFilter]     = useState<string>("all");
  const [txnSearch, setTxnSearch]     = useState("");
  const [hoveredFormat, setHoveredFormat] = useState<number | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/admin/transactions")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBookings(data.bookings);
        }
        setLoading(false);
      })
      .catch(err => console.error("Lỗi lấy transactions:", err));
  }, []);

  const { dailyData, formatData, topMovies, recentTxn, totals } = useMemo(() => {
    if (!bookings.length) return { dailyData: DAILY_DATA, formatData: FORMAT_DATA, topMovies: TOP_MOVIES, recentTxn: TRANSACTIONS, totals: { rev: 850000000, tix: 12450, con: 120000000 } };
    
    let tRev = 0;
    let cRev = 0;
    let tTix = 0;

    const formatMap: any = {};
    const movieMap: any = {};
    const daysMap: any = {};
    
    for(let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
      daysMap[key] = {
        date: key,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        tickets: 0,
        concession: 0,
        total: 0
      };
    }

    const txns: any[] = [];

    bookings.forEach(b => {
      const d = new Date(b.createdAt);
      const dateKey = `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
      
      let bTixRev = 0;
      let bConRev = 0;

      b.tickets.forEach((t: any) => {
        bTixRev += t.price;
        tRev += t.price;
        tTix += 1;

        const format = t.showtime?.room?.name?.includes("IMAX") ? "IMAX" : t.showtime?.room?.name?.includes("Dolby") ? "Dolby" : "2D";
        if(!formatMap[format]) formatMap[format] = 0;
        formatMap[format] += t.price;

        const mTitle = t.showtime?.movie?.title || "Unknown";
        if(!movieMap[mTitle]) movieMap[mTitle] = { tickets: 0, revenue: 0 };
        movieMap[mTitle].tickets += 1;
        movieMap[mTitle].revenue += t.price;
      });

      b.comboItems.forEach((c: any) => {
        const cPrice = c.combo?.price * c.quantity || 0;
        bConRev += cPrice;
        cRev += cPrice;
      });

      if(daysMap[dateKey]) {
        daysMap[dateKey].tickets += (bTixRev / 1000000);
        daysMap[dateKey].concession += (bConRev / 1000000);
        daysMap[dateKey].total += ((bTixRev + bConRev) / 1000000);
      }

      txns.push({
        id: "TXN-" + b.id.substring(0,8).toUpperCase(),
        ticketId: b.id.substring(0,8).toUpperCase(),
        customer: b.user?.name || "Guest",
        av: (b.user?.name || "G").substring(0,2).toUpperCase(),
        movie: b.tickets[0]?.showtime?.movie?.title || "Combo Only",
        time: d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
        amount: b.totalAmount,
        method: b.paymentMethod === "CREDIT_CARD" ? "Visa" : b.paymentMethod === "E_WALLET" ? "Momo" : "Cash",
        status: b.status.toLowerCase()
      });
    });

    const dailyDataArr = Object.values(daysMap).map((d: any) => ({
      ...d,
      tickets: parseFloat(d.tickets.toFixed(2)),
      concession: parseFloat(d.concession.toFixed(2)),
      total: parseFloat(d.total.toFixed(2))
    }));

    const COLORS = [C.red, C.blue, C.orange, C.purple, C.cyan];
    const formatDataArr = Object.entries(formatMap).map(([name, rev]: any, i) => ({
      name,
      revenue: parseFloat((rev / 1000000).toFixed(2)),
      pct: Math.round((rev / (tRev || 1)) * 100),
      color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.revenue - a.revenue);

    const topMoviesArr = Object.entries(movieMap).map(([title, data]: any, i) => ({
      title,
      revenue: parseFloat((data.revenue / 1000000).toFixed(2)),
      tickets: data.tickets,
      pct: Math.round((data.revenue / (tRev || 1)) * 100),
      color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.revenue - a.revenue).slice(0, 5);

    return {
      dailyData: dailyDataArr,
      formatData: formatDataArr,
      topMovies: topMoviesArr,
      recentTxn: txns,
      totals: { rev: tRev + cRev, tix: tTix, con: cRev }
    };
  }, [bookings]);

  // Totals for header KPIs
  const totalTicketRev   = dailyData.reduce((s, d) => s + d.tickets,    0);
  const totalConcession  = dailyData.reduce((s, d) => s + d.concession, 0);

  // Filtered transactions
  const visibleTxn = recentTxn.filter(t => {
    if (txnFilter !== "all" && t.status !== txnFilter) return false;
    if (txnSearch) {
      const q = txnSearch.toLowerCase();
      return t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.movie.toLowerCase().includes(q);
    }
    return true;
  });

  // Avatar color bank
  const avColors = [C.red, C.blue, C.purple, C.orange, C.cyan, C.green];
  const avColor  = (s: string) => avColors[s.charCodeAt(0) % avColors.length];

  return (
    <AdminLayout
      title="Revenue & Analytics"
      subtitle="Financial performance overview · May 2026"
      actions={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DateRangePicker />
          <button
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 10,
              background: `linear-gradient(135deg, ${C.red}, #c8111f)`,
              border: "none", color: "#fff",
              fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
              boxShadow: `0 4px 16px ${C.redGlow}`,
              transition: "box-shadow .2s, transform .15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${C.redGlow}`; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${C.redGlow}`; (e.currentTarget as HTMLElement).style.transform = "none"; }}
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      }
    >
      <div style={{ padding: "24px 28px 40px", display: "flex", flexDirection: "column", gap: 28 }}>

        {/* ══ KPI CARDS ══════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <KpiCard
            uid="revenue"
            label="Gross Revenue"
            value={`₫${(totals.rev / 1000000).toFixed(1)}M`}
            sub="30-day total"
            change="+12.2%"
            up
            sparkData={SPARK.revenue}
            sparkColor={C.red}
            icon={<DollarSign size={18} />}
            iconBg={C.redSoft}
            iconColor={C.red}
            accentBar={C.red}
          />
          <KpiCard
            uid="tickets"
            label="Tickets Sold"
            value={totals.tix.toLocaleString("en-US")}
            sub="across all halls"
            change="+8.3%"
            up
            sparkData={SPARK.tickets}
            sparkColor={C.green}
            icon={<Ticket size={18} />}
            iconBg={C.greenSoft}
            iconColor={C.green}
            accentBar={C.green}
          />
          <KpiCard
            uid="concession"
            label="Concession Sales"
            value={`₫${(totals.con / 1000000).toFixed(1)}M`}
            sub="Snacks & Combos"
            change="+5.7%"
            up
            sparkData={SPARK.concession}
            sparkColor={C.orange}
            icon={<ShoppingBag size={18} />}
            iconBg={"rgba(249,115,22,0.12)"}
            iconColor={C.orange}
            accentBar={C.orange}
          />
          <KpiCard
            uid="profit"
            label="Net Profit"
            value={`₫${(totals.rev * 0.3 / 1000000).toFixed(1)}M`}
            sub="Margin 30.0% · Estimated"
            change="+9.2%"
            up
            sparkData={SPARK.profit}
            sparkColor={C.purple}
            icon={<BarChart3 size={18} />}
            iconBg={C.purpleSoft}
            iconColor={C.purple}
            accentBar={C.purple}
          />
        </div>

        {/* ══ CHARTS ROW ═════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

          {/* — Daily Revenue Area Chart — */}
          <div style={{
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "22px 22px 16px",
          }}>
            <SectionHeader
              title="Daily Revenue"
              sub="Last 30 days · Ticket revenue + Concession"
              action={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {[
                    { label: "Ticket Rev.", color: C.red    },
                    { label: "Concession",  color: C.orange },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 24, height: 2.5, borderRadius: 2, backgroundColor: l.color, display: "inline-block" }} />
                      <span style={{ fontSize: "0.62rem", color: C.muted }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              }
            />

            {/* Summary badges */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Avg / Day",    value: `₫${Math.round((totalTicketRev + totalConcession) / 30)}M`, color: C.muted },
                { label: "Peak Day",     value: `₫${Math.max(...dailyData.map(d => d.total))}M`,            color: C.red   },
                { label: "Lowest Day",   value: `₫${Math.min(...dailyData.map(d => d.total))}M`,            color: C.amber },
              ].map(b => (
                <div key={b.label} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: "0.6rem", color: C.dim }}>{b.label}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: b.color, fontVariantNumeric: "tabular-nums" }}>{b.value}</span>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="arRevTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.red}    stopOpacity={0.32} />
                    <stop offset="95%" stopColor={C.red}    stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="arRevConcession" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.orange} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={C.orange} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}
                  tickLine={false} axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => `₫${v}M`}
                  width={46}
                />
                <Tooltip content={<AreaTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area
                  type="monotone" dataKey="tickets" name="Ticket Rev."
                  stroke={C.red} strokeWidth={2}
                  fill="url(#arRevTickets)"
                  dot={false}
                  activeDot={{ r: 5, fill: C.red, stroke: "#0a0a0f", strokeWidth: 2 }}
                />
                <Area
                  type="monotone" dataKey="concession" name="Concession"
                  stroke={C.orange} strokeWidth={1.5}
                  fill="url(#arRevConcession)"
                  dot={false}
                  activeDot={{ r: 4, fill: C.orange, stroke: "#0a0a0f", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* — Revenue by Format — */}
          <div style={{
            backgroundColor: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 16, padding: "22px 22px 18px",
            display: "flex", flexDirection: "column",
          }}>
            <SectionHeader title="Revenue by Format" sub="30-day distribution" />

            {/* Donut */}
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={formatData}
                  cx="50%" cy="50%"
                  innerRadius={58} outerRadius={85}
                  paddingAngle={3} dataKey="pct"
                  onMouseEnter={(_, i) => setHoveredFormat(i)}
                  onMouseLeave={() => setHoveredFormat(null)}
                >
                  {formatData.map((entry: any, i: number) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      stroke="transparent"
                      opacity={hoveredFormat === null || hoveredFormat === i ? 1 : 0.4}
                    />
                  ))}
                </Pie>
                <Tooltip content={<FormatTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              {formatData.map((d: any, i: number) => (
                <div
                  key={d.name}
                  onMouseEnter={() => setHoveredFormat(i)}
                  onMouseLeave={() => setHoveredFormat(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 10, cursor: "pointer",
                    backgroundColor: hoveredFormat === i ? `${d.color}10` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${hoveredFormat === i ? `${d.color}28` : C.border}`,
                    transition: "all .15s",
                  }}
                >
                  <span style={{
                    width: 10, height: 10, borderRadius: "50%",
                    backgroundColor: d.color, flexShrink: 0,
                    boxShadow: hoveredFormat === i ? `0 0 6px ${d.color}` : "none",
                  }} />
                  <span style={{ flex: 1, fontSize: "0.73rem", color: C.muted, fontWeight: 500 }}>{d.name}</span>
                  <span style={{ fontSize: "0.73rem", fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums" }}>₫{d.revenue}M</span>
                  <span style={{
                    padding: "1px 7px", borderRadius: 20,
                    fontSize: "0.58rem", fontWeight: 800,
                    backgroundColor: `${d.color}18`, color: d.color,
                  }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TOP MOVIES ═════════════════════════════════════════════════ */}
        <div style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16, padding: "22px 24px",
        }}>
          <SectionHeader
            title="Top Performing Movies"
            sub="Revenue contribution · Last 30 days"
            action={
              <button style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 9,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.border}`,
                color: C.muted, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
              }}>
                View All <ChevronRight size={12} />
              </button>
            }
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
            {topMovies.map((m: any, i: number) => (
              <TopMovieCard key={m.title} m={m} i={i} />
            ))}
          </div>
        </div>

        {/* ══ RECENT TRANSACTIONS ════════════════════════════════════════ */}
        <div style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16, overflow: "hidden",
        }}>
          {/* Table header bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 22px", borderBottom: `1px solid ${C.border}`,
            backgroundColor: "rgba(255,255,255,0.015)",
          }}>
            <div>
              <p style={{ fontSize: "0.92rem", fontWeight: 800, color: C.text }}>Recent Transactions</p>
              <p style={{ fontSize: "0.63rem", color: C.dim }}>All bookings · Live from DB</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "0 12px", height: 34, borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${txnSearch ? "rgba(255,255,255,0.15)" : C.border}`,
                width: 200,
              }}>
                <Search size={12} color={C.dim} />
                <input
                  value={txnSearch}
                  onChange={e => setTxnSearch(e.target.value)}
                  placeholder="Search..."
                  style={{
                    background: "none", border: "none", outline: "none",
                    color: C.text, fontSize: "0.78rem", width: "100%",
                    caretColor: C.red,
                  }}
                />
                {txnSearch && (
                  <button onClick={() => setTxnSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, padding: 0 }}>
                    ×
                  </button>
                )}
              </div>

              {/* Status filter */}
              {(["all","completed","pending","refunded"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTxnFilter(f)}
                  style={{
                    padding: "5px 12px", borderRadius: 9,
                    backgroundColor: txnFilter === f
                      ? f === "all" ? C.redSoft
                        : f === "completed" ? C.greenSoft
                        : f === "pending" ? C.amberSoft
                        : C.redSoft
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${txnFilter === f
                      ? f === "all" ? "rgba(232,25,44,0.3)"
                        : f === "completed" ? "rgba(16,185,129,0.3)"
                        : f === "pending" ? "rgba(245,158,11,0.3)"
                        : "rgba(232,25,44,0.3)"
                      : C.border}`,
                    color: txnFilter === f
                      ? f === "all" ? C.red : f === "completed" ? C.green : f === "pending" ? C.amber : C.red
                      : C.dim,
                    fontSize: "0.65rem", fontWeight: txnFilter === f ? 800 : 500,
                    cursor: "pointer", textTransform: "capitalize",
                    transition: "all .15s",
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Column headings */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 150px 110px 110px 110px 100px 48px",
            padding: "8px 22px",
            borderBottom: `1px solid ${C.border}`,
            backgroundColor: "rgba(255,255,255,0.01)",
          }}>
            {["Transaction ID","Customer","Movie","Date","Amount","Method","Status",""].map(h => (
              <span key={h} style={{
                fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: C.dim,
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {visibleTxn.length === 0 ? (
            <div style={{ padding: "48px 22px", textAlign: "center" }}>
              <p style={{ color: C.dim, fontSize: "0.88rem" }}>No transactions match your filters.</p>
            </div>
          ) : (
            visibleTxn.map((t, i) => {
              const sc   = STATUS_CFG[t.status as TxnStatus];
              const isLast = i === visibleTxn.length - 1;
              return (
                <div
                  key={t.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 150px 110px 110px 110px 100px 48px",
                    padding: "11px 22px",
                    borderBottom: isLast ? "none" : `1px solid rgba(255,255,255,0.04)`,
                    alignItems: "center",
                    backgroundColor: i % 2 === 1 ? "rgba(255,255,255,0.008)" : "transparent",
                    transition: "background .12s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(232,25,44,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 1 ? "rgba(255,255,255,0.008)" : "transparent"; }}
                >
                  {/* TXN ID */}
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: C.blue, fontFamily: "monospace" }}>
                    {t.id}
                  </span>

                  {/* Customer */}
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                      backgroundColor: `${avColor(t.av)}22`,
                      border: `1px solid ${avColor(t.av)}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.55rem", fontWeight: 900, color: avColor(t.av),
                    }}>{t.av}</div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: C.text }}>{t.customer}</span>
                  </div>

                  {/* Movie */}
                  <span style={{
                    fontSize: "0.73rem", color: C.muted,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{t.movie}</span>

                  {/* Time */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} color={C.dim} />
                    <span style={{ fontSize: "0.72rem", color: C.muted, fontVariantNumeric: "tabular-nums" }}>{t.time}</span>
                  </div>

                  {/* Amount */}
                  <span style={{
                    fontSize: "0.82rem", fontWeight: 900, color: C.text,
                    fontVariantNumeric: "tabular-nums",
                  }}>{fmtVND(t.amount)}</span>

                  {/* Method */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.muted }}>
                    {METHOD_ICON[t.method]}
                    <span style={{ fontSize: "0.72rem" }}>{t.method}</span>
                  </div>

                  {/* Status badge */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 9px", borderRadius: 20,
                    backgroundColor: sc.bg,
                    color: sc.color,
                    fontSize: "0.6rem", fontWeight: 800,
                    border: `1px solid ${sc.color}28`,
                    whiteSpace: "nowrap",
                  }}>
                    {sc.icon} {sc.label}
                  </span>

                  {/* Actions */}
                  <button style={{
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${C.border}`,
                    color: C.dim, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = C.redSoft;
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,25,44,0.28)";
                    (e.currentTarget as HTMLElement).style.color = C.red;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLElement).style.color = C.dim;
                  }}
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              );
            })
          )}

          {/* Table footer */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 22px",
            borderTop: `1px solid ${C.border}`,
            backgroundColor: "rgba(255,255,255,0.01)",
          }}>
            <span style={{ fontSize: "0.68rem", color: C.dim }}>
              Showing <strong style={{ color: C.text }}>{visibleTxn.length}</strong> of{" "}
              <strong style={{ color: C.text }}>{recentTxn.length}</strong> transactions
            </span>
            <button style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "6px 12px", borderRadius: 9,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.border}`,
              color: C.muted, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
            }}>
              View All Transactions <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes arRevPanelIn {
          from { opacity:0; transform:scale(.93) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </AdminLayout>
  );
}
