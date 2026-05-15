/**
 * AdminSettings.tsx — System Settings
 *
 * Layout:
 *   Two-column: sticky left nav (240 px) + scrollable right form content.
 *
 * Sections (General tab):
 *   1. Cinema Profile   — Logo upload · Name · Email · Hotline · Website
 *   2. Operational Rules — Max advance days · Cancellation window · Seat hold · Max seats
 *   3. Security          — 2FA toggle · Session timeout · Login-attempt limit
 *   4. Danger Zone       — Reset settings · Flush cache
 *
 * Inactive tabs show a Coming Soon panel.
 * Sticky action bar at the bottom tracks unsaved changes.
 */

import { useState, useRef } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Building2, Ticket, CreditCard, ShieldCheck,
  Upload, Clapperboard, Mail, Phone, Globe,
  Minus, Plus, Save, Loader2, CheckCircle2,
  AlertCircle, Trash2, RefreshCw, Info, Clock,
  X, Lock, ChevronRight, Zap, Eye, Bell,
  RotateCcw, Database,
} from "lucide-react";

/* ════════════════════════════════════════
   PALETTE
════════════════════════════════════════ */
const C = {
  bg:         "#0a0a0f",
  surface:    "#0f0f18",
  card:       "#13131e",
  cardHi:     "#171728",
  border:     "rgba(255,255,255,0.07)",
  borderHi:   "rgba(255,255,255,0.14)",
  borderFocus:"#e8192c",
  red:        "#e8192c",
  redSoft:    "rgba(232,25,44,0.1)",
  redGlow:    "rgba(232,25,44,0.22)",
  green:      "#10b981",
  greenSoft:  "rgba(16,185,129,0.1)",
  greenBorder:"rgba(16,185,129,0.28)",
  amber:      "#f59e0b",
  amberSoft:  "rgba(245,158,11,0.1)",
  amberBorder:"rgba(245,158,11,0.28)",
  blue:       "#3b82f6",
  purple:     "#8b5cf6",
  text:       "#ffffff",
  muted:      "rgba(255,255,255,0.45)",
  dim:        "rgba(255,255,255,0.22)",
  dimmer:     "rgba(255,255,255,0.1)",
};

/* ════════════════════════════════════════
   SETTINGS NAV TABS
════════════════════════════════════════ */
const TABS = [
  {
    id: "general",
    label: "General",
    sub: "Cinema info & operations",
    icon: Building2,
    ready: true,
  },
  {
    id: "ticketing",
    label: "Ticketing Rules",
    sub: "Booking & cancellation",
    icon: Ticket,
    ready: false,
  },
  {
    id: "payment",
    label: "Payment Gateways",
    sub: "Stripe, VNPay, Momo",
    icon: CreditCard,
    ready: false,
  },
  {
    id: "security",
    label: "Security",
    sub: "Auth & access control",
    icon: ShieldCheck,
    ready: false,
  },
];

/* ════════════════════════════════════════
   ANIMATED TOGGLE SWITCH
════════════════════════════════════════ */
function Toggle({
  checked, onChange, size = "md",
}: { checked: boolean; onChange: () => void; size?: "sm" | "md" }) {
  const w  = size === "md" ? 46 : 36;
  const h  = size === "md" ? 26 : 20;
  const r  = size === "md" ? 13 : 10;
  const tb = size === "md" ? 3  : 2;
  const tw = size === "md" ? 20 : 16;
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: w, height: h, borderRadius: r,
        backgroundColor: checked ? C.red : "rgba(255,255,255,0.1)",
        border: `1px solid ${checked ? "rgba(232,25,44,0.55)" : "rgba(255,255,255,0.15)"}`,
        position: "relative", cursor: "pointer",
        padding: 0, flexShrink: 0, outline: "none",
        transition: "background-color .22s, border-color .22s, box-shadow .22s",
        boxShadow: checked ? `0 0 12px ${C.redGlow}` : "none",
      }}
    >
      <span style={{
        position: "absolute",
        top: tb,
        left: checked ? w - tw - tb : tb,
        width: tw, height: tw, borderRadius: "50%",
        backgroundColor: checked ? "#fff" : "rgba(255,255,255,0.65)",
        transition: "left .22s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.45)",
        display: "block",
      }} />
    </button>
  );
}

/* ════════════════════════════════════════
   NUMBER STEPPER
════════════════════════════════════════ */
function NumberStepper({
  value, onChange, min, max, unit,
}: { value: number; onChange: (v: number) => void; min: number; max: number; unit?: string }) {
  const btnBase: React.CSSProperties = {
    width: 38, flexShrink: 0, backgroundColor: "rgba(255,255,255,0.04)",
    border: "none", color: C.muted, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background .15s, color .15s",
    outline: "none",
  };
  return (
    <div style={{
      display: "inline-flex", alignItems: "stretch",
      borderRadius: 10, overflow: "hidden",
      border: `1px solid rgba(255,255,255,0.09)`,
      height: 40,
    }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          ...btnBase,
          borderRight: `1px solid rgba(255,255,255,0.07)`,
          color: value <= min ? C.dimmer : C.muted,
          cursor: value <= min ? "not-allowed" : "pointer",
        }}
        onMouseEnter={e => { if (value > min) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = value <= min ? C.dimmer : C.muted; }}
      >
        <Minus size={13} />
      </button>

      <div style={{
        padding: "0 18px",
        backgroundColor: "rgba(255,255,255,0.03)",
        color: C.text, fontSize: "0.88rem", fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        display: "flex", alignItems: "center", gap: 5,
        userSelect: "none", minWidth: 72, justifyContent: "center",
      }}>
        <span>{value}</span>
        {unit && <span style={{ fontSize: "0.7rem", color: C.muted, fontWeight: 500 }}>{unit}</span>}
      </div>

      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          ...btnBase,
          borderLeft: `1px solid rgba(255,255,255,0.07)`,
          color: value >= max ? C.dimmer : C.muted,
          cursor: value >= max ? "not-allowed" : "pointer",
        }}
        onMouseEnter={e => { if (value < max) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = value >= max ? C.dimmer : C.muted; }}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION CARD
════════════════════════════════════════ */
function SectionCard({
  icon, iconBg, iconColor, title, desc, accentColor, children,
}: {
  icon: React.ReactNode;
  iconBg: string; iconColor: string;
  title: string; desc: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      backgroundColor: C.card,
      border: `1px solid ${accentColor ? `${accentColor}28` : C.border}`,
      borderRadius: 18,
      overflow: "hidden",
      marginBottom: 16,
    }}>
      {/* Accent top bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg,transparent,${accentColor ?? C.red}80,transparent)`,
      }} />

      {/* Card header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 24px",
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: "rgba(255,255,255,0.012)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: iconBg, color: iconColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${iconColor}22`, flexShrink: 0,
        }}>{icon}</div>
        <div>
          <p style={{ fontWeight: 800, fontSize: "0.9rem", color: C.text }}>{title}</p>
          <p style={{ fontSize: "0.66rem", color: C.dim, marginTop: 2 }}>{desc}</p>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════
   FORM ROW — label + helper + input
════════════════════════════════════════ */
function FormRow({
  label, helper, required, children,
}: { label: string; helper?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: helper ? 4 : 7 }}>
        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: C.text }}>{label}</label>
        {required && <span style={{ color: C.red, fontSize: "0.78rem", lineHeight: 1 }}>*</span>}
      </div>
      {helper && (
        <p style={{ fontSize: "0.65rem", color: C.dim, marginBottom: 7, display: "flex", alignItems: "center", gap: 4 }}>
          <Info size={10} style={{ flexShrink: 0 }} /> {helper}
        </p>
      )}
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   TOGGLE ROW — side-by-side toggle item
════════════════════════════════════════ */
function ToggleRow({
  label, sub, checked, onChange, badge,
}: { label: string; sub: string; checked: boolean; onChange: () => void; badge?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: "14px 16px", borderRadius: 12,
      backgroundColor: checked ? "rgba(232,25,44,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${checked ? "rgba(232,25,44,0.2)" : C.border}`,
      transition: "background .2s, border-color .2s",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.text }}>{label}</p>
          {badge && (
            <span style={{
              padding: "1px 7px", borderRadius: 12,
              fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
              backgroundColor: "rgba(232,25,44,0.14)", color: C.red,
              border: "1px solid rgba(232,25,44,0.28)",
            }}>{badge}</span>
          )}
        </div>
        <p style={{ fontSize: "0.68rem", color: C.muted, marginTop: 2 }}>{sub}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

/* ════════════════════════════════════════
   COMING SOON PANEL
════════════════════════════════════════ */
function ComingSoonPanel({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: C.card, border: `1px solid ${C.border}`,
      borderRadius: 18, padding: "80px 40px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 18, textAlign: "center", minHeight: 420,
    }}>
      <div style={{
        width: 70, height: 70, borderRadius: 20,
        backgroundColor: C.amberSoft,
        border: `1px solid ${C.amberBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.amber,
      }}>{icon}</div>

      <div>
        <p style={{ fontWeight: 900, fontSize: "1.05rem", color: C.text, marginBottom: 8 }}>
          {label} Settings
        </p>
        <p style={{ color: C.muted, fontSize: "0.83rem", lineHeight: 1.7, maxWidth: 380 }}>
          This configuration panel is currently under development. A comprehensive {label.toLowerCase()} management interface will be available in the next release.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <span style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 16px", borderRadius: 24,
          backgroundColor: C.amberSoft, border: `1px solid ${C.amberBorder}`,
          color: C.amber, fontSize: "0.72rem", fontWeight: 800,
        }}>
          <Clock size={12} /> Coming Soon
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 16px", borderRadius: 24,
          backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
          color: C.dim, fontSize: "0.72rem", fontWeight: 600,
        }}>
          <Bell size={12} /> Notify me
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */

const INITIAL_FORM = {
  cinemaName:   "Galaxy Cinema",
  tagline:      "Your universe of entertainment",
  email:        "support@galaxycinema.vn",
  hotline:      "1900 6677",
  website:      "https://galaxycinema.vn",
  maxDays:      30,
  cancelHrs:    24,
  holdMins:     10,
  maxSeats:     8,
  require2fa:   true,
  staffAlerts:  true,
  maintenance:  false,
  sessionMins:  "60",
  loginLimit:   5,
  timezone:     "Asia/Ho_Chi_Minh",
};

export function AdminSettings() {
  const [tab,       setTab]       = useState("general");
  const [form,      setForm]      = useState(INITIAL_FORM);
  const [isDirty,   setIsDirty]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [savedOk,   setSavedOk]   = useState(false);
  const [logoSrc,   setLogoSrc]   = useState<string | null>(null);
  const [dragOn,    setDragOn]    = useState(false);
  const [focused,   setFocused]   = useState<string | null>(null);
  const [resetConf, setResetConf] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const set = (key: string, val: any) => {
    setForm(p => ({ ...p, [key]: val }));
    setIsDirty(true);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => { setLogoSrc(e.target?.result as string); setIsDirty(true); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1400));
    setSaving(false);
    setSavedOk(true);
    setIsDirty(false);
    setTimeout(() => setSavedOk(false), 3200);
  };

  const handleDiscard = () => {
    setForm(INITIAL_FORM);
    setLogoSrc(null);
    setIsDirty(false);
  };

  /* ── input style factory (red ring on focus) ── */
  const inp = (id: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", borderRadius: 10,
    backgroundColor: focused === id ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focused === id ? C.red : "rgba(255,255,255,0.09)"}`,
    boxShadow: focused === id ? `0 0 0 3px rgba(232,25,44,0.13)` : "none",
    color: C.text, fontSize: "0.88rem", outline: "none",
    caretColor: C.red, fontFamily: "'Inter', sans-serif",
    transition: "border-color .18s, box-shadow .18s, background .18s",
    ...extra,
  });

  const sel = (id: string): React.CSSProperties => ({
    ...inp(id),
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 36,
    cursor: "pointer",
  });

  const focusBind = (id: string) => ({
    onFocus: () => setFocused(id),
    onBlur:  () => setFocused(null),
  });

  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <AdminLayout
      title="System Settings"
      subtitle="Manage cinema configurations and security"
    >
      {/* ── GLOBAL TOAST ── */}
      {savedOk && (
        <div style={{
          position: "fixed", bottom: 90, right: 28, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 18px", borderRadius: 14,
          backgroundColor: "#0f1e18",
          border: `1px solid ${C.greenBorder}`,
          color: C.green,
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          animation: "asSlideIn .3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Settings saved successfully</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 0, minHeight: "100%" }}>

        {/* ════════════════════════════════════════
            LEFT SETTINGS NAV (sticky)
        ════════════════════════════════════════ */}
        <aside style={{
          width: 248, flexShrink: 0,
          position: "sticky", top: 65, alignSelf: "flex-start",
          height: "calc(100vh - 65px)", overflowY: "auto",
          scrollbarWidth: "none",
          borderRight: `1px solid ${C.border}`,
          backgroundColor: C.surface,
          padding: "20px 14px 24px",
          display: "flex", flexDirection: "column",
        }}>
          {/* Nav label */}
          <p style={{
            fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.dimmer,
            paddingLeft: 10, marginBottom: 10,
          }}>Configuration</p>

          {/* Tab items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {TABS.map(t => {
              const Icon  = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "11px 12px", borderRadius: 12,
                    backgroundColor: active ? C.redSoft : "transparent",
                    border: `1px solid ${active ? "rgba(232,25,44,0.25)" : "transparent"}`,
                    color: active ? C.red : C.muted,
                    cursor: "pointer", textAlign: "left",
                    position: "relative",
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = C.muted; } }}
                >
                  {/* Active accent */}
                  {active && (
                    <span style={{
                      position: "absolute", left: 0, top: "50%",
                      transform: "translateY(-50%)",
                      width: 2.5, height: 20, borderRadius: "0 3px 3px 0",
                      backgroundColor: C.red,
                    }} />
                  )}

                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    backgroundColor: active ? "rgba(232,25,44,0.15)" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${active ? "rgba(232,25,44,0.28)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <Icon size={15} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500 }}>{t.label}</span>
                      {!t.ready && (
                        <span style={{
                          fontSize: "0.48rem", fontWeight: 900, letterSpacing: "0.12em",
                          textTransform: "uppercase", padding: "1px 5px", borderRadius: 4,
                          backgroundColor: C.amberSoft, color: C.amber,
                        }}>Soon</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.62rem", color: active ? "rgba(232,25,44,0.7)" : C.dimmer, marginTop: 1 }}>{t.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom info */}
          <div style={{ marginTop: 24 }}>
            <div style={{ height: 1, backgroundColor: C.border, marginBottom: 16 }} />
            <div style={{
              padding: "10px 12px", borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Zap size={10} color={C.amber} />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: C.amber }}>System Info</span>
              </div>
              {[
                ["Version",      "v3.8.2"],
                ["Last saved",   "Today, 09:14"],
                ["Environment",  "Production"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: "0.6rem", color: C.dim }}>{k}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, color: C.muted }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ════════════════════════════════════════
            RIGHT CONTENT AREA
        ════════════════════════════════════════ */}
        <div style={{ flex: 1, minWidth: 0, padding: "24px 28px 120px" }}>

          {/* Section title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: C.redSoft, color: C.red,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid rgba(232,25,44,0.25)`,
            }}>
              <activeTab.icon size={17} />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: "1rem", color: C.text }}>{activeTab.label}</p>
              <p style={{ fontSize: "0.68rem", color: C.dim }}>{activeTab.sub}</p>
            </div>
          </div>

          {/* ─── INACTIVE TAB PLACEHOLDER ─── */}
          {tab !== "general" && (
            <ComingSoonPanel
              label={activeTab.label}
              icon={<activeTab.icon size={28} />}
            />
          )}

          {/* ─── GENERAL TAB CONTENT ─── */}
          {tab === "general" && (
            <>
              {/* ══ CINEMA PROFILE ══ */}
              <SectionCard
                icon={<Building2 size={18} />}
                iconBg={C.redSoft} iconColor={C.red}
                title="Cinema Profile"
                desc="Public-facing identity and contact information"
              >
                {/* Logo upload */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: C.text, marginBottom: 8 }}>
                    Cinema Logo
                  </p>

                  <div
                    onDragOver={e  => { e.preventDefault(); setDragOn(true);  }}
                    onDragEnter={e => { e.preventDefault(); setDragOn(true);  }}
                    onDragLeave={() => setDragOn(false)}
                    onDrop={e => {
                      e.preventDefault(); setDragOn(false);
                      const f = e.dataTransfer.files[0];
                      if (f) handleFile(f);
                    }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      display: "flex", alignItems: "center", gap: 18,
                      padding: "18px 20px", borderRadius: 14, cursor: "pointer",
                      border: `2px dashed ${dragOn ? C.red : logoSrc ? C.green : "rgba(255,255,255,0.1)"}`,
                      backgroundColor: dragOn ? C.redSoft : logoSrc ? C.greenSoft : "rgba(255,255,255,0.02)",
                      transition: "all .2s",
                    }}
                  >
                    {/* Preview */}
                    <div style={{
                      width: 68, height: 68, borderRadius: 14, flexShrink: 0,
                      backgroundColor: logoSrc ? "transparent" : C.redSoft,
                      border: `1px solid ${logoSrc ? C.greenBorder : "rgba(232,25,44,0.22)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      {logoSrc
                        ? <img src={logoSrc} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        : <Clapperboard size={26} color={C.red} />
                      }
                    </div>

                    {/* Instructions */}
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: C.text, marginBottom: 4 }}>
                        {logoSrc ? "Logo uploaded" : dragOn ? "Drop to upload" : "Upload Cinema Logo"}
                      </p>
                      <p style={{ fontSize: "0.67rem", color: C.muted, lineHeight: 1.6 }}>
                        Drag & drop or click to browse<br />
                        <span style={{ color: C.dim }}>PNG, JPG or SVG · Max 2 MB · 512×512 px recommended</span>
                      </p>
                      {logoSrc ? (
                        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                          <button
                            onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                            style={{ fontSize: "0.68rem", color: C.blue, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}
                          >Replace</button>
                          <button
                            onClick={e => { e.stopPropagation(); setLogoSrc(null); setIsDirty(true); }}
                            style={{ fontSize: "0.68rem", color: C.red, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}
                          >Remove</button>
                        </div>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                          style={{
                            marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "5px 12px", borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.06)",
                            border: `1px solid ${C.border}`, color: C.muted,
                            fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          <Upload size={12} /> Browse files
                        </button>
                      )}
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </div>

                {/* Form grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                  <FormRow label="Cinema Name" required helper="Displayed on tickets and all customer-facing pages.">
                    <input
                      value={form.cinemaName}
                      onChange={e => set("cinemaName", e.target.value)}
                      style={inp("cinemaName")}
                      {...focusBind("cinemaName")}
                      placeholder="e.g. Galaxy Cinema"
                      maxLength={80}
                    />
                    <p style={{ fontSize: "0.6rem", color: C.dimmer, marginTop: 4, textAlign: "right" }}>
                      {form.cinemaName.length}/80
                    </p>
                  </FormRow>

                  <FormRow label="Tagline" helper="A short slogan displayed on the homepage banner.">
                    <input
                      value={form.tagline}
                      onChange={e => set("tagline", e.target.value)}
                      style={inp("tagline")}
                      {...focusBind("tagline")}
                      placeholder="e.g. Your universe of entertainment"
                      maxLength={120}
                    />
                  </FormRow>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <FormRow label="Support Email" required>
                      <div style={{ position: "relative" }}>
                        <Mail size={13} color={focused === "email" ? C.red : C.dim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set("email", e.target.value)}
                          style={{ ...inp("email"), paddingLeft: 34 }}
                          {...focusBind("email")}
                          placeholder="support@cinema.vn"
                        />
                      </div>
                    </FormRow>

                    <FormRow label="Hotline" required>
                      <div style={{ position: "relative" }}>
                        <Phone size={13} color={focused === "hotline" ? C.red : C.dim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          value={form.hotline}
                          onChange={e => set("hotline", e.target.value)}
                          style={{ ...inp("hotline"), paddingLeft: 34 }}
                          {...focusBind("hotline")}
                          placeholder="1900 xxxx"
                        />
                      </div>
                    </FormRow>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <FormRow label="Website URL">
                      <div style={{ position: "relative" }}>
                        <Globe size={13} color={focused === "website" ? C.red : C.dim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        <input
                          value={form.website}
                          onChange={e => set("website", e.target.value)}
                          style={{ ...inp("website"), paddingLeft: 34 }}
                          {...focusBind("website")}
                          placeholder="https://yourcinema.vn"
                        />
                      </div>
                    </FormRow>

                    <FormRow label="Timezone">
                      <select
                        value={form.timezone}
                        onChange={e => set("timezone", e.target.value)}
                        style={sel("tz")}
                        {...focusBind("tz")}
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (UTC+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                        <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </FormRow>
                  </div>
                </div>
              </SectionCard>

              {/* ══ OPERATIONAL RULES ══ */}
              <SectionCard
                icon={<Clock size={18} />}
                iconBg={"rgba(59,130,246,0.1)"} iconColor={C.blue}
                title="Operational Rules"
                desc="Booking windows, cancellations, and seat management"
                accentColor={C.blue}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {/* Max advance booking */}
                  <FormRow
                    label="Max Advance Booking"
                    helper="How far in advance customers can book tickets."
                  >
                    <NumberStepper
                      value={form.maxDays} min={7} max={90} unit="days"
                      onChange={v => set("maxDays", v)}
                    />
                    <p style={{ fontSize: "0.6rem", color: C.dim, marginTop: 6 }}>Range: 7 – 90 days</p>
                  </FormRow>

                  {/* Cancellation notice */}
                  <FormRow
                    label="Cancellation Notice"
                    helper="Minimum hours before showtime to cancel."
                  >
                    <select
                      value={form.cancelHrs}
                      onChange={e => set("cancelHrs", Number(e.target.value))}
                      style={{ ...sel("cancelHrs"), width: "auto", minWidth: 180 }}
                      {...focusBind("cancelHrs")}
                    >
                      {[1, 2, 4, 6, 8, 12, 24, 48, 72].map(h => (
                        <option key={h} value={h}>{h} hour{h !== 1 ? "s" : ""} before</option>
                      ))}
                    </select>
                  </FormRow>

                  {/* Seat hold duration */}
                  <FormRow
                    label="Seat Hold Duration"
                    helper="Minutes a seat is reserved during checkout."
                  >
                    <NumberStepper
                      value={form.holdMins} min={5} max={30} unit="min"
                      onChange={v => set("holdMins", v)}
                    />
                    <p style={{ fontSize: "0.6rem", color: C.dim, marginTop: 6 }}>Range: 5 – 30 min</p>
                  </FormRow>

                  {/* Max seats per booking */}
                  <FormRow
                    label="Max Seats per Booking"
                    helper="Maximum seats a single customer can book."
                  >
                    <NumberStepper
                      value={form.maxSeats} min={1} max={20} unit="seats"
                      onChange={v => set("maxSeats", v)}
                    />
                    <p style={{ fontSize: "0.6rem", color: C.dim, marginTop: 6 }}>Range: 1 – 20 seats</p>
                  </FormRow>
                </div>
              </SectionCard>

              {/* ══ SECURITY ══ */}
              <SectionCard
                icon={<ShieldCheck size={18} />}
                iconBg={"rgba(139,92,246,0.1)"} iconColor={C.purple}
                title="Security & Access"
                desc="Authentication policies and staff access controls"
                accentColor={C.purple}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <ToggleRow
                    label="Require Two-Factor Authentication"
                    sub="All staff accounts must verify via authenticator app or SMS on login."
                    checked={form.require2fa}
                    onChange={() => set("require2fa", !form.require2fa)}
                    badge="Recommended"
                  />
                  <ToggleRow
                    label="Staff Security Alert Emails"
                    sub="Send email notifications for new logins, failed attempts, and role changes."
                    checked={form.staffAlerts}
                    onChange={() => set("staffAlerts", !form.staffAlerts)}
                  />
                  <ToggleRow
                    label="Maintenance Mode"
                    sub="Temporarily close the booking site for customers. Staff access remains active."
                    checked={form.maintenance}
                    onChange={() => set("maintenance", !form.maintenance)}
                  />
                </div>

                {/* Session + Login limit */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
                  <FormRow label="Session Timeout" helper="Auto-logout staff after idle period.">
                    <select
                      value={form.sessionMins}
                      onChange={e => set("sessionMins", e.target.value)}
                      style={{ ...sel("sessionMins"), width: "100%" }}
                      {...focusBind("sessionMins")}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="480">8 hours</option>
                      <option value="0">Never</option>
                    </select>
                  </FormRow>

                  <FormRow label="Failed Login Limit" helper="Lock account after N failed attempts.">
                    <NumberStepper
                      value={form.loginLimit} min={3} max={10} unit="attempts"
                      onChange={v => set("loginLimit", v)}
                    />
                  </FormRow>
                </div>
              </SectionCard>

              {/* ══ DANGER ZONE ══ */}
              <div style={{
                backgroundColor: C.card,
                border: `1px solid rgba(232,25,44,0.22)`,
                borderRadius: 18, overflow: "hidden",
              }}>
                <div style={{ height: 2, background: `linear-gradient(90deg,transparent,rgba(232,25,44,0.6),transparent)` }} />
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "18px 24px", borderBottom: `1px solid rgba(232,25,44,0.15)`,
                  backgroundColor: "rgba(232,25,44,0.04)",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    backgroundColor: "rgba(232,25,44,0.12)", color: C.red,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid rgba(232,25,44,0.28)",
                  }}><AlertCircle size={18} /></div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "0.9rem", color: C.red }}>Danger Zone</p>
                    <p style={{ fontSize: "0.66rem", color: "rgba(232,25,44,0.65)", marginTop: 2 }}>These actions are irreversible. Proceed with caution.</p>
                  </div>
                </div>

                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Reset settings */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "14px 16px", borderRadius: 12,
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.82rem", color: C.text }}>Reset to Default Settings</p>
                      <p style={{ fontSize: "0.67rem", color: C.muted, marginTop: 2 }}>
                        Restore all configuration values to their factory defaults. This cannot be undone.
                      </p>
                    </div>
                    {!resetConf ? (
                      <button
                        onClick={() => setResetConf(true)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "7px 14px", borderRadius: 9, flexShrink: 0,
                          backgroundColor: C.amberSoft, border: `1px solid ${C.amberBorder}`,
                          color: C.amber, fontSize: "0.73rem", fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        <RotateCcw size={13} /> Reset
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => { handleDiscard(); setResetConf(false); }}
                          style={{
                            padding: "7px 14px", borderRadius: 9,
                            backgroundColor: C.redSoft, border: `1px solid rgba(232,25,44,0.3)`,
                            color: C.red, fontSize: "0.73rem", fontWeight: 700, cursor: "pointer",
                          }}
                        >Confirm Reset</button>
                        <button
                          onClick={() => setResetConf(false)}
                          style={{
                            padding: "7px 12px", borderRadius: 9,
                            backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                            color: C.muted, fontSize: "0.73rem", cursor: "pointer",
                          }}
                        >Cancel</button>
                      </div>
                    )}
                  </div>

                  {/* Flush cache */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    padding: "14px 16px", borderRadius: 12,
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.82rem", color: C.text }}>Flush Application Cache</p>
                      <p style={{ fontSize: "0.67rem", color: C.muted, marginTop: 2 }}>
                        Clear all cached assets and sessions. Active users may be temporarily logged out.
                      </p>
                    </div>
                    <button
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "7px 14px", borderRadius: 9, flexShrink: 0,
                        backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`,
                        color: C.muted, fontSize: "0.73rem", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      <Database size={13} /> Flush Cache
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          STICKY ACTION BAR
      ════════════════════════════════════════ */}
      <div style={{
        position: "fixed", bottom: 0,
        left: 220, right: 0,   /* aligns with main content past sidebar */
        zIndex: 50,
        borderTop: `1px solid ${isDirty ? "rgba(232,25,44,0.25)" : C.border}`,
        backgroundColor: isDirty ? "rgba(10,10,18,0.98)" : `${C.surface}f8`,
        backdropFilter: "blur(20px)",
        padding: "12px 28px",
        display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
        transition: "border-color .25s, background .25s",
      }}>
        {/* Unsaved indicator */}
        {isDirty && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 8, marginRight: "auto",
            backgroundColor: C.amberSoft, border: `1px solid ${C.amberBorder}`,
            color: C.amber, fontSize: "0.68rem", fontWeight: 700,
            animation: "asSlideIn .25s both",
          }}>
            <AlertCircle size={12} />
            Unsaved changes
          </div>
        )}

        {savedOk && !isDirty && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 8, marginRight: "auto",
            backgroundColor: C.greenSoft, border: `1px solid ${C.greenBorder}`,
            color: C.green, fontSize: "0.68rem", fontWeight: 700,
          }}>
            <CheckCircle2 size={12} />
            All changes saved
          </div>
        )}

        {/* Discard */}
        <button
          onClick={handleDiscard}
          disabled={!isDirty}
          style={{
            padding: "8px 18px", borderRadius: 10,
            backgroundColor: "transparent",
            border: `1px solid ${isDirty ? C.border : "rgba(255,255,255,0.04)"}`,
            color: isDirty ? C.muted : C.dimmer,
            fontSize: "0.82rem", fontWeight: 600,
            cursor: isDirty ? "pointer" : "not-allowed",
            transition: "all .15s",
          }}
          onMouseEnter={e => { if (isDirty) { (e.currentTarget as HTMLElement).style.borderColor = C.borderHi; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isDirty ? C.border : "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = isDirty ? C.muted : C.dimmer; }}
        >
          Discard
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 20px", borderRadius: 10,
            background: isDirty || saving
              ? `linear-gradient(135deg,${C.red},#c8111f)`
              : "rgba(232,25,44,0.25)",
            border: "none",
            color: isDirty || saving ? "#fff" : "rgba(255,255,255,0.4)",
            fontSize: "0.82rem", fontWeight: 800,
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: isDirty ? `0 4px 18px ${C.redGlow}` : "none",
            transition: "all .2s",
          }}
          onMouseEnter={e => { if (isDirty && !saving) (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${C.redGlow}`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = isDirty ? `0 4px 18px ${C.redGlow}` : "none"; }}
        >
          {saving ? (
            <><Loader2 size={14} style={{ animation: "asSpin 1s linear infinite" }} /> Saving…</>
          ) : savedOk ? (
            <><CheckCircle2 size={14} /> Saved!</>
          ) : (
            <><Save size={14} /> Save Changes</>
          )}
        </button>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes asSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes asSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        option { background-color: #13131e; color: white; }
      `}</style>
    </AdminLayout>
  );
}
