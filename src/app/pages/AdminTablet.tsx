import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Film, Clock, DoorOpen, Users, Settings,
  Bell, Search, TrendingUp, TrendingDown, Ticket, DollarSign,
  Activity, ChevronRight, BarChart3, Star, AlertTriangle,
  LogOut, Clapperboard, Globe, ShieldCheck, ArrowUpRight,
  X, Check, Zap, MoreHorizontal, Edit2, Eye, Filter,
  RefreshCw, Download, Calendar, Sparkles, Play,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

/* ═══════════════════════════════════════
   PALETTE
═══════════════════════════════════════ */
const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  cardB:   "#161624",
  border:  "rgba(255,255,255,0.07)",
  borderHi:"rgba(255,255,255,0.13)",
  red:     "#e8192c",
  redSoft: "rgba(232,25,44,0.12)",
  redGlow: "rgba(232,25,44,0.28)",
  green:   "#10b981",
  amber:   "#f59e0b",
  blue:    "#3b82f6",
  purple:  "#8b5cf6",
  orange:  "#f97316",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
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

const SPARKLINES = {
  revenue:  [120,145,132,168,155,190,175,210,198,230,215,248],
  tickets:  [1800,2100,1950,2400,2200,2700,2500,3000,2850,3200,3050,3400],
  movies:   [12,14,13,15,16,14,17,18,16,19,17,20],
  occupancy:[68,72,69,75,78,73,80,82,77,84,81,86],
};

const TOP_MOVIES = [
  { title:"Your Name",    genre:"Animation · Romance", revenue:442, tickets:5120, occ:94,  trend:+18.4, status:"active",  format:"IMAX",  poster:"https://images.unsplash.com/photo-1629058545686-f9acd8608d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
  { title:"Neon Horizon", genre:"Sci-Fi · Action",     revenue:388, tickets:4580, occ:87,  trend:+12.1, status:"active",  format:"4DX",   poster:"https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
  { title:"Void Runner",  genre:"Sci-Fi · Adventure",  revenue:356, tickets:4210, occ:82,  trend:+7.3,  status:"active",  format:"IMAX",  poster:"https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
  { title:"Iron Legacy",  genre:"Fantasy · Action",    revenue:298, tickets:3490, occ:73,  trend:-3.2,  status:"active",  format:"Dolby", poster:"https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
  { title:"Code Black",   genre:"Thriller · Crime",    revenue:265, tickets:3080, occ:68,  trend:+2.8,  status:"active",  format:"3D",    poster:"https://images.unsplash.com/photo-1641328824708-b9df9d9ab697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
];

const HALL_OCC = [
  { name:"IMAX 01",   pct:94, color:C.red    },
  { name:"IMAX 02",   pct:88, color:C.orange },
  { name:"4DX 01",    pct:81, color:C.amber  },
  { name:"Dolby 01",  pct:76, color:C.blue   },
  { name:"Hall 05",   pct:62, color:C.purple },
  { name:"Hall 06",   pct:45, color:C.green  },
];

const PIE_DATA = [
  { name:"VIP",      value:28, color:C.red    },
  { name:"Premium",  value:42, color:C.orange },
  { name:"Standard", value:30, color:C.blue   },
];

const ACTIVITY = [
  { color:C.green,  icon:<Ticket size={12}/>,       text:"New booking — Your Name · G10, G11", time:"2m ago"  },
  { color:C.blue,   icon:<Film size={12}/>,          text:"Showtime added — Neon Horizon 22:00", time:"8m ago"  },
  { color:C.amber,  icon:<Users size={12}/>,         text:"New user registered — Alex Nguyen",  time:"15m ago" },
  { color:C.red,    icon:<AlertTriangle size={12}/>, text:"Hall 05 maintenance scheduled",       time:"32m ago" },
  { color:C.green,  icon:<DollarSign size={12}/>,    text:"Daily revenue target reached ✓",      time:"1h ago"  },
];

/* ═══════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════ */
const NAV = [
  { id:"dashboard", icon:LayoutDashboard, href:"/admin/tablet",    tip:"Dashboard"       },
  { id:"movies",    icon:Film,            href:"/admin/movies",    tip:"Movies",   badge:20 },
  { id:"showtimes", icon:Clock,           href:"/admin/showtimes", tip:"Showtimes"       },
  { id:"rooms",     icon:DoorOpen,        href:"/admin/rooms",     tip:"Rooms"           },
  { id:"users",     icon:Users,           href:"/admin/users",     tip:"Users",    badge:3  },
];

/* ═══════════════════════════════════════
   MINI SPARKLINE
═══════════════════════════════════════ */
function Spark({ data, color }: { data: number[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data.map(v => ({ v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sk${color.replace(/[^a-z0-9]/gi,"")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.38} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
          fill={`url(#sk${color.replace(/[^a-z0-9]/gi,"")})`} dot={false} isAnimationActive />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════
   STAT CARD (2×2 grid)
═══════════════════════════════════════ */
interface StatCardProps {
  label: string; value: string; delta: number; sub: string;
  icon: React.ReactNode; sparkData: number[]; accentColor: string;
}
function StatCard({ label, value, delta, sub, icon, sparkData, accentColor }: StatCardProps) {
  const pos = delta >= 0;
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-3 group transition-all duration-200 hover:-translate-y-0.5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, padding: "22px 20px 16px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      {/* Accent top bar */}
      <div className="absolute top-0 inset-x-0 h-px opacity-80" style={{ background: `linear-gradient(90deg,transparent,${accentColor} 45%,transparent)` }} />
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${accentColor}20` }} />

      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}16`, border: `1px solid ${accentColor}28`, color: accentColor }}>
            {icon}
          </div>
          <span className="uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", color: C.muted }}>{label}</span>
        </div>
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ fontSize: "0.65rem", fontWeight: 800, backgroundColor: pos ? "rgba(16,185,129,0.12)" : "rgba(232,25,44,0.12)", color: pos ? C.green : C.red }}
        >
          {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {pos ? "+" : ""}{delta}%
        </span>
      </div>

      {/* Value */}
      <div>
        <p className="text-white" style={{ fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: "0.68rem", color: C.dim, marginTop: "4px" }}>{sub}</p>
      </div>

      {/* Sparkline */}
      <Spark data={sparkData} color={accentColor} />
    </div>
  );
}

/* ═══════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════ */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5 border border-white/10"
      style={{ backgroundColor: "#1a1a2e", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
      <p className="text-white/40 mb-1.5" style={{ fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.1em" }}>{label}</p>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-[#e8192c]" />
        <span className="text-white font-bold" style={{ fontSize: "0.82rem" }}>₫{payload[0]?.value}M</span>
      </div>
      {payload[1] && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span className="text-white/55" style={{ fontSize: "0.78rem" }}>{payload[1].value?.toLocaleString()} tickets</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   NOTIFICATION PANEL
═══════════════════════════════════════ */
function NotifPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!(e.target as Element).closest("[data-notif]")) onClose(); };
    setTimeout(() => window.addEventListener("mousedown", h), 60);
    return () => window.removeEventListener("mousedown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div data-notif="1" className="absolute top-full right-0 mt-2 rounded-2xl border border-white/10 overflow-hidden z-[60]"
      style={{ width: "320px", backgroundColor: "#13131e", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", animation: "panelIn .25s cubic-bezier(.34,1.4,.64,1) forwards" }}>
      <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <span className="text-white font-bold" style={{ fontSize: "0.88rem" }}>Notifications</span>
        <span className="text-[#e8192c] cursor-pointer" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Mark all read</span>
      </div>
      {ACTIVITY.map((a, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b border-white/4 last:border-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${a.color}14`, color: a.color, border: `1px solid ${a.color}20` }}>{a.icon}</div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a.text}</p>
            <p style={{ fontSize: "0.62rem", color: C.dim, marginTop: "2px" }}>{a.time}</p>
          </div>
        </div>
      ))}
      <div className="px-4 py-2.5 text-center border-t border-white/6">
        <span className="text-white/30 cursor-pointer" style={{ fontSize: "0.75rem" }}>View all</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════ */
function LiveClock() {
  const [now, setNow] = useState(new Date(2026, 2, 5, 10, 27, 0));
  useEffect(() => {
    const t = setInterval(() => setNow(d => new Date(d.getTime() + 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const d = now.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric", year:"numeric" });
  const t = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
  return (
    <div className="flex flex-col items-end">
      <span className="text-white font-bold" style={{ fontSize:"0.82rem", letterSpacing:"-0.01em", fontVariantNumeric:"tabular-nums" }}>{t}</span>
      <span style={{ fontSize:"0.62rem", color:C.dim, marginTop:"1px" }}>{d}</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   TOP MOVIES TABLE ROW
═══════════════════════════════════════ */
const FORMAT_COLOR: Record<string,{bg:string;color:string}> = {
  IMAX:  {bg:"rgba(59,130,246,0.15)",  color:C.blue   },
  "4DX": {bg:"rgba(245,158,11,0.15)",  color:C.amber  },
  Dolby: {bg:"rgba(139,92,246,0.15)",  color:C.purple },
  "3D":  {bg:"rgba(16,185,129,0.15)",  color:C.green  },
};

const maxRev = Math.max(...TOP_MOVIES.map(m => m.revenue));

function MovieRow({ movie, rank }: { movie: typeof TOP_MOVIES[0]; rank: number }) {
  const [hov, setHov] = useState(false);
  const fc = FORMAT_COLOR[movie.format] ?? { bg:"rgba(255,255,255,0.07)", color:C.muted };
  return (
    <tr
      className="border-b transition-colors"
      style={{ borderColor: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)", backgroundColor: hov ? "rgba(255,255,255,0.022)" : "transparent" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <td className="py-3.5 pl-5 pr-3 w-8">
        <span className="font-mono" style={{ fontSize:"0.75rem", fontWeight:700, color:"rgba(255,255,255,0.2)" }}>{String(rank).padStart(2,"0")}</span>
      </td>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-13 rounded-lg overflow-hidden flex-shrink-0 border border-white/8" style={{ height:48, width:36 }}>
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white" style={{ fontWeight:700, fontSize:"0.88rem" }}>{movie.title}</p>
            <p style={{ fontSize:"0.68rem", color:C.dim }}>{movie.genre}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <span className="px-2 py-0.5 rounded" style={{ fontSize:"0.58rem", fontWeight:900, letterSpacing:"0.1em", backgroundColor:fc.bg, color:fc.color }}>{movie.format}</span>
      </td>
      <td className="py-3.5 pr-4" style={{ minWidth:160 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full" style={{ width:`${(movie.revenue/maxRev)*100}%`, background:`linear-gradient(90deg,${C.red},${C.red}aa)`, boxShadow:`0 0 8px ${C.redGlow}` }} />
          </div>
          <span className="text-white flex-shrink-0" style={{ fontWeight:800, fontSize:"0.82rem", minWidth:52, textAlign:"right" }}>₫{movie.revenue}M</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-right">
        <span style={{ fontSize:"0.8rem", fontWeight:600, color:"rgba(255,255,255,0.65)" }}>{movie.tickets.toLocaleString()}</span>
      </td>
      <td className="py-3.5 pr-4 text-right">
        <span style={{ fontSize:"0.82rem", fontWeight:700, color:movie.occ>=80?C.green:movie.occ>=60?C.amber:C.red }}>{movie.occ}%</span>
      </td>
      <td className="py-3.5 pr-5 text-right">
        <span className="flex items-center justify-end gap-1" style={{ fontSize:"0.78rem", fontWeight:700, color:movie.trend>=0?C.green:C.red }}>
          {movie.trend>=0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}
          {movie.trend>=0?"+":""}{movie.trend}%
        </span>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export function AdminTablet() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal,     setSearchVal]     = useState("");
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [activeNav,     setActiveNav]     = useState("dashboard");
  const [chartView,     setChartView]     = useState<"revenue"|"tickets">("revenue");
  const [tooltipNav,    setTooltipNav]    = useState<string|null>(null);

  /* Sidebar icon size */
  const SIDEBAR_W = 64;
  const TOPBAR_H  = 64;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: C.bg, color: C.text }}>

      {/* ════════════════════════════════
          COLLAPSED ICON-ONLY SIDEBAR
      ════════════════════════════════ */}
      <aside
        className="flex flex-col items-center border-r flex-shrink-0 relative z-40"
        style={{ width: SIDEBAR_W, backgroundColor: C.surface, borderColor: C.border }}
      >
        {/* Logo mark */}
        <div className="flex items-center justify-center border-b flex-shrink-0" style={{ height: TOPBAR_H, borderColor: C.border, width: "100%" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow:`0 4px 16px ${C.redGlow}` }}>
            <Clapperboard size={15} className="text-white" />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4">
          {NAV.map(({ id, icon: Icon, href, tip, badge }) => {
            const active = activeNav === id;
            return (
              <Link
                key={id}
                to={href}
                onClick={() => setActiveNav(id)}
                onMouseEnter={() => setTooltipNav(id)}
                onMouseLeave={() => setTooltipNav(null)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group/icon no-underline"
                style={{
                  backgroundColor: active ? C.redSoft : "transparent",
                  border: `1px solid ${active ? `${C.red}35` : "transparent"}`,
                  color: active ? C.red : "rgba(255,255,255,0.32)",
                  textDecoration: "none",
                }}
              >
                {/* Active left indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ backgroundColor: C.red, boxShadow:`0 0 8px ${C.red}` }} />
                )}

                <Icon size={18} />

                {/* Badge */}
                {badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                    style={{ backgroundColor: C.red, fontSize:"0.46rem", fontWeight:900 }}>{badge}</span>
                )}

                {/* Tooltip */}
                {tooltipNav === id && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-xl border border-white/10 text-white whitespace-nowrap z-50 pointer-events-none"
                    style={{ backgroundColor:"#1e1e2e", fontSize:"0.75rem", fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.5)", animation:"panelIn .18s ease forwards" }}>
                    {tip}
                    {badge && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor:C.red, fontSize:"0.52rem", fontWeight:900 }}>{badge}</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="w-8 border-t mb-3" style={{ borderColor: C.border }} />

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1.5 pb-4">
          {[
            { icon: <Settings size={17} />, href: "/admin",   tip: "Settings" },
            { icon: <Globe size={17} />,    href: "/",        tip: "View Site" },
          ].map(({ icon, href, tip }) => (
            <Link key={tip} to={href}
              onMouseEnter={() => setTooltipNav(tip)}
              onMouseLeave={() => setTooltipNav(null)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors no-underline group/bot"
              style={{ color:"rgba(255,255,255,0.25)", textDecoration:"none" }}
              onMouseOver={e => (e.currentTarget.style.color="rgba(255,255,255,0.6)")}
              onMouseOut={e => (e.currentTarget.style.color="rgba(255,255,255,0.25)")}
            >
              {icon}
              {tooltipNav === tip && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-xl border border-white/10 text-white whitespace-nowrap z-50 pointer-events-none"
                  style={{ backgroundColor:"#1e1e2e", fontSize:"0.75rem", fontWeight:600, animation:"panelIn .18s ease forwards" }}>{tip}</div>
              )}
            </Link>
          ))}

          {/* Admin avatar */}
          <div className="mt-2 w-8 h-8 rounded-xl flex items-center justify-center text-white"
            style={{ background:"linear-gradient(135deg,#e8192c,#a00e1f)", fontSize:"0.58rem", fontWeight:900 }}>SA</div>
        </div>
      </aside>

      {/* ════════════════════════════════
          MAIN COLUMN
      ════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── TOP BAR ── */}
        <header
          className="flex-shrink-0 flex items-center gap-4 border-b px-6"
          style={{
            height: TOPBAR_H,
            backgroundColor: `${C.surface}f0`,
            backdropFilter: "blur(20px)",
            borderColor: C.border,
          }}
        >
          {/* Global search — 40% width */}
          <div
            className="relative flex items-center gap-2 rounded-xl border transition-all duration-200"
            style={{
              width: "40%",
              height: "38px",
              paddingLeft: "12px",
              paddingRight: "12px",
              backgroundColor: searchFocused ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.03)",
              borderColor: searchFocused ? "rgba(255,255,255,0.18)" : C.border,
              boxShadow: searchFocused ? `0 0 0 3px ${C.redGlow}` : "none",
            }}
          >
            <Search size={14} style={{ color: searchFocused ? "rgba(255,255,255,0.55)" : C.dim, flexShrink: 0 }} />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search movies, showtimes, users..."
              className="flex-1 bg-transparent text-white placeholder-white/25 outline-none"
              style={{ fontSize: "0.84rem" }}
            />
            {searchFocused && (
              <div className="flex items-center gap-1">
                <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded border border-white/10 text-white/25" style={{ fontSize:"0.55rem" }}>ESC</kbd>
              </div>
            )}
            {searchVal && !searchFocused && (
              <button onClick={() => setSearchVal("")}><X size={13} className="text-white/30 hover:text-white/60 transition-colors" /></button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Date/time */}
          <LiveClock />

          {/* Divider */}
          <div className="h-6 w-px" style={{ backgroundColor: C.border }} />

          {/* Refresh */}
          <button className="w-9 h-9 rounded-xl border flex items-center justify-center text-white/35 hover:text-white/70 transition-all"
            style={{ borderColor: C.border, backgroundColor:"rgba(255,255,255,0.02)" }}>
            <RefreshCw size={15} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotifOpen(v => !v)}
              className="relative w-9 h-9 rounded-xl border flex items-center justify-center text-white/40 hover:text-white transition-all"
              style={{ borderColor: notifOpen ? `${C.red}35` : C.border, backgroundColor: notifOpen ? C.redSoft : "rgba(255,255,255,0.02)" }}>
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ backgroundColor:C.red, fontSize:"0.48rem", fontWeight:900 }}>3</span>
            </button>
            <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* Divider */}
          <div className="h-6 w-px" style={{ backgroundColor: C.border }} />

          {/* Admin profile */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all hover:border-white/18"
            style={{ borderColor:C.border, backgroundColor:"rgba(255,255,255,0.02)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#e8192c,#a00e1f)", fontSize:"0.6rem", fontWeight:900 }}>SA</div>
            <div className="text-left">
              <p className="text-white" style={{ fontSize:"0.75rem", fontWeight:700 }}>System Admin</p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={9} style={{ color:C.red }} />
                <span style={{ fontSize:"0.56rem", fontWeight:700, letterSpacing:"0.1em", color:C.red }}>ADMIN</span>
              </div>
            </div>
          </button>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"thin", scrollbarColor:`rgba(255,255,255,0.1) transparent` }}>
          <div style={{ padding: "28px 28px 32px" }}>

            {/* Page title row */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <h1 className="text-white" style={{ fontWeight:900, fontSize:"1.4rem", letterSpacing:"-0.03em" }}>Dashboard Overview</h1>
                <p style={{ fontSize:"0.72rem", color:C.dim, marginTop:"3px" }}>Thu, March 5, 2026 · Last updated just now</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8" style={{ backgroundColor:"rgba(16,185,129,0.08)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor:C.green }} />
                  <span style={{ fontSize:"0.68rem", fontWeight:700, color:C.green }}>All Systems Operational</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                  style={{ background:`linear-gradient(135deg,${C.red},#c8111f)`, fontSize:"0.78rem", fontWeight:800, boxShadow:`0 4px 16px ${C.redGlow}` }}>
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            {/* ── 2×2 STAT CARDS ── */}
            <div className="grid grid-cols-2 gap-6 mb-7">
              <StatCard
                label="Total Revenue"  value="₫442M"  delta={+18.4} sub="vs last month"
                icon={<DollarSign size={16}/>} sparkData={SPARKLINES.revenue}   accentColor={C.red}    />
              <StatCard
                label="Tickets Sold"   value="5,120"   delta={+11.7} sub="vs last month"
                icon={<Ticket size={16}/>}     sparkData={SPARKLINES.tickets}   accentColor={C.blue}   />
              <StatCard
                label="Active Movies"  value="20"      delta={+3.0}  sub="titles showing"
                icon={<Film size={16}/>}       sparkData={SPARKLINES.movies}    accentColor={C.purple} />
              <StatCard
                label="Occupancy Rate" value="86%"     delta={+4.2}  sub="avg across halls"
                icon={<Activity size={16}/>}   sparkData={SPARKLINES.occupancy} accentColor={C.green}  />
            </div>

            {/* ── REVENUE CHART (full width) ── */}
            <div className="rounded-2xl border mb-7"
              style={{ backgroundColor:C.card, borderColor:C.border, overflow:"hidden" }}>
              <div className="h-px" style={{ background:`linear-gradient(90deg,transparent,${C.red} 40%,transparent)` }} />

              {/* Chart header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor:C.border }}>
                <div>
                  <h2 className="text-white" style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.02em" }}>Monthly Revenue Trends</h2>
                  <p style={{ fontSize:"0.7rem", color:C.dim, marginTop:"3px" }}>Apr 2025 – Mar 2026 · CGV Vincom Center</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* View toggle */}
                  {(["revenue","tickets"] as const).map(v => (
                    <button key={v} onClick={() => setChartView(v)}
                      className="px-3 py-1.5 rounded-xl border transition-all"
                      style={{
                        fontSize:"0.7rem", fontWeight:700,
                        backgroundColor: chartView===v ? (v==="revenue"?C.redSoft:"rgba(59,130,246,0.1)") : "transparent",
                        borderColor:     chartView===v ? (v==="revenue"?`${C.red}40`:"rgba(59,130,246,0.3)") : C.border,
                        color:           chartView===v ? (v==="revenue"?C.red:C.blue) : C.muted,
                      }}>
                      {v==="revenue" ? "Revenue (₫M)" : "Tickets Sold"}
                    </button>
                  ))}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-white/35 hover:text-white/60 transition-all"
                    style={{ fontSize:"0.7rem", borderColor:C.border }}>
                    <Filter size={11} /> Filter
                  </button>
                </div>
              </div>

              {/* KPI row */}
              <div className="flex items-center gap-6 px-6 py-4 border-b" style={{ borderColor:C.border }}>
                {[
                  { label:"YTD Total",    value:"₫3,286M", color:C.text   },
                  { label:"Best Month",   value:"Mar · ₫442M", color:C.text},
                  { label:"Growth YoY",   value:"+24.8%",  color:C.green  },
                  { label:"Total Tickets",value:"43,040",  color:C.text   },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.14em", color:C.dim, textTransform:"uppercase" }}>{label}</p>
                    <p style={{ fontWeight:900, fontSize:"1.05rem", letterSpacing:"-0.03em", color }}>{value}</p>
                  </div>
                ))}
                <div className="h-8 w-px ml-2" style={{ backgroundColor:C.border }} />
                {/* Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor:C.red }} />
                    <span style={{ fontSize:"0.68rem", color:C.muted }}>Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor:C.blue }} />
                    <span style={{ fontSize:"0.68rem", color:C.muted }}>Tickets</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div style={{ height: "240px", padding: "16px 12px 8px 4px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 16, bottom: 0, left: -4 }}>
                    <defs>
                      <linearGradient id="tabRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.red}  stopOpacity={0.35} />
                        <stop offset="80%"  stopColor={C.red}  stopOpacity={0.03} />
                      </linearGradient>
                      <linearGradient id="tabTixGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={C.blue} stopOpacity={0.3}  />
                        <stop offset="80%"  stopColor={C.blue} stopOpacity={0.02} />
                      </linearGradient>
                      <filter id="tabGlow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} strokeDasharray="0" />
                    <XAxis dataKey="month"
                      tick={{ fill:"rgba(255,255,255,0.32)", fontSize:11, fontWeight:600 }}
                      axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill:"rgba(255,255,255,0.22)", fontSize:10 }}
                      axisLine={false} tickLine={false}
                      tickFormatter={v => chartView==="revenue" ? `₫${v}M` : v.toLocaleString()}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke:"rgba(255,255,255,0.07)", strokeWidth:1 }} />
                    {chartView==="revenue" ? (
                      <Area type="monotone" dataKey="revenue" stroke={C.red} strokeWidth={2.5}
                        fill="url(#tabRevGrad)" dot={false}
                        activeDot={{ r:5, fill:C.red, stroke:"white", strokeWidth:2 }}
                        filter="url(#tabGlow)" />
                    ) : (
                      <Area type="monotone" dataKey="tickets" stroke={C.blue} strokeWidth={2.5}
                        fill="url(#tabTixGrad)" dot={false}
                        activeDot={{ r:5, fill:C.blue, stroke:"white", strokeWidth:2 }} />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── SECONDARY ROW ── */}
            <div className="grid grid-cols-3 gap-6 mb-7">

              {/* Hall Occupancy — col 1 */}
              <div className="rounded-2xl border p-5 flex flex-col gap-4"
                style={{ backgroundColor:C.card, borderColor:C.border }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-white" style={{ fontWeight:700, fontSize:"0.9rem" }}>Hall Occupancy</h3>
                  <span style={{ fontSize:"0.65rem", color:C.dim }}>Live</span>
                </div>
                <div className="flex flex-col gap-3">
                  {HALL_OCC.map(h => (
                    <div key={h.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ fontSize:"0.72rem", fontWeight:600, color:"rgba(255,255,255,0.5)" }}>{h.name}</span>
                        <span style={{ fontSize:"0.75rem", fontWeight:800, color:h.color }}>{h.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:"rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width:`${h.pct}%`, backgroundColor:h.color, boxShadow:`0 0 6px ${h.color}60` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket Types donut — col 2 */}
              <div className="rounded-2xl border p-5 flex flex-col gap-4"
                style={{ backgroundColor:C.card, borderColor:C.border }}>
                <h3 className="text-white" style={{ fontWeight:700, fontSize:"0.9rem" }}>Ticket Types</h3>
                <div className="flex items-center gap-4 flex-1">
                  <div style={{ width:110, height:110, flexShrink:0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
                          paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {PIE_DATA.map((e,i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2.5 flex-1">
                    {PIE_DATA.map(t => (
                      <div key={t.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:t.color }} />
                          <span style={{ fontSize:"0.72rem", color:C.muted }}>{t.name}</span>
                        </div>
                        <span className="text-white" style={{ fontSize:"0.78rem", fontWeight:700 }}>{t.value}%</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t" style={{ borderColor:C.border }}>
                      <p style={{ fontSize:"0.62rem", color:C.dim }}>Total this month</p>
                      <p className="text-white" style={{ fontWeight:800, fontSize:"0.92rem" }}>5,120 tickets</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity — col 3 */}
              <div className="rounded-2xl border flex flex-col"
                style={{ backgroundColor:C.card, borderColor:C.border }}>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:C.border }}>
                  <h3 className="text-white" style={{ fontWeight:700, fontSize:"0.9rem" }}>Recent Activity</h3>
                  <span className="text-white/25 cursor-pointer hover:text-white/50 transition-colors" style={{ fontSize:"0.68rem" }}>View all</span>
                </div>
                <div className="flex-1 divide-y" style={{ borderColor: C.border }}>
                  {ACTIVITY.map((a,i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.015] transition-colors">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor:`${a.color}12`, color:a.color, border:`1px solid ${a.color}20` }}>{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{a.text}</p>
                        <p style={{ fontSize:"0.62rem", color:C.dim, marginTop:"2px" }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Today's snapshot */}
                <div className="px-4 py-3.5 border-t" style={{ borderColor:C.border }}>
                  <p className="uppercase mb-2.5" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.14em", color:C.dim }}>Today's Snapshot</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label:"Shows",    value:"24",   color:C.blue  },
                      { label:"Bookings", value:"187",  color:C.green },
                      { label:"Revenue",  value:"₫18M", color:C.red   },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center py-2 rounded-xl border"
                        style={{ backgroundColor:"rgba(255,255,255,0.02)", borderColor:C.border }}>
                        <p style={{ fontWeight:800, fontSize:"0.86rem", color }}>{value}</p>
                        <p style={{ fontSize:"0.58rem", color:C.dim }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── TOP PERFORMING MOVIES TABLE ── */}
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:C.card, borderColor:C.border }}>
              {/* Table header */}
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:C.border }}>
                <div>
                  <h2 className="text-white" style={{ fontWeight:800, fontSize:"0.95rem" }}>Top Performing Movies</h2>
                  <p style={{ fontSize:"0.68rem", color:C.dim, marginTop:"2px" }}>Ranked by revenue · March 2026</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-white/35 hover:text-white/60 transition-all"
                    style={{ fontSize:"0.7rem", borderColor:C.border }}>
                    <Filter size={11} /> Filter
                  </button>
                  <Link to="/admin/movies"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl no-underline transition-all"
                    style={{ fontSize:"0.7rem", fontWeight:700, backgroundColor:C.redSoft, border:`1px solid ${C.red}35`, color:C.red, textDecoration:"none" }}>
                    View All <ChevronRight size={11} />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor:"rgba(255,255,255,0.05)", backgroundColor:"rgba(255,255,255,0.015)" }}>
                      {["#","Movie","Format","Revenue","Tickets","Occ.","Trend"].map(h => (
                        <th key={h}
                          className="py-2.5 text-left"
                          style={{
                            fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.13em",
                            color:"rgba(255,255,255,0.25)", textTransform:"uppercase",
                            paddingLeft: h==="#"?"20px": undefined,
                            paddingRight: h==="Trend"?"20px":undefined,
                            textAlign: ["Tickets","Occ.","Trend"].includes(h)?"right":"left",
                          }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_MOVIES.map((m,i) => <MovieRow key={m.title} movie={m} rank={i+1} />)}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="flex items-center justify-between px-6 py-3 border-t" style={{ borderColor:C.border }}>
                <span style={{ fontSize:"0.7rem", color:C.dim }}>Showing 5 of 20 movies</span>
                <div className="flex items-center gap-1">
                  {[1,2,3].map(p => (
                    <button key={p} className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all"
                      style={{ fontSize:"0.72rem", fontWeight:p===1?800:500, backgroundColor:p===1?C.red:"transparent", borderColor:p===1?C.red:"rgba(255,255,255,0.08)", color:p===1?"white":"rgba(255,255,255,0.35)" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── QUICK ACTIONS BAR ── */}
            <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl border flex-wrap"
              style={{ backgroundColor:C.card, borderColor:C.border }}>
              <p className="uppercase" style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.14em", color:C.dim, flexShrink:0 }}>Quick Actions</p>
              <div className="h-5 w-px" style={{ backgroundColor:C.border }} />
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label:"Add Movie",    icon:<Film size={13}/>,       color:C.red,    href:"/admin/movies"    },
                  { label:"New Showtime", icon:<Clock size={13}/>,      color:C.blue,   href:"/admin/showtimes" },
                  { label:"Manage Rooms", icon:<DoorOpen size={13}/>,   color:C.purple, href:"/admin/rooms"     },
                  { label:"View Users",   icon:<Users size={13}/>,      color:C.green,  href:"/admin/users"     },
                  { label:"Mobile View",  icon:<Sparkles size={13}/>,   color:C.amber,  href:"/admin/mobile"    },
                ].map(({ label, icon, color, href }) => (
                  <Link key={label} to={href}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all hover:-translate-y-0.5 no-underline"
                    style={{ fontSize:"0.75rem", fontWeight:600, backgroundColor:`${color}0d`, borderColor:`${color}25`, color, textDecoration:"none" }}>
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes panelIn {
          from { opacity:0; transform:scale(.93) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
