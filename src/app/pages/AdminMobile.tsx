import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Menu, Bell, X, LayoutDashboard, Film, DoorOpen,
  Settings, TrendingUp, TrendingDown, Ticket,
  DollarSign, Activity, ChevronRight, Clock,
  Users, BarChart3, Star, Zap, AlertTriangle,
  LogOut, Clapperboard, Globe, ShieldCheck,
  Play, Eye, MoreHorizontal, ArrowUpRight,
  CircleDot, Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

/* ══════════════════════════
   PALETTE
══════════════════════════ */
const C = {
  bg:       "#0a0a0f",
  surface:  "#111118",
  card:     "#1a1a24",
  cardAlt:  "#141420",
  border:   "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.13)",
  red:      "#e8192c",
  redSoft:  "rgba(232,25,44,0.13)",
  redGlow:  "rgba(232,25,44,0.28)",
  green:    "#10b981",
  amber:    "#f59e0b",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
  text:     "#ffffff",
  muted:    "rgba(255,255,255,0.45)",
  dim:      "rgba(255,255,255,0.22)",
};

/* ══════════════════════════
   DATA
══════════════════════════ */
const REVENUE_TREND = [
  { m: "Apr", v: 182, t: 2140 },
  { m: "May", v: 224, t: 2680 },
  { m: "Jun", v: 198, t: 2310 },
  { m: "Jul", v: 275, t: 3210 },
  { m: "Aug", v: 310, t: 3650 },
  { m: "Sep", v: 265, t: 3080 },
  { m: "Oct", v: 340, t: 4020 },
  { m: "Nov", v: 298, t: 3490 },
  { m: "Dec", v: 410, t: 4870 },
  { m: "Jan", v: 356, t: 4210 },
  { m: "Feb", v: 388, t: 4580 },
  { m: "Mar", v: 442, t: 5120 },
];

const SPARKLINE_DATA = {
  revenue:  [120,145,132,168,155,190,175,210,198,230,215,248],
  tickets:  [1800,2100,1950,2400,2200,2700,2500,3000,2850,3200,3050,3400],
  movies:   [12,14,13,15,16,14,17,18,16,19,17,20],
  occupancy:[68,72,69,75,78,73,80,82,77,84,81,86],
};

const TOP_MOVIES = [
  { title: "Your Name",    genre: "Animation", revenue: 442, occ: 94,  trend: +18.4, poster: "https://images.unsplash.com/photo-1629058545686-f9acd8608d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { title: "Neon Horizon", genre: "Sci-Fi",    revenue: 388, occ: 87,  trend: +12.1, poster: "https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { title: "Void Runner",  genre: "Sci-Fi",    revenue: 356, occ: 82,  trend: +7.3,  poster: "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { title: "Iron Legacy",  genre: "Fantasy",   revenue: 298, occ: 73,  trend: -3.2,  poster: "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
];

const ACTIVITY = [
  { icon: <Ticket size={12} />,      color: C.green,  text: "New booking · Your Name · G10",  time: "2m"  },
  { icon: <Film size={12} />,        color: C.blue,   text: "Showtime added · Neon Horizon",  time: "8m"  },
  { icon: <Users size={12} />,       color: C.amber,  text: "New user · Alex Nguyen",         time: "15m" },
  { icon: <AlertTriangle size={12}/>,color: C.red,    text: "Hall 05 maintenance alert",      time: "32m" },
  { icon: <DollarSign size={12} />,  color: C.green,  text: "Daily revenue target reached",   time: "1h"  },
];

const HALL_OCC = [
  { name: "IMAX 01",  pct: 94, color: C.red    },
  { name: "IMAX 02",  pct: 88, color: "#f97316"},
  { name: "4DX 01",   pct: 81, color: C.amber  },
  { name: "Dolby 01", pct: 76, color: C.blue   },
  { name: "Hall 05",  pct: 62, color: C.purple },
];

const NAV_DRAWER = [
  { id: "dashboard", label: "Dashboard",       icon: LayoutDashboard, href: "/admin/mobile"    },
  { id: "movies",    label: "Movies",           icon: Film,            href: "/admin/movies",   badge: 20  },
  { id: "showtimes", label: "Showtimes",        icon: Clock,           href: "/admin/showtimes"           },
  { id: "rooms",     label: "Rooms",            icon: DoorOpen,        href: "/admin/rooms"               },
  { id: "users",     label: "Users",            icon: Users,           href: "/admin/users",    badge: 3   },
  { id: "revenue",   label: "Revenue Reports",  icon: BarChart3,       href: "/admin"                     },
];

/* ══════════════════════════
   MINI SPARKLINE
══════════════════════════ */
function Spark({ data, color }: { data: number[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={data.map(v => ({ v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6}
          fill={`url(#sg${color.replace("#","")})`} dot={false} isAnimationActive />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════
   STAT CARD
══════════════════════════ */
interface StatCardProps {
  label: string; value: string; delta: number; sub: string;
  icon: React.ReactNode; sparkData: number[];
  accentColor: string; rank: number;
}
function StatCard({ label, value, delta, sub, icon, sparkData, accentColor, rank }: StatCardProps) {
  const pos = delta >= 0;
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-2.5"
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        padding: "16px",
        boxShadow: `0 4px 24px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Top bar gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor} 50%, transparent)` }} />

      {/* Rank watermark */}
      <span className="absolute top-3 right-3 opacity-[0.06]" style={{ fontSize: "3.5rem", fontWeight: 900, color: accentColor, lineHeight: 1 }}>
        {rank < 10 ? `0${rank}` : rank}
      </span>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}28`, color: accentColor }}>
            {icon}
          </div>
          <span className="uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", color: C.muted }}>
            {label}
          </span>
        </div>
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{
            fontSize: "0.62rem", fontWeight: 800,
            backgroundColor: pos ? "rgba(16,185,129,0.12)" : "rgba(232,25,44,0.12)",
            color: pos ? C.green : C.red,
          }}
        >
          {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {pos ? "+" : ""}{delta}%
        </span>
      </div>

      {/* Value */}
      <div>
        <p className="text-white" style={{ fontWeight: 900, fontSize: "1.65rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ fontSize: "0.65rem", color: C.dim, marginTop: "3px" }}>{sub}</p>
      </div>

      {/* Sparkline */}
      <Spark data={sparkData} color={accentColor} />
    </div>
  );
}

/* ══════════════════════════
   CUSTOM TOOLTIP
══════════════════════════ */
function MobileTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 border border-white/10"
      style={{ backgroundColor: "#1a1a2e", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", fontSize: "0.72rem" }}>
      <p className="text-white/40 mb-1" style={{ fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.1em" }}>{label}</p>
      <p className="text-white font-bold">₫{payload[0]?.value}M</p>
    </div>
  );
}

/* ══════════════════════════
   SECTION HEADER
══════════════════════════ */
function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em" }}>{title}</h2>
        {sub && <p style={{ fontSize: "0.65rem", color: C.dim, marginTop: "1px" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ══════════════════════════
   BOTTOM TAB BAR
══════════════════════════ */
const TABS = [
  { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin/mobile" },
  { id: "movies",    icon: <Film size={20} />,            label: "Movies",    href: "/admin/movies"  },
  { id: "rooms",     icon: <DoorOpen size={20} />,        label: "Rooms",     href: "/admin/rooms"   },
  { id: "settings",  icon: <Settings size={20} />,        label: "Settings",  href: "/admin"         },
];

function BottomTabBar({ active }: { active: string }) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around"
      style={{
        backgroundColor: "rgba(14,14,20,0.97)",
        backdropFilter: "blur(24px)",
        borderTop: `1px solid ${C.border}`,
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}
    >
      {TABS.map(tab => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            to={tab.href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full no-underline relative"
            style={{ textDecoration: "none" }}
          >
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                style={{ width: "32px", height: "2.5px", backgroundColor: C.red, boxShadow: `0 0 10px ${C.redGlow}` }}
              />
            )}
            <span style={{ color: isActive ? C.red : "rgba(255,255,255,0.28)", transition: "color .2s" }}>
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "0.56rem", fontWeight: isActive ? 800 : 500,
                color: isActive ? C.red : "rgba(255,255,255,0.28)",
                letterSpacing: "0.04em", transition: "color .2s",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ══════════════════════════
   SLIDE-OUT DRAWER
══════════════════════════ */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Close on escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{ backgroundColor: open ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)", backdropFilter: open ? "blur(8px)" : "none", pointerEvents: open ? "auto" : "none" }}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{
          width: "280px",
          backgroundColor: "#0e0e16",
          borderRight: `1px solid ${C.border}`,
          boxShadow: open ? "8px 0 40px rgba(0,0,0,0.7)" : "none",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: `0 4px 16px ${C.redGlow}` }}>
              <Clapperboard size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.78rem", letterSpacing: "0.2em" }}>CINEMA</p>
              <p style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em", color: C.dim }}>ADMIN PANEL</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/30 hover:text-white transition-colors"
            style={{ borderColor: C.border }}>
            <X size={15} />
          </button>
        </div>

        {/* Admin profile mini */}
        <div className="mx-4 my-4 p-3.5 rounded-2xl border flex items-center gap-3"
          style={{ backgroundColor: C.redSoft, borderColor: `${C.red}25` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.7rem", fontWeight: 900 }}>SA</div>
          <div className="flex-1 min-w-0">
            <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.82rem" }}>System Admin</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck size={9} style={{ color: C.red }} />
              <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", color: C.red }}>SUPER ADMIN</span>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-3 mb-2 uppercase" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", color: C.dim }}>Main Menu</p>
          <div className="flex flex-col gap-1">
            {NAV_DRAWER.map(({ id, label, icon: Icon, href, badge }) => {
              const active = id === "dashboard";
              return (
                <Link
                  key={id}
                  to={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all no-underline"
                  style={{
                    backgroundColor: active ? C.redSoft : "transparent",
                    border: `1px solid ${active ? `${C.red}30` : "transparent"}`,
                    textDecoration: "none",
                  }}
                >
                  {active && <span className="absolute left-0 w-0.5 h-5 rounded-r-full" style={{ backgroundColor: C.red }} />}
                  <span style={{ color: active ? C.red : C.muted }}><Icon size={17} /></span>
                  <span style={{ flex: 1, fontWeight: active ? 700 : 500, fontSize: "0.84rem", color: active ? C.red : "rgba(255,255,255,0.7)" }}>{label}</span>
                  {badge && (
                    <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: "0.58rem", fontWeight: 800, backgroundColor: active ? C.red : "rgba(255,255,255,0.12)" }}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t" style={{ borderColor: C.border }} />
          <p className="px-3 mb-2 uppercase" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", color: C.dim }}>System</p>
          {[
            { icon: <Settings size={16} />, label: "Settings", href: "/admin" },
            { icon: <Globe size={16} />,    label: "View Public Site", href: "/" },
            { icon: <LogOut size={16} />,   label: "Sign Out", href: "/" },
          ].map(({ icon, label, href }) => (
            <Link key={label} to={href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-white/70 transition-colors no-underline"
              style={{ textDecoration: "none" }}>
              {icon}
              <span style={{ fontSize: "0.84rem" }}>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Version badge */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "0.62rem", color: C.dim }}>Cinema Admin v2.6</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "0.55rem", fontWeight: 700, backgroundColor: "rgba(16,185,129,0.12)", color: C.green, border: "1px solid rgba(16,185,129,0.2)" }}>● LIVE</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════
   NOTIFICATION PANEL
══════════════════════════ */
function NotifPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!(e.target as Element).closest("[data-notif]")) onClose(); };
    setTimeout(() => window.addEventListener("mousedown", h), 50);
    return () => window.removeEventListener("mousedown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      data-notif="1"
      className="absolute top-full right-0 mt-2 rounded-2xl border border-white/10 overflow-hidden z-[60]"
      style={{ width: "290px", backgroundColor: "#13131e", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", animation: "slideDown .25s cubic-bezier(.34,1.4,.64,1) forwards" }}
    >
      <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <span className="text-white" style={{ fontWeight: 700, fontSize: "0.85rem" }}>Notifications</span>
        <span style={{ fontSize: "0.68rem", fontWeight: 600, color: C.red, cursor: "pointer" }}>Mark all read</span>
      </div>
      <div className="divide-y" style={{ borderColor: C.border }}>
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${a.color}14`, color: a.color, border: `1px solid ${a.color}20` }}>
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a.text}</p>
              <p style={{ fontSize: "0.62rem", color: C.dim, marginTop: "2px" }}>{a.time} ago</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-white/6 text-center">
        <span style={{ fontSize: "0.72rem", color: C.dim, cursor: "pointer" }}>View all notifications</span>
      </div>
    </div>
  );
}

/* ══════════════════════════
   MAIN PAGE
══════════════════════════ */
export function AdminMobile() {
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [chartView,   setChartView]   = useState<"revenue"|"tickets">("revenue");
  const topRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: C.bg, color: C.text, fontFamily: "inherit" }}>

      {/* ══ STICKY TOP NAVBAR ══ */}
      <header
        ref={topRef}
        className="sticky top-0 z-30 flex items-center justify-between"
        style={{
          backgroundColor: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          height: "56px",
          padding: "0 16px",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }}
        >
          <Menu size={18} className="text-white/70" />
        </button>

        {/* Center logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: `0 2px 10px ${C.redGlow}` }}>
            <Clapperboard size={12} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.22em", lineHeight: 1 }}>CINEMA</p>
            <p style={{ fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.18em", color: C.red }}>ADMIN</p>
          </div>
        </div>

        {/* Right: Bell + Avatar */}
        <div className="flex items-center gap-2 relative">
          {/* Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{ backgroundColor: notifOpen ? C.redSoft : "rgba(255,255,255,0.04)", border: `1px solid ${notifOpen ? `${C.red}30` : C.border}` }}
            >
              <Bell size={17} className="text-white/70" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: C.red, fontSize: "0.48rem", fontWeight: 900 }}>
                3
              </span>
            </button>
            <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.6rem", fontWeight: 900, boxShadow: `0 2px 10px ${C.redGlow}` }}
          >
            SA
          </div>
        </div>
      </header>

      {/* ══ DRAWER ══ */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ══ MAIN SCROLL AREA ══ */}
      <main style={{ padding: "16px", paddingBottom: "88px" }}>

        {/* Welcome banner */}
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-between mb-5"
          style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, padding: "16px 18px" }}
        >
          <div className="h-px absolute top-0 inset-x-0" style={{ background: `linear-gradient(90deg,transparent,${C.red} 50%,transparent)` }} />
          {/* Red glow blob */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none" style={{ backgroundColor: C.red, filter: "blur(32px)", opacity: 0.12 }} />
          <div>
            <p style={{ fontSize: "0.62rem", fontWeight: 600, color: C.dim, letterSpacing: "0.06em" }}>{dateStr}</p>
            <h1 className="text-white mt-0.5" style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
              Good morning, <span style={{ color: C.red }}>Admin</span> 👋
            </h1>
            <p style={{ fontSize: "0.68rem", color: C.muted, marginTop: "2px" }}>5 showtimes scheduled today</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${C.red}22,${C.red}08)`, border: `1.5px solid ${C.red}30` }}>
              <Sparkles size={22} style={{ color: C.red }} />
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="flex flex-col gap-3 mb-6">
          {[
            { label: "Total Revenue",  value: "₫442M",  delta: +18.4, sub: "vs last month", icon: <DollarSign size={14} />, sparkData: SPARKLINE_DATA.revenue,   accentColor: C.red    },
            { label: "Tickets Sold",   value: "5,120",   delta: +11.7, sub: "vs last month", icon: <Ticket size={14} />,     sparkData: SPARKLINE_DATA.tickets,   accentColor: C.blue   },
            { label: "Active Movies",  value: "20",      delta: +3.0,  sub: "titles showing", icon: <Film size={14} />,       sparkData: SPARKLINE_DATA.movies,    accentColor: C.purple },
            { label: "Occupancy Rate", value: "86%",     delta: +4.2,  sub: "avg across halls", icon: <Activity size={14} />, sparkData: SPARKLINE_DATA.occupancy, accentColor: C.green  },
          ].map((card, i) => (
            <StatCard key={card.label} {...card} rank={i + 1} />
          ))}
        </div>

        {/* ── REVENUE CHART ── */}
        <section className="mb-6">
          <SectionHeader
            title="Revenue Trends"
            sub="Apr 2025 – Mar 2026"
            action={
              <Link to="/admin" className="flex items-center gap-1 no-underline" style={{ textDecoration: "none", fontSize: "0.68rem", fontWeight: 600, color: C.red }}>
                Detail <ArrowUpRight size={12} />
              </Link>
            }
          />

          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red} 50%,transparent)` }} />

            {/* Toggle row */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div>
                <p className="text-white" style={{ fontWeight: 900, fontSize: "1.3rem", letterSpacing: "-0.03em" }}>₫3,286M</p>
                <p style={{ fontSize: "0.62rem", color: C.green, fontWeight: 700 }}>↑ +24.8% YoY</p>
              </div>
              <div className="flex gap-1.5">
                {(["revenue","tickets"] as const).map(v => (
                  <button key={v} onClick={() => setChartView(v)}
                    className="px-3 py-1.5 rounded-xl border transition-all"
                    style={{
                      fontSize: "0.64rem", fontWeight: 700,
                      backgroundColor: chartView === v ? (v === "revenue" ? C.redSoft : "rgba(59,130,246,0.1)") : "transparent",
                      borderColor: chartView === v ? (v === "revenue" ? `${C.red}40` : "rgba(59,130,246,0.3)") : C.border,
                      color: chartView === v ? (v === "revenue" ? C.red : C.blue) : C.muted,
                    }}
                  >
                    {v === "revenue" ? "₫ Rev" : "🎟 Tix"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={{ height: "160px", padding: "0 4px 8px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
                  <defs>
                    <linearGradient id="mRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.red}  stopOpacity={0.38} />
                      <stop offset="85%" stopColor={C.red}  stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="mTixGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.blue} stopOpacity={0.38} />
                      <stop offset="85%" stopColor={C.blue} stopOpacity={0.02} />
                    </linearGradient>
                    <filter id="mGlow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <XAxis dataKey="m"
                    tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 10, fontWeight: 600 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<MobileTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
                  {chartView === "revenue" ? (
                    <Area type="monotone" dataKey="v" stroke={C.red} strokeWidth={2.2}
                      fill="url(#mRevGrad)" dot={false}
                      activeDot={{ r: 4, fill: C.red, stroke: "white", strokeWidth: 2 }}
                      filter="url(#mGlow)"
                    />
                  ) : (
                    <Area type="monotone" dataKey="t" stroke={C.blue} strokeWidth={2.2}
                      fill="url(#mTixGrad)" dot={false}
                      activeDot={{ r: 4, fill: C.blue, stroke: "white", strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ── HALL OCCUPANCY ── */}
        <section className="mb-6">
          <SectionHeader
            title="Hall Occupancy"
            sub="Live · Today"
            action={
              <Link to="/admin/rooms" className="flex items-center gap-1 no-underline" style={{ textDecoration: "none", fontSize: "0.68rem", fontWeight: 600, color: C.red }}>
                Rooms <ArrowUpRight size={12} />
              </Link>
            }
          />
          <div className="rounded-2xl flex flex-col gap-3 p-4" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            {HALL_OCC.map(h => (
              <div key={h.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{h.name}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: h.color }}>{h.pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${h.pct}%`, backgroundColor: h.color, boxShadow: `0 0 8px ${h.color}60` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOP MOVIES ── */}
        <section className="mb-6">
          <SectionHeader
            title="Top Movies"
            sub="By revenue this month"
            action={
              <Link to="/admin/movies" className="flex items-center gap-1 no-underline" style={{ textDecoration: "none", fontSize: "0.68rem", fontWeight: 600, color: C.red }}>
                All <ArrowUpRight size={12} />
              </Link>
            }
          />
          <div className="flex flex-col gap-2.5">
            {TOP_MOVIES.map((movie, i) => {
              const pos = movie.trend >= 0;
              const barW = (movie.revenue / TOP_MOVIES[0].revenue) * 100;
              return (
                <div
                  key={movie.title}
                  className="flex items-center gap-3 rounded-2xl p-3 transition-all active:scale-[0.98]"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  {/* Rank */}
                  <span className="w-5 text-center" style={{ fontSize: "0.65rem", fontWeight: 700, color: i === 0 ? C.red : C.dim }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Poster */}
                  <div className="w-10 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/8">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.84rem" }}>{movie.title}</p>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: C.red, flexShrink: 0 }}>₫{movie.revenue}M</span>
                    </div>
                    <p style={{ fontSize: "0.62rem", color: C.dim, marginBottom: "6px" }}>{movie.genre}</p>
                    {/* Revenue bar */}
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${barW}%`, background: `linear-gradient(90deg, ${C.red}, ${C.red}aa)`, boxShadow: `0 0 6px ${C.redGlow}` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>Occ. {movie.occ}%</span>
                      <span
                        className="flex items-center gap-1"
                        style={{ fontSize: "0.62rem", fontWeight: 700, color: pos ? C.green : C.red }}
                      >
                        {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                        {pos ? "+" : ""}{movie.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section className="mb-6">
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Film size={20} />,       label: "Add Movie",    sub: "New title",      color: C.red,    href: "/admin/movies"    },
              { icon: <Clock size={20} />,      label: "Showtime",     sub: "Schedule",       color: C.blue,   href: "/admin/showtimes" },
              { icon: <DoorOpen size={20} />,   label: "Rooms",        sub: "Manage halls",   color: C.purple, href: "/admin/rooms"     },
              { icon: <Users size={20} />,      label: "Users",        sub: "View all",       color: C.green,  href: "/admin/users"     },
            ].map(({ icon, label, sub, color, href }) => (
              <Link
                key={label}
                to={href}
                className="flex flex-col items-start gap-2 p-4 rounded-2xl transition-all active:scale-[0.96] no-underline"
                style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, textDecoration: "none" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}14`, border: `1px solid ${color}25`, color }}>
                  {icon}
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 700, fontSize: "0.84rem" }}>{label}</p>
                  <p style={{ fontSize: "0.62rem", color: C.dim }}>{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── RECENT ACTIVITY ── */}
        <section className="mb-4">
          <SectionHeader title="Recent Activity" sub="Last 2 hours" />
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red} 50%,transparent)` }} />
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 transition-colors"
                style={{ borderBottom: i < ACTIVITY.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none" }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${a.color}12`, color: a.color, border: `1px solid ${a.color}20` }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}>{a.text}</p>
                </div>
                <span style={{ fontSize: "0.62rem", color: C.dim, flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TODAY'S SNAPSHOT ── */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[
            { label: "Shows",    value: "24",   color: C.blue  },
            { label: "Bookings", value: "187",  color: C.green },
            { label: "Revenue",  value: "₫18M", color: C.red   },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center py-3.5 rounded-2xl"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              <p style={{ fontWeight: 900, fontSize: "1rem", color }}>{value}</p>
              <p style={{ fontSize: "0.58rem", color: C.dim, marginTop: "2px" }}>{label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ══ BOTTOM TAB BAR ══ */}
      <BottomTabBar active="dashboard" />

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
