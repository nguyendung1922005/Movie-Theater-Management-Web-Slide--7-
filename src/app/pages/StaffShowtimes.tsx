/**
 * Screen 1 — Staff Showtime Grid
 * 7-day weekly calendar: rows = theater rooms, columns = hours (8 AM–midnight).
 * Showtime cards display: Movie Title, Time Range, Occupancy %.
 * Red accent highlights current/live showtimes.
 * "Create Showtime" modal includes real-time overlap detection.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Search, X, ChevronLeft, ChevronRight, Check,
  AlertTriangle, Users, Ticket, TrendingUp, Filter,
  ChevronDown, Clock, Eye, Edit2, Trash2, Copy,
} from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";

/* ══════════════════════════════════
   GRID CONSTANTS
══════════════════════════════════ */
const START_H    = 8;          // 8 AM
const END_H      = 24;         // midnight
const TOTAL_H    = END_H - START_H; // 16 hours
const START_MIN  = START_H * 60;
const END_MIN    = END_H   * 60;
const CELL_PX    = 90;         // px per hour
const PPM        = CELL_PX / 60;
const ROW_H      = 100;        // px per room row
const HEADER_H   = 48;         // px for hour labels row
const ROOM_COL   = 154;        // px for room label column
const GRID_W     = TOTAL_H * CELL_PX; // 1440px

/* ══════════════════════════════════
   TYPES
══════════════════════════════════ */
interface Showtime {
  id:            string;
  movieId:       string;
  hallId:        string;
  startMin:      number;
  durationMin:   number;
  format:        string;
  occupancyBase: number;
}

/* ══════════════════════════════════
   DATA — HALLS
══════════════════════════════════ */
const HALLS = [
  { id: "h1",    name: "Hall 1",      type: "Standard", seats: 120 },
  { id: "h2",    name: "Hall 2",      type: "Standard", seats: 100 },
  { id: "h3",    name: "Hall 3",      type: "Premium",  seats:  80 },
  { id: "imax",  name: "IMAX",        type: "IMAX",     seats:  60 },
  { id: "dolby", name: "Dolby Atmos", type: "Dolby",    seats:  70 },
];

const HALL_TYPES = ["All", "Standard", "Premium", "IMAX", "Dolby"];

/* ══════════════════════════════════
   DATA — MOVIES
══════════════════════════════════ */
const MOVIES = [
  { id: "your-name",    title: "Your Name",    dur: 106, color: "#e8192c", bg: "rgba(232,25,44,0.17)"   },
  { id: "neon-horizon", title: "Neon Horizon", dur: 138, color: "#3b82f6", bg: "rgba(59,130,246,0.17)"  },
  { id: "void-runner",  title: "Void Runner",  dur: 125, color: "#8b5cf6", bg: "rgba(139,92,246,0.17)"  },
  { id: "iron-legacy",  title: "Iron Legacy",  dur: 152, color: "#f97316", bg: "rgba(249,115,22,0.17)"  },
  { id: "code-black",   title: "Code Black",   dur: 122, color: "#06b6d4", bg: "rgba(6,182,212,0.17)"   },
  { id: "dark-hollow",  title: "Dark Hollow",  dur: 114, color: "#6366f1", bg: "rgba(99,102,241,0.17)"  },
];

/* ══════════════════════════════════
   DATA — SEED SHOWTIMES
   (same schedule repeated all 7 days,
    occupancy varies by day of week)
══════════════════════════════════ */
const BASE: Omit<Showtime, "id">[] = [
  // Hall 1
  { movieId:"your-name",    hallId:"h1",    startMin: 600, durationMin:106, format:"IMAX",  occupancyBase:92 },
  { movieId:"iron-legacy",  hallId:"h1",    startMin: 735, durationMin:152, format:"3D",    occupancyBase:75 },
  { movieId:"code-black",   hallId:"h1",    startMin: 930, durationMin:122, format:"Dolby", occupancyBase:68 },
  { movieId:"neon-horizon", hallId:"h1",    startMin:1100, durationMin:138, format:"IMAX",  occupancyBase:88 },
  { movieId:"dark-hollow",  hallId:"h1",    startMin:1295, durationMin:114, format:"2D",    occupancyBase:55 },
  // Hall 2
  { movieId:"void-runner",  hallId:"h2",    startMin: 540, durationMin:125, format:"4DX",   occupancyBase:82 },
  { movieId:"dark-hollow",  hallId:"h2",    startMin: 700, durationMin:114, format:"2D",    occupancyBase:61 },
  { movieId:"your-name",    hallId:"h2",    startMin: 870, durationMin:106, format:"IMAX",  occupancyBase:94 },
  { movieId:"iron-legacy",  hallId:"h2",    startMin:1030, durationMin:152, format:"3D",    occupancyBase:72 },
  { movieId:"code-black",   hallId:"h2",    startMin:1250, durationMin:122, format:"Dolby", occupancyBase:58 },
  // Hall 3
  { movieId:"neon-horizon", hallId:"h3",    startMin: 600, durationMin:138, format:"4DX",   occupancyBase:88 },
  { movieId:"your-name",    hallId:"h3",    startMin: 795, durationMin:106, format:"IMAX",  occupancyBase:96 },
  { movieId:"void-runner",  hallId:"h3",    startMin: 960, durationMin:125, format:"Dolby", occupancyBase:74 },
  { movieId:"code-black",   hallId:"h3",    startMin:1140, durationMin:122, format:"2D",    occupancyBase:65 },
  // IMAX
  { movieId:"your-name",    hallId:"imax",  startMin: 660, durationMin:106, format:"IMAX",  occupancyBase:98 },
  { movieId:"void-runner",  hallId:"imax",  startMin: 855, durationMin:125, format:"IMAX",  occupancyBase:91 },
  { movieId:"neon-horizon", hallId:"imax",  startMin:1050, durationMin:138, format:"IMAX",  occupancyBase:85 },
  { movieId:"dark-hollow",  hallId:"imax",  startMin:1260, durationMin:114, format:"IMAX",  occupancyBase:62 },
  // Dolby
  { movieId:"code-black",   hallId:"dolby", startMin: 570, durationMin:122, format:"Dolby", occupancyBase:78 },
  { movieId:"iron-legacy",  hallId:"dolby", startMin: 735, durationMin:152, format:"Dolby", occupancyBase:84 },
  { movieId:"dark-hollow",  hallId:"dolby", startMin: 945, durationMin:114, format:"Dolby", occupancyBase:57 },
  { movieId:"neon-horizon", hallId:"dolby", startMin:1110, durationMin:138, format:"Dolby", occupancyBase:79 },
  { movieId:"your-name",    hallId:"dolby", startMin:1310, durationMin:106, format:"Dolby", occupancyBase:72 },
];

// Occupancy multiplier per day-of-week (0=Mon … 6=Sun)
const OCC_MULT = [0.82, 0.78, 0.86, 0.91, 1.0, 1.22, 1.16];

function buildDay(dayIdx: number): Showtime[] {
  return BASE.map((b, i) => ({
    ...b,
    id: `d${dayIdx}-s${String(i).padStart(2,"0")}`,
    occupancyBase: b.occupancyBase,
  }));
}

// Today is Friday May 8 2026 (dayIdx=0 is the Mon of that week → May 5)
const WEEK_START = new Date(2026, 4, 4); // Mon May 4

function weekDay(offset: number) {
  const d = new Date(WEEK_START);
  d.setDate(WEEK_START.getDate() + offset);
  return d;
}

const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
// Today is Friday = offset 4 in the Mon-based week
const TODAY_IDX = 4;

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function fmtMin(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

function occColor(pct: number) {
  if (pct >= 90) return SC.red;
  if (pct >= 70) return SC.amber;
  return SC.green;
}

function getOcc(base: number, dayIdx: number) {
  return Math.min(100, Math.round(base * OCC_MULT[dayIdx]));
}

function detectOverlap(
  showtimes: Showtime[],
  hallId: string, startMin: number, durationMin: number,
  excludeId?: string,
): Showtime | null {
  for (const st of showtimes) {
    if (st.hallId !== hallId) continue;
    if (excludeId && st.id === excludeId) continue;
    if (startMin < st.startMin + st.durationMin && startMin + durationMin > st.startMin) return st;
  }
  return null;
}

/* ══════════════════════════════════
   CREATE SHOWTIME MODAL
══════════════════════════════════ */
function CreateModal({
  onClose, onSave, showtimes,
}: {
  onClose: () => void;
  onSave:  (st: Showtime) => void;
  showtimes: Showtime[];
}) {
  const [movieId,  setMovieId]  = useState(MOVIES[0].id);
  const [hallId,   setHallId]   = useState(HALLS[0].id);
  const [startStr, setStartStr] = useState("10:00");
  const [durStr,   setDurStr]   = useState(String(MOVIES[0].dur));
  const [fmt,      setFmt]      = useState("IMAX");
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  // auto-fill duration from selected movie
  useEffect(() => {
    const m = MOVIES.find(m => m.id === movieId);
    if (m) setDurStr(String(m.dur));
  }, [movieId]);

  const strToMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const startMin = strToMin(startStr);
  const durMin   = parseInt(durStr) || 90;
  const conflict = detectOverlap(showtimes, hallId, startMin, durMin);
  const cfMovie  = conflict ? MOVIES.find(m => m.id === conflict.movieId) : null;
  const selMovie = MOVIES.find(m => m.id === movieId)!;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 650));
    onSave({
      id: "new-" + Math.random().toString(36).slice(2,8),
      movieId, hallId,
      startMin, durationMin: durMin,
      format: fmt,
      occupancyBase: 0,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full rounded-3xl border overflow-hidden"
        style={{
          maxWidth: 580,
          backgroundColor: "#0d0d18",
          borderColor: SC.borderHi,
          boxShadow: "0 0 0 1px rgba(232,25,44,0.12), 0 40px 100px rgba(0,0,0,0.9)",
          animation: "sfModalIn .3s cubic-bezier(.34,1.4,.64,1) forwards",
        }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.25)` }}>
              <Plus size={16} style={{ color: SC.red }} />
            </div>
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>New Showtime</h2>
              <p style={{ fontSize: "0.7rem", color: SC.dim }}>Schedule a screening · {DAY_LABELS[TODAY_IDX]}, May {weekDay(TODAY_IDX).getDate()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/30 hover:text-white/70 transition-all"
            style={{ borderColor: SC.border }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: "60vh" }}>

          {/* Movie grid */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Select Movie</label>
            <div className="grid grid-cols-3 gap-2">
              {MOVIES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMovieId(m.id)}
                  className="flex flex-col items-start gap-1.5 px-3 py-2.5 rounded-xl border text-left transition-all"
                  style={{
                    backgroundColor: movieId === m.id ? `${m.color}18` : "rgba(255,255,255,0.02)",
                    borderColor:     movieId === m.id ? `${m.color}55` : SC.border,
                    boxShadow:       movieId === m.id ? `0 0 0 1px ${m.color}28` : "none",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: m.color, boxShadow: movieId === m.id ? `0 0 6px ${m.color}` : "none" }}
                  />
                  <span className="text-white w-full truncate" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{m.title}</span>
                  <span style={{ fontSize: "0.6rem", color: movieId === m.id ? m.color : SC.dim }}>{m.dur}m</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hall selector */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Hall / Room</label>
            <div className="flex flex-wrap gap-2">
              {HALLS.map(h => (
                <button
                  key={h.id}
                  onClick={() => setHallId(h.id)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all"
                  style={{
                    backgroundColor: hallId === h.id ? SC.redSoft : "rgba(255,255,255,0.02)",
                    borderColor:     hallId === h.id ? "rgba(232,25,44,0.38)" : SC.border,
                    color:           hallId === h.id ? SC.red : SC.muted,
                    fontSize: "0.78rem", fontWeight: hallId === h.id ? 700 : 500,
                  }}
                >
                  {h.name}
                  <span style={{ fontSize: "0.6rem", opacity: 0.55 }}>{h.seats}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Start Time</label>
              <input
                type="time"
                value={startStr}
                onChange={e => setStartStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none [color-scheme:dark]"
                style={{
                  border: `1.5px solid ${conflict ? "rgba(245,158,11,0.55)" : "rgba(255,255,255,0.1)"}`,
                  fontSize: "0.9rem",
                  transition: "border-color .15s",
                }}
              />
            </div>
            <div>
              <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Duration (min)</label>
              <input
                type="number"
                value={durStr}
                onChange={e => setDurStr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none"
                style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(232,25,44,0.5)"; }}
                onBlur={e =>  { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          </div>

          {/* End time preview */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${SC.border}` }}>
            <Clock size={13} style={{ color: SC.dim }} />
            <span style={{ fontSize: "0.78rem", color: SC.muted }}>
              Screening: <strong className="text-white">{fmtMin(startMin)}</strong>
              {" "}→{" "}
              <strong className="text-white">{fmtMin(startMin + durMin)}</strong>
              <span style={{ color: SC.dim }}> ({durMin}m)</span>
            </span>
          </div>

          {/* Format */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Format</label>
            <div className="flex gap-2 flex-wrap">
              {["IMAX","4DX","Dolby","3D","2D"].map(f => (
                <button
                  key={f}
                  onClick={() => setFmt(f)}
                  className="px-3.5 py-1.5 rounded-xl border transition-all"
                  style={{
                    fontSize: "0.72rem", fontWeight: fmt === f ? 800 : 500,
                    backgroundColor: fmt === f ? SC.redSoft : "rgba(255,255,255,0.02)",
                    borderColor: fmt === f ? "rgba(232,25,44,0.4)" : SC.border,
                    color: fmt === f ? SC.red : SC.muted,
                  }}
                >
                  {fmt === f && <Check size={9} className="inline mr-1" />}{f}
                </button>
              ))}
            </div>
          </div>

          {/* Overlap warning */}
          {conflict && cfMovie && (
            <div
              className="flex items-start gap-3 px-4 py-4 rounded-2xl border"
              style={{
                backgroundColor: "rgba(245,158,11,0.07)",
                borderColor: "rgba(245,158,11,0.28)",
                animation: "sfFadeIn .2s both",
              }}
            >
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: SC.amber }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.83rem", color: SC.amber }}>Scheduling Conflict Detected</p>
                <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.6 }}>
                  <strong style={{ color: "rgba(255,255,255,0.85)" }}>{HALLS.find(h=>h.id===hallId)?.name}</strong> is already booked
                  for{" "}<strong style={{ color: cfMovie.color }}>{cfMovie.title}</strong>{" "}
                  from{" "}<strong className="text-white">{fmtMin(conflict.startMin)}</strong> to{" "}
                  <strong className="text-white">{fmtMin(conflict.startMin + conflict.durationMin)}</strong>.
                  Please choose a different time or hall.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.01)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border text-white/35 hover:text-white/70 transition-all"
            style={{ fontSize: "0.82rem", fontWeight: 600, borderColor: SC.border }}
          >Cancel</button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60 transition-all"
            style={{
              background: conflict
                ? "linear-gradient(135deg,#f59e0b,#d97706)"
                : "linear-gradient(135deg,#e8192c,#c8111f)",
              fontSize: "0.82rem", fontWeight: 800,
              boxShadow: conflict
                ? "0 6px 20px rgba(245,158,11,0.35)"
                : "0 6px 20px rgba(232,25,44,0.38)",
            }}
          >
            {saving ? "Saving…" : conflict
              ? <><AlertTriangle size={13} /> Save with Conflict</>
              : <><Check size={13} /> Add Showtime</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SHOWTIME BLOCK
══════════════════════════════════ */
function ShowtimeBlock({
  st, dayIdx, isNow,
  onActionClick,
}: {
  st:       Showtime;
  dayIdx:   number;
  isNow:    boolean;
  onActionClick: (e: React.MouseEvent, st: Showtime) => void;
}) {
  const movie = MOVIES.find(m => m.id === st.movieId)!;
  const occ   = getOcc(st.occupancyBase, dayIdx);
  const oc    = occColor(occ);
  const left  = (st.startMin - START_MIN) * PPM;
  const width = Math.max(4, st.durationMin * PPM - 3);
  const endMin = st.startMin + st.durationMin;
  const wide   = width >= 160;
  const medium = width >= 90;

  return (
    <div
      className="absolute top-1.5 rounded-xl overflow-hidden cursor-pointer group/blk select-none"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        height: ROW_H - 12,
        backgroundColor: movie.bg,
        border: `1.5px solid ${isNow ? movie.color : movie.color + "70"}`,
        boxShadow: isNow
          ? `0 0 0 1px ${movie.color}55, 0 4px 16px ${movie.color}35`
          : `0 2px 10px ${movie.color}20`,
        zIndex: 10,
        transition: "box-shadow .15s, border-color .15s",
      }}
      onClick={e => { e.stopPropagation(); onActionClick(e, st); }}
    >
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-0.5" style={{ backgroundColor: movie.color }} />

      {/* "LIVE" badge for current showtime */}
      {isNow && (
        <div
          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded flex items-center gap-1"
          style={{ backgroundColor: `${movie.color}22`, border: `1px solid ${movie.color}45`, animation: "sfPulse 2s ease-in-out infinite" }}
        >
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: movie.color }} />
          <span style={{ fontSize: "0.46rem", fontWeight: 900, letterSpacing: "0.1em", color: movie.color }}>LIVE</span>
        </div>
      )}

      <div className="relative h-full flex flex-col justify-between px-2 py-2 overflow-hidden">
        {medium && (
          <div className="flex-1 min-w-0 pr-1">
            <p className="truncate" style={{ fontWeight: 800, fontSize: "0.74rem", color: movie.color, lineHeight: 1.2 }}>
              {movie.title}
            </p>
            {wide && (
              <p className="truncate mt-0.5 text-white/40" style={{ fontSize: "0.58rem" }}>
                {st.format}
              </p>
            )}
          </div>
        )}

        {medium && (
          <div className="flex flex-col gap-1 mt-auto">
            {/* Time range */}
            <span className="text-white/55" style={{ fontSize: "0.57rem", fontWeight: 600 }}>
              {fmtMin(st.startMin)}–{fmtMin(endMin)}
            </span>

            {/* Occupancy bar */}
            {wide && (
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${occ}%`, backgroundColor: oc, boxShadow: `0 0 4px ${oc}80` }}
                  />
                </div>
                <span style={{ fontSize: "0.56rem", fontWeight: 800, color: oc, flexShrink: 0 }}>{occ}%</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover/blk:bg-black/20 transition-colors rounded-xl" />
    </div>
  );
}

/* ══════════════════════════════════
   BLOCK ACTION POPUP
══════════════════════════════════ */
function BlockPopup({
  st, dayIdx, x, y, onClose, onDelete,
}: {
  st:       Showtime;
  dayIdx:   number;
  x:        number;
  y:        number;
  onClose:  () => void;
  onDelete: (id: string) => void;
}) {
  const movie = MOVIES.find(m => m.id === st.movieId)!;
  const hall  = HALLS.find(h => h.id === st.hallId)!;
  const occ   = getOcc(st.occupancyBase, dayIdx);
  const oc    = occColor(occ);

  const popW = 230, popH = 240;
  const px = x + popW > window.innerWidth  ? x - popW - 8 : x + 10;
  const py = y + popH > window.innerHeight ? y - popH - 8 : y + 10;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!(e.target as Element).closest("[data-blkpop]")) onClose(); };
    setTimeout(() => window.addEventListener("mousedown", h), 50);
    return () => window.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div
      data-blkpop="1"
      className="fixed z-[400] rounded-2xl border overflow-hidden"
      style={{
        top: py, left: px, width: popW,
        backgroundColor: "#0f0f1c",
        borderColor: SC.borderHi,
        boxShadow: `0 0 0 1px ${movie.color}25, 0 20px 60px rgba(0,0,0,0.8)`,
        animation: "sfPanelIn .2s cubic-bezier(.34,1.4,.64,1) both",
      }}
    >
      <div className="h-0.5" style={{ background: `linear-gradient(90deg,transparent,${movie.color},transparent)` }} />

      <div className="px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.85rem" }}>{movie.title}</p>
        <p style={{ fontSize: "0.68rem", color: SC.dim, marginTop: 1 }}>
          {hall.name} · {st.format} · {fmtMin(st.startMin)}–{fmtMin(st.startMin + st.durationMin)}
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: `${occ}%`, backgroundColor: oc }} />
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: oc }}>{occ}% full</span>
        </div>
      </div>

      <div className="p-2">
        {[
          { icon: Eye,    label: "View Details",    color: SC.blue   },
          { icon: Edit2,  label: "Edit Showtime",   color: SC.purple },
          { icon: Copy,   label: "Duplicate",       color: SC.cyan   },
          { icon: Trash2, label: "Delete",          color: SC.red    },
        ].map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => { if (label === "Delete") onDelete(st.id); onClose(); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all hover:bg-white/[0.04]"
            style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
          >
            <span style={{ color }}><Icon size={13} /></span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export function StaffShowtimes() {
  const [selectedDay,  setSelectedDay]  = useState(TODAY_IDX);
  const [showtimes,    setShowtimes]    = useState<Showtime[]>(() =>
    buildDay(TODAY_IDX)
  );
  const [modalOpen,    setModalOpen]    = useState(false);
  const [popup,        setPopup]        = useState<{ st: Showtime; x: number; y: number } | null>(null);
  const [movieFilter,  setMovieFilter]  = useState("");
  const [movieSearch,  setMovieSearch]  = useState("");
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [roomType,     setRoomType]     = useState("All");
  const [roomTypeOpen, setRoomTypeOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  // Re-build showtimes when day changes
  useEffect(() => {
    setShowtimes(buildDay(selectedDay));
    setPopup(null);
  }, [selectedDay]);

  // Real current time indicator
  const now       = new Date();
  const nowMin    = now.getHours() * 60 + now.getMinutes();
  const showNow   = selectedDay === TODAY_IDX && nowMin >= START_MIN && nowMin < END_MIN;
  const nowX      = (nowMin - START_MIN) * PPM;

  // Filtered halls
  const visibleHalls = useMemo(() =>
    roomType === "All" ? HALLS : HALLS.filter(h => h.type === roomType),
    [roomType]
  );

  // Filtered showtimes
  const filteredSTs = useMemo(() =>
    showtimes.filter(st => {
      if (movieFilter && st.movieId !== movieFilter) return false;
      if (roomType !== "All" && !visibleHalls.find(h => h.id === st.hallId)) return false;
      return true;
    }),
    [showtimes, movieFilter, roomType, visibleHalls]
  );

  // Stats
  const totalTickets = useMemo(() =>
    filteredSTs.reduce((sum, st) => {
      const hall = HALLS.find(h => h.id === st.hallId);
      if (!hall) return sum;
      return sum + Math.round(hall.seats * getOcc(st.occupancyBase, selectedDay) / 100);
    }, 0),
    [filteredSTs, selectedDay]
  );
  const avgOcc = useMemo(() => {
    if (!filteredSTs.length) return 0;
    return Math.round(filteredSTs.reduce((s, st) => s + getOcc(st.occupancyBase, selectedDay), 0) / filteredSTs.length);
  }, [filteredSTs, selectedDay]);

  const liveCount = useMemo(() =>
    selectedDay === TODAY_IDX
      ? filteredSTs.filter(st => nowMin >= st.startMin && nowMin < st.startMin + st.durationMin).length
      : 0,
    [filteredSTs, selectedDay, nowMin]
  );

  // Typeahead suggestions
  const suggestions = useMemo(() =>
    movieSearch === ""
      ? []
      : MOVIES.filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase())),
    [movieSearch]
  );

  const handleBlockClick = (e: React.MouseEvent, st: Showtime) => {
    setPopup({ st, x: e.clientX, y: e.clientY });
  };

  const handleDeleteST = (id: string) => {
    setShowtimes(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveNew = (st: Showtime) => {
    setShowtimes(prev => [...prev, st]);
  };

  const hourLabels = Array.from({ length: TOTAL_H + 1 }, (_, i) => {
    const h = START_H + i;
    if (h === 0 || h === 24) return "12 AM";
    if (h === 12) return "12 PM";
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  });

  return (
    <StaffRouteGuard allow={["general_staff"]}>
    <StaffPage
      noPadding
      title="Showtime Grid"
      subtitle={`Weekly schedule · ${visibleHalls.length} rooms · ${filteredSTs.length} screenings`}
      actions={
        <>
          {/* Room type filter */}
          <div className="relative">
            <button
              onClick={() => setRoomTypeOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 h-9 rounded-xl border transition-all"
              style={{
                borderColor: roomType !== "All" ? "rgba(232,25,44,0.35)" : SC.border,
                backgroundColor: roomType !== "All" ? SC.redSoft : "rgba(255,255,255,0.03)",
                color: roomType !== "All" ? SC.red : SC.muted,
                fontSize: "0.78rem", fontWeight: 600,
              }}
            >
              <Filter size={13} />
              {roomType === "All" ? "All Rooms" : roomType}
              <ChevronDown size={12} />
            </button>
            {roomTypeOpen && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setRoomTypeOpen(false)} />
                <div
                  className="absolute top-full right-0 mt-1 rounded-2xl border overflow-hidden z-[101]"
                  style={{ width: 160, backgroundColor: "#0e0e1c", borderColor: SC.borderHi, boxShadow: "0 16px 48px rgba(0,0,0,0.8)", animation: "sfPanelIn .2s both" }}
                >
                  {HALL_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => { setRoomType(t); setRoomTypeOpen(false); }}
                      className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                      style={{ fontSize: "0.8rem", color: roomType === t ? SC.red : SC.muted, fontWeight: roomType === t ? 700 : 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      {t}
                      {roomType === t && <Check size={12} style={{ color: SC.red }} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Movie typeahead */}
          <div className="relative" style={{ width: 220 }}>
            <div
              className="flex items-center gap-2 px-3 h-9 rounded-xl border transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: movieSearch || movieFilter ? "rgba(255,255,255,0.15)" : SC.border,
              }}
            >
              <Search size={13} style={{ color: SC.dim, flexShrink: 0 }} />
              <input
                value={movieSearch}
                onChange={e => { setMovieSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Filter by movie title…"
                className="flex-1 bg-transparent text-white outline-none"
                style={{ fontSize: "0.8rem", caretColor: SC.red }}
              />
              {(movieSearch || movieFilter) && (
                <button onClick={() => { setMovieSearch(""); setMovieFilter(""); setSearchOpen(false); }}>
                  <X size={12} style={{ color: SC.dim }} />
                </button>
              )}
            </div>
            {searchOpen && suggestions.length > 0 && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setSearchOpen(false)} />
                <div
                  className="absolute top-full left-0 right-0 mt-1 rounded-2xl border overflow-hidden z-[101]"
                  style={{ backgroundColor: "#0e0e1c", borderColor: SC.borderHi, boxShadow: "0 16px 48px rgba(0,0,0,0.8)", animation: "sfPanelIn .18s both" }}
                >
                  {suggestions.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setMovieFilter(m.id); setMovieSearch(m.title); setSearchOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/[0.04] transition-colors text-left"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{m.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* New showtime button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-xl text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#e8192c,#c8111f)",
              fontSize: "0.82rem", fontWeight: 800,
              boxShadow: "0 4px 16px rgba(232,25,44,0.38)",
            }}
          >
            <Plus size={15} /> New Showtime
          </button>
        </>
      }
    >
      {/* ── BODY ── */}
      <div style={{ backgroundColor: SC.bg, minHeight: "calc(100vh - 128px)" }}>

        {/* ── STATS ROW ── */}
        <div
          className="flex items-center gap-4 px-8 py-4 border-b overflow-x-auto"
          style={{ borderColor: SC.border, scrollbarWidth: "none" }}
        >
          {[
            { label: "Total Screenings", value: filteredSTs.length, color: SC.blue,   icon: <Ticket size={14} /> },
            { label: "Tickets Sold",     value: totalTickets.toLocaleString(), color: SC.green, icon: <Users size={14} /> },
            { label: "Avg Occupancy",    value: `${avgOcc}%`,       color: avgOcc >= 90 ? SC.red : avgOcc >= 70 ? SC.amber : SC.green, icon: <TrendingUp size={14} /> },
            { label: "Live Now",         value: liveCount,          color: SC.red,    icon: <Clock size={14} /> },
          ].map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl flex-shrink-0"
              style={{ backgroundColor: SC.card, border: `1px solid ${SC.border}` }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}16`, color }}>
                {icon}
              </div>
              <div>
                <p className="text-white" style={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: "0.62rem", color: SC.dim, marginTop: 2 }}>{label}</p>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="ml-auto flex items-center gap-4 flex-shrink-0">
            {[
              { label: "< 70%",  color: SC.green },
              { label: "70–90%", color: SC.amber },
              { label: "> 90%",  color: SC.red   },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span style={{ fontSize: "0.65rem", color: SC.muted }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7-DAY TABS ── */}
        <div
          className="flex items-center gap-0 border-b px-8 overflow-x-auto"
          style={{ borderColor: SC.border, scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setSelectedDay(d => Math.max(0, d - 1))}
            className="w-8 h-8 rounded-xl mr-2 flex items-center justify-center flex-shrink-0 text-white/30 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {DAY_LABELS.map((day, i) => {
            const date  = weekDay(i);
            const isSel = i === selectedDay;
            const isTod = i === TODAY_IDX;
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className="relative flex flex-col items-center px-5 py-3.5 flex-shrink-0 transition-all"
                style={{ minWidth: 80 }}
              >
                <span style={{
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isSel ? SC.red : isTod ? "rgba(255,255,255,0.7)" : SC.dim,
                  marginBottom: 4,
                }}>
                  {day}
                </span>
                <span style={{
                  fontSize: "1.1rem", fontWeight: isSel ? 800 : 500,
                  color: isSel ? "#ffffff" : isTod ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                }}>
                  {date.getDate()}
                </span>
                {/* Activity dots */}
                <div className="flex gap-0.5 mt-1.5">
                  {[0,1,2,3].map(d => (
                    <span
                      key={d}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: isSel ? SC.red : "rgba(255,255,255,0.12)" }}
                    />
                  ))}
                </div>
                {/* Active indicator */}
                {isSel && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
                    style={{ width: 32, height: "2.5px", backgroundColor: SC.red }}
                  />
                )}
                {/* Today badge */}
                {isTod && !isSel && (
                  <span
                    className="absolute top-2 right-3 px-1.5 py-0.5 rounded"
                    style={{ fontSize: "0.44rem", fontWeight: 800, backgroundColor: SC.redSoft, color: SC.red, letterSpacing: "0.08em" }}
                  >TODAY</span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setSelectedDay(d => Math.min(6, d + 1))}
            className="w-8 h-8 rounded-xl ml-2 flex items-center justify-center flex-shrink-0 text-white/30 hover:text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── CALENDAR GRID ── */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.07) transparent" }} ref={gridRef}>
          <div style={{ minWidth: ROOM_COL + GRID_W + 32, padding: "0 32px 32px" }}>

            {/* Hour header row */}
            <div className="flex" style={{ marginLeft: ROOM_COL, height: HEADER_H, position: "sticky", top: 0, zIndex: 20, backgroundColor: SC.bg }}>
              {Array.from({ length: TOTAL_H }, (_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-end pb-2 border-l"
                  style={{ width: CELL_PX, borderColor: "rgba(255,255,255,0.04)" }}
                >
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: SC.dim, paddingLeft: 6 }}>
                    {hourLabels[i]}
                  </span>
                </div>
              ))}
            </div>

            {/* Room rows */}
            <div className="flex flex-col">
              {visibleHalls.map((hall, hi) => {
                const hallSTs = filteredSTs.filter(s => s.hallId === hall.id);
                const isLast  = hi === visibleHalls.length - 1;

                return (
                  <div
                    key={hall.id}
                    className="flex"
                    style={{ borderBottom: isLast ? "none" : `1px solid rgba(255,255,255,0.04)` }}
                  >
                    {/* Room label */}
                    <div
                      className="flex-shrink-0 flex flex-col justify-center px-4 py-3 border-r sticky left-0 z-20"
                      style={{
                        width: ROOM_COL,
                        height: ROW_H,
                        backgroundColor: SC.bg,
                        borderColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <p className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem", letterSpacing: "-0.01em" }}>{hall.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-1.5 py-0.5 rounded"
                          style={{
                            fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.1em",
                            backgroundColor: hall.type === "IMAX" ? "rgba(232,25,44,0.12)"
                              : hall.type === "Dolby" ? "rgba(249,115,22,0.12)"
                              : hall.type === "Premium" ? "rgba(139,92,246,0.12)"
                              : "rgba(255,255,255,0.07)",
                            color: hall.type === "IMAX" ? SC.red
                              : hall.type === "Dolby" ? SC.orange
                              : hall.type === "Premium" ? SC.purple
                              : SC.dim,
                          }}
                        >{hall.type}</span>
                        <span style={{ fontSize: "0.6rem", color: SC.dim }}>{hall.seats} seats</span>
                      </div>
                    </div>

                    {/* Time slots */}
                    <div
                      className="relative flex-1"
                      style={{ height: ROW_H, width: GRID_W }}
                    >
                      {/* Hour grid lines */}
                      {Array.from({ length: TOTAL_H }, (_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l"
                          style={{ left: i * CELL_PX, borderColor: "rgba(255,255,255,0.04)" }}
                        />
                      ))}

                      {/* Half-hour ticks */}
                      {Array.from({ length: TOTAL_H }, (_, i) => (
                        <div
                          key={`h-${i}`}
                          className="absolute border-l"
                          style={{
                            left: i * CELL_PX + CELL_PX / 2,
                            top: "60%", bottom: 0,
                            borderColor: "rgba(255,255,255,0.025)",
                            borderStyle: "dashed",
                          }}
                        />
                      ))}

                      {/* Current time indicator */}
                      {showNow && (
                        <div
                          className="absolute top-0 bottom-0 z-30 pointer-events-none"
                          style={{ left: nowX, width: 1.5, backgroundColor: SC.red, boxShadow: `0 0 8px ${SC.red}` }}
                        />
                      )}

                      {/* Showtime blocks */}
                      {hallSTs.map(st => {
                        const isNow = selectedDay === TODAY_IDX &&
                          nowMin >= st.startMin && nowMin < st.startMin + st.durationMin;
                        return (
                          <ShowtimeBlock
                            key={st.id}
                            st={st}
                            dayIdx={selectedDay}
                            isNow={isNow}
                            onActionClick={handleBlockClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS / POPUPS ── */}
      {modalOpen && (
        <CreateModal
          onClose={() => setModalOpen(false)}
          onSave={handleSaveNew}
          showtimes={showtimes}
        />
      )}

      {popup && (
        <BlockPopup
          st={popup.st}
          dayIdx={selectedDay}
          x={popup.x}
          y={popup.y}
          onClose={() => setPopup(null)}
          onDelete={handleDeleteST}
        />
      )}
    </StaffPage>
    </StaffRouteGuard>
  );
}
