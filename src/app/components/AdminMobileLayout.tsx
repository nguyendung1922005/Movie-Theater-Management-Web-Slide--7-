/**
 * Shared components for Admin Mobile screens.
 * Provides the Clapperboard header, slide-out drawer,
 * notification panel, and bottom tab-bar — all wired
 * to the /admin/mobile/* route family.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Menu, Bell, X, LayoutDashboard, Film, DoorOpen,
  Settings, Clock, Users, BarChart3, Clapperboard,
  Globe, ShieldCheck, LogOut, Ticket, DollarSign,
  AlertTriangle, ChevronRight,
} from "lucide-react";

/* ══════════════════════════════════
   COLOUR PALETTE
══════════════════════════════════ */
export const C = {
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
  orange:   "#f97316",
  text:     "#ffffff",
  muted:    "rgba(255,255,255,0.45)",
  dim:      "rgba(255,255,255,0.22)",
};

/* ══════════════════════════════════
   NOTIFICATION DATA
══════════════════════════════════ */
const NOTIFS = [
  { icon: <Ticket size={12}/>,       color: C.green,  text: "New booking · Your Name · G10", time: "2m"  },
  { icon: <Film size={12}/>,         color: C.blue,   text: "Showtime added · Neon Horizon", time: "8m"  },
  { icon: <Users size={12}/>,        color: C.amber,  text: "New user · Alex Nguyen",        time: "15m" },
  { icon: <AlertTriangle size={12}/>,color: C.red,    text: "Hall 05 maintenance alert",     time: "32m" },
  { icon: <DollarSign size={12}/>,   color: C.green,  text: "Daily revenue target reached",  time: "1h"  },
];

/* ══════════════════════════════════
   DRAWER NAV ITEMS
══════════════════════════════════ */
const DRAWER_NAV = [
  { id: "dashboard", label: "Dashboard",      icon: LayoutDashboard, href: "/admin/mobile",          badge: 0  },
  { id: "movies",    label: "Movies",         icon: Film,            href: "/admin/mobile/movies",   badge: 20 },
  { id: "showtimes", label: "Showtimes",      icon: Clock,           href: "/admin/showtimes",       badge: 0  },
  { id: "rooms",     label: "Rooms",          icon: DoorOpen,        href: "/admin/mobile/rooms",    badge: 0  },
  { id: "users",     label: "Users",          icon: Users,           href: "/admin/users",           badge: 3  },
  { id: "revenue",   label: "Revenue Reports",icon: BarChart3,       href: "/admin",                 badge: 0  },
];

/* ══════════════════════════════════
   NOTIFICATION PANEL
══════════════════════════════════ */
function NotifPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!(e.target as Element).closest("[data-notif]")) onClose(); };
    setTimeout(() => window.addEventListener("mousedown", h), 50);
    return () => window.removeEventListener("mousedown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div data-notif="1" className="absolute top-full right-0 mt-2 rounded-2xl border border-white/10 overflow-hidden z-[60]"
      style={{ width: 290, backgroundColor: "#13131e", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", animation: "amPanelIn .22s cubic-bezier(.34,1.4,.64,1) both" }}>
      <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <span className="text-white font-bold" style={{ fontSize: "0.85rem" }}>Notifications</span>
        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: C.red, cursor: "pointer" }}>Mark all read</span>
      </div>
      {NOTIFS.map((n, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-white/4 last:border-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${n.color}14`, color: n.color, border: `1px solid ${n.color}20` }}>{n.icon}</div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{n.text}</p>
            <p style={{ fontSize: "0.6rem", color: C.dim, marginTop: 2 }}>{n.time} ago</p>
          </div>
        </div>
      ))}
      <div className="px-4 py-2.5 border-t border-white/6 text-center">
        <span style={{ fontSize: "0.7rem", color: C.dim, cursor: "pointer" }}>View all notifications</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SLIDE-OUT DRAWER
══════════════════════════════════ */
export function AdminMobileDrawer({ open, onClose, activeId }: { open: boolean; onClose: () => void; activeId: string }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 transition-all duration-300"
        style={{ backgroundColor: open ? "rgba(0,0,0,0.75)" : "transparent", backdropFilter: open ? "blur(8px)" : "none", pointerEvents: open ? "auto" : "none" }} />
      <div className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{ width: 280, backgroundColor: "#0e0e16", borderRight: `1px solid ${C.border}`, boxShadow: open ? "8px 0 40px rgba(0,0,0,0.7)" : "none", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.32s cubic-bezier(0.34,1.1,0.64,1)" }}>

        {/* Header */}
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

        {/* Profile mini */}
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

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-3 mb-2 uppercase" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", color: C.dim }}>Main Menu</p>
          <div className="flex flex-col gap-1">
            {DRAWER_NAV.map(({ id, label, icon: Icon, href, badge }) => {
              const active = id === activeId;
              return (
                <Link key={id} to={href} onClick={onClose}
                  className="relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all no-underline"
                  style={{ backgroundColor: active ? C.redSoft : "transparent", border: `1px solid ${active ? `${C.red}30` : "transparent"}`, textDecoration: "none" }}>
                  {active && <span className="absolute left-0 w-0.5 h-5 rounded-r-full" style={{ backgroundColor: C.red }} />}
                  <span style={{ color: active ? C.red : C.muted }}><Icon size={17} /></span>
                  <span style={{ flex: 1, fontWeight: active ? 700 : 500, fontSize: "0.84rem", color: active ? C.red : "rgba(255,255,255,0.7)" }}>{label}</span>
                  {badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-white" style={{ fontSize: "0.58rem", fontWeight: 800, backgroundColor: active ? C.red : "rgba(255,255,255,0.12)" }}>{badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="my-4 border-t" style={{ borderColor: C.border }} />
          <p className="px-3 mb-2 uppercase" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", color: C.dim }}>System</p>
          {[
            { icon: <Settings size={16} />, label: "Settings", href: "/admin/mobile/settings" },
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

        {/* Version */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "0.62rem", color: C.dim }}>Cinema Admin v2.6</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: "0.55rem", fontWeight: 700, backgroundColor: "rgba(16,185,129,0.12)", color: C.green, border: "1px solid rgba(16,185,129,0.2)" }}>● LIVE</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════
   STICKY HEADER
══════════════════════════════════ */
export function AdminMobileHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4"
      style={{ height: 56, backgroundColor: "rgba(10,10,15,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>

      <button onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }}>
        <Menu size={18} className="text-white/70" />
      </button>

      {/* Logo (absolutely centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: `0 2px 10px ${C.redGlow}` }}>
          <Clapperboard size={12} className="text-white" />
        </div>
        <div>
          <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.75rem", letterSpacing: "0.22em", lineHeight: 1 }}>CINEMA</p>
          <p style={{ fontSize: "0.45rem", fontWeight: 700, letterSpacing: "0.18em", color: C.red }}>ADMIN</p>
        </div>
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-2 relative">
        <div className="relative">
          <button onClick={() => setNotifOpen(v => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ backgroundColor: notifOpen ? C.redSoft : "rgba(255,255,255,0.04)", border: `1px solid ${notifOpen ? `${C.red}30` : C.border}` }}>
            <Bell size={17} className="text-white/70" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: C.red, fontSize: "0.48rem", fontWeight: 900 }}>3</span>
          </button>
          <NotifPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.6rem", fontWeight: 900, boxShadow: `0 2px 10px ${C.redGlow}` }}>
          SA
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════
   BOTTOM TAB BAR
══════════════════════════════════ */
const TABS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/admin/mobile"          },
  { id: "movies",    icon: Film,            label: "Movies",    href: "/admin/mobile/movies"   },
  { id: "rooms",     icon: DoorOpen,        label: "Rooms",     href: "/admin/mobile/rooms"    },
  { id: "settings",  icon: Settings,        label: "Settings",  href: "/admin/mobile/settings" },
];

export function AdminMobileBottomNav({ active }: { active: string }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around"
      style={{ backgroundColor: "rgba(14,14,20,0.97)", backdropFilter: "blur(24px)", borderTop: `1px solid ${C.border}`, height: 64, paddingBottom: "env(safe-area-inset-bottom,8px)" }}>
      {TABS.map(({ id, icon: Icon, label, href }) => {
        const isActive = id === active;
        return (
          <Link key={id} to={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full no-underline relative"
            style={{ textDecoration: "none" }}>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                style={{ width: 32, height: 2.5, backgroundColor: C.red, boxShadow: `0 0 10px ${C.redGlow}` }} />
            )}
            <span style={{ color: isActive ? C.red : "rgba(255,255,255,0.28)", transition: "color .2s" }}>
              <Icon size={20} />
            </span>
            <span style={{ fontSize: "0.56rem", fontWeight: isActive ? 800 : 500, color: isActive ? C.red : "rgba(255,255,255,0.28)", letterSpacing: "0.04em", transition: "color .2s" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════
   GLOBAL KEYFRAME (injected once)
══════════════════════════════════ */
export const AM_KEYFRAMES = `
  @keyframes amPanelIn {
    from { opacity:0; transform:scale(.93) translateY(-6px); }
    to   { opacity:1; transform:scale(1)   translateY(0);    }
  }
  @keyframes amSlideUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes amFadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
`;
