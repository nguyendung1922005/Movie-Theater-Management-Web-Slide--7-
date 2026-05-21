import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Film, Clock, Users, Plus, X, Check, AlertTriangle,
  ChevronLeft, ChevronRight, Trash2, Edit2, Copy, ZoomIn, ZoomOut,
  Calendar, Clapperboard, Bell, ShieldCheck, Settings, LogOut, Globe,
  AlertCircle, GripVertical, MoreHorizontal, Eye, Maximize2, DoorOpen,
  Zap, BarChart3,
} from "lucide-react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface Showtime {
  id: string;
  movieId: string;
  hallId: string;
  startMin: number;
  durationMin: number;
  format?: string;
  originalDate?: Date;
}
interface PopupState {
  showtimeId: string;
  x: number;
  y: number;
}

/* ══════════════════════════════════════════
   GRID CONSTANTS
══════════════════════════════════════════ */
const START_MIN = 480;   // 08:00
const END_MIN   = 1440;  // 24:00
const HALL_W    = 164;   // px — hall label column
const ROW_H     = 90;    // px — each hall row
const HEADER_H  = 52;    // px — time header

const COLOR_PALETTE = [
  { border: "#e8192c", bg: "rgba(232,25,44,0.16)",   text: "#ff6b7a", glow: "rgba(232,25,44,0.3)"  },
  { border: "#3b82f6", bg: "rgba(59,130,246,0.16)",  text: "#60a5fa", glow: "rgba(59,130,246,0.3)" },
  { border: "#8b5cf6", bg: "rgba(139,92,246,0.16)",  text: "#a78bfa", glow: "rgba(139,92,246,0.3)" },
  { border: "#f97316", bg: "rgba(249,115,22,0.16)",  text: "#fb923c", glow: "rgba(249,115,22,0.3)" },
  { border: "#06b6d4", bg: "rgba(6,182,212,0.16)",   text: "#22d3ee", glow: "rgba(6,182,212,0.3)"  },
  { border: "#6366f1", bg: "rgba(99,102,241,0.16)",  text: "#818cf8", glow: "rgba(99,102,241,0.3)" },
];
const CONFLICT_COLOR = { border: "#f59e0b", bg: "rgba(245,158,11,0.14)", text: "#fbbf24", glow: "rgba(245,158,11,0.3)" };
const DEFAULT_COLOR  = { border: "#e8192c", bg: "rgba(232,25,44,0.16)",  text: "#ff6b7a", glow: "rgba(232,25,44,0.3)" };

function getMovieColor(movieId: string, movies: any[]) {
  const index = movies.findIndex(m => m.id === movieId);
  if (index === -1) return DEFAULT_COLOR;
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

function genId() { return Math.random().toString(36).slice(2, 9); }

function formatMin(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function minToDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

/* ══════════════════════════════════════════
   CONFLICT DETECTION
══════════════════════════════════════════ */
function getConflictIds(showtimes: Showtime[]): Set<string> {
  const ids = new Set<string>();
  showtimes.forEach(a => {
    showtimes.forEach(b => {
      if (a.id !== b.id && a.hallId === b.hallId &&
        a.startMin < b.startMin + b.durationMin &&
        a.startMin + a.durationMin > b.startMin) {
        ids.add(a.id); ids.add(b.id);
      }
    });
  });
  return ids;
}

/* ══════════════════════════════════════════
   ADD / EDIT MODAL
══════════════════════════════════════════ */
function AddShowtimeModal({
  defaultHallId, defaultStartMin,
  editShowtime, editMovie,
  movies, halls,
  onSave, onClose,
}: {
  defaultHallId?: string;
  defaultStartMin?: number;
  editShowtime?: Showtime;
  editMovie?: any;
  movies: any[];
  halls: any[];
  onSave: (data: Omit<Showtime, "id">) => void;
  onClose: () => void;
}) {
  const [movieId,  setMovieId]  = useState(editShowtime?.movieId  ?? (movies[0]?.id || ""));
  const [hallId,   setHallId]   = useState(editShowtime?.hallId   ?? (defaultHallId ?? (halls[0]?.id || "")));
  const [startStr, setStartStr] = useState(formatMin(editShowtime?.startMin ?? (defaultStartMin ?? 600)));
  const [durStr,   setDurStr]   = useState(String(editShowtime?.durationMin ?? (movies[0]?.duration || 120)));
  const [format,   setFormat]   = useState(editShowtime?.format ?? "");
  const [saving,   setSaving]   = useState(false);

  /* Sync duration when movie changes */
  useEffect(() => {
    if (!editShowtime) {
      const m = movies.find(m => m.id === movieId);
      if (m) setDurStr(String(m.duration));
    }
  }, [movieId, editShowtime, movies]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const strToMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    onSave({ movieId, hallId, startMin: strToMin(startStr), durationMin: parseInt(durStr) || 90, format });
    setSaving(false);
  };

  const selectedMovie = movies.find(m => m.id === movieId);
  const mc = getMovieColor(movieId, movies);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden"
        style={{ backgroundColor: "#0f0f18", boxShadow: "0 0 0 1px rgba(232,25,44,0.12), 0 40px 100px rgba(0,0,0,0.8)", animation: "modalIn .3s cubic-bezier(.34,1.4,.64,1) forwards" }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(232,25,44,0.2),rgba(232,25,44,0.07))", border: "1px solid rgba(232,25,44,0.22)" }}>
              <Clock size={16} className="text-[#e8192c]" />
            </div>
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>{editShowtime ? "Edit Showtime" : "New Showtime"}</h2>
              <p className="text-white/30" style={{ fontSize: "0.7rem" }}>Thu, March 5, 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"><X size={14} /></button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Movie selector */}
          <div className="flex flex-col gap-2">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Movie</label>
            <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
              {movies.map(m => {
                const mc2 = getMovieColor(m.id, movies);
                const sel = movieId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMovieId(m.id)}
                    className="flex flex-col rounded-xl border overflow-hidden transition-all text-left"
                    style={{ borderColor: sel ? mc2.border + "80" : "rgba(255,255,255,0.07)", backgroundColor: sel ? mc2.bg : "rgba(255,255,255,0.02)", boxShadow: sel ? `0 0 0 1px ${mc2.border}40` : "none" }}
                  >
                    <div className="w-full h-14 overflow-hidden">
                      <img src={m.posterUrl} alt="" className="w-full h-full object-cover" style={{ filter: sel ? "none" : "brightness(0.55)" }} />
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="text-white truncate" style={{ fontSize: "0.68rem", fontWeight: 700 }}>{m.title}</p>
                      <p style={{ fontSize: "0.6rem", color: sel ? mc2.text : "rgba(255,255,255,0.3)" }}>{minToDuration(m.duration)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hall */}
          <div className="flex flex-col gap-2">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Hall</label>
            <div className="flex flex-wrap gap-2">
              {halls.map(h => (
                <button
                  key={h.id}
                  onClick={() => setHallId(h.id)}
                  className="px-3 py-1.5 rounded-xl border transition-all"
                  style={{ fontSize: "0.75rem", fontWeight: hallId === h.id ? 700 : 500, backgroundColor: hallId === h.id ? "rgba(232,25,44,0.12)" : "rgba(255,255,255,0.03)", borderColor: hallId === h.id ? "rgba(232,25,44,0.4)" : "rgba(255,255,255,0.08)", color: hallId === h.id ? "#e8192c" : "rgba(255,255,255,0.45)" }}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Start Time</label>
              <input
                type="time"
                value={startStr}
                onChange={e => setStartStr(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none [color-scheme:dark]"
                style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem" }}
                onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Duration (min)</label>
              <input
                type="number"
                value={durStr}
                onChange={e => setDurStr(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none"
                style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem" }}
                onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          </div>

          {/* Format */}
          <div className="flex flex-col gap-2">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Format</label>
            <div className="flex gap-2 flex-wrap">
              {["IMAX","4DX","Dolby","3D","2D"].map(f => (
                <button key={f} onClick={() => setFormat(format === f ? "" : f)}
                  className="px-3 py-1 rounded-lg border transition-all"
                  style={{ fontSize: "0.68rem", fontWeight: 700, backgroundColor: format === f ? "rgba(232,25,44,0.12)" : "rgba(255,255,255,0.03)", borderColor: format === f ? "rgba(232,25,44,0.4)" : "rgba(255,255,255,0.08)", color: format === f ? "#e8192c" : "rgba(255,255,255,0.35)" }}>
                  {format === f && <Check size={9} className="inline mr-1" />}{f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/6" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/8 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}>
            {saving ? "Saving…" : <><Check size={13} /> {editShowtime ? "Save Changes" : "Add Showtime"}</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn { from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)} }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHOWTIME BLOCK
══════════════════════════════════════════ */
function ShowtimeBlock({
  st, movie, isConflict, zoom, movies,
  draggingId,
  onDragStart, onDragEnd,
  onClick,
}: {
  st: Showtime;
  movie: any | undefined;
  isConflict: boolean;
  zoom: number;
  movies: any[];
  draggingId: string | null;
  onDragStart: (e: React.DragEvent, st: Showtime) => void;
  onDragEnd: () => void;
  onClick: (e: React.MouseEvent, st: Showtime) => void;
}) {
  const mc = isConflict ? CONFLICT_COLOR : getMovieColor(st.movieId, movies);
  const left  = (st.startMin - START_MIN) * zoom;
  const width = Math.max(4, st.durationMin * zoom - 3);
  const isDragging = draggingId === st.id;

  const endMin = st.startMin + st.durationMin;
  const showFull   = width >= 150;
  const showMedium = width >= 80;

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, st)}
      onDragEnd={onDragEnd}
      onClick={e => { e.stopPropagation(); onClick(e, st); }}
      className="absolute top-1.5 rounded-xl cursor-grab active:cursor-grabbing overflow-hidden group/block select-none transition-opacity"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        height: ROW_H - 12,
        backgroundColor: mc.bg,
        border: `1.5px solid ${mc.border}${isConflict ? "" : "90"}`,
        boxShadow: isDragging ? "none" : `0 2px 12px ${mc.glow}`,
        opacity: isDragging ? 0.25 : 1,
        zIndex: 10,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-xl opacity-80" style={{ backgroundColor: mc.border }} />

      {/* Conflict stripe overlay */}
      {isConflict && (
        <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-15"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #f59e0b 0, #f59e0b 2px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }}
        />
      )}

      <div className="relative h-full flex flex-col justify-between px-2 py-1.5 overflow-hidden">
        {showMedium && (
          <div className="flex items-start gap-2 min-w-0">
            {showFull && movie?.posterUrl && (
              <img src={movie.posterUrl} alt="" className="w-7 h-9 rounded-md object-cover flex-shrink-0 opacity-90" />
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontWeight: 800, fontSize: "0.75rem", color: mc.text, lineHeight: 1.2 }}>
                {movie?.title ?? "—"}
              </p>
              {showFull && (
                <p className="text-white/40 truncate mt-0.5" style={{ fontSize: "0.6rem" }}>
                  {movie?.status === 'NOW_SHOWING' ? 'Live' : 'Soon'}
                </p>
              )}
            </div>
            {isConflict && (
              <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
            )}
          </div>
        )}

        {showMedium && (
          <div className="flex items-center justify-between mt-auto gap-1">
            <span className="text-white/50 truncate" style={{ fontSize: "0.58rem", fontWeight: 600 }}>
              {formatMin(st.startMin)}–{formatMin(endMin)}
            </span>
            {showFull && st.format && (
              <span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: "0.52rem", fontWeight: 800, letterSpacing: "0.08em", backgroundColor: `${mc.border}22`, color: mc.text }}>
                {st.format}
              </span>
            )}
          </div>
        )}

        {/* Hover edit overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover/block:bg-black/20 transition-colors rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover/block:opacity-100">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <GripVertical size={11} className="text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   BLOCK ACTION POPUP
══════════════════════════════════════════ */
function BlockPopup({
  showtimeId, x, y,
  showtimes, conflictIds, movies, halls,
  onEdit, onDuplicate, onDelete, onClose,
}: {
  showtimeId: string; x: number; y: number;
  showtimes: Showtime[]; conflictIds: Set<string>;
  movies: any[]; halls: any[];
  onEdit: (st: Showtime) => void;
  onDuplicate: (st: Showtime) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const st = showtimes.find(s => s.id === showtimeId);
  const movie = movies.find(m => m.id === st?.movieId);
  if (!st || !movie) return null;
  const mc = conflictIds.has(st.id) ? CONFLICT_COLOR : getMovieColor(st.movieId, movies);
  const hall = halls.find(h => h.id === st.hallId);

  // Adjust popup so it stays in viewport
  const popW = 220, popH = 220;
  const px = x + popW > window.innerWidth  ? x - popW - 8 : x + 8;
  const py = y + popH > window.innerHeight ? y - popH - 8 : y + 8;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-popup]")) onClose();
    };
    setTimeout(() => window.addEventListener("mousedown", h), 50);
    return () => window.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div
      data-popup="1"
      className="fixed z-[400] rounded-2xl border border-white/10 overflow-hidden"
      style={{ top: py, left: px, width: popW, backgroundColor: "#0f0f18", boxShadow: `0 0 0 1px ${mc.border}30, 0 20px 60px rgba(0,0,0,0.7)`, animation: "popIn .2s cubic-bezier(.34,1.4,.64,1) forwards" }}
    >
      <div className="h-0.5" style={{ background: `linear-gradient(90deg,transparent,${mc.border},transparent)` }} />

      {/* Movie info */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6">
        <img src={movie.posterUrl} alt="" className="w-8 h-11 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{movie.title}</p>
          <p className="text-white/35 truncate" style={{ fontSize: "0.68rem" }}>
            {hall?.name} · {st.format ?? "—"}
          </p>
          <p style={{ fontSize: "0.65rem", color: mc.text, fontWeight: 600, marginTop: "2px" }}>
            {formatMin(st.startMin)} → {formatMin(st.startMin + st.durationMin)}
          </p>
        </div>
      </div>

      {/* Conflict warning */}
      {conflictIds.has(st.id) && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6" style={{ backgroundColor: "rgba(245,158,11,0.08)" }}>
          <AlertTriangle size={12} className="text-[#f59e0b] flex-shrink-0" />
          <span className="text-[#f59e0b]" style={{ fontSize: "0.7rem", fontWeight: 600 }}>Scheduling conflict detected</span>
        </div>
      )}

      {/* Actions */}
      <div className="p-2 flex flex-col gap-0.5">
        {[
          { icon: <Edit2 size={13} />, label: "Edit Showtime", color: "#3b82f6", action: () => { onEdit(st); onClose(); } },
          { icon: <Copy size={13} />,  label: "Duplicate",     color: "#8b5cf6", action: () => { onDuplicate(st); onClose(); } },
          { icon: <Trash2 size={13} />,label: "Delete",        color: "#e8192c", action: () => { onDelete(st.id); onClose(); } },
        ].map(({ icon, label, color, action }) => (
          <button key={label} onClick={action}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full hover:bg-white/[0.04]"
            style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
          >
            <span style={{ color }}>{icon}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export function AdminShowtimes() {
  const [halls, setHalls] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [zoom,       setZoom]       = useState(2);   // px per minute
  const [addModal,   setAddModal]   = useState<{ hallId?: string; startMin?: number } | null>(null);
  const [editTarget, setEditTarget] = useState<Showtime | null>(null);
  const [popup,      setPopup]      = useState<PopupState | null>(null);
  const [dragPreview, setDragPreview] = useState<{ hallId: string; startMin: number; durationMin: number; movieId: string } | null>(null);
  const [draggingId,  setDraggingId]  = useState<string | null>(null);
  const [dragOverHall, setDragOverHall] = useState<string | null>(null);
  const [toast, setToast]   = useState("");
  const [toastOn, setToastOn] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRooms, resMovies, resShowtimes] = await Promise.all([
          fetch("http://localhost:3000/api/rooms"),
          fetch("http://localhost:3000/api/movies"),
          fetch("http://localhost:3000/api/showtimes")
        ]);
        const jsonRooms = await resRooms.json();
        const jsonMovies = await resMovies.json();
        const jsonShowtimes = await resShowtimes.json();

        if (jsonRooms.success) {
          setHalls(jsonRooms.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.name.includes("IMAX") ? "IMAX" : r.name.includes("Dolby") ? "Dolby" : "Standard",
            seats: r.capacity
          })));
        }
        setMovies(jsonMovies);

        const mappedShowtimes = jsonShowtimes.map((st: any) => {
          const start = new Date(st.startTime);
          const end = new Date(st.endTime);
          const startMin = start.getHours() * 60 + start.getMinutes();
          const durationMin = (end.getTime() - start.getTime()) / 60000;
          return {
            id: st.id,
            movieId: st.movieId,
            hallId: st.roomId,
            startMin,
            durationMin,
            format: st.room?.name?.includes("IMAX") ? "IMAX" : "2D",
            originalDate: start
          };
        });
        setShowtimes(mappedShowtimes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollRef   = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<{ type: "new"; movieId: string } | { type: "move"; showtimeId: string } | null>(null);
  const dragOffMin  = useRef(0); // minutes offset from block start to grab point

  const conflictIds = useMemo(() => getConflictIds(showtimes), [showtimes]);

  /* ── helpers ── */
  const showToast = (msg: string) => {
    setToast(msg); setToastOn(true);
    setTimeout(() => setToastOn(false), 2400);
  };

  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const baseDate = new Date();
  const displayDate = new Date(baseDate);
  displayDate.setDate(baseDate.getDate() + dateOffset);
  const dateLabel = `${DAYS[displayDate.getDay()]}, ${MONTHS[displayDate.getMonth()]} ${displayDate.getDate()}, ${displayDate.getFullYear()}`;

  // Lọc showtime theo ngày hiển thị (So sánh năm tháng ngày)
  const visibleShowtimes = showtimes.filter(s => s.originalDate && s.originalDate.toDateString() === displayDate.toDateString());

  /* Current time indicator (real time, only if between 08:00 and 24:00) */
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = nowMin >= START_MIN && nowMin < END_MIN;
  const nowX = (nowMin - START_MIN) * zoom;

  /* ── position calculations ── */
  const getPosFromEvent = (e: React.DragEvent | React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return { hallId: halls[0]?.id || "", startMin: START_MIN };
    const rect = el.getBoundingClientRect();
    const xInTimeline = e.clientX - rect.left + el.scrollLeft - HALL_W;
    const yInHalls    = e.clientY - rect.top - HEADER_H;
    const rawMin = START_MIN + xInTimeline / zoom;
    const startMin = Math.max(START_MIN, Math.min(END_MIN - 30, Math.round(rawMin / 5) * 5));
    const hallIdx  = Math.max(0, Math.min(halls.length - 1, Math.floor(yInHalls / ROW_H)));
    return { hallId: halls[hallIdx]?.id || "", startMin };
  };

  /* ── drag from movie panel ── */
  const onMovieDragStart = (e: React.DragEvent, movieId: string) => {
    dragItemRef.current = { type: "new", movieId };
    e.dataTransfer.effectAllowed = "move";
    dragOffMin.current = 0;
  };

  /* ── drag existing block ── */
  const onBlockDragStart = (e: React.DragEvent, st: Showtime) => {
    dragItemRef.current = { type: "move", showtimeId: st.id };
    const grabX = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left;
    dragOffMin.current = Math.round(grabX / zoom / 5) * 5;
    setDraggingId(st.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onBlockDragEnd = () => {
    setDraggingId(null);
    setDragPreview(null);
    dragItemRef.current = null;
  };

  /* ── timeline drag events ── */
  const onTimelineDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const item = dragItemRef.current;
    if (!item) return;
    const { hallId, startMin } = getPosFromEvent(e);
    setDragOverHall(hallId);
    const durationMin = item.type === "new"
      ? (movies.find(m => m.id === item.movieId)?.duration ?? 120)
      : (showtimes.find(s => s.id === item.showtimeId)?.durationMin ?? 120);
    const movieId = item.type === "new"
      ? item.movieId
      : (showtimes.find(s => s.id === item.showtimeId)?.movieId ?? "");
    const previewStart = item.type === "move" ? startMin - dragOffMin.current : startMin;
    setDragPreview({ hallId, startMin: Math.max(START_MIN, previewStart), durationMin, movieId });
  }, [zoom, showtimes, movies]);

  const onTimelineDragLeave = useCallback(() => {
    setDragOverHall(null);
    setDragPreview(null);
  }, []);

  const onTimelineDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const item = dragItemRef.current;
    if (!item) return;
    const { hallId, startMin } = getPosFromEvent(e);

    // Calculate start and end time with displayDate
    const startDate = new Date(displayDate);
    startDate.setHours(0, 0, 0, 0);
    startDate.setMinutes(startMin);

    if (item.type === "new") {
      const movie = movies.find(m => m.id === item.movieId);
      if (!movie) return;

      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + movie.duration);

      try {
        const res = await fetch("http://localhost:3000/api/admin/showtimes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId: movie.id, roomId: hallId, startTime: startDate.toISOString(), endTime: endDate.toISOString(), priceBase: 80000 })
        });
        const data = await res.json();
        if (data.success) {
          const newSt: Showtime = { id: data.data.id, movieId: movie.id, hallId, startMin, durationMin: movie.duration, format: data.data.room?.name?.includes("IMAX") ? "IMAX" : "2D", originalDate: startDate };
          setShowtimes(prev => [...prev, newSt]);
          showToast(`Added "${movie.title}"`);
        }
      } catch (err) {
        showToast("Lỗi lưu suất chiếu");
      }
    } else {
      const newStart = Math.max(START_MIN, Math.min(END_MIN - 30, startMin - dragOffMin.current));
      const oldSt = showtimes.find(s => s.id === item.showtimeId);
      if (oldSt) {
        const sDate = new Date(displayDate);
        sDate.setHours(0, 0, 0, 0);
        sDate.setMinutes(newStart);
        const eDate = new Date(sDate);
        eDate.setMinutes(sDate.getMinutes() + oldSt.durationMin);
        try {
          const res = await fetch(`http://localhost:3000/api/admin/showtimes/${item.showtimeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieId: oldSt.movieId, roomId: hallId, startTime: sDate.toISOString(), endTime: eDate.toISOString() })
          });
          if (res.ok) {
            setShowtimes(prev => prev.map(s => s.id === item.showtimeId ? { ...s, hallId, startMin: newStart, originalDate: sDate } : s));
            showToast(`Moved showtime`);
          }
        } catch (err) {
          showToast("Lỗi cập nhật suất chiếu");
        }
      }
    }
    dragItemRef.current = null;
    setDraggingId(null);
    setDragPreview(null);
    setDragOverHall(null);
  }, [zoom, showtimes, movies, displayDate]);

  /* ── click on timeline row to add ── */
  const onRowClick = (e: React.MouseEvent, hallId: string) => {
    if ((e.target as HTMLElement).closest("[data-block]")) return;
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xInTimeline = e.clientX - rect.left + el.scrollLeft - HALL_W;
    const rawMin = START_MIN + xInTimeline / zoom;
    const startMin = Math.max(START_MIN, Math.min(END_MIN - 30, Math.round(rawMin / 5) * 5));
    setAddModal({ hallId, startMin });
  };

  /* ── CRUD ── */
  const handleSave = async (data: Omit<Showtime, "id">) => {
    const startDate = new Date(displayDate);
    startDate.setHours(0, 0, 0, 0);
    startDate.setMinutes(data.startMin);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + data.durationMin);

    if (editTarget) {
      const res = await fetch(`http://localhost:3000/api/admin/showtimes/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: data.movieId, roomId: data.hallId, startTime: startDate.toISOString(), endTime: endDate.toISOString() })
      });
      if (res.ok) {
        setShowtimes(prev => prev.map(s => s.id === editTarget.id ? { ...s, ...data, originalDate: startDate } : s));
        showToast("Showtime updated");
      }
    } else {
      const res = await fetch("http://localhost:3000/api/admin/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: data.movieId, roomId: data.hallId, startTime: startDate.toISOString(), endTime: endDate.toISOString(), priceBase: 80000 })
      });
      const json = await res.json();
      if (json.success) {
        setShowtimes(prev => [...prev, { id: json.data.id, ...data, originalDate: startDate }]);
        showToast("Showtime added");
      }
    }
    setAddModal(null); setEditTarget(null);
  };
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/api/admin/showtimes/${id}`, { method: "DELETE" });
    setShowtimes(prev => prev.filter(s => s.id !== id));
    showToast(`Deleted showtime`);
  };
  const handleDuplicate = async (st: Showtime) => {
    const newStart = Math.min(END_MIN - st.durationMin, st.startMin + st.durationMin + 15);
    const startDate = new Date(displayDate);
    startDate.setHours(0, 0, 0, 0);
    startDate.setMinutes(newStart);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + st.durationMin);

    const res = await fetch("http://localhost:3000/api/admin/showtimes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movieId: st.movieId, roomId: st.hallId, startTime: startDate.toISOString(), endTime: endDate.toISOString(), priceBase: 80000 })
    });
    const json = await res.json();
    if (json.success) {
      setShowtimes(prev => [...prev, { ...st, id: json.data.id, startMin: newStart, originalDate: startDate }]);
      showToast("Showtime duplicated");
    }
  };

  /* ── Timeline header marks ── */
  const hours: number[] = [];
  for (let m = START_MIN; m < END_MIN; m += 60) hours.push(m);
  const halfHours: number[] = [];
  for (let m = START_MIN; m < END_MIN; m += 30) halfHours.push(m);

  const totalW = (END_MIN - START_MIN) * zoom;
  const stats = {
    total: visibleShowtimes.length,
    conflicts: conflictIds.size / 2,
    halls: new Set(visibleShowtimes.map(s => s.hallId)).size,
    seats: visibleShowtimes.reduce((acc, s) => {
      const h = halls.find(h => h.id === s.hallId);
      return acc + (h?.seats ?? 0);
    }, 0),
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0a0a0f] text-white">Đang tải dữ liệu...</div>;
  }

  const NAV = [
    { id: "dashboard",  icon: <LayoutDashboard size={18} />, href: "/admin",             tip: "Dashboard"  },
    { id: "movies",     icon: <Film size={18} />,            href: "/admin/movies",      tip: "Movies"     },
    { id: "showtimes",  icon: <Clock size={18} />,           href: "/admin/showtimes",   tip: "Showtimes"  },
    { id: "rooms",      icon: <DoorOpen size={18} />,        href: "/admin/rooms",       tip: "Rooms"      },
    { id: "users",      icon: <Users size={18} />,           href: "/admin/users",       tip: "Users"      },
    { id: "promotions", icon: <Zap size={18} />,             href: "/admin/promotions",  tip: "Promotions" },
    { id: "inventory",  icon: <Clapperboard size={18} />,    href: "/admin/inventory",   tip: "Snack Inventory" },
    { id: "feedback",   icon: <ShieldCheck size={18} />,     href: "/admin/feedback",    tip: "Feedback"   },
    { id: "revenue",    icon: <BarChart3 size={18} />,       href: "/admin/revenue",     tip: "Revenue Reports" },
    { id: "settings",   icon: <Settings size={18} />,        href: "/admin/settings",    tip: "Settings"   },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0f", color: "white" }}>

      {/* ══ GLOBAL SIDEBAR (56px) ══ */}
      <aside className="flex flex-col items-center border-r z-50 flex-shrink-0" style={{ width: 56, backgroundColor: "#0f0f18", borderColor: "rgba(255,255,255,0.07)" }}>
        {/* Logo */}
        <div className="flex items-center justify-center py-4" style={{ height: 64, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: "0 4px 14px rgba(232,25,44,0.4)" }}>
            <Clapperboard size={15} className="text-white" />
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-3">
          {NAV.map(({ id, icon, href, tip }) => {
            const active = id === "showtimes";
            return (
              <Link key={id} to={href} title={tip}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all group/nav"
                style={{ backgroundColor: active ? "rgba(232,25,44,0.15)" : "transparent", color: active ? "#e8192c" : "rgba(255,255,255,0.3)", border: active ? "1px solid rgba(232,25,44,0.3)" : "1px solid transparent", textDecoration: "none" }}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#e8192c]" />}
                {icon}
                <div className="absolute left-full ml-2.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-white whitespace-nowrap pointer-events-none opacity-0 group-hover/nav:opacity-100 transition-opacity z-50" style={{ backgroundColor: "#1a1a28", fontSize: "0.75rem", fontWeight: 600 }}>{tip}</div>
              </Link>
            );
          })}
        </nav>
        {/* Bottom */}
        <div className="pb-4 flex flex-col items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12 }}>
          <Link to="/" title="View Site" className="w-9 h-9 rounded-xl flex items-center justify-center text-white/20 hover:text-white/50 transition-colors no-underline" style={{ textDecoration: "none" }}>
            <Globe size={16} />
          </Link>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.55rem", fontWeight: 900 }}>SA</div>
        </div>
      </aside>

      {/* ══ MOVIE PANEL (192px) ══ */}
      <div className="flex flex-col border-r flex-shrink-0 overflow-hidden" style={{ width: 192, backgroundColor: "#0c0c14", borderColor: "rgba(255,255,255,0.07)" }}>
        {/* Panel header */}
        <div className="flex-shrink-0 px-4 py-4 border-b" style={{ height: 64, borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-white uppercase" style={{ fontWeight: 800, fontSize: "0.65rem", letterSpacing: "0.18em" }}>Now Showing</p>
          <p className="text-white/25 mt-0.5" style={{ fontSize: "0.62rem" }}>Drag to schedule</p>
        </div>

        {/* Movie list */}
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
          {movies.map(movie => {
            const mc = getMovieColor(movie.id, movies);
            return (
              <div
                key={movie.id}
                draggable
                onDragStart={e => onMovieDragStart(e, movie.id)}
                onDragEnd={onBlockDragEnd}
                className="mx-2 mb-2 rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing transition-all group/card hover:-translate-y-0.5"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                {/* Poster */}
                <div className="relative h-24 overflow-hidden">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform group-hover/card:scale-105" style={{ filter: "brightness(0.75)" }} />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)` }} />
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-white" style={{ fontSize: "0.55rem", fontWeight: 800, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
                    {minToDuration(movie.duration)}
                  </span>
                  {/* Color accent top */}
                  <div className="absolute top-0 inset-x-0 h-0.5" style={{ backgroundColor: mc.border }} />
                  {/* Drag hint */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/card:bg-black/30 transition-colors">
                    <div className="opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                      <GripVertical size={11} className="text-white/60" />
                      <span className="text-white/70" style={{ fontSize: "0.6rem", fontWeight: 600 }}>Drag</span>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="px-2.5 py-2">
                  <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.75rem" }}>{movie.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/35" style={{ fontSize: "0.6rem" }}>{movie.genre}</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "0.52rem", fontWeight: 700, backgroundColor: `${mc.border}18`, color: mc.text }}>{movie.status === 'NOW_SHOWING' ? 'LIVE' : 'SOON'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex-shrink-0 px-3 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-white/20 uppercase mb-2" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.14em" }}>Legend</p>
          <div className="flex flex-col gap-1.5">
            {[
              { color: "#e8192c", label: "Active" },
              { color: "#f59e0b", label: "Conflict" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: color, opacity: 0.8 }} />
                <span className="text-white/30" style={{ fontSize: "0.62rem" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SCHEDULE AREA ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── TOP BAR ── */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-5 border-b"
          style={{ height: 64, backgroundColor: "#0f0f18f5", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          {/* Date navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setDateOffset(d => d - 1)} className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all">
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                <Calendar size={13} className="text-[#e8192c]" />
                <span className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{dateLabel}</span>
              </div>
              <button onClick={() => setDateOffset(d => d + 1)} className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: `${stats.total} Showtimes`, color: "rgba(255,255,255,0.5)" },
                { label: `${stats.conflicts > 0 ? `${stats.conflicts} Conflicts` : "No Conflicts"}`, color: stats.conflicts > 0 ? "#f59e0b" : "#10b981" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ fontSize: "0.72rem", fontWeight: 600, color, backgroundColor: `${color}10`, border: `1px solid ${color}18` }}>
                  {stats.conflicts > 0 && label.includes("Conflict") && <AlertTriangle size={10} />}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Zoom */}
            <div className="flex items-center gap-1 px-1 rounded-xl border border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1} className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white disabled:opacity-20 transition-colors">
                <ZoomOut size={13} />
              </button>
              <span className="text-white/40 px-1" style={{ fontSize: "0.68rem", fontWeight: 700, minWidth: "28px", textAlign: "center" }}>{zoom}×</span>
              <button onClick={() => setZoom(z => Math.min(4, z + 0.5))} disabled={zoom >= 4} className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white disabled:opacity-20 transition-colors">
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={() => setAddModal({})}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all"
              style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.8rem", fontWeight: 800, boxShadow: "0 4px 16px rgba(232,25,44,0.4)" }}
            >
              <Plus size={15} /> Add Showtime
            </button>

            {/* Admin profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/8">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.55rem", fontWeight: 900 }}>SA</div>
              <div className="hidden sm:block">
                <p className="text-white" style={{ fontSize: "0.72rem", fontWeight: 700, lineHeight: 1 }}>Admin</p>
                <div className="flex items-center gap-0.5">
                  <ShieldCheck size={8} className="text-[#e8192c]" />
                  <span className="text-[#e8192c]" style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.1em" }}>ADMIN</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── TIMELINE GRID ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
          onDragOver={onTimelineDragOver}
          onDragLeave={onTimelineDragLeave}
          onDrop={onTimelineDrop}
        >
          {/* Minimum inner width so the whole grid is rendered */}
          <div style={{ minWidth: HALL_W + totalW, position: "relative" }}>

            {/* ── TIME HEADER ROW ── */}
            <div
              className="flex"
              style={{ position: "sticky", top: 0, zIndex: 25, height: HEADER_H, backgroundColor: "#0c0c14", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Corner */}
              <div
                className="flex items-center justify-center flex-shrink-0 border-r"
                style={{ position: "sticky", left: 0, zIndex: 30, width: HALL_W, backgroundColor: "#0c0c14", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#e8192c]" />
                  <span className="text-white/40 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em" }}>Schedule</span>
                </div>
              </div>

              {/* Time marks */}
              <div className="relative flex-shrink-0" style={{ width: totalW, height: HEADER_H }}>
                {/* Hour marks */}
                {hours.map(min => {
                  const x = (min - START_MIN) * zoom;
                  const label = formatMin(min);
                  const isNight = min >= 1260; // 21:00+
                  return (
                    <div key={min} className="absolute top-0 flex flex-col items-start" style={{ left: x }}>
                      <div className="h-full w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                      <span className="absolute top-2 pl-1.5" style={{ fontSize: "0.65rem", fontWeight: 700, color: isNight ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.5)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
                {/* Half-hour marks */}
                {halfHours.filter(m => m % 60 !== 0).map(min => {
                  const x = (min - START_MIN) * zoom;
                  return (
                    <div key={`h${min}`} className="absolute" style={{ left: x, top: "60%", height: "40%", width: 1, backgroundColor: "rgba(255,255,255,0.05)" }} />
                  );
                })}
                {/* Current time marker in header */}
                {showNow && (
                  <div className="absolute top-0 bottom-0 flex items-center" style={{ left: nowX - 1, zIndex: 5 }}>
                    <div className="w-0.5 h-full bg-[#e8192c] opacity-80" />
                    <div className="absolute top-1 -translate-x-1/2 px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: "#e8192c", fontSize: "0.55rem", fontWeight: 900, whiteSpace: "nowrap" }}>
                      NOW
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── HALL ROWS ── */}
            {halls.map((hall, hi) => {
              const hallShowtimes = visibleShowtimes.filter(s => s.hallId === hall.id);
              const isOver = dragOverHall === hall.id;

              return (
                <div
                  key={hall.id}
                  className="flex"
                  style={{
                    height: ROW_H,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: hi % 2 === 0 ? "transparent" : "rgba(255,255,255,0.008)",
                  }}
                  onClick={e => onRowClick(e, hall.id)}
                >
                  {/* Hall label */}
                  <div
                    className="flex items-center flex-shrink-0 border-r px-3 gap-2.5"
                    style={{ position: "sticky", left: 0, zIndex: 15, width: HALL_W, backgroundColor: hi % 2 === 0 ? "#0a0a0f" : "#0b0b13", borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor:
                        hall.type === "IMAX"   ? "rgba(59,130,246,0.12)"  :
                        hall.type === "Dolby"  ? "rgba(139,92,246,0.12)"  :
                        hall.type === "Premium"? "rgba(245,158,11,0.12)"  :
                        "rgba(255,255,255,0.06)",
                      border: `1px solid ${hall.type === "IMAX" ? "rgba(59,130,246,0.25)" : hall.type === "Dolby" ? "rgba(139,92,246,0.25)" : hall.type === "Premium" ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.1)"}`,
                    }}>
                      <span style={{ fontSize: "0.62rem", fontWeight: 900, color: hall.type === "IMAX" ? "#3b82f6" : hall.type === "Dolby" ? "#8b5cf6" : hall.type === "Premium" ? "#f59e0b" : "rgba(255,255,255,0.5)" }}>{hall.type.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.8rem" }}>{hall.name}</p>
                      <p className="text-white/25 truncate" style={{ fontSize: "0.58rem" }}>{hall.seats} seats</p>
                    </div>
                  </div>

                  {/* Timeline row */}
                  <div
                    data-hall={hall.id}
                    className="relative flex-shrink-0 cursor-crosshair"
                    style={{
                      width: totalW,
                      height: ROW_H,
                      backgroundColor: isOver ? "rgba(232,25,44,0.03)" : "transparent",
                      transition: "background-color 0.15s",
                    }}
                  >
                    {/* Hour grid lines */}
                    {hours.map(min => (
                      <div key={min} className="absolute top-0 bottom-0 w-px" style={{ left: (min - START_MIN) * zoom, backgroundColor: "rgba(255,255,255,0.04)" }} />
                    ))}
                    {/* 30-min lines */}
                    {halfHours.filter(m => m % 60 !== 0).map(min => (
                      <div key={min} className="absolute top-1/4 bottom-1/4 w-px" style={{ left: (min - START_MIN) * zoom, backgroundColor: "rgba(255,255,255,0.025)" }} />
                    ))}

                    {/* Off-hours shading */}
                    {/* Before 10:00 */}
                    <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 0, width: Math.max(0, (600 - START_MIN) * zoom), backgroundColor: "rgba(0,0,0,0.12)" }} />
                    {/* After 22:00 */}
                    <div className="absolute top-0 bottom-0 right-0 pointer-events-none" style={{ left: (1320 - START_MIN) * zoom, backgroundColor: "rgba(139,92,246,0.05)" }} />

                    {/* Current time line */}
                    {showNow && (
                      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: nowX, width: 2, backgroundColor: "#e8192c", opacity: 0.6, zIndex: 5 }} />
                    )}

                    {/* Drag hover row highlight */}
                    {isOver && (
                      <div className="absolute inset-0 pointer-events-none rounded-none" style={{ border: "1px dashed rgba(232,25,44,0.3)", zIndex: 1 }} />
                    )}

                    {/* Drag preview ghost */}
                    {dragPreview && dragPreview.hallId === hall.id && (() => {
                      const mc = getMovieColor(dragPreview.movieId, movies);
                      const gLeft = Math.max(0, (dragPreview.startMin - START_MIN) * zoom);
                      const gWidth = Math.max(4, dragPreview.durationMin * zoom - 3);
                      return (
                        <div
                          className="absolute top-1.5 rounded-xl pointer-events-none"
                          style={{ left: gLeft, width: gWidth, height: ROW_H - 12, backgroundColor: mc.bg, border: `2px dashed ${mc.border}`, opacity: 0.75, zIndex: 8 }}
                        >
                          <div className="h-full flex items-center justify-center">
                            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: mc.text, opacity: 0.8 }}>
                              {formatMin(dragPreview.startMin)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Showtime blocks */}
                    {hallShowtimes.map(st => (
                      <div key={st.id} data-block="1">
                        <ShowtimeBlock
                          st={st}
                          movie={movies.find(m => m.id === st.movieId)}
                          isConflict={conflictIds.has(st.id)}
                          zoom={zoom}
                          movies={movies}
                          draggingId={draggingId}
                          onDragStart={onBlockDragStart}
                          onDragEnd={onBlockDragEnd}
                          onClick={(e, st) => setPopup({ showtimeId: st.id, x: e.clientX, y: e.clientY })}
                        />
                      </div>
                    ))}

                    {/* Quick add hint on hover */}
                    <div className="absolute inset-y-0 right-2 flex items-center opacity-0 hover:opacity-0 pointer-events-none" style={{ zIndex: 1 }}>
                      <span className="text-white/10" style={{ fontSize: "0.6rem" }}>Click to add</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom padding */}
            <div style={{ height: 24 }} />
          </div>
        </div>

        {/* ── BOTTOM STATUS BAR ── */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 border-t"
          style={{ height: 38, backgroundColor: "#0c0c14", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-4">
            {[
              { label: `${stats.total} showtimes scheduled`, color: "rgba(255,255,255,0.3)" },
              { label: `${halls.length} halls active`, color: "rgba(255,255,255,0.25)" },
              { label: stats.conflicts > 0 ? `${stats.conflicts} conflicts need attention` : "No conflicts", color: stats.conflicts > 0 ? "#f59e0b" : "#10b981" },
            ].map(({ label, color }) => (
              <span key={label} style={{ fontSize: "0.65rem", fontWeight: 500, color }}>{label}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/20" style={{ fontSize: "0.62rem" }}>08:00 – 00:00</span>
            <span className="text-white/15" style={{ fontSize: "0.62rem" }}>Zoom: {zoom}× · {(END_MIN - START_MIN) * zoom}px/16h</span>
          </div>
        </div>
      </div>

      {/* ══ FLOATING "+" FAB ══ */}
      <button
        onClick={() => setAddModal({})}
        className="fixed z-50 flex items-center justify-center rounded-2xl text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
        style={{
          bottom: 60, right: 24, width: 52, height: 52,
          background: "linear-gradient(135deg,#e8192c,#c8111f)",
          boxShadow: "0 8px 32px rgba(232,25,44,0.5), 0 0 0 4px rgba(232,25,44,0.12)",
        }}
      >
        <Plus size={22} />
      </button>

      {/* ══ MODALS ══ */}
      {(addModal || editTarget) && (
        <AddShowtimeModal
          defaultHallId={addModal?.hallId}
          defaultStartMin={addModal?.startMin}
          editShowtime={editTarget ?? undefined}
          editMovie={editTarget ? movies.find(m => m.id === editTarget.movieId) : undefined}
          movies={movies}
          halls={halls}
          onSave={handleSave}
          onClose={() => { setAddModal(null); setEditTarget(null); }}
        />
      )}

      {popup && (
        <BlockPopup
          showtimeId={popup.showtimeId}
          x={popup.x} y={popup.y}
          showtimes={visibleShowtimes}
          conflictIds={conflictIds}
          movies={movies}
          halls={halls}
          onEdit={st => { setEditTarget(st); setPopup(null); }}
          onDuplicate={st => { handleDuplicate(st); setPopup(null); }}
          onDelete={id => { handleDelete(id); setPopup(null); }}
          onClose={() => setPopup(null)}
        />
      )}

      {/* ══ TOAST ══ */}
      <div
        className="fixed bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 z-[500] transition-all duration-300 pointer-events-none"
        style={{
          backgroundColor: "rgba(15,15,24,0.97)", backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          opacity: toastOn ? 1 : 0,
          transform: toastOn ? "translate(-50%,0)" : "translate(-50%,14px)",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-white" />
        </div>
        <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}>{toast}</span>
      </div>

      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </div>
  );
}
