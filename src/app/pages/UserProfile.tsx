import { useState } from "react";
import { Link } from "react-router";
import {
  Star, Edit3, Check, X, Mail, Phone, User, Calendar,
  Shield, Bell, Trash2, ChevronRight, Camera, Award,
  Ticket, DollarSign, Film, LogOut,
} from "lucide-react";
import { Header } from "../components/Header";

/* ─────────────────────────────────────────────────────────
   PALETTE
───────────────────────────────────────────────────────── */
const C = {
  bg:      "#0a0a0f",
  surface: "#0f0f18",
  card:    "#13131e",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redSoft: "rgba(232,25,44,0.10)",
  gold:    "#f59e0b",
  purple:  "#8b5cf6",
  green:   "#10b981",
  muted:   "rgba(255,255,255,0.35)",
  dim:     "rgba(255,255,255,0.07)",
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA  — swap for real auth context in production
───────────────────────────────────────────────────────── */
const PROFILE = {
  name:            "Nguyễn Văn Thịnh",
  email:           "thinh@galaxycinema.vn",
  phone:           "+84 901 234 567",
  dob:             "15/03/1995",
  gender:          "Male",
  initial:         "T",
  memberSince:     "March 2024",
  tier:            "Gold",
  points:          2_450,
  platinumAt:      5_000,
  totalMovies:     18,
  totalSpend:      840_000,
  upcomingTickets: 3,
};

const TIER_BENEFITS: Record<string, string[]> = {
  Gold: [
    "10% discount on all tickets",
    "Priority seat selection",
    "Free combo upgrade (monthly)",
    "Birthday month 2× points",
  ],
};

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export function UserProfile() {
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [form, setForm] = useState({
    name:   PROFILE.name,
    phone:  PROFILE.phone,
    dob:    PROFILE.dob,
    gender: PROFILE.gender,
  });

  const pct = Math.min(
    100,
    ((PROFILE.points - 1_000) / (PROFILE.platinumAt - 1_000)) * 100,
  );

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2_500);
  };

  const Field = ({
    label, fieldKey, icon, select,
  }: {
    label: string;
    fieldKey: keyof typeof form;
    icon: React.ReactNode;
    select?: string[];
  }) => (
    <div>
      <label
        className="flex items-center gap-1.5 mb-1.5"
        style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}
      >
        {icon} {label}
      </label>
      {editing ? (
        select ? (
          <select
            value={form[fieldKey]}
            onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))}
            className="w-full rounded-xl px-3.5 py-2.5 text-white outline-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: "0.88rem",
              color: "white",
            }}
          >
            {select.map(o => (
              <option key={o} value={o} style={{ backgroundColor: "#1a1a28" }}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={form[fieldKey]}
            onChange={e => setForm(f => ({ ...f, [fieldKey]: e.target.value }))}
            className="w-full rounded-xl px-3.5 py-2.5 text-white placeholder-white/25 outline-none"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontSize: "0.88rem",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,25,44,0.5)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        )
      ) : (
        <p
          className="px-3.5 py-2.5 rounded-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: `1px solid ${C.dim}`,
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.88rem",
          }}
        >
          {form[fieldKey] || <span style={{ color: C.muted }}>Not set</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      <Header />

      <div className="pt-16">
        {/* ── Hero band ─────────────────────────────── */}
        <div
          className="px-6 py-10"
          style={{
            background: `linear-gradient(180deg, rgba(232,25,44,0.07) 0%, transparent 100%)`,
            borderBottom: `1px solid ${C.dim}`,
          }}
        >
          <div className="max-w-screen-xl mx-auto">

            {/* Avatar row */}
            <div className="flex items-end gap-6 flex-wrap mb-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white select-none"
                  style={{
                    background: "linear-gradient(135deg, #e8192c, #9b0e1d)",
                    fontSize: "2rem",
                    fontWeight: 800,
                    boxShadow: `0 0 0 3px rgba(232,25,44,0.5), 0 0 32px rgba(232,25,44,0.22)`,
                  }}
                >
                  {PROFILE.initial}
                </div>
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0a0a0f] transition-colors hover:bg-white/10"
                  style={{ backgroundColor: C.surface }}
                  title="Change avatar"
                >
                  <Camera size={13} style={{ color: C.muted }} />
                </button>
              </div>

              {/* Name + tier */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-white" style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                    {PROFILE.name}
                  </h1>
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                      border: "1px solid rgba(245,158,11,0.35)",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: C.gold,
                      letterSpacing: "0.08em",
                    }}
                  >
                    <Star size={10} fill={C.gold} style={{ color: C.gold }} />
                    GOLD MEMBER
                  </span>
                </div>
                <p style={{ color: C.muted, fontSize: "0.88rem" }}>
                  {PROFILE.email} · Member since {PROFILE.memberSince}
                </p>
              </div>

              {/* Edit / save controls */}
              <div className="flex items-center gap-2 pb-1">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-colors hover:text-white"
                      style={{ borderColor: "rgba(255,255,255,0.1)", color: C.muted, fontSize: "0.82rem", fontWeight: 600 }}
                    >
                      <X size={13} /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white transition-all active:scale-95"
                      style={{ backgroundColor: C.red, fontSize: "0.82rem", fontWeight: 700 }}
                    >
                      <Check size={13} /> Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all hover:text-white hover:border-white/25"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: C.muted, fontSize: "0.82rem", fontWeight: 600 }}
                  >
                    <Edit3 size={13} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Movies Watched",  value: PROFILE.totalMovies,                       icon: <Film size={14} />,       color: C.red    },
                { label: "Points Balance",  value: PROFILE.points.toLocaleString(),            icon: <Award size={14} />,      color: C.gold   },
                { label: "Total Spent",     value: `₫${(PROFILE.totalSpend / 1000).toFixed(0)}K`, icon: <DollarSign size={14} />, color: C.green  },
                { label: "Active Tickets",  value: PROFILE.upcomingTickets,                   icon: <Ticket size={14} />,     color: "#3b82f6" },
              ].map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4 border"
                  style={{ backgroundColor: C.surface, borderColor: C.border }}
                >
                  <div className="flex items-center gap-2 mb-2" style={{ color }}>
                    {icon}
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {label}
                    </span>
                  </div>
                  <p className="text-white" style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column: details + security ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Personal details card */}
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              {/* Save success banner */}
              {saved && (
                <div
                  className="flex items-center gap-2 mb-5 px-4 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: "rgba(16,185,129,0.09)",
                    border: "1px solid rgba(16,185,129,0.22)",
                  }}
                >
                  <Check size={13} style={{ color: C.green, flexShrink: 0 }} />
                  <span style={{ color: C.green, fontSize: "0.82rem", fontWeight: 600 }}>
                    Profile updated successfully
                  </span>
                </div>
              )}

              <h2 className="text-white mb-5" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name"    fieldKey="name"   icon={<User size={13} />} />
                <Field label="Phone Number" fieldKey="phone"  icon={<Phone size={13} />} />
                <Field label="Date of Birth"fieldKey="dob"    icon={<Calendar size={13} />} />
                <Field label="Gender"       fieldKey="gender" icon={<User size={13} />} select={["Male","Female","Other"]} />

                {/* Email — always read-only */}
                <div className="sm:col-span-2">
                  <label
                    className="flex items-center gap-1.5 mb-1.5"
                    style={{ fontSize: "0.68rem", fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    <Mail size={13} /> Email Address
                  </label>
                  <div
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.015)", border: `1px solid ${C.dim}` }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>
                      {PROFILE.email}
                    </span>
                    <span
                      className="ml-auto flex-shrink-0 px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em",
                        backgroundColor: "rgba(16,185,129,0.12)", color: C.green,
                      }}
                    >
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & security */}
            <div
              className="rounded-2xl border p-6"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <h2 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Account &amp; Security
              </h2>
              <div className="flex flex-col gap-1">
                {([
                  {
                    label: "Change Password",
                    desc:  "Last updated 3 months ago",
                    icon:  <Shield size={15} />,
                    red:   false,
                    arrow: true,
                  },
                  {
                    label: "Notification Preferences",
                    desc:  "Email, push and SMS alerts",
                    icon:  <Bell size={15} />,
                    red:   false,
                    arrow: true,
                  },
                  {
                    label: "Sign Out",
                    desc:  "Sign out of your current session",
                    icon:  <LogOut size={15} />,
                    red:   false,
                    arrow: false,
                  },
                  {
                    label: "Delete Account",
                    desc:  "Permanently delete your data",
                    icon:  <Trash2 size={15} />,
                    red:   true,
                    arrow: false,
                  },
                ] as const).map(({ label, desc, icon, red, arrow }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl w-full text-left transition-colors"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={e =>
                      ((e.currentTarget as HTMLElement).style.backgroundColor =
                        red ? "rgba(232,25,44,0.06)" : "rgba(255,255,255,0.03)")
                    }
                    onMouseLeave={e =>
                      ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                    }
                  >
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: red ? "rgba(232,25,44,0.09)" : "rgba(255,255,255,0.05)",
                        color: red ? C.red : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <p style={{ fontSize: "0.86rem", fontWeight: 600, color: red ? C.red : "rgba(255,255,255,0.8)" }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "0.71rem", color: C.muted, marginTop: "2px" }}>{desc}</p>
                    </div>
                    {arrow && <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: membership + quick links ── */}
          <div className="flex flex-col gap-6">

            {/* Membership card */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              {/* Gold header */}
              <div
                className="px-5 py-4"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.04) 100%)",
                  borderBottom: "1px solid rgba(245,158,11,0.14)",
                }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <Star size={15} fill={C.gold} style={{ color: C.gold }} />
                    <span style={{ color: C.gold, fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                      GOLD MEMBER
                    </span>
                  </div>
                  <Award size={18} style={{ color: "rgba(245,158,11,0.4)" }} />
                </div>
                <p style={{ color: C.muted, fontSize: "0.68rem" }}>Cinema Galaxy Rewards</p>
              </div>

              <div className="p-5">
                {/* Points balance */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-white" style={{ fontWeight: 900, fontSize: "1.95rem", letterSpacing: "-0.04em" }}>
                      {PROFILE.points.toLocaleString()}
                    </span>
                    <span style={{ color: C.muted, fontSize: "0.8rem" }}>pts</span>
                  </div>
                  <p style={{ color: C.muted, fontSize: "0.71rem" }}>
                    {(PROFILE.platinumAt - PROFILE.points).toLocaleString()} pts to reach Platinum
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span style={{ fontSize: "0.62rem", fontWeight: 800, color: C.gold, letterSpacing: "0.08em" }}>GOLD</span>
                    <span style={{ fontSize: "0.62rem", fontWeight: 800, color: C.purple, letterSpacing: "0.08em" }}>PLATINUM</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${C.gold}, ${C.purple})`,
                        boxShadow: `0 0 8px rgba(245,158,11,0.45)`,
                        transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)",
                      }}
                    />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.63rem", marginTop: "6px", textAlign: "right" }}>
                    {Math.round(pct)}% of the way there
                  </p>
                </div>

                {/* Benefits list */}
                <div className="mb-5">
                  <p
                    className="mb-2.5 uppercase"
                    style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em" }}
                  >
                    Your Gold Benefits
                  </p>
                  <div className="flex flex-col gap-2">
                    {TIER_BENEFITS.Gold.map(b => (
                      <div key={b} className="flex items-start gap-2">
                        <Check size={11} style={{ color: C.green, flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.76rem" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/my-tickets"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border transition-all hover:text-white hover:border-white/25"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: C.muted, fontSize: "0.83rem", fontWeight: 600, textDecoration: "none" }}
                >
                  <Ticket size={14} /> View My Tickets
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <h3 className="text-white mb-3" style={{ fontWeight: 700, fontSize: "0.88rem" }}>Quick Links</h3>
              <div className="flex flex-col gap-0.5">
                {([
                  { to: "/my-tickets", label: "My Tickets",    icon: <Ticket size={14} /> },
                  { to: "/movies",     label: "Browse Movies", icon: <Film size={14} /> },
                  { to: "/showtimes",  label: "Showtimes",     icon: <Calendar size={14} /> },
                ] as const).map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/[0.04]"
                    style={{ color: C.muted, fontSize: "0.84rem", fontWeight: 500, textDecoration: "none" }}
                  >
                    <span style={{ color: "rgba(255,255,255,0.25)" }}>{icon}</span>
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.18)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
