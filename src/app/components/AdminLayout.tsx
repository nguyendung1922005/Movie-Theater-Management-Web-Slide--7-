import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Film, Clock, DoorOpen, Users,
  BarChart3, Settings, ChevronRight, Search, Bell,
  Clapperboard, Globe, ShieldCheck, ChevronDown,
  RefreshCw, LogOut, Zap,
} from "lucide-react";

type AdminRole = "manager" | "coordinator" | "fb_staff";

const ROLE_META: Record<AdminRole, { label: string; short: string; allow: string[] }> = {
  manager: {
    label: "Manager",
    short: "MGR",
    allow: ["dashboard", "movies", "showtimes", "rooms", "users", "promotions", "revenue", "feedback", "settings"],
  },
  coordinator: {
    label: "Coordinator",
    short: "COOR",
    allow: ["dashboard", "movies", "showtimes", "rooms"],
  },
  fb_staff: {
    label: "F&B Staff",
    short: "F&B",
    allow: ["dashboard", "inventory"],
  },
};

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",       icon: LayoutDashboard, href: "/admin",             badge: null },
  { id: "movies",     label: "Movies",          icon: Film,            href: "/admin/movies",      badge: 20   },
  { id: "showtimes",  label: "Showtimes",       icon: Clock,           href: "/admin/showtimes",   badge: null },
  { id: "rooms",      label: "Rooms",           icon: DoorOpen,        href: "/admin/rooms",       badge: null },
  { id: "users",      label: "Users",           icon: Users,           href: "/admin/users",       badge: 3    },
  { id: "promotions", label: "Promotions",      icon: Zap,             href: "/admin/promotions",  badge: null },
  { id: "inventory",  label: "Snack Inventory", icon: Clapperboard,    href: "/admin/inventory",   badge: null },
  { id: "feedback",   label: "Feedback",        icon: ShieldCheck,     href: "/admin/feedback",    badge: null },
  { id: "revenue",    label: "Revenue Reports", icon: BarChart3,       href: "/admin/revenue",     badge: null },
  { id: "settings",   label: "Settings",        icon: Settings,        href: "/admin/settings",    badge: null },
];

/**
 * Active-state is now derived from the URL via useLocation(),
 * so the `activeNav` prop is no longer needed by callers.
 */
interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminLayout({ title, subtitle, children, actions }: AdminLayoutProps) {
  const [expanded, setExpanded]           = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [roleOpen, setRoleOpen]           = useState(false);
  const [role, setRole]                   = useState<AdminRole>("manager");

  /** Resolves the current pathname for active-link highlighting. */
  const { pathname } = useLocation();

  /**
   * Returns true when `href` is the "active" route.
   *
   * Dashboard lives at "/admin" (exact), so we use strict equality
   * to prevent it lighting up on every nested /admin/* route.
   * Every other item uses a startsWith check so that sub-routes
   * (e.g. /admin/movies/edit) also highlight the parent item.
   */
  const isActive = (href: string): boolean =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(href + "/");

  const C = {
    surface: "#0f0f18", card: "#13131e", border: "rgba(255,255,255,0.07)",
    red: "#e8192c", redSoft: "rgba(232,25,44,0.12)", redGlow: "rgba(232,25,44,0.25)",
    muted: "rgba(255,255,255,0.45)", dim: "rgba(255,255,255,0.2)",
    green: "#10b981", amber: "#f59e0b", blue: "#3b82f6",
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("admin_role") as AdminRole | null;
    if (saved && ROLE_META[saved]) setRole(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("admin_role", role);
    setRoleOpen(false);
  }, [role]);

  const navItemsForRole = useMemo(() => {
    const allow = new Set(ROLE_META[role].allow);
    return NAV_ITEMS.filter((i) => allow.has(i.id));
  }, [role]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0a0a0f", color: "white" }}>

      {/* ─── SIDEBAR ─── */}
      <aside
        className="fixed left-0 top-0 h-full flex flex-col border-r z-40 transition-all duration-300"
        style={{ width: expanded ? "220px" : "64px", backgroundColor: C.surface, borderColor: C.border }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 px-4 py-5 border-b no-underline transition-colors hover:bg-white/[0.02]" style={{ borderColor: C.border, minHeight: "65px", textDecoration: "none" }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: "0 4px 16px rgba(232,25,44,0.4)" }}
          >
            <Clapperboard size={16} className="text-white" />
          </div>
          {expanded && (
            <div>
              <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.2em" }}>CINEMA</p>
              <p className="text-white/30 uppercase" style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em" }}>Admin Panel</p>
            </div>
          )}
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-2 flex flex-col gap-0.5">
            {navItemsForRole.map(({ id, label, icon: Icon, href, badge }) => {
              const active = isActive(href);
              return (
                <Link
                  key={id}
                  to={href}
                  className="relative flex items-center gap-3 rounded-xl transition-all duration-150 group cursor-pointer no-underline box-border"
                  style={{
                    padding: expanded ? "9px 12px" : "9px",
                    justifyContent: expanded ? "flex-start" : "center",
                    backgroundColor: active ? C.redSoft : "transparent",
                    color: active ? C.red : C.muted,
                    border: `1px solid ${active ? C.redGlow : "transparent"}`,
                    textDecoration: "none",
                  }}
                  title={!expanded ? label : undefined}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ backgroundColor: C.red }} />
                  )}
                  <Icon size={17} className="flex-shrink-0" />
                  {expanded && (
                    <>
                      <span style={{ fontSize: "0.82rem", fontWeight: active ? 700 : 500 }}>{label}</span>
                      {badge && (
                        <span
                          className="ml-auto px-1.5 py-0.5 rounded-full text-white"
                          style={{ fontSize: "0.58rem", fontWeight: 800, backgroundColor: active ? C.red : "rgba(255,255,255,0.12)" }}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {!expanded && (
                    <div
                      className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg border border-white/10 text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                      style={{ backgroundColor: "#1a1a28", fontSize: "0.78rem", fontWeight: 600 }}
                    >
                      {label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mx-4 my-3 border-t" style={{ borderColor: C.border }} />

          <div className="px-2 flex flex-col gap-0.5">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl py-2.5 px-3 text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all no-underline"
              style={{ justifyContent: expanded ? "flex-start" : "center", color: "rgba(255,255,255,0.3)" }}
            >
              <LogOut size={16} className="flex-shrink-0" />
              {expanded && <span style={{ fontSize: "0.82rem" }}>Exit Admin</span>}
            </Link>
          </div>
        </nav>

        {/* Admin card */}
        {expanded && (
          <div className="mx-3 mb-4 p-3 rounded-2xl border" style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.72rem", fontWeight: 900 }}>SA</div>
              <div className="min-w-0">
                <p className="text-white truncate" style={{ fontSize: "0.78rem", fontWeight: 700 }}>System Admin</p>
                <p className="text-white/30 truncate" style={{ fontSize: "0.62rem" }}>admin@cinema.vn</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-white/8 text-white/40 hover:text-white/70 transition-colors no-underline"
              style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}
            >
              <Globe size={11} /> View Site
            </Link>
          </div>
        )}

        {/* Collapse */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center justify-center h-10 border-t text-white/25 hover:text-white/60 transition-colors"
          style={{ borderColor: C.border }}
        >
          <ChevronRight size={15} className="transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }} />
        </button>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: expanded ? "220px" : "64px" }}>

        {/* TOP BAR */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 border-b"
          style={{ height: "65px", backgroundColor: `${C.surface}f5`, backdropFilter: "blur(16px)", borderColor: C.border }}
        >
          <div>
            <h1 className="text-white" style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>{title}</h1>
            {subtitle && <p className="text-white/30" style={{ fontSize: "0.68rem" }}>{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2.5">
            {actions}

            {/* Search */}
            <div
              className="relative flex items-center gap-2 rounded-xl border px-3 transition-all duration-200"
              style={{
                backgroundColor: searchFocused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                borderColor: searchFocused ? "rgba(255,255,255,0.18)" : C.border,
                height: "36px", width: searchFocused ? "220px" : "160px",
              }}
            >
              <Search size={13} style={{ color: searchFocused ? "rgba(255,255,255,0.6)" : C.dim, flexShrink: 0 }} />
              <input
                type="text" placeholder="Quick search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent text-white placeholder-white/25 outline-none w-full"
                style={{ fontSize: "0.8rem" }}
              />
            </div>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative w-9 h-9 rounded-xl border flex items-center justify-center text-white/40 hover:text-white transition-all"
              style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <Bell size={15} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: C.red, fontSize: "0.5rem", fontWeight: 900 }}>3</span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setRoleOpen((v) => !v)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all hover:border-white/20"
                style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.02)" }}
              >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.62rem", fontWeight: 900 }}>SA</div>
              <div className="text-left hidden sm:block">
                <p className="text-white" style={{ fontSize: "0.75rem", fontWeight: 700 }}>System Admin</p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={9} className="text-[#e8192c]" />
                  <span className="text-[#e8192c]" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                    {ROLE_META[role].label.toUpperCase()}
                  </span>
                </div>
              </div>
              <ChevronDown size={12} className="text-white/30 hidden sm:block" />
              </button>

              {roleOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: "rgba(19,19,30,0.9)",
                    borderColor: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(18px)",
                    boxShadow: "0 24px 70px rgba(0,0,0,0.6), 0 0 50px rgba(232,25,44,0.10)",
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <p className="text-white/50 uppercase" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.14em" }}>
                      Role Switcher (Demo)
                    </p>
                    <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 800, marginTop: 2 }}>
                      Active: <span style={{ color: C.red }}>{ROLE_META[role].label}</span>
                    </p>
                  </div>
                  <div className="p-2">
                    {(Object.keys(ROLE_META) as AdminRole[]).map((r) => {
                      const active = r === role;
                      return (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                          style={{
                            backgroundColor: active ? "rgba(232,25,44,0.12)" : "transparent",
                            border: `1px solid ${active ? "rgba(232,25,44,0.28)" : "transparent"}`,
                            color: active ? "white" : "rgba(255,255,255,0.70)",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center border flex-shrink-0"
                            style={{
                              backgroundColor: active ? "rgba(232,25,44,0.14)" : "rgba(255,255,255,0.04)",
                              borderColor: active ? "rgba(232,25,44,0.30)" : "rgba(255,255,255,0.10)",
                              color: active ? C.red : "rgba(255,255,255,0.55)",
                              fontSize: "0.68rem",
                              fontWeight: 900,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {ROLE_META[r].short}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 800 }}>
                              {ROLE_META[r].label}
                            </p>
                            <p className="text-white/35" style={{ fontSize: "0.7rem" }}>
                              {r === "manager"
                                ? "Full access (Promotions, Revenue, Feedback)"
                                : r === "coordinator"
                                ? "Movies, Showtimes, Rooms"
                                : "Snack Inventory only"}
                            </p>
                          </div>
                          {active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.red, boxShadow: `0 0 10px ${C.redGlow}` }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6" style={{ backgroundColor: "#0a0a0f" }}>
          {children}
        </main>
      </div>
    </div>
  );
}