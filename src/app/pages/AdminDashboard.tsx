import { useState } from "react";
import { Link } from "react-router";
import { AdminLayout } from "../components/AdminLayout";
import {
  LayoutDashboard, Film, Clock, DoorOpen, Users,
  BarChart3, Settings, LogOut, Search, Bell, ChevronDown,
  TrendingUp, TrendingDown, Ticket, DollarSign, Star,
  Clapperboard, ChevronRight, MoreHorizontal, ArrowUpRight,
  ShieldCheck, Activity, Filter, Download, RefreshCw,
  Circle, CheckCircle2, AlertCircle, Zap, Globe, Eye,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

/* ═══════════════════════════════════════════════
   PALETTE
═══════════════════════════════════════════════ */
const C = {
  bg:        "#0a0a0f",
  surface:   "#0f0f18",
  card:      "#13131e",
  cardHover: "#181826",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(255,255,255,0.13)",
  red:       "#e8192c",
  redSoft:   "rgba(232,25,44,0.12)",
  redGlow:   "rgba(232,25,44,0.25)",
  text:      "#ffffff",
  muted:     "rgba(255,255,255,0.45)",
  dim:       "rgba(255,255,255,0.2)",
  green:     "#10b981",
  amber:     "#f59e0b",
  blue:      "#3b82f6",
  purple:    "#8b5cf6",
};

/* ═══════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════ */
const REVENUE_DATA = [
  { month: "Apr", revenue: 182, tickets: 2140 },
  { month: "May", revenue: 224, tickets: 2680 },
  { month: "Jun", revenue: 198, tickets: 2310 },
  { month: "Jul", revenue: 275, tickets: 3210 },
  { month: "Aug", revenue: 310, tickets: 3650 },
  { month: "Sep", revenue: 265, tickets: 3080 },
  { month: "Oct", revenue: 340, tickets: 4020 },
  { month: "Nov", revenue: 298, tickets: 3490 },
  { month: "Dec", revenue: 410, tickets: 4870 },
  { month: "Jan", revenue: 356, tickets: 4210 },
  { month: "Feb", revenue: 388, tickets: 4580 },
  { month: "Mar", revenue: 442, tickets: 5120 },
];

const SPARKLINE_REVENUE  = [120,145,132,168,155,190,175,210,198,230,215,248];
const SPARKLINE_TICKETS  = [1800,2100,1950,2400,2200,2700,2500,3000,2850,3200,3050,3400];
const SPARKLINE_MOVIES   = [12,14,13,15,16,14,17,18,16,19,17,20];
const SPARKLINE_OCC      = [68,72,69,75,78,73,80,82,77,84,81,86];

const TOP_MOVIES = [
  {
    id: "your-name",
    title: "Your Name",
    genre: "Animation · Romance",
    poster: "https://images.unsplash.com/photo-1629058545686-f9acd8608d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHNreSUyMGNvbG9yZnVsJTIwdHdpbGlnaHQlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzcyNjcwOTE5fDA&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 442,
    tickets: 5120,
    occupancy: 94,
    trend: +18.4,
    status: "active",
    format: "IMAX",
  },
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    genre: "Sci-Fi · Action",
    poster: "https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBuZW9uJTIwY2l0eSUyMGZ1dHVyaXN0aWMlMjBkYXJrJTIwYmx1ZXxlbnwxfHx8fDE3NzI2NzA5MjB8MA&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 388,
    tickets: 4580,
    occupancy: 87,
    trend: +12.1,
    status: "active",
    format: "4DX",
  },
  {
    id: "void-runner",
    title: "Void Runner",
    genre: "Sci-Fi · Adventure",
    poster: "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMHN0YXJzJTIwbmVidWxhJTIwY2luZW1hdGljfGVufDF8fHx8MTc3MjY3MDkyMHww&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 356,
    tickets: 4210,
    occupancy: 82,
    trend: +7.3,
    status: "active",
    format: "IMAX",
  },
  {
    id: "iron-legacy",
    title: "Iron Legacy",
    genre: "Fantasy · Action",
    poster: "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJyaW9yJTIwc3dvcmQlMjBlcGljJTIwZmFudGFzeSUyMGJhdHRsZSUyMGRhcmt8ZW58MXx8fHwxNzcyNjcwOTIwfDA&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 298,
    tickets: 3490,
    occupancy: 73,
    trend: -3.2,
    status: "active",
    format: "3D",
  },
  {
    id: "code-black",
    title: "Code Black",
    genre: "Thriller · Crime",
    poster: "https://images.unsplash.com/photo-1641328824708-b9df9d9ab697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMHNweSUyMGRhcmslMjBhY3Rpb24lMjBkcmFtYXRpYyUyMHNoYWRvd3N8ZW58MXx8fHwxNzcyNjcwOTIxfDA&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 265,
    tickets: 3080,
    occupancy: 68,
    trend: +2.8,
    status: "active",
    format: "Dolby",
  },
  {
    id: "dark-hollow",
    title: "Dark Hollow",
    genre: "Horror · Thriller",
    poster: "https://images.unsplash.com/photo-1768121496378-0644c37e7fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBhYmFuZG9uZWQlMjBkYXJrJTIwYnVpbGRpbmclMjBuaWdodCUyMGZvZ3xlbnwxfHx8fDE3NzI2NzA5MjF8MA&ixlib=rb-4.1.0&q=80&w=200",
    revenue: 210,
    tickets: 2460,
    occupancy: 57,
    trend: -8.5,
    status: "ending",
    format: "2D",
  },
];

const HALL_OCCUPANCY = [
  { name: "IMAX 01", pct: 94, color: C.red },
  { name: "IMAX 02", pct: 88, color: "#f97316" },
  { name: "4DX 01",  pct: 81, color: C.amber },
  { name: "Dolby 1", pct: 76, color: C.blue },
  { name: "Hall 05", pct: 62, color: C.purple },
  { name: "Hall 06", pct: 45, color: C.green },
];

const TICKETS_BY_TYPE = [
  { name: "VIP",     value: 28, color: C.red },
  { name: "Premium", value: 42, color: "#f97316" },
  { name: "Standard",value: 30, color: C.blue },
];

const RECENT_ACTIVITY = [
  { icon: <Ticket size={13} />, color: C.green,  text: "New booking — Your Name · G10, G11", time: "2m ago" },
  { icon: <Film size={13} />,   color: C.blue,   text: "Neon Horizon showtime added — 22:00", time: "8m ago" },
  { icon: <Users size={13} />,  color: C.amber,  text: "New user registered — Alex Nguyen",  time: "15m ago" },
  { icon: <AlertCircle size={13}/>, color: C.red, text: "Hall 05 maintenance scheduled",     time: "32m ago" },
  { icon: <DollarSign size={13}/>,color: C.green, text: "Daily revenue target reached",      time: "1h ago" },
];

/* ═══════════════════════════════════════════════
   SPARKLINE SUB-CHART
═══════════════════════════════════════════════ */
function Sparkline({ data, color = C.red }: { data: number[]; color?: string }) {
  const d = data.map((v, i) => ({ v }));
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={d} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#sg-${color.replace("#","")})`}
          dot={false}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════════════
   SUMMARY CARD
═══════════════════════════════════════════════ */
interface SummaryCardProps {
  label: string;
  value: string;
  delta: number;
  sub: string;
  icon: React.ReactNode;
  sparkData: number[];
  sparkColor: string;
  accentColor: string;
}
function SummaryCard({ label, value, delta, sub, icon, sparkData, sparkColor, accentColor }: SummaryCardProps) {
  const pos = delta >= 0;
  return (
    <div
      className="relative flex flex-col gap-3 rounded-2xl p-5 border overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: C.card,
        borderColor: C.border,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Icon top-right */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>{label}</p>
          <p className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.7rem", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}25`, color: accentColor }}
        >
          {icon}
        </div>
      </div>

      {/* Delta */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{
            fontSize: "0.68rem", fontWeight: 700,
            backgroundColor: pos ? "rgba(16,185,129,0.12)" : "rgba(232,25,44,0.12)",
            color: pos ? C.green : C.red,
          }}
        >
          {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {pos ? "+" : ""}{delta}%
        </span>
        <span className="text-white/30" style={{ fontSize: "0.72rem" }}>{sub}</span>
      </div>

      {/* Sparkline */}
      <div className="mt-1">
        <Sparkline data={sparkData} color={sparkColor} />
      </div>

      {/* Bottom glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor} 50%, transparent)` }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════════════ */
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3.5 py-2.5 border border-white/10"
      style={{ backgroundColor: "#1a1a2e", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
    >
      <p className="text-white/40 mb-1.5" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>{label} 2025–26</p>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-[#e8192c]" />
        <span className="text-white" style={{ fontSize: "0.8rem", fontWeight: 700 }}>₫{payload[0]?.value}M revenue</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
        <span className="text-white/55" style={{ fontSize: "0.78rem" }}>{payload[1]?.value?.toLocaleString()} tickets</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOP MOVIES TABLE
═══════════════════════════════════════════════ */
const maxRev = Math.max(...TOP_MOVIES.map((m) => m.revenue));

function MovieRow({ movie, rank }: { movie: typeof TOP_MOVIES[0]; rank: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      className="border-b transition-colors"
      style={{ borderColor: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)", backgroundColor: hovered ? "rgba(255,255,255,0.02)" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank */}
      <td className="py-3.5 pl-5 pr-3 w-10">
        <span className="text-white/20 font-mono" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
          {String(rank).padStart(2, "0")}
        </span>
      </td>

      {/* Movie */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/8">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>{movie.title}</p>
            <p className="text-white/35" style={{ fontSize: "0.7rem" }}>{movie.genre}</p>
          </div>
        </div>
      </td>

      {/* Format badge */}
      <td className="py-3.5 pr-4">
        <span
          className="px-2 py-0.5 rounded text-white"
          style={{
            fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em",
            backgroundColor:
              movie.format === "IMAX" ? "rgba(59,130,246,0.2)" :
              movie.format === "4DX"  ? "rgba(245,158,11,0.2)" :
              movie.format === "Dolby"? "rgba(139,92,246,0.2)" :
              "rgba(255,255,255,0.08)",
            color:
              movie.format === "IMAX" ? C.blue :
              movie.format === "4DX"  ? C.amber :
              movie.format === "Dolby"? C.purple :
              "rgba(255,255,255,0.5)",
          }}
        >
          {movie.format}
        </span>
      </td>

      {/* Revenue bar */}
      <td className="py-3.5 pr-5" style={{ minWidth: "160px" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(movie.revenue / maxRev) * 100}%`,
                background: `linear-gradient(90deg, ${C.red}, ${C.red}aa)`,
                boxShadow: `0 0 8px ${C.redGlow}`,
              }}
            />
          </div>
          <span className="text-white flex-shrink-0" style={{ fontSize: "0.8rem", fontWeight: 800, minWidth: "52px", textAlign: "right" }}>
            ₫{movie.revenue}M
          </span>
        </div>
      </td>

      {/* Tickets */}
      <td className="py-3.5 pr-4 text-right">
        <span className="text-white/70" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
          {movie.tickets.toLocaleString()}
        </span>
      </td>

      {/* Occupancy */}
      <td className="py-3.5 pr-4 text-right">
        <span
          style={{
            fontSize: "0.82rem", fontWeight: 700,
            color: movie.occupancy >= 80 ? C.green : movie.occupancy >= 60 ? C.amber : C.red,
          }}
        >
          {movie.occupancy}%
        </span>
      </td>

      {/* Trend */}
      <td className="py-3.5 pr-4 text-right">
        <span
          className="flex items-center justify-end gap-1"
          style={{ fontSize: "0.78rem", fontWeight: 700, color: movie.trend >= 0 ? C.green : C.red }}
        >
          {movie.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {movie.trend >= 0 ? "+" : ""}{movie.trend}%
        </span>
      </td>

      {/* Status */}
      <td className="py-3.5 pr-4 text-right">
        <span
          className="flex items-center justify-end gap-1.5 px-2 py-1 rounded-full ml-auto"
          style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
            backgroundColor: movie.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
            color: movie.status === "active" ? C.green : C.amber,
            width: "fit-content",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: movie.status === "active" ? C.green : C.amber }} />
          {movie.status === "active" ? "LIVE" : "ENDING"}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5 text-right">
        <button className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all ml-auto">
          <MoreHorizontal size={13} />
        </button>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export function AdminDashboard() {
  // Only chart-view toggle remains — navigation state is now
  // handled by AdminLayout + React Router (useLocation).
  const [chartView, setChartView] = useState<"revenue" | "tickets">("revenue");

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Thursday, March 5, 2026 · Last updated just now"
    >
      <div className="flex flex-col gap-6">

          {/* ── SUMMARY CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SummaryCard
              label="Total Revenue"
              value="₫442M"
              delta={+18.4}
              sub="vs last month"
              icon={<DollarSign size={17} />}
              sparkData={SPARKLINE_REVENUE}
              sparkColor={C.red}
              accentColor={C.red}
            />
            <SummaryCard
              label="Tickets Sold"
              value="5,120"
              delta={+11.7}
              sub="vs last month"
              icon={<Ticket size={17} />}
              sparkData={SPARKLINE_TICKETS}
              sparkColor={C.blue}
              accentColor={C.blue}
            />
            <SummaryCard
              label="Active Movies"
              value="20"
              delta={+3}
              sub="titles showing"
              icon={<Film size={17} />}
              sparkData={SPARKLINE_MOVIES}
              sparkColor={C.purple}
              accentColor={C.purple}
            />
            <SummaryCard
              label="Occupancy Rate"
              value="86%"
              delta={+4.2}
              sub="avg across halls"
              icon={<Activity size={17} />}
              sparkData={SPARKLINE_OCC}
              sparkColor={C.green}
              accentColor={C.green}
            />
          </div>

          {/* ── MIDDLE ROW ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Monthly Revenue Chart — 2/3 */}
            <div
              className="xl:col-span-2 rounded-2xl border p-5 flex flex-col gap-4"
              style={{ backgroundColor: C.card, borderColor: C.border }}
            >
              {/* Chart header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem" }}>Monthly Revenue Trends</h2>
                  <p className="text-white/35 mt-0.5" style={{ fontSize: "0.73rem" }}>Apr 2025 – Mar 2026 · CGV Vincom Center</p>
                </div>
                <div className="flex items-center gap-2">
                  {(["revenue","tickets"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      className="px-3 py-1.5 rounded-lg border transition-all"
                      style={{
                        fontSize: "0.72rem", fontWeight: 700,
                        backgroundColor: chartView === v ? (v === "revenue" ? C.redSoft : "rgba(59,130,246,0.1)") : "transparent",
                        borderColor: chartView === v ? (v === "revenue" ? C.redGlow : "rgba(59,130,246,0.3)") : C.border,
                        color: chartView === v ? (v === "revenue" ? C.red : C.blue) : C.muted,
                      }}
                    >
                      {v === "revenue" ? "Revenue (₫M)" : "Tickets Sold"}
                    </button>
                  ))}
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-white/35 hover:text-white/60 transition-all"
                    style={{ fontSize: "0.72rem", borderColor: C.border }}
                  >
                    <Download size={11} /> Export
                  </button>
                </div>
              </div>

              {/* Big numbers row */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/30 uppercase" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em" }}>YTD Total</p>
                  <p className="text-white" style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>₫3,286M</p>
                </div>
                <div className="h-10 w-px bg-white/6" />
                <div>
                  <p className="text-white/30 uppercase" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em" }}>Best Month</p>
                  <p className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>March · ₫442M</p>
                </div>
                <div className="h-10 w-px bg-white/6" />
                <div>
                  <p className="text-white/30 uppercase" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em" }}>Growth YoY</p>
                  <p style={{ fontWeight: 800, fontSize: "1rem", color: C.green }}>+24.8%</p>
                </div>
              </div>

              {/* Chart */}
              <div style={{ height: "220px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.red}  stopOpacity={0.35} />
                        <stop offset="75%"  stopColor={C.red}  stopOpacity={0.05} />
                        <stop offset="100%" stopColor={C.red}  stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ticketsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.blue} stopOpacity={0.35} />
                        <stop offset="75%"  stopColor={C.blue} stopOpacity={0.05} />
                        <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                      <filter id="redGlow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600 }}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={(v) => chartView === "revenue" ? `₫${v}M` : v.toLocaleString()}
                    />
                    <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
                    {chartView === "revenue" ? (
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={C.red}
                        strokeWidth={2.5}
                        fill="url(#revenueGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: C.red, stroke: "white", strokeWidth: 2 }}
                        filter="url(#redGlow)"
                      />
                    ) : (
                      <Area
                        type="monotone"
                        dataKey="tickets"
                        stroke={C.blue}
                        strokeWidth={2.5}
                        fill="url(#ticketsGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: C.blue, stroke: "white", strokeWidth: 2 }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right column — Hall Occupancy + Ticket Types */}
            <div className="flex flex-col gap-4">

              {/* Hall Occupancy */}
              <div
                className="rounded-2xl border p-5 flex flex-col gap-4 flex-1"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>Hall Occupancy</h3>
                  <span className="text-white/25" style={{ fontSize: "0.68rem" }}>Live</span>
                </div>
                <div className="flex flex-col gap-3">
                  {HALL_OCCUPANCY.map((h) => (
                    <div key={h.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white/55" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{h.name}</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: h.color }}>{h.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${h.pct}%`, backgroundColor: h.color, boxShadow: `0 0 6px ${h.color}60` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket type donut */}
              <div
                className="rounded-2xl border p-5 flex flex-col gap-3"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                <h3 className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>Ticket Types</h3>
                <div className="flex items-center gap-4">
                  <div style={{ width: "90px", height: "90px", flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={TICKETS_BY_TYPE}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={42}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {TICKETS_BY_TYPE.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    {TICKETS_BY_TYPE.map((t) => (
                      <div key={t.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                          <span className="text-white/55" style={{ fontSize: "0.75rem" }}>{t.name}</span>
                        </div>
                        <span className="text-white" style={{ fontSize: "0.78rem", fontWeight: 700 }}>{t.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* Top Performing Movies Table — 2/3 */}
            <div
              className="xl:col-span-2 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: C.card, borderColor: C.border }}
            >
              {/* Table header */}
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
                <div>
                  <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>Top Performing Movies</h2>
                  <p className="text-white/30 mt-0.5" style={{ fontSize: "0.7rem" }}>Ranked by revenue · March 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-white/35 hover:text-white/60 transition-all"
                    style={{ fontSize: "0.72rem", borderColor: C.border }}
                  >
                    <Filter size={11} /> Filter
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all"
                    style={{ fontSize: "0.72rem", fontWeight: 700, backgroundColor: C.redSoft, border: `1px solid ${C.redGlow}`, color: C.red }}
                  >
                    View All <ChevronRight size={11} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["#", "Movie", "Format", "Revenue", "Tickets", "Occ.", "Trend", "Status", ""].map((h) => (
                        <th
                          key={h}
                          className="py-2.5 text-left"
                          style={{
                            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
                            paddingLeft: h === "#" ? "20px" : h === "" ? "0" : undefined,
                            paddingRight: h === "" ? "20px" : undefined,
                            textAlign: ["Tickets","Occ.","Trend","Status"].includes(h) ? "right" : "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_MOVIES.map((m, i) => (
                      <MovieRow key={m.id} movie={m} rank={i + 1} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div
              className="rounded-2xl border flex flex-col"
              style={{ backgroundColor: C.card, borderColor: C.border }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
                <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>Recent Activity</h2>
                <button className="text-white/25 hover:text-white/60 transition-colors" style={{ fontSize: "0.7rem" }}>View all</button>
              </div>

              <div className="flex-1 divide-y" style={{ divideColor: C.border }}>
                {RECENT_ACTIVITY.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.015] transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${a.color}12`, color: a.color, border: `1px solid ${a.color}20` }}
                    >
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/65" style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{a.text}</p>
                      <p className="text-white/25 mt-0.5" style={{ fontSize: "0.65rem" }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick stats at bottom */}
              <div className="px-5 py-4 border-t" style={{ borderColor: C.border }}>
                <p className="text-white/25 uppercase mb-3" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em" }}>Today's Snapshot</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Showtimes", value: "24", color: C.blue },
                    { label: "Bookings", value: "187", color: C.green },
                    { label: "Revenue", value: "₫18M", color: C.red },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}` }}>
                      <p style={{ fontWeight: 800, fontSize: "0.9rem", color }}>{value}</p>
                      <p className="text-white/25" style={{ fontSize: "0.6rem" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS BAR ── */}
          <div
            className="rounded-2xl border p-4 flex items-center gap-4 flex-wrap"
            style={{ backgroundColor: C.card, borderColor: C.border }}
          >
            <p className="text-white/35 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", flexShrink: 0 }}>
              Quick Actions
            </p>
            <div className="h-5 w-px bg-white/8 hidden sm:block" />
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "Add Movie",     icon: <Film size={13} />,    color: C.red    },
                { label: "New Showtime",  icon: <Clock size={13} />,   color: C.blue   },
                { label: "Add Promotion", icon: <Zap size={13} />,     color: C.amber  },
                { label: "Manage Users",  icon: <Users size={13} />,   color: C.purple },
                { label: "Run Report",    icon: <BarChart3 size={13}/>, color: C.green  },
              ].map(({ label, icon, color }) => (
                <button
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all hover:-translate-y-0.5"
                  style={{
                    fontSize: "0.76rem", fontWeight: 600,
                    backgroundColor: `${color}0d`,
                    borderColor: `${color}25`,
                    color,
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
      </div>
    </AdminLayout>
  );
}