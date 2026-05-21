/**
 * Cinema Staff Portal — top navigation shell with RBAC, shift toggle, Outlet for nested routes.
 */

import React, { useMemo, useState, useEffect, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard, Bell, X, Clock as ClockIcon,
  Ticket, AlertTriangle, DollarSign, Settings, Globe, LogOut,
  ShieldCheck, ChevronDown, ScanQrCode,
  Laptop, UserPlus, Search, Undo2,
  Coffee, CalendarRange, Film,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { appendShiftAudit, type ShiftAuditRole } from "../lib/shiftAuditData";
import { formatDigitsAsCurrencyTyping } from "../lib/inputFormat";
import { loadCurrentStaffSession, saveStaffRole, clockIn, clockOut } from "../lib/staffSession";
import { getUserRole, getCurrentUser } from "../../lib/auth";

/* ══════════════════════════════════ STAFF PALETTE ═══════════════════════════════════ */
export const SC = {
  bg: "#0a0a0f",
  surface: "#0d0d16",
  nav: "rgba(9,9,18,0.97)",
  card: "#141421",
  cardAlt: "#111118",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.13)",
  red: "#e8192c",
  redSoft: "rgba(232,25,44,0.11)",
  redGlow: "rgba(232,25,44,0.26)",
  green: "#10b981",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  orange: "#f97316",
  cyan: "#06b6d4",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.45)",
  dim: "rgba(255,255,255,0.22)",
};

/* ══════════════════════════════════ RBAC ═══════════════════════════════════ */

export type StaffRole = "counter_staff" | "ticket_checker" | "general_staff" | "cinema_manager" | "STAFF" | "ADMIN";

const ROLE_META: Record<string, { label: string; short: string }> = {
  counter_staff: { label: "Counter Staff · NV Quầy vé", short: "QK" },
  ticket_checker: { label: "Ticket Checker · NV Soát vé", short: "SV" },
  general_staff: { label: "General Staff · Nhân viên", short: "NV" },
  cinema_manager: { label: "Cinema Manager · Quản lý", short: "QL" },
  STAFF: { label: "Staff · Nhân viên rạp", short: "NV" },
  ADMIN: { label: "System Admin · Quản trị", short: "AD" },
};

const LS_ROLE = "staff_role";
const LS_CLOCK_IN = "staff_clock_in_iso";

interface NavEntry {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  roles: StaffRole[];
}

/** Shared items visible to every role */
const SHARED_ROLE_SET: StaffRole[] = ["counter_staff", "ticket_checker", "general_staff", "cinema_manager", "STAFF", "ADMIN"];

const ALL_NAV: NavEntry[] = [
  { id: "pos", label: "Counter Sales (POS)", href: "/staff/pos", icon: Laptop, roles: ["counter_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "members", label: "Member Registration", href: "/staff/members", icon: UserPlus, roles: ["counter_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "vouchers", label: "Voucher Lookup", href: "/staff/vouchers", icon: Search, roles: ["counter_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "refunds", label: "Refund / Cancel", href: "/staff/refunds", icon: Undo2, roles: ["counter_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "scanner", label: "QR Ticket Scanner", href: "/staff/scanner", icon: ScanQrCode, roles: ["ticket_checker", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "finance", label: "Finance Dashboard", href: "/finance/dashboard", icon: DollarSign, roles: ["cinema_manager", "ADMIN"] },
  { id: "shift", label: "Shift Management", href: "/staff/shift", icon: ClockIcon, roles: SHARED_ROLE_SET },
  { id: "profile", label: "Profile Settings", href: "/staff/profile", icon: Settings, roles: SHARED_ROLE_SET },
  /** General staff ops (legacy grids) */
  { id: "showtimes", label: "Showtime Grid", href: "/staff/showtimes", icon: CalendarRange, roles: ["general_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "movies", label: "Movie Status", href: "/staff/movies", icon: Film, roles: ["general_staff", "cinema_manager", "STAFF", "ADMIN"] },
  { id: "combos", label: "Snack Combos", href: "/staff/combos", icon: Coffee, roles: ["general_staff", "cinema_manager", "STAFF", "ADMIN"] },
];

function navFor(role: StaffRole): NavEntry[] {
  return ALL_NAV.filter((n) => n.roles.includes(role));
}

/* ══════════════════════════════════ MOCK NOTIFS ═══════════════════════════════════ */

const NOTIFS = [
  { color: "#f59e0b", icon: Ticket, text: "Hall 3 at 95% capacity · Code Black 7 PM", time: "3m" },
  { color: "#10b981", icon: Ticket, text: "New booking · Neon Horizon 2 PM · 4 seats", time: "9m" },
  { color: "#e8192c", icon: AlertTriangle, text: "Dark Signal 9 PM — only 8 seats remaining", time: "22m" },
  { color: "#3b82f6", icon: DollarSign, text: "Snack combo pricing updated successfully", time: "1h" },
  { color: "#8b5cf6", icon: Film, text: "Void Runner added to Saturday schedule", time: "2h" },
];

/* ══════════════════════════════════ PAGE WRAPPER ═══════════════════════════════════ */

export interface StaffPageProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  noPadding?: boolean;
  children: ReactNode;
}

/** Title strip + padded main — use inside each `/staff/*` route */
export function StaffPage({ title, subtitle, actions, noPadding = false, children }: StaffPageProps) {
  return (
    <>
      {title !== undefined && title !== "" && (
        <div
          className="px-8 py-5 border-b flex items-center justify-between"
          style={{
            borderColor: SC.border,
            backgroundColor: "rgba(13,13,22,0.7)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <h1 className="text-white" style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.03em" }}>
              {title}
            </h1>
            {subtitle && <p style={{ fontSize: "0.78rem", color: SC.muted, marginTop: 3 }}>{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      <main className={noPadding ? "" : "px-4 sm:px-8 pb-12 pt-0"} style={noPadding ? {} : {}}>{children}</main>
    </>
  );
}

/* ══════════════════════════════════ PORTAL (ROUTER PARENT) ═══════════════════════════════════ */

export function StaffPortalLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState<StaffRole>("counter_staff");
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const [clockedIn, setClockedIn] = useState(false);
  const [clockInAt, setClockInAt] = useState<Date | null>(null);
  const [shiftElapsedSec, setShiftElapsedSec] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  /** End shift: cash declaration before clock-out (finance shift audit) */
  const [clockOutFormOpen, setClockOutFormOpen] = useState(false);
  const [reportedCashInput, setReportedCashInput] = useState("");
  /** Mock totals at last clock-out (demo) */
  const [shiftSummary] = useState({ ticketsSold: 147, snacksSold: 83 });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const loadSession = async () => {
      const { role: savedRole, clockInAt: savedClockIn } = await loadCurrentStaffSession();
      
      // Fetch role from database instead of using localStorage
      const user = await getCurrentUser();
      if (user) {
        const dbRole = await getUserRole(user.id);
        if (dbRole && ROLE_META[dbRole as StaffRole]) {
          setRole(dbRole as StaffRole);
        } else if (savedRole && ROLE_META[savedRole]) {
          // Fallback to localStorage if database fetch fails
          setRole(savedRole);
        }
      } else if (savedRole && ROLE_META[savedRole]) {
        // Fallback to localStorage if user not authenticated
        setRole(savedRole);
      }
      
      if (savedClockIn && !Number.isNaN(savedClockIn.getTime())) {
        setClockedIn(true);
        setClockInAt(savedClockIn);
      }
    };
    loadSession();
  }, []);

  /** If switched role hides current route, send user to Shift hub */
  useEffect(() => {
    const allowedPaths = navFor(role).map((n) => n.href);
    const ok =
      pathname === "/staff" ||
      allowedPaths.some((href) => pathname === href || pathname.startsWith(`${href}/`));
    if (!ok && pathname.startsWith("/staff")) {
      navigate("/staff/shift", { replace: true });
    }
  }, [role, pathname, navigate]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!clockedIn || !clockInAt) return;
    const tick = () => {
      const s = Math.max(0, Math.floor((Date.now() - clockInAt.getTime()) / 1000));
      setShiftElapsedSec(s);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [clockedIn, clockInAt]);

  const navVisible = useMemo(() => navFor(role), [role]);

  const activeHref = pathname;

  function isNavActive(href: string): boolean {
    return href === "/staff" ? pathname === "/staff" : pathname === href || pathname.startsWith(`${href}/`);
  }

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const mm = String(Math.floor(shiftElapsedSec / 60)).padStart(2, "0");
  const ss = String(shiftElapsedSec % 60).padStart(2, "0");

  const closeAll = () => {
    setNotifOpen(false);
    setUserOpen(false);
  };

  async function toggleClock() {
    if (!clockedIn) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/staff/shift/clock-in", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const now = new Date(data.data.startTime);
          setClockInAt(now);
          setShiftElapsedSec(0);
          setClockedIn(true);
          toast.success("Clocked in", { description: "Ca làm việc đã bắt đầu." });
        } else {
          toast.error("Lỗi", { description: data.error });
        }
      } catch (error) {
        toast.error("Failed to clock in", { description: "Please try again." });
      }
    } else {
      setReportedCashInput("");
      setClockOutFormOpen(true);
    }
  }

  function cancelClockOutForm() {
    setClockOutFormOpen(false);
    toast.message("Clock-out cancelled", { description: "You remain on shift." });
  }

  async function confirmClockOutForm() {
    if (!clockInAt) return;
    const raw = reportedCashInput.replace(/\D/g, "");
    const reportedCashVnd = Number(raw) || 0;
    
    const isCashRole = role === "counter_staff" || role === "STAFF" || role === "ADMIN";
    if (isCashRole && reportedCashVnd <= 0) {
      toast.error("Enter a cash total", { description: "Declare the drawer count in ₫ before ending shift." });
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/staff/shift/clock-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reportedCash: isCashRole ? reportedCashVnd : 0 })
      });
      const data = await res.json();

      if (data.success) {
        setClockedIn(false);
        setClockInAt(null);
        setShiftElapsedSec(0);
        setClockOutFormOpen(false);
        setReportedCashInput("");
        setSummaryOpen(true);
        toast.success("Shift ended", {
          description: isCashRole
            ? `Cash declaration ${reportedCashVnd.toLocaleString("vi-VN")} ₫ saved for Finance.`
            : "Shift record saved.",
        });
      } else {
        toast.error("Failed to clock out", { description: data.error });
      }
    } catch (error) {
      toast.error("Failed to clock out", { description: "Please try again." });
    }
  }

  const brandHref =
    navVisible.find((n) => n.id === "shift")?.href ?? navVisible[0]?.href ?? "/staff/shift";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: SC.bg, color: SC.text, fontFamily: "'Inter', sans-serif" }}>
      <Toaster theme="dark" position="top-center" richColors closeButton />
      {/* TOP NAV */}
      <header
        className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6"
        style={{
          height: 64,
          backgroundColor: SC.nav,
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${SC.border}`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.025), 0 4px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center gap-0 h-full">
          <Link to={brandHref} className="flex items-center gap-3 no-underline flex-shrink-0" style={{ textDecoration: "none" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: `0 3px 14px ${SC.redGlow}` }}
            >
              <Clapperboard size={17} className="text-white" />
            </div>
            <div>
              <p
                className="text-white uppercase"
                style={{ fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.22em", lineHeight: 1.1 }}
              >
                CINEMA
              </p>
              <p
                style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.26em", color: SC.red, textTransform: "uppercase" }}
              >
                STAFF PORTAL
              </p>
            </div>
          </Link>

          <div className="h-7 w-px mx-4 lg:mx-5 flex-shrink-0" style={{ backgroundColor: SC.border }} />

          <nav className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {navVisible.map(({ id, label, icon: Icon, href }) => {
              const active = isNavActive(href);
              return (
                <Link
                  key={id}
                  to={href}
                  className="relative flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl no-underline group flex-shrink-0 duration-200 transition-colors hover:bg-white/[0.04]"
                  style={{
                    textDecoration: "none",
                    backgroundColor: active ? SC.redSoft : "transparent",
                    border: `1px solid ${active ? "rgba(232,25,44,0.28)" : "transparent"}`,
                    color: active ? SC.red : SC.muted,
                  }}
                  onClick={closeAll}
                >
                  <Icon size={15} className="flex-shrink-0 transition-colors" />
                  <span className="hidden md:inline" style={{ fontSize: "0.82rem", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px rounded-t-full"
                      style={{ width: 28, height: "2.5px", backgroundColor: SC.red, boxShadow: `0 0 6px ${SC.redGlow}` }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-2">
            {/* Shift toggle */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${SC.border}` }}>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: clockedIn ? SC.green : SC.dim,
                    boxShadow: clockedIn ? `0 0 10px ${SC.green}` : "none",
                  }}
                />
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: SC.muted, letterSpacing: "0.08em" }}>
                  {clockedIn ? `ON SHIFT · ${mm}:${ss}` : "OFF SHIFT"}
                </span>
              </span>
              <button
                type="button"
                onClick={toggleClock}
                className="px-2.5 py-1 rounded-lg transition-all active:scale-95"
                style={{
                  backgroundColor: clockedIn ? SC.redSoft : SC.green + "22",
                  border: `1px solid ${clockedIn ? SC.redGlow : SC.green + "55"}`,
                  color: clockedIn ? SC.red : SC.green,
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                }}
              >
                {clockedIn ? "Clock Out" : "Clock In"}
              </button>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${SC.border}` }}>
              <ClockIcon size={13} style={{ color: SC.dim }} />
              <span className="text-white" style={{ fontSize: "0.8rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {timeStr}
              </span>
              <span style={{ fontSize: "0.68rem", color: SC.dim }}>{dateStr}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setUserOpen(false);
                }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: notifOpen ? SC.redSoft : "rgba(255,255,255,0.03)",
                  border: `1px solid ${notifOpen ? "rgba(232,25,44,0.28)" : SC.border}`,
                  color: notifOpen ? SC.red : SC.muted,
                }}
              >
                <Bell size={16} />
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: SC.red, fontSize: "0.46rem", fontWeight: 900 }}
                >
                  3
                </span>
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-[198]" onClick={() => setNotifOpen(false)} />
                  <div
                    className="absolute top-full right-0 mt-2 rounded-2xl border overflow-hidden z-[199]"
                    style={{
                      width: 340,
                      backgroundColor: "#0e0e1c",
                      borderColor: SC.borderHi,
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 24px 70px rgba(0,0,0,0.8)",
                      animation: "sfPanelIn .22s cubic-bezier(.34,1.4,.64,1) both",
                    }}
                  >
                    <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${SC.red},transparent)` }} />
                    <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: SC.border }}>
                      <span className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                        Notifications
                      </span>
                      <button type="button" onClick={() => setNotifOpen(false)} className="text-white/30 hover:text-white transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
                      {NOTIFS.map((n, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 px-4 py-3.5 border-b hover:bg-white/[0.02] transition-colors cursor-pointer"
                          style={{ borderColor: "rgba(255,255,255,0.04)" }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: `${n.color}15`, border: `1px solid ${n.color}25`, color: n.color }}
                          >
                            <n.icon size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{n.text}</p>
                            <p style={{ fontSize: "0.6rem", color: SC.dim, marginTop: 2 }}>{n.time} ago</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: n.color }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User menu + role demo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all"
                style={{
                  borderColor: userOpen ? "rgba(59,130,246,0.35)" : SC.border,
                  backgroundColor: userOpen ? "rgba(59,130,246,0.09)" : "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", fontSize: "0.58rem", fontWeight: 900 }}
                >
                  {ROLE_META[role].short}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-white" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    Staff
                  </p>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={9} style={{ color: SC.blue }} />
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em", color: SC.blue }}>STAFF RBAC · DEMO</span>
                  </div>
                </div>
                <ChevronDown size={12} style={{ color: SC.dim }} />
              </button>

              {userOpen && (
                <>
                  <div className="fixed inset-0 z-[198]" onClick={() => setUserOpen(false)} />
                  <div
                    className="absolute top-full right-0 mt-2 rounded-2xl border overflow-hidden z-[199]"
                    style={{
                      width: 280,
                      backgroundColor: "#0e0e1c",
                      borderColor: SC.borderHi,
                      boxShadow: "0 24px 70px rgba(0,0,0,0.8)",
                      animation: "sfPanelIn .22s cubic-bezier(.34,1.4,.64,1) both",
                    }}
                  >
                    <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${SC.blue},transparent)` }} />
                    <div className="px-4 py-3.5 border-b" style={{ borderColor: SC.border }}>
                      <p className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                        {ROLE_META[role].label}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: SC.dim, marginTop: 4 }}>
                        Your role is set by the system.
                      </p>
                    </div>
                    <Link
                      to="/staff/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/[0.04] no-underline border-b"
                      style={{ textDecoration: "none", color: SC.muted, fontSize: "0.82rem", borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <Settings size={14} /> Profile Settings
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/[0.04] no-underline border-b"
                      style={{ textDecoration: "none", color: SC.muted, fontSize: "0.82rem", borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <Globe size={14} /> View Public Site
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/[0.04] no-underline"
                      style={{ textDecoration: "none", color: SC.red, fontSize: "0.82rem", fontWeight: 600 }}
                    >
                      <LogOut size={14} /> Sign Out
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ paddingTop: 64 }} className="min-w-0">
        <Outlet />
      </div>

      {/* Clock-out: reported cash (feeds Finance · Shift Audit) */}
      {clockOutFormOpen && (
        <div
          className="sf-modal-overlay fixed inset-0 z-[255] flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(10,10,15,0.88)", backdropFilter: "blur(16px)" }}
          role="dialog"
          aria-modal
        >
          <div
            className="sf-modal-shell w-full max-w-md rounded-3xl border overflow-hidden"
            style={{
              backgroundColor: "rgba(20,20,33,0.96)",
              borderColor: SC.borderHi,
              boxShadow: "0 32px 90px rgba(0,0,0,0.75)",
            }}
          >
            <div className="px-6 py-5 border-b" style={{ borderColor: SC.border }}>
              <p className="text-white uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", color: SC.muted }}>
                End shift
              </p>
              <h2 className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                Cash drawer declaration
              </h2>
              <p style={{ fontSize: "0.76rem", color: SC.dim, marginTop: 8, lineHeight: 1.55 }}>
                Counter staff: enter the physical cash total for this shift. Finance uses this in{" "}
                <span style={{ color: SC.cyan, fontWeight: 700 }}>Shift Audit</span> reconciliation.
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
            {role === "counter_staff" || role === "STAFF" || role === "ADMIN" ? (
                <label className="block">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Reported cash (₫)</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={reportedCashInput}
                    onChange={(e) => setReportedCashInput(formatDigitsAsCurrencyTyping(e.target.value))}
                    placeholder="e.g. 2,450,000"
                    className="mt-2 w-full rounded-2xl px-4 py-3 text-white outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: `1px solid ${SC.border}`,
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                </label>
              ) : (
                <p style={{ fontSize: "0.8rem", color: SC.muted, lineHeight: 1.6 }}>
                  Non-counter role — cash total will be recorded as <strong style={{ color: "#fff" }}>₫0</strong> for this shift
                  segment. Switch role to Counter Staff to declare drawer cash.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-3 rounded-2xl font-bold text-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${SC.border}`, color: SC.muted }}
                  onClick={cancelClockOutForm}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 rounded-2xl text-white font-black text-sm"
                  style={{ backgroundColor: SC.red, boxShadow: `0 10px 28px ${SC.redGlow}` }}
                  onClick={confirmClockOutForm}
                >
                  Confirm clock out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clock-out summary modal */}
      {summaryOpen && (
        <div className="sf-modal-overlay fixed inset-0 z-[250] flex items-center justify-center p-6" style={{ backgroundColor: "rgba(10,10,15,0.82)", backdropFilter: "blur(18px)" }} role="dialog" aria-modal>
          <div
            className="sf-modal-shell w-full max-w-md rounded-3xl border overflow-hidden"
            style={{
              backgroundColor: "rgba(20,20,33,0.92)",
              borderColor: SC.borderHi,
              boxShadow: `0 32px 90px rgba(0,0,0,0.75), 0 0 60px rgba(232,25,44,0.12)`,
            }}
          >
            <div className="px-6 py-5 border-b" style={{ borderColor: SC.border }}>
              <p className="text-white uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em", color: SC.muted }}>
                Shift Summary (Mock)
              </p>
              <h2 className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
                Today&apos;s performance
              </h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex gap-4">
                <div
                  className="flex-1 rounded-2xl border p-4"
                  style={{ backgroundColor: "rgba(232,25,44,0.08)", borderColor: "rgba(232,25,44,0.22)" }}
                >
                  <p style={{ fontSize: "0.72rem", color: SC.muted }}>Tickets sold</p>
                  <p className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.85rem", letterSpacing: "-0.02em" }}>
                    {shiftSummary.ticketsSold}
                  </p>
                </div>
                <div className="flex-1 rounded-2xl border p-4" style={{ backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.22)" }}>
                  <p style={{ fontSize: "0.72rem", color: SC.muted }}>Snacks sold</p>
                  <p style={{ fontWeight: 900, fontSize: "1.85rem", color: SC.green }}>{shiftSummary.snacksSold}</p>
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: SC.dim, lineHeight: 1.65 }}>
                End-of-shift report is illustrative. Hook this to POS / concessions APIs for production totals.
              </p>
              <Link
                to="/finance/shift-audit"
                className="block w-full py-2.5 rounded-2xl text-center no-underline transition-all"
                style={{
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  border: `1px solid rgba(6,182,212,0.35)`,
                  color: SC.cyan,
                  backgroundColor: "rgba(6,182,212,0.08)",
                }}
                onClick={() => setSummaryOpen(false)}
              >
                Finance · Shift Audit
              </Link>
              <button
                type="button"
                className="w-full py-3 rounded-2xl text-white transition-all active:scale-[0.99]"
                style={{ fontWeight: 800, letterSpacing: "0.06em", backgroundColor: SC.red, boxShadow: `0 10px 30px rgba(232,25,44,0.35)` }}
                onClick={() => setSummaryOpen(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sfPanelIn {
          from { opacity:0; transform:scale(.93) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes sfModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sfModalPop {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sf-modal-overlay {
          animation: sfModalFade 0.22s ease-out both;
        }
        .sf-modal-shell {
          animation: sfModalPop 0.32s cubic-bezier(0.34, 1.25, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
