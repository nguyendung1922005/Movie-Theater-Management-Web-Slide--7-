import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Plus, Search, X, Check, ChevronDown, Trash2, Edit2,
  AlertTriangle, Users, Zap, Star, Settings2, Loader2,
  MonitorPlay, Wifi, Volume2, Armchair, Accessibility,
  Sparkles, ShieldCheck, Film, LayoutGrid, Clock,
} from "lucide-react";

/* ═══════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════ */
type ScreenType = "IMAX" | "4DX" | "Dolby Atmos" | "3D" | "Premium" | "Standard";
type RoomStatus = "active" | "maintenance" | "closed";

interface CinemaRoom {
  id: string;
  name: string;
  type: ScreenType;
  capacity: number;
  rows: number;
  seatsPerRow: number;
  status: RoomStatus;
  features: string[];
  showtimesToday: number;
  occupancyPct: number;
  revenueToday: number;
  lastMaintenance: string;
}

const TYPE_CONFIG: Record<ScreenType, { accent: string; text: string; bg: string; border: string; label: string }> = {
  "IMAX":       { accent: "#3b82f6", text: "#60a5fa", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  label: "IMAX"       },
  "4DX":        { accent: "#f59e0b", text: "#fbbf24", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  label: "4DX"        },
  "Dolby Atmos":{ accent: "#8b5cf6", text: "#a78bfa", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)",  label: "Dolby"      },
  "3D":         { accent: "#10b981", text: "#34d399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  label: "3D"         },
  "Premium":    { accent: "#f97316", text: "#fb923c", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)",  label: "Premium"    },
  "Standard":   { accent: "#94a3b8", text: "#cbd5e1", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)", label: "Standard"   },
};

const STATUS_CONFIG: Record<RoomStatus, { label: string; dot: string; text: string; bg: string }> = {
  active:      { label: "Active",      dot: "#10b981", text: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  maintenance: { label: "Maintenance", dot: "#f59e0b", text: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  closed:      { label: "Closed",      dot: "#e8192c", text: "#e8192c", bg: "rgba(232,25,44,0.1)"   },
};

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "Laser Projection": <Sparkles size={11} />,
  "Surround Sound":   <Volume2 size={11} />,
  "4D Motion":        <Zap size={11} />,
  "Recliner Seats":   <Armchair size={11} />,
  "Wheelchair Access":<Accessibility size={11} />,
  "WiFi":             <Wifi size={11} />,
  "VIP Lounge":       <Star size={11} />,
  "LED Screen":       <MonitorPlay size={11} />,
};

const ALL_FEATURES = Object.keys(FEATURE_ICONS);
const SCREEN_TYPES: ScreenType[] = ["IMAX","4DX","Dolby Atmos","3D","Premium","Standard"];

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ═══════════════════════════════════
   SEED DATA
═══════════════════════════════════ */
const SEED_ROOMS: CinemaRoom[] = [
  {
    id: "r1", name: "Hall 1", type: "IMAX", capacity: 350, rows: 12, seatsPerRow: 30, status: "active",
    features: ["Laser Projection","Surround Sound","Wheelchair Access","LED Screen"],
    showtimesToday: 4, occupancyPct: 88, revenueToday: 124, lastMaintenance: "2026-01-15",
  },
  {
    id: "r2", name: "Hall 2", type: "4DX", capacity: 120, rows: 8, seatsPerRow: 15, status: "active",
    features: ["4D Motion","Surround Sound","Recliner Seats"],
    showtimesToday: 5, occupancyPct: 94, revenueToday: 98, lastMaintenance: "2026-02-01",
  },
  {
    id: "r3", name: "Hall 3", type: "Dolby Atmos", capacity: 180, rows: 9, seatsPerRow: 20, status: "active",
    features: ["Surround Sound","Recliner Seats","Wheelchair Access"],
    showtimesToday: 4, occupancyPct: 76, revenueToday: 88, lastMaintenance: "2026-01-28",
  },
  {
    id: "r4", name: "Hall 4", type: "3D", capacity: 200, rows: 10, seatsPerRow: 20, status: "maintenance",
    features: ["Surround Sound","LED Screen"],
    showtimesToday: 0, occupancyPct: 0, revenueToday: 0, lastMaintenance: "2026-03-04",
  },
  {
    id: "r5", name: "Hall 5", type: "Premium", capacity: 160, rows: 8, seatsPerRow: 20, status: "active",
    features: ["Recliner Seats","VIP Lounge","WiFi","Surround Sound"],
    showtimesToday: 3, occupancyPct: 82, revenueToday: 76, lastMaintenance: "2026-02-10",
  },
  {
    id: "r6", name: "Hall 6", type: "Standard", capacity: 280, rows: 10, seatsPerRow: 28, status: "active",
    features: ["Wheelchair Access","LED Screen"],
    showtimesToday: 5, occupancyPct: 61, revenueToday: 54, lastMaintenance: "2025-12-20",
  },
  {
    id: "r7", name: "Hall 7", type: "Standard", capacity: 240, rows: 10, seatsPerRow: 24, status: "maintenance",
    features: ["Wheelchair Access"],
    showtimesToday: 0, occupancyPct: 0, revenueToday: 0, lastMaintenance: "2026-03-05",
  },
  {
    id: "r8", name: "Hall 8", type: "IMAX", capacity: 300, rows: 11, seatsPerRow: 28, status: "active",
    features: ["Laser Projection","Surround Sound","LED Screen","Wheelchair Access"],
    showtimesToday: 4, occupancyPct: 91, revenueToday: 118, lastMaintenance: "2026-01-20",
  },
];

/* ═══════════════════════════════════
   SEATING MAP SVG
═══════════════════════════════════ */
function SeatingMap({ id, rows, seatsPerRow, accent }: { id: string; rows: number; seatsPerRow: number; accent: string }) {
  const W = 148, H = 108;
  const dispRows = Math.min(rows, 10);
  const dispCols = Math.min(seatsPerRow, 22);
  const seatW = Math.max(3, Math.floor((W - 18) / dispCols) - 1.5);
  const seatH = Math.max(3, Math.floor((H - 28) / dispRows) - 1.5);
  const colStep = (W - 18) / dispCols;
  const rowStep = (H - 28) / dispRows;
  const gid = `sg-${id}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <filter id={`gf-${id}`}><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>

      {/* Screen ambient glow */}
      <ellipse cx={W / 2} cy="10" rx="60" ry="7" fill={accent} opacity="0.12" filter={`url(#gf-${id})`} />

      {/* Screen bar */}
      <rect x="12" y="7" width={W - 24} height="4" rx="2" fill={accent} opacity="0.85" />
      <rect x="12" y="11" width={W - 24} height="10" fill={`url(#${gid})`} />

      {/* SCREEN label */}
      <text x={W / 2} y="18" textAnchor="middle" fill={accent} fontSize="4.5" fontWeight="700" opacity="0.5" letterSpacing="2">
        SCREEN
      </text>

      {/* Seat rows */}
      {Array.from({ length: dispRows }, (_, r) => {
        const y = 26 + r * rowStep;
        const prog = r / Math.max(1, dispRows - 1);
        // Section coloring: first 15% VIP (amber), next 40% accent, rest standard
        const isVip   = prog < 0.15;
        const isPrem  = prog >= 0.15 && prog < 0.55;
        const seatColor   = isVip ? "#f59e0b" : isPrem ? accent : "rgba(255,255,255,0.2)";
        const seatOpacity = isVip ? 0.95 : isPrem ? 0.68 : 0.35;
        const rowLabel    = String.fromCharCode(65 + r);

        return (
          <g key={r}>
            {/* Row label */}
            <text x="5" y={y + seatH * 0.82} fill="rgba(255,255,255,0.14)" fontSize="4.2" fontWeight="700">{rowLabel}</text>
            {/* Seats */}
            {Array.from({ length: dispCols }, (_, c) => {
              const x = 13 + c * colStep + (colStep - seatW) / 2;
              // Center aisle gap
              const isAisle = dispCols > 12 && c === Math.floor(dispCols / 2) - 1;
              if (isAisle) return null;
              return (
                <rect key={c} x={x} y={y} width={seatW} height={seatH} rx={1}
                  fill={seatColor} opacity={seatOpacity} />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════
   STATUS TOGGLE
═══════════════════════════════════ */
function StatusToggle({ status, onChange }: { status: RoomStatus; onChange: (s: RoomStatus) => void }) {
  const active = status === "active";
  return (
    <button
      onClick={() => onChange(active ? "maintenance" : "active")}
      className="relative flex-shrink-0 transition-all duration-300"
      style={{
        width: 40, height: 22, borderRadius: 11,
        backgroundColor: active ? "#10b981" : "rgba(245,158,11,0.8)",
        boxShadow: active ? "0 0 10px rgba(16,185,129,0.4)" : "0 0 10px rgba(245,158,11,0.3)",
      }}
      title={`Click to set ${active ? "Maintenance" : "Active"}`}
    >
      <span
        className="absolute top-1 bg-white rounded-full shadow-sm transition-all duration-300"
        style={{
          width: 14, height: 14,
          left: active ? 23 : 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

/* ═══════════════════════════════════
   ROOM CARD
═══════════════════════════════════ */
function RoomCard({
  room, onEdit, onDelete, onToggle,
}: {
  room: CinemaRoom;
  onEdit: (r: CinemaRoom) => void;
  onDelete: (r: CinemaRoom) => void;
  onToggle: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const tc = TYPE_CONFIG[room.type];
  const sc = STATUS_CONFIG[room.status];

  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 group"
      style={{
        backgroundColor: "#13131e",
        borderColor: hovered ? tc.border : "rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 8px 32px ${tc.accent}18, 0 0 0 1px ${tc.border}` : "0 4px 16px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${tc.accent} 40%, transparent)` }} />

      {/* Seating map area */}
      <div className="relative overflow-hidden" style={{ height: "148px", backgroundColor: "rgba(0,0,0,0.3)", padding: "12px 10px 8px" }}>
        <SeatingMap id={room.id} rows={room.rows} seatsPerRow={room.seatsPerRow} accent={tc.accent} />

        {/* Type badge — top left */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 rounded-lg"
            style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.1em", backgroundColor: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
          >
            {tc.label}
          </span>
        </div>

        {/* Status dot — top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
          <span style={{ fontSize: "0.58rem", fontWeight: 700, color: sc.text }}>{sc.label.toUpperCase()}</span>
        </div>

        {/* Hover overlay with actions */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200"
          style={{
            backgroundColor: hovered ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
            opacity: hovered ? 1 : 0,
            backdropFilter: hovered ? "blur(4px)" : "none",
          }}
        >
          <button
            onClick={() => onEdit(room)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
            style={{ backgroundColor: "#3b82f6", fontSize: "0.78rem", fontWeight: 700, boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(room)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
            style={{ backgroundColor: "#e8192c", fontSize: "0.78rem", fontWeight: 700, boxShadow: "0 4px 16px rgba(232,25,44,0.4)" }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Info section */}
      <div className="flex-1 flex flex-col gap-3 p-4">
        {/* Room name */}
        <div>
          <h3 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
            {room.name} <span className="text-white/25 font-normal">—</span>{" "}
            <span style={{ color: tc.text, fontWeight: 700 }}>{room.type}</span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Users size={11} className="text-white/30" />
            <span className="text-white/40" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
              {room.capacity.toLocaleString()} Seats
            </span>
            <span className="text-white/15">·</span>
            <span className="text-white/30" style={{ fontSize: "0.72rem" }}>
              {room.rows}×{room.seatsPerRow}
            </span>
          </div>
        </div>

        {/* Stats row */}
        {room.status === "active" ? (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Shows",    value: room.showtimesToday, unit: "today", color: "#3b82f6" },
              { label: "Occupancy",value: `${room.occupancyPct}%`, unit: "avg", color: room.occupancyPct > 80 ? "#10b981" : room.occupancyPct > 50 ? "#f59e0b" : "#e8192c" },
              { label: "Revenue",  value: `₫${room.revenueToday}M`, unit: "today", color: "#e8192c" },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="text-center py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontWeight: 800, fontSize: "0.82rem", color }}>{value}</p>
                <p className="text-white/25 mt-0.5" style={{ fontSize: "0.56rem", fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}>
            <Settings2 size={13} className="text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
            <div>
              <p className="text-amber-400" style={{ fontSize: "0.74rem", fontWeight: 700 }}>Under Maintenance</p>
              <p className="text-amber-400/50" style={{ fontSize: "0.62rem" }}>Since {new Date(room.lastMaintenance).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {room.features.slice(0, 3).map(f => (
            <span
              key={f}
              className="flex items-center gap-1 px-2 py-1 rounded-lg"
              style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: `${tc.accent}10`, color: tc.text, border: `1px solid ${tc.accent}20` }}
            >
              {FEATURE_ICONS[f] ?? null} {f}
            </span>
          ))}
          {room.features.length > 3 && (
            <span className="px-2 py-1 rounded-lg text-white/25" style={{ fontSize: "0.6rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              +{room.features.length - 3}
            </span>
          )}
        </div>

        {/* Status toggle row */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <StatusToggle
              status={room.status}
              onChange={() => onToggle(room.id)}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: room.status === "active" ? "#10b981" : "#f59e0b" }}>
              {room.status === "active" ? "Active" : "Maintenance"}
            </span>
          </div>
          <button onClick={() => onEdit(room)} className="flex items-center gap-1.5 text-white/25 hover:text-white/60 transition-colors" style={{ fontSize: "0.68rem" }}>
            <Edit2 size={11} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   ADD / EDIT ROOM MODAL
═══════════════════════════════════ */
const EMPTY_FORM = {
  name: "", type: "Standard" as ScreenType, capacity: 200,
  rows: 10, seatsPerRow: 20, status: "active" as RoomStatus,
  features: [] as string[], notes: "",
};

function RoomModal({
  mode, room, onSave, onClose,
}: {
  mode: "add" | "edit";
  room?: CinemaRoom;
  onSave: (data: Omit<CinemaRoom, "id" | "showtimesToday" | "occupancyPct" | "revenueToday" | "lastMaintenance">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name:       room?.name        ?? "",
    type:       room?.type        ?? "Standard" as ScreenType,
    capacity:   room?.capacity    ?? 200,
    rows:       room?.rows        ?? 10,
    seatsPerRow:room?.seatsPerRow ?? 20,
    status:     room?.status      ?? "active" as RoomStatus,
    features:   room?.features    ?? [] as string[],
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Room name is required";
    if (form.capacity < 10) e.capacity = "Capacity must be at least 10";
    if (form.rows < 2)      e.rows = "Minimum 2 rows";
    if (form.seatsPerRow < 4) e.seatsPerRow = "Minimum 4 seats per row";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({ name: form.name, type: form.type, capacity: form.capacity, rows: form.rows, seatsPerRow: form.seatsPerRow, status: form.status, features: form.features });
    setSaving(false);
  };

  const toggleFeature = (f: string) => set("features", form.features.includes(f) ? form.features.filter(x => x !== f) : [...form.features, f]);
  const tc = TYPE_CONFIG[form.type];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col"
        style={{ backgroundColor: "#0f0f18", maxHeight: "90vh", boxShadow: "0 0 0 1px rgba(232,25,44,0.12), 0 40px 100px rgba(0,0,0,0.8)", animation: "modalIn .32s cubic-bezier(.34,1.4,.64,1) forwards" }}
      >
        <div className="h-0.5 flex-shrink-0" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-white/6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${tc.accent}25,${tc.accent}08)`, border: `1px solid ${tc.border}` }}>
              <LayoutGrid size={18} style={{ color: tc.accent }} />
            </div>
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {mode === "add" ? "Add New Room" : `Edit — ${room?.name}`}
              </h2>
              <p className="text-white/30" style={{ fontSize: "0.7rem" }}>Configure hall details and capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-5">

          {/* Room Name + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Room Name <span className="text-[#e8192c]">*</span></label>
              <input
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Hall 1"
                className="px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
                style={{ border: `1.5px solid ${errors.name ? "#e8192c" : "rgba(255,255,255,0.1)"}`, fontSize: "0.88rem" }}
                onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; }}
                onBlur={e => { e.target.style.borderColor = errors.name ? "#e8192c" : "rgba(255,255,255,0.1)"; }}
              />
              {errors.name && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Screen Type <span className="text-[#e8192c]">*</span></label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={e => set("type", e.target.value as ScreenType)}
                  className="w-full appearance-none px-4 pr-10 py-3 rounded-xl bg-white/[0.04] text-white outline-none cursor-pointer"
                  style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.88rem" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  {SCREEN_TYPES.map(t => <option key={t} value={t} style={{ backgroundColor: "#0f0f18" }}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Screen type preview badges */}
          <div className="flex flex-wrap gap-2">
            {SCREEN_TYPES.map(t => {
              const tc2 = TYPE_CONFIG[t];
              const sel = form.type === t;
              return (
                <button
                  key={t}
                  onClick={() => set("type", t)}
                  className="px-3 py-1.5 rounded-xl border transition-all"
                  style={{
                    fontSize: "0.72rem", fontWeight: 700,
                    backgroundColor: sel ? tc2.bg : "rgba(255,255,255,0.02)",
                    borderColor: sel ? tc2.border : "rgba(255,255,255,0.07)",
                    color: sel ? tc2.text : "rgba(255,255,255,0.3)",
                  }}
                >
                  {sel && <Check size={10} className="inline mr-1" />}{t}
                </button>
              );
            })}
          </div>

          {/* Capacity, Rows, Seats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "capacity" as const, label: "Total Capacity *", placeholder: "200", suffix: "seats" },
              { key: "rows" as const,     label: "Number of Rows *",  placeholder: "10",  suffix: "rows"  },
              { key: "seatsPerRow" as const, label: "Seats Per Row *", placeholder: "20",  suffix: "seats" },
            ].map(({ key, label, placeholder, suffix }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form[key]}
                    onChange={e => set(key, parseInt(e.target.value) || 0)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none"
                    style={{ border: `1.5px solid ${errors[key] ? "#e8192c" : "rgba(255,255,255,0.1)"}`, fontSize: "0.88rem" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; }}
                    onBlur={e => { e.target.style.borderColor = errors[key] ? "#e8192c" : "rgba(255,255,255,0.1)"; }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" style={{ fontSize: "0.6rem" }}>{suffix}</span>
                </div>
                {errors[key] && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors[key]}</span>}
              </div>
            ))}
          </div>

          {/* Live seating preview */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.07)", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
              <span className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em" }}>Seating Preview</span>
              <span className="text-white/25" style={{ fontSize: "0.68rem" }}>{form.rows} × {form.seatsPerRow} = {form.rows * form.seatsPerRow} seats</span>
            </div>
            <div className="px-8 py-4" style={{ height: "130px" }}>
              <SeatingMap id="preview" rows={form.rows} seatsPerRow={form.seatsPerRow} accent={TYPE_CONFIG[form.type]?.accent ?? "#e8192c"} />
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Features</label>
            <div className="flex flex-wrap gap-2">
              {ALL_FEATURES.map(f => {
                const on = form.features.includes(f);
                return (
                  <button
                    key={f}
                    onClick={() => toggleFeature(f)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all"
                    style={{
                      fontSize: "0.72rem", fontWeight: 600,
                      backgroundColor: on ? `${tc.accent}15` : "rgba(255,255,255,0.02)",
                      borderColor: on ? tc.border : "rgba(255,255,255,0.08)",
                      color: on ? tc.text : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {on && <Check size={10} />}
                    {FEATURE_ICONS[f]} {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2.5">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Initial Status</label>
            <div className="flex gap-2">
              {(["active","maintenance","closed"] as RoomStatus[]).map(s => {
                const sc = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => set("status", s)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all flex-1 justify-center"
                    style={{ backgroundColor: form.status === s ? sc.bg : "rgba(255,255,255,0.02)", borderColor: form.status === s ? `${sc.dot}40` : "rgba(255,255,255,0.07)", color: form.status === s ? sc.text : "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: 600 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: form.status === s ? sc.dot : "rgba(255,255,255,0.2)" }} /> {sc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-white/6 flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}
          >
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> {mode === "add" ? "Add Room" : "Save Changes"}</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════
   DELETE MODAL
═══════════════════════════════════ */
function DeleteRoomModal({ room, onConfirm, onClose }: { room: CinemaRoom; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => { setLoading(true); await new Promise(r => setTimeout(r, 700)); onConfirm(); };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden" style={{ backgroundColor: "#0f0f18", boxShadow: "0 0 0 1px rgba(232,25,44,0.15), 0 32px 80px rgba(0,0,0,0.8)", animation: "modalIn .3s cubic-bezier(.34,1.4,.64,1) forwards" }}>
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />
        <div className="p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg,rgba(232,25,44,0.15),rgba(232,25,44,0.06))", border: "1px solid rgba(232,25,44,0.25)" }}>
            <Trash2 size={28} className="text-[#e8192c]" strokeWidth={1.5} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "1.1rem" }}>Delete Room?</h3>
          <p className="text-white/50 mb-1" style={{ fontSize: "0.85rem" }}>Permanently deleting</p>
          <p className="text-white mb-5" style={{ fontWeight: 700 }}>"{room.name} — {room.type}"</p>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 w-full justify-center" style={{ backgroundColor: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
            <AlertTriangle size={13} className="text-[#e8192c]" />
            <p className="text-[#e8192c]/80" style={{ fontSize: "0.74rem" }}>All scheduled showtimes will be removed.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/45 hover:text-white transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
            <button onClick={handle} disabled={loading} className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.35)" }}>
              {loading ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
export function AdminRooms() {
  const [rooms,        setRooms]        = useState<CinemaRoom[]>(SEED_ROOMS);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal,        setModal]        = useState<null | "add" | "edit">(null);
  const [editTarget,   setEditTarget]   = useState<CinemaRoom | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CinemaRoom | undefined>();
  const [toast,        setToast]        = useState("");
  const [toastOn,      setToastOn]      = useState(false);

  const showToast = (msg: string) => { setToast(msg); setToastOn(true); setTimeout(() => setToastOn(false), 2400); };

  const filtered = rooms.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.type.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  const handleSave = (data: Omit<CinemaRoom,"id"|"showtimesToday"|"occupancyPct"|"revenueToday"|"lastMaintenance">) => {
    if (modal === "edit" && editTarget) {
      setRooms(prev => prev.map(r => r.id === editTarget.id ? { ...r, ...data } : r));
      showToast(`"${data.name}" updated`);
    } else {
      setRooms(prev => [...prev, { ...data, id: uid(), showtimesToday: 0, occupancyPct: 0, revenueToday: 0, lastMaintenance: new Date().toISOString().slice(0, 10) }]);
      showToast(`"${data.name}" added successfully`);
    }
    setModal(null); setEditTarget(undefined);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setRooms(prev => prev.filter(r => r.id !== deleteTarget.id));
    showToast(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(undefined);
  };

  const handleToggle = (id: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "active" ? "maintenance" : "active" } : r));
  };

  const stats = {
    total:    rooms.length,
    active:   rooms.filter(r => r.status === "active").length,
    maint:    rooms.filter(r => r.status === "maintenance").length,
    capacity: rooms.reduce((a, r) => a + r.capacity, 0),
  };

  return (
    <AdminLayout
      title="Rooms Management"
      subtitle={`${stats.total} halls · ${stats.active} active · ${stats.maint} in maintenance`}
      actions={
        <button
          onClick={() => { setEditTarget(undefined); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.06em", boxShadow: "0 6px 20px rgba(232,25,44,0.4)" }}
        >
          <Plus size={15} /> Add Room
        </button>
      }
    >
      {/* Stats chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Halls",   value: stats.total,                      color: "#e8192c" },
          { label: "Active",        value: stats.active,                     color: "#10b981" },
          { label: "Maintenance",   value: stats.maint,                      color: "#f59e0b" },
          { label: "Total Capacity",value: stats.capacity.toLocaleString(),  color: "#3b82f6" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border px-4 py-3.5" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}>
              <span style={{ fontWeight: 900, fontSize: "0.78rem", color }}>{value}</span>
            </div>
            <p className="text-white/40" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl border" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
        {/* Search */}
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by room name or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
            style={{ border: "1.5px solid rgba(255,255,255,0.08)", fontSize: "0.85rem" }}
            onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.45)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 text-white/25 hover:text-white/60 transition-colors"><X size={13} /></button>}
        </div>

        {/* Screen Type */}
        <div className="relative">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer"
            style={{ backgroundColor: typeFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: typeFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: typeFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}
          >
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Screen Types</option>
            {SCREEN_TYPES.map(t => <option key={t} value={t} style={{ backgroundColor: "#0f0f18" }}>{t}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer"
            style={{ backgroundColor: statusFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: statusFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: statusFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}
          >
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Statuses</option>
            <option value="active"      style={{ backgroundColor: "#0f0f18" }}>Active</option>
            <option value="maintenance" style={{ backgroundColor: "#0f0f18" }}>Maintenance</option>
            <option value="closed"      style={{ backgroundColor: "#0f0f18" }}>Closed</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {(search || typeFilter !== "All" || statusFilter !== "All") && (
          <button onClick={() => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.78rem" }}>
            <X size={12} /> Clear
          </button>
        )}
        <span className="ml-auto text-white/25" style={{ fontSize: "0.75rem" }}>{filtered.length} room{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Room Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-white/5" style={{ backgroundColor: "#13131e" }}>
          <LayoutGrid size={40} className="text-white/10 mb-3" />
          <p className="text-white/30" style={{ fontSize: "0.9rem" }}>No rooms found</p>
          <button onClick={() => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); }} className="mt-2 text-[#e8192c]/60 hover:text-[#e8192c] transition-colors" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={r => { setEditTarget(r); setModal("edit"); }}
              onDelete={r => setDeleteTarget(r)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <RoomModal mode={modal} room={editTarget} onSave={handleSave} onClose={() => { setModal(null); setEditTarget(undefined); }} />
      )}
      {deleteTarget && (
        <DeleteRoomModal room={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(undefined)} />
      )}

      {/* Toast */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 z-[400] transition-all duration-300 pointer-events-none"
        style={{ backgroundColor: "rgba(15,15,24,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", opacity: toastOn ? 1 : 0, transform: toastOn ? "translate(-50%,0)" : "translate(-50%,14px)" }}>
        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" /></div>
        <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}>{toast}</span>
      </div>
    </AdminLayout>
  );
}
