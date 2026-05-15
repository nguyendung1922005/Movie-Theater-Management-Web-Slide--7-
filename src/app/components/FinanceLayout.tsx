/**
 * Shared layout for the Cinema Finance Portal.
 * Visually distinct from AdminLayout (collapsible sidebar)
 * and StaffLayout (top nav bar).
 *
 * FinanceLayout uses a FIXED 260 px left sidebar that is
 * always expanded, contains inline quick-metrics, a session
 * timer, and a "CONFIDENTIAL · SECURED" access badge — giving
 * accountants the look of a proper Bloomberg-style terminal.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Toaster } from "sonner";
import {
  Clapperboard, BarChart3, FileText, Receipt,
  ShieldCheck, Lock, LogOut, RefreshCw,
  ChevronDown, TrendingUp, DollarSign, Clock,
  Settings, Globe, AlertCircle, ClipboardCheck,
} from "lucide-react";

/* ══════════════════════════════════
   FINANCE COLOUR SYSTEM
══════════════════════════════════ */
export const FC = {
  bg:         "#0a0a0f",
  surface:    "#0b0b16",
  sidebar:    "#060610",
  card:       "#0f0f1e",
  cardAlt:    "#0c0c19",
  border:     "rgba(255,255,255,0.07)",
  borderHi:   "rgba(255,255,255,0.13)",
  red:        "#e8192c",
  redSoft:    "rgba(232,25,44,0.1)",
  redGlow:    "rgba(232,25,44,0.24)",
  green:      "#10b981",
  greenSoft:  "rgba(16,185,129,0.1)",
  greenBorder:"rgba(16,185,129,0.25)",
  amber:      "#f59e0b",
  amberSoft:  "rgba(245,158,11,0.1)",
  blue:       "#3b82f6",
  blueSoft:   "rgba(59,130,246,0.1)",
  purple:     "#8b5cf6",
  orange:     "#f97316",
  text:       "#ffffff",
  muted:      "rgba(255,255,255,0.45)",
  dim:        "rgba(255,255,255,0.22)",
  dimmer:     "rgba(255,255,255,0.1)",
};

/* ══════════════════════════════════
   QUICK METRICS (sidebar)
══════════════════════════════════ */
const QUICK_METRICS = [
  { label: "MTD Revenue",     value: "₫842.6M",  change: "+8.4%",  up: true  },
  { label: "YTD Revenue",     value: "₫8.42B",   change: "+14.2%", up: true  },
  { label: "Pending Reviews", value: "2",         change: null,     up: null  },
  { label: "Active Tickets",  value: "1,248",     change: "+87",    up: true  },
];

/* ══════════════════════════════════
   NAV ITEMS
══════════════════════════════════ */
const NAV = [
  { id: "dashboard",    label: "Financial Dashboard",  icon: BarChart3, href: "/finance/dashboard"    },
  { id: "reports",      label: "Revenue Reports",      icon: FileText,  href: "/finance/reports"      },
  { id: "transactions", label: "Transactions",         icon: Receipt,   href: "/finance/transactions" },
  { id: "shift-audit",  label: "Shift Audit",          icon: ClipboardCheck, href: "/finance/shift-audit" },
];

/* ══════════════════════════════════
   FISCAL PERIOD SELECTOR
══════════════════════════════════ */
const PERIODS = ["FY 2026", "Q2 2026", "Q1 2026", "FY 2025"];

/* ══════════════════════════════════
   LAYOUT PROPS
══════════════════════════════════ */
interface FinanceLayoutProps {
  activeNav:  string;
  title:      string;
  subtitle?:  string;
  children:   React.ReactNode;
  actions?:   React.ReactNode;
}

/* ══════════════════════════════════
   COMPONENT
══════════════════════════════════ */
export function FinanceLayout({
  activeNav, title, subtitle, children, actions,
}: FinanceLayoutProps) {
  const [period,      setPeriod]      = useState("Q2 2026");
  const [periodOpen,  setPeriodOpen]  = useState(false);
  const [syncAge,     setSyncAge]     = useState(0);      // seconds since last sync
  const [sessionSecs, setSessionSecs] = useState(0);      // session timer

  useEffect(() => {
    const t = setInterval(() => {
      setSyncAge(s => s + 1);
      setSessionSecs(s => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const syncLabel = syncAge < 60
    ? `${syncAge}s ago`
    : syncAge < 3600
      ? `${Math.floor(syncAge / 60)}m ago`
      : `${Math.floor(syncAge / 3600)}h ago`;

  const fmtSess = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: FC.bg,
      color: FC.text,
      fontFamily: "'Inter', sans-serif",
      display: "flex",
    }}>
      <Toaster theme="dark" position="top-center" richColors closeButton />

      {/* ─── FIXED SIDEBAR (260 px) ─── */}
      <aside style={{
        position: "fixed",
        left: 0, top: 0,
        width: 260, height: "100vh",
        backgroundColor: FC.sidebar,
        borderRight: `1px solid ${FC.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        overflowY: "auto",
        scrollbarWidth: "none",
      }}>

        {/* Brand */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${FC.border}`,
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg,#e8192c,#a00e1f)",
              boxShadow: `0 4px 14px ${FC.redGlow}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Clapperboard size={16} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.2em", color: "#fff", textTransform: "uppercase", lineHeight: 1.1 }}>CINEMA</p>
              <p style={{ fontSize: "0.48rem", fontWeight: 700, letterSpacing: "0.22em", color: FC.red, textTransform: "uppercase" }}>FINANCE PORTAL</p>
            </div>
          </div>

          {/* Access badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            backgroundColor: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 8, padding: "5px 10px",
          }}>
            <ShieldCheck size={10} color={FC.blue} />
            <span style={{ fontSize: "0.56rem", fontWeight: 800, letterSpacing: "0.14em", color: FC.blue }}>FINANCE DEPT · CONFIDENTIAL</span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "12px 10px 8px" }}>
          <p style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.18em", color: FC.dimmer, textTransform: "uppercase", padding: "0 10px 8px" }}>
            Navigation
          </p>
          {NAV.map(({ id, label, icon: Icon, href }) => {
            const active = activeNav === id;
            return (
              <Link
                key={id}
                to={href}
                className="duration-200 transition-colors"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10,
                  backgroundColor: active ? FC.redSoft : "transparent",
                  border: `1px solid ${active ? "rgba(232,25,44,0.25)" : "transparent"}`,
                  color: active ? FC.red : FC.muted,
                  textDecoration: "none",
                  marginBottom: 2,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = active ? FC.redSoft : "transparent";
                }}
              >
                {active && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%",
                    transform: "translateY(-50%)",
                    width: 2, height: 20, borderRadius: "0 2px 2px 0",
                    backgroundColor: FC.red,
                  }} />
                )}
                <Icon size={15} />
                <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500 }}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: FC.border, margin: "4px 10px" }} />

        {/* Quick Metrics */}
        <div style={{ padding: "10px 12px" }}>
          <p style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.18em", color: FC.dimmer, textTransform: "uppercase", marginBottom: 8 }}>
            Quick Metrics
          </p>
          {QUICK_METRICS.map(m => (
            <div
              key={m.label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 8px", borderRadius: 8, marginBottom: 3,
                backgroundColor: "rgba(255,255,255,0.02)",
                border: `1px solid ${FC.border}`,
              }}
            >
              <span style={{ fontSize: "0.65rem", color: FC.muted }}>{m.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
                {m.change && (
                  <span style={{ fontSize: "0.55rem", fontWeight: 700, color: m.up ? FC.green : FC.red }}>{m.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: FC.border, margin: "4px 10px" }} />

        {/* System links */}
        <div style={{ padding: "8px 10px" }}>
          {[
            { icon: Settings, label: "Preferences",     href: "#"  },
            { icon: Globe,    label: "View Public Site", href: "/"  },
            { icon: LogOut,   label: "Sign Out",         href: "/"  },
          ].map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              to={href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8,
                color: label === "Sign Out" ? FC.red : FC.dim,
                textDecoration: "none",
                fontSize: "0.78rem",
                transition: "color .15s",
              }}
            >
              <Icon size={14} /> {label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Session info */}
        <div style={{
          margin: "0 10px 12px",
          padding: "10px 12px",
          backgroundColor: "rgba(255,255,255,0.02)",
          border: `1px solid ${FC.border}`,
          borderRadius: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              backgroundColor: FC.green,
              boxShadow: `0 0 5px ${FC.green}`,
              animation: "fcPulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "0.58rem", fontWeight: 700, color: FC.green, letterSpacing: "0.1em" }}>ACTIVE SESSION</span>
          </div>
          <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "0.06em" }}>
            {fmtSess(sessionSecs)}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.55rem", fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>JN</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>J. Nguyen</p>
              <p style={{ fontSize: "0.57rem", color: FC.blue, fontWeight: 600 }}>Head Accountant</p>
            </div>
            <Lock size={10} style={{ color: FC.dim, flexShrink: 0, marginLeft: "auto" }} />
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div style={{ marginLeft: 260, flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Sticky top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          height: 60,
          backgroundColor: `${FC.surface}f8`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${FC.border}`,
          display: "flex", alignItems: "center",
          padding: "0 28px",
          gap: 16,
        }}>
          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.025em", color: "#fff", margin: 0, lineHeight: 1 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: "0.68rem", color: FC.muted, marginTop: 2 }}>{subtitle}</p>}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {actions}

            {/* Fiscal period */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setPeriodOpen(v => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "6px 12px", borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${periodOpen ? "rgba(232,25,44,0.35)" : FC.border}`,
                  color: "#fff", cursor: "pointer",
                  fontSize: "0.78rem", fontWeight: 700,
                }}
              >
                <BarChart3 size={13} color={FC.red} />
                {period}
                <ChevronDown size={11} color={FC.dim} />
              </button>
              {periodOpen && (
                <>
                  <div className="fixed inset-0 z-[198]" onClick={() => setPeriodOpen(false)} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0,
                    width: 160,
                    backgroundColor: "#0e0e1c",
                    border: `1px solid ${FC.borderHi}`,
                    borderRadius: 12,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
                    zIndex: 199,
                    overflow: "hidden",
                    animation: "fcPanelIn .2s both",
                  }}>
                    {PERIODS.map(p => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "10px 14px",
                          backgroundColor: period === p ? FC.redSoft : "transparent",
                          border: "none", borderBottom: `1px solid rgba(255,255,255,0.04)`,
                          color: period === p ? FC.red : FC.muted,
                          fontSize: "0.8rem", fontWeight: period === p ? 700 : 500,
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        {p}
                        {period === p && <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: FC.red }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sync indicator */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.03)",
              border: `1px solid ${FC.border}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: FC.green, animation: "fcPulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.72rem", color: FC.muted }}>
                Synced <span style={{ color: "#fff", fontWeight: 700 }}>{syncLabel}</span>
              </span>
              <button
                onClick={() => setSyncAge(0)}
                style={{ background: "none", border: "none", cursor: "pointer", color: FC.dim, padding: 0, display: "flex" }}
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, backgroundColor: FC.bg, overflow: "auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes fcPanelIn {
          from { opacity:0; transform:scale(.93) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fcFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes fcSlideUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fcModalIn {
          from { opacity:0; transform:scale(.92) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fcPulse {
          0%, 100% { opacity:1; }
          50%       { opacity:0.45; }
        }
      `}</style>
    </div>
  );
}
