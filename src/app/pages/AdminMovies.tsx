import { useState, useRef, useCallback, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Plus, Search, ChevronDown, Edit2, Trash2, Eye,
  Upload, X, Check, Film, Star, AlertTriangle,
  Link as LinkIcon, Calendar, Clock, Tag, Users,
  ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal,
  Copy, TrendingUp, Zap, RefreshCw, Download, Filter,
  CheckSquare, Square, ArrowUpDown, Image as ImageIcon,
  Loader2, Clapperboard,
} from "lucide-react";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
type MovieStatus = "Showing" | "Coming Soon" | "Ending" | "Ended";
type MovieRating = "G" | "PG" | "PG-13" | "R";
type SortDir = "asc" | "desc" | null;

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  director: string;
  cast: string;
  duration: string;
  releaseDate: string;
  format: string[];
  rating: MovieRating;
  status: MovieStatus;
  trailerUrl: string;
  poster: string;
  revenue: number;
  tickets: number;
  occupancy: number;
}

/* ═══════════════════════════════════════
   SEED DATA
═══════════════════════════════════════ */
const SEED: Movie[] = [
  {
    id: "your-name",
    title: "Your Name",
    synopsis: "Two teenagers share a profound supernatural bond, discovering they are swapping bodies. They must find each other before a comet strikes.",
    genre: ["Animation", "Romance"],
    director: "Makoto Shinkai",
    cast: "Ryunosuke Kamiki, Mone Kamishiraishi",
    duration: "1h 46m",
    releaseDate: "2026-03-01",
    format: ["IMAX", "2D"],
    rating: "PG",
    status: "Showing",
    trailerUrl: "https://youtu.be/xU47nhruN-Q",
    poster: "https://images.unsplash.com/photo-1629058545686-f9acd8608d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 442,
    tickets: 5120,
    occupancy: 94,
  },
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    synopsis: "In a hyper-connected future city, a rogue AI begins rewriting human memories. One engineer is the last line of defense against total mind-collapse.",
    genre: ["Sci-Fi", "Action"],
    director: "James Cameron",
    cast: "Ryan Gosling, Zendaya, Oscar Isaac",
    duration: "2h 18m",
    releaseDate: "2026-02-14",
    format: ["4DX", "IMAX"],
    rating: "PG-13",
    status: "Showing",
    trailerUrl: "https://youtu.be/neon-horizon",
    poster: "https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 388,
    tickets: 4580,
    occupancy: 87,
  },
  {
    id: "void-runner",
    title: "Void Runner",
    synopsis: "A rescue crew ventures into the unknown reaches of deep space after receiving a distress signal from a colony ship thought long lost.",
    genre: ["Sci-Fi", "Adventure"],
    director: "Ridley Scott",
    cast: "Tom Hardy, Cate Blanchett, Pedro Pascal",
    duration: "2h 05m",
    releaseDate: "2026-01-28",
    format: ["IMAX", "4DX", "Dolby"],
    rating: "R",
    status: "Showing",
    trailerUrl: "https://youtu.be/void-runner",
    poster: "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 356,
    tickets: 4210,
    occupancy: 82,
  },
  {
    id: "iron-legacy",
    title: "Iron Legacy",
    synopsis: "An ancient warrior is resurrected in the modern world and must confront a new evil threatening to plunge civilization into darkness.",
    genre: ["Fantasy", "Action"],
    director: "Park Chan-wook",
    cast: "Takeshi Kitano, Ken Watanabe",
    duration: "2h 32m",
    releaseDate: "2026-02-01",
    format: ["3D", "Dolby"],
    rating: "R",
    status: "Showing",
    trailerUrl: "https://youtu.be/iron-legacy",
    poster: "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 298,
    tickets: 3490,
    occupancy: 73,
  },
  {
    id: "code-black",
    title: "Code Black",
    synopsis: "A brilliant detective tracks a ghost-like hacker across three continents in a deadly game of cat and mouse.",
    genre: ["Thriller", "Crime"],
    director: "Denis Villeneuve",
    cast: "Ana de Armas, Idris Elba, Florence Pugh",
    duration: "2h 02m",
    releaseDate: "2025-12-20",
    format: ["Dolby", "2D"],
    rating: "PG-13",
    status: "Showing",
    trailerUrl: "https://youtu.be/code-black",
    poster: "https://images.unsplash.com/photo-1641328824708-b9df9d9ab697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 265,
    tickets: 3080,
    occupancy: 68,
  },
  {
    id: "dark-hollow",
    title: "Dark Hollow",
    synopsis: "When a paranormal investigator enters an abandoned asylum, she discovers the line between the living and the dead is thinner than ever.",
    genre: ["Horror", "Thriller"],
    director: "Jordan Peele",
    cast: "Daniel Kaluuya, Tessa Thompson",
    duration: "1h 54m",
    releaseDate: "2025-10-31",
    format: ["2D"],
    rating: "R",
    status: "Ending",
    trailerUrl: "https://youtu.be/dark-hollow",
    poster: "https://images.unsplash.com/photo-1768121496378-0644c37e7fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 210,
    tickets: 2460,
    occupancy: 57,
  },
  {
    id: "iron-ascent",
    title: "Iron Ascent",
    synopsis: "In a world where machines have surpassed human capability, one engineer discovers a rogue AI with a secret that could change everything.",
    genre: ["Sci-Fi", "Action"],
    director: "Patty Jenkins",
    cast: "Chris Evans, Anya Taylor-Joy",
    duration: "2h 24m",
    releaseDate: "2026-03-15",
    format: ["IMAX", "4DX"],
    rating: "PG-13",
    status: "Coming Soon",
    trailerUrl: "https://youtu.be/iron-ascent",
    poster: "https://images.unsplash.com/photo-1759395162739-84190996783c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 0,
    tickets: 0,
    occupancy: 0,
  },
  {
    id: "ember-kingdom",
    title: "Ember Kingdom",
    synopsis: "A young fire mage journeys across a dying empire to relight the ancient flame that once held the kingdom together.",
    genre: ["Fantasy", "Adventure"],
    director: "Werner Herzog",
    cast: "Dev Patel, Jodie Comer",
    duration: "2h 18m",
    releaseDate: "2026-04-24",
    format: ["IMAX", "3D"],
    rating: "PG",
    status: "Coming Soon",
    trailerUrl: "https://youtu.be/ember-kingdom",
    poster: "https://images.unsplash.com/photo-1764562206914-78ab352f4658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    revenue: 0,
    tickets: 0,
    occupancy: 0,
  },
];

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const ALL_GENRES  = ["Action","Adventure","Animation","Crime","Drama","Fantasy","Horror","Romance","Sci-Fi","Thriller"];
const ALL_FORMATS = ["IMAX","4DX","Dolby","3D","2D"];
const ALL_RATINGS: MovieRating[] = ["G","PG","PG-13","R"];
const STATUSES: MovieStatus[]    = ["Showing","Coming Soon","Ending","Ended"];

const STATUS_STYLE: Record<string, { bg: string; border: string; color: string; dot: string }> = {
  "Showing":    { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", color: "#10b981", dot: "#10b981" },
  "Coming Soon":{ bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)", color: "#3b82f6", dot: "#3b82f6" },
  "Ending":     { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", color: "#f59e0b", dot: "#f59e0b" },
  "Ended":      { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", dot: "rgba(255,255,255,0.2)" },
};

const FORMAT_COLORS: Record<string, { bg: string; color: string }> = {
  IMAX:  { bg: "rgba(59,130,246,0.15)",   color: "#3b82f6" },
  "4DX": { bg: "rgba(245,158,11,0.15)",   color: "#f59e0b" },
  Dolby: { bg: "rgba(139,92,246,0.15)",   color: "#8b5cf6" },
  "3D":  { bg: "rgba(16,185,129,0.15)",   color: "#10b981" },
  "2D":  { bg: "rgba(255,255,255,0.07)",  color: "rgba(255,255,255,0.45)" },
};

const PAGE_SIZE = 6;

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE["Ended"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", ...s }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.dot }} />
      {status.toUpperCase()}
    </span>
  );
}

/* ═══════════════════════════════════════
   FORMAT PILLS
═══════════════════════════════════════ */
function FormatPills({ formats }: { formats: string[] }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {formats.map(f => {
        const fc = FORMAT_COLORS[f] ?? FORMAT_COLORS["2D"];
        return (
          <span
            key={f}
            className="px-1.5 py-0.5 rounded"
            style={{ fontSize: "0.55rem", fontWeight: 900, letterSpacing: "0.12em", backgroundColor: fc.bg, color: fc.color }}
          >
            {f}
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   SORT HEADER CELL
═══════════════════════════════════════ */
function SortTh({
  label, field, sortField, sortDir, onSort, className = "", style = {},
}: {
  label: string; field: string; sortField: string | null;
  sortDir: SortDir; onSort: (f: string) => void;
  className?: string; style?: React.CSSProperties;
}) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className={`py-3 text-left cursor-pointer select-none group ${className}`}
      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.13em", color: active ? "#e8192c" : "rgba(255,255,255,0.3)", textTransform: "uppercase", userSelect: "none", ...style }}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <span className="transition-opacity" style={{ opacity: active ? 1 : 0.3 }}>
          {active && sortDir === "asc" ? <ChevronUp size={11} /> : active && sortDir === "desc" ? <ChevronDown size={11} /> : <ArrowUpDown size={10} />}
        </span>
      </div>
    </th>
  );
}

/* ═══════════════════════════════════════
   IMAGE UPLOAD AREA
═══════════════════════════════════════ */
function PosterUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onChange(url);
  };
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>
          Movie Poster
        </label>
        <button
          type="button"
          onClick={() => setUrlMode(v => !v)}
          className="flex items-center gap-1 text-[#e8192c]/70 hover:text-[#e8192c] transition-colors"
          style={{ fontSize: "0.68rem", fontWeight: 600 }}
        >
          <LinkIcon size={10} /> {urlMode ? "Upload File" : "Use URL"}
        </button>
      </div>

      {urlMode ? (
        <div className="relative">
          <LinkIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); onChange(e.target.value); }}
            placeholder="https://example.com/poster.jpg"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
            style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.84rem" }}
            onFocus={e => (e.target.style.borderColor = "rgba(232,25,44,0.5)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col items-center justify-center"
          style={{
            border: `2px dashed ${dragging ? "#e8192c" : "rgba(255,255,255,0.12)"}`,
            backgroundColor: dragging ? "rgba(232,25,44,0.05)" : "rgba(255,255,255,0.02)",
            minHeight: "180px",
            boxShadow: dragging ? "0 0 0 4px rgba(232,25,44,0.1), inset 0 0 32px rgba(232,25,44,0.05)" : "none",
          }}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {value ? (
            /* Preview */
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img src={value} alt="Poster preview" className="max-h-44 max-w-full rounded-xl object-cover shadow-2xl" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }} />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onChange(""); setUrlInput(""); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#e8192c] transition-all"
              >
                <X size={13} />
              </button>
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                <span className="opacity-0 hover:opacity-100 text-white text-sm font-semibold transition-opacity flex items-center gap-2">
                  <Upload size={14} /> Change
                </span>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: dragging ? "rgba(232,25,44,0.15)" : "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.15)" }}
              >
                <ImageIcon size={24} className="text-white/20" />
              </div>
              <div>
                <p className="text-white/50" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  {dragging ? "Drop to upload" : "Drag & drop poster here"}
                </p>
                <p className="text-white/20 mt-0.5" style={{ fontSize: "0.7rem" }}>or click to browse · JPG, PNG, WebP · Max 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   FORM FIELD WRAPPER
═══════════════════════════════════════ */
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>
        {label}
        {required && <span className="text-[#e8192c]">*</span>}
      </label>
      {children}
      {hint && <p className="text-white/20" style={{ fontSize: "0.65rem" }}>{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all";
const inputStyle: React.CSSProperties = { border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.88rem" };
function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "rgba(232,25,44,0.55)";
  (e.target as HTMLElement).style.boxShadow = "0 0 0 3px rgba(232,25,44,0.07)";
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  (e.target as HTMLElement).style.boxShadow = "none";
}

/* ═══════════════════════════════════════
   FORMAT CHECKBOX GROUP
═══════════════════════════════════════ */
function FormatCheckboxes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (f: string) => onChange(value.includes(f) ? value.filter(x => x !== f) : [...value, f]);
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_FORMATS.map(f => {
        const on = value.includes(f);
        const fc = FORMAT_COLORS[f];
        return (
          <button
            key={f}
            type="button"
            onClick={() => toggle(f)}
            className="px-3 py-1.5 rounded-lg border transition-all duration-150"
            style={{
              fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em",
              backgroundColor: on ? fc.bg : "rgba(255,255,255,0.03)",
              borderColor: on ? fc.color + "60" : "rgba(255,255,255,0.1)",
              color: on ? fc.color : "rgba(255,255,255,0.3)",
            }}
          >
            {on && <Check size={10} className="inline mr-1" />}{f}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   GENRE CHECKBOX GROUP
═══════════════════════════════════════ */
function GenreCheckboxes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (g: string) => onChange(value.includes(g) ? value.filter(x => x !== g) : [...value, g]);
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_GENRES.map(g => {
        const on = value.includes(g);
        return (
          <button
            key={g}
            type="button"
            onClick={() => toggle(g)}
            className="px-3 py-1.5 rounded-full border transition-all"
            style={{
              fontSize: "0.72rem", fontWeight: 600,
              backgroundColor: on ? "rgba(232,25,44,0.12)" : "rgba(255,255,255,0.03)",
              borderColor: on ? "rgba(232,25,44,0.4)" : "rgba(255,255,255,0.1)",
              color: on ? "#e8192c" : "rgba(255,255,255,0.35)",
            }}
          >
            {on && <Check size={10} className="inline mr-1" />}{g}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   MOVIE FORM (shared Add/Edit)
═══════════════════════════════════════ */
const EMPTY_MOVIE: Omit<Movie, "id" | "revenue" | "tickets" | "occupancy"> = {
  title: "", synopsis: "", genre: [], director: "", cast: "",
  duration: "", releaseDate: "", format: [], rating: "PG",
  status: "Coming Soon", trailerUrl: "", poster: "",
};

interface MovieFormProps {
  initial: typeof EMPTY_MOVIE;
  onSave: (data: typeof EMPTY_MOVIE) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

function MovieForm({ initial, onSave, onCancel, mode }: MovieFormProps) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_MOVIE, string>>>({});
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"basic" | "media" | "screening">("basic");

  const set = <K extends keyof typeof EMPTY_MOVIE>(k: K, v: typeof EMPTY_MOVIE[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.synopsis.trim()) e.synopsis = "Synopsis is required";
    if (form.genre.length === 0) e.genre = "Select at least one genre";
    if (!form.duration.trim()) e.duration = "Duration is required";
    if (!form.releaseDate) e.releaseDate = "Release date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    onSave(form);
  };

  const SECTIONS = [
    { id: "basic", label: "Basic Info", icon: <Film size={13} /> },
    { id: "media", label: "Media", icon: <ImageIcon size={13} /> },
    { id: "screening", label: "Screening", icon: <Clapperboard size={13} /> },
  ] as const;

  return (
    <>
      {/* Section tabs */}
      <div className="flex border-b border-white/8 mb-6">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className="flex items-center gap-2 px-5 py-3 relative transition-colors"
            style={{
              fontSize: "0.78rem", fontWeight: 600,
              color: activeSection === s.id ? "#e8192c" : "rgba(255,255,255,0.35)",
            }}
          >
            {s.icon} {s.label}
            {activeSection === s.id && (
              <span className="absolute bottom-0 inset-x-3 h-0.5 rounded-t-full bg-[#e8192c]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-1 flex flex-col gap-5" style={{ maxHeight: "calc(75vh - 180px)" }}>

        {/* ── BASIC INFO ── */}
        {activeSection === "basic" && (
          <>
            <Field label="Movie Title" required>
              <input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="e.g. Your Name"
                className={inputCls}
                style={{ ...inputStyle, borderColor: errors.title ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                onFocus={focusBorder} onBlur={blurBorder}
              />
              {errors.title && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.title}</span>}
            </Field>

            <Field label="Synopsis" required>
              <textarea
                value={form.synopsis}
                onChange={e => set("synopsis", e.target.value)}
                placeholder="Describe the movie plot..."
                rows={4}
                className={inputCls + " resize-none"}
                style={{ ...inputStyle, borderColor: errors.synopsis ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(232,25,44,0.07)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
              <div className="flex items-center justify-between">
                {errors.synopsis && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.synopsis}</span>}
                <span className="ml-auto text-white/20" style={{ fontSize: "0.65rem" }}>{form.synopsis.length}/500</span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Director">
                <input
                  value={form.director}
                  onChange={e => set("director", e.target.value)}
                  placeholder="e.g. Makoto Shinkai"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </Field>
              <Field label="Age Rating" required>
                <select
                  value={form.rating}
                  onChange={e => set("rating", e.target.value as MovieRating)}
                  className={inputCls + " appearance-none cursor-pointer"}
                  style={{ ...inputStyle, backgroundImage: "none" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                >
                  {ALL_RATINGS.map(r => <option key={r} value={r} style={{ backgroundColor: "#0f0f18" }}>{r}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Cast" hint="Comma-separated list of main cast members">
              <input
                value={form.cast}
                onChange={e => set("cast", e.target.value)}
                placeholder="e.g. Ryan Gosling, Zendaya, Oscar Isaac"
                className={inputCls}
                style={inputStyle}
                onFocus={focusBorder} onBlur={blurBorder}
              />
            </Field>

            <Field label="Genres" required>
              <GenreCheckboxes value={form.genre} onChange={v => set("genre", v)} />
              {errors.genre && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.genre}</span>}
            </Field>
          </>
        )}

        {/* ── MEDIA ── */}
        {activeSection === "media" && (
          <>
            <PosterUpload value={form.poster} onChange={v => set("poster", v)} />

            <Field label="Trailer URL" hint="YouTube or Vimeo embed link">
              <div className="relative">
                <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={form.trailerUrl}
                  onChange={e => set("trailerUrl", e.target.value)}
                  placeholder="https://youtu.be/..."
                  className={inputCls}
                  style={{ ...inputStyle, paddingLeft: "2.75rem" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
              </div>
            </Field>

            {/* Trailer preview */}
            {form.trailerUrl && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8"
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#e8192c]/12 flex items-center justify-center">
                  <Film size={15} className="text-[#e8192c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 truncate" style={{ fontSize: "0.78rem" }}>{form.trailerUrl}</p>
                  <p className="text-white/25" style={{ fontSize: "0.65rem" }}>Trailer URL saved</p>
                </div>
                <Check size={14} className="text-[#10b981] flex-shrink-0" />
              </div>
            )}
          </>
        )}

        {/* ── SCREENING ── */}
        {activeSection === "screening" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration" required>
                <input
                  value={form.duration}
                  onChange={e => set("duration", e.target.value)}
                  placeholder="e.g. 2h 15m"
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.duration ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                {errors.duration && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.duration}</span>}
              </Field>

              <Field label="Release Date" required>
                <input
                  type="date"
                  value={form.releaseDate}
                  onChange={e => set("releaseDate", e.target.value)}
                  className={inputCls + " [color-scheme:dark]"}
                  style={{ ...inputStyle, borderColor: errors.releaseDate ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                {errors.releaseDate && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.releaseDate}</span>}
              </Field>
            </div>

            <Field label="Status">
              <div className="flex gap-2">
                {STATUSES.map(s => {
                  const on = form.status === s;
                  const ss = STATUS_STYLE[s] ?? STATUS_STYLE["Ended"];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all flex-1 justify-center"
                      style={{
                        backgroundColor: on ? ss.bg : "rgba(255,255,255,0.02)",
                        borderColor: on ? ss.border : "rgba(255,255,255,0.08)",
                        color: on ? ss.color : "rgba(255,255,255,0.35)",
                        fontSize: "0.75rem", fontWeight: on ? 700 : 500,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: on ? ss.dot : "rgba(255,255,255,0.2)" }} />
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Screening Formats">
              <FormatCheckboxes value={form.format} onChange={v => set("format", v)} />
            </Field>
          </>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   ADD / EDIT MODAL
═══════════════════════════════════════ */
function MovieModal({
  mode, movie, onSave, onClose,
}: {
  mode: "add" | "edit";
  movie?: Movie;
  onSave: (data: typeof EMPTY_MOVIE) => void;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"basic" | "media" | "screening">("basic");
  const [form, setForm] = useState<typeof EMPTY_MOVIE>(
    movie
      ? { title: movie.title, synopsis: movie.synopsis, genre: movie.genre, director: movie.director,
          cast: movie.cast, duration: movie.duration, releaseDate: movie.releaseDate,
          format: movie.format, rating: movie.rating, status: movie.status,
          trailerUrl: movie.trailerUrl, poster: movie.poster }
      : { ...EMPTY_MOVIE }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const set = <K extends keyof typeof EMPTY_MOVIE>(k: K, v: typeof EMPTY_MOVIE[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.synopsis.trim()) e.synopsis = "Synopsis is required";
    if (form.genre.length === 0) e.genre = "Select at least one genre";
    if (!form.duration.trim()) e.duration = "Duration is required";
    if (!form.releaseDate) e.releaseDate = "Release date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    onSave(form);
  };

  const SECTIONS = [
    { id: "basic",     label: "Basic Info",  icon: <Film size={13} /> },
    { id: "media",     label: "Media",       icon: <ImageIcon size={13} /> },
    { id: "screening", label: "Screening",   icon: <Clapperboard size={13} /> },
  ] as const;

  const hasError = (section: string) => {
    if (section === "basic") return !!(errors.title || errors.synopsis || errors.genre);
    if (section === "screening") return !!(errors.duration || errors.releaseDate);
    return false;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full flex flex-col rounded-3xl overflow-hidden border border-white/10"
        style={{
          maxWidth: "680px",
          maxHeight: "90vh",
          backgroundColor: "#0f0f18",
          boxShadow: "0 0 0 1px rgba(232,25,44,0.12), 0 40px 100px rgba(0,0,0,0.8)",
          animation: "modalIn 0.35s cubic-bezier(0.34,1.4,0.64,1) forwards",
        }}
      >
        {/* Red top accent */}
        <div className="h-0.5 flex-shrink-0" style={{ background: "linear-gradient(90deg, transparent, #e8192c 40%, transparent)" }} />

        {/* Modal header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 flex-shrink-0 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.2), rgba(232,25,44,0.08))", border: "1px solid rgba(232,25,44,0.25)" }}>
              <Film size={17} className="text-[#e8192c]" />
            </div>
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
                {mode === "add" ? "Add New Movie" : `Edit · ${movie?.title}`}
              </h2>
              <p className="text-white/30" style={{ fontSize: "0.7rem" }}>
                {mode === "add" ? "Fill in all required fields (*)" : "Update movie information below"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b border-white/8 flex-shrink-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className="flex items-center gap-2 px-6 py-3.5 relative transition-colors"
              style={{ fontSize: "0.78rem", fontWeight: 600, color: activeSection === s.id ? "#e8192c" : "rgba(255,255,255,0.35)" }}
            >
              {s.icon} {s.label}
              {hasError(s.id) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8192c] ml-0.5" />
              )}
              {activeSection === s.id && <span className="absolute bottom-0 inset-x-3 h-0.5 rounded-t-full bg-[#e8192c]" />}
            </button>
          ))}
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-5">
          {activeSection === "basic" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>
                  Movie Title <span className="text-[#e8192c]">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  placeholder="e.g. Your Name"
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.title ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                {errors.title && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.title}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>
                  Synopsis <span className="text-[#e8192c]">*</span>
                </label>
                <textarea
                  value={form.synopsis}
                  onChange={e => set("synopsis", e.target.value)}
                  placeholder="Describe the movie plot in detail..."
                  rows={4}
                  className={inputCls + " resize-none"}
                  style={{ ...inputStyle, borderColor: errors.synopsis ? "#e8192c" : "rgba(255,255,255,0.1)" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(232,25,44,0.07)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
                <div className="flex items-center justify-between">
                  {errors.synopsis && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.synopsis}</span>}
                  <span className="ml-auto text-white/20" style={{ fontSize: "0.65rem" }}>{form.synopsis.length}/500 chars</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Director</label>
                  <input value={form.director} onChange={e => set("director", e.target.value)} placeholder="e.g. Makoto Shinkai" className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Age Rating</label>
                  <select value={form.rating} onChange={e => set("rating", e.target.value as MovieRating)} className={inputCls + " appearance-none cursor-pointer"} style={{ ...inputStyle, backgroundImage: "none" }} onFocus={focusBorder} onBlur={blurBorder}>
                    {ALL_RATINGS.map(r => <option key={r} value={r} style={{ backgroundColor: "#0f0f18" }}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Cast <span className="text-white/20 normal-case font-normal ml-1" style={{ letterSpacing: 0 }}>— comma-separated</span></label>
                <input value={form.cast} onChange={e => set("cast", e.target.value)} placeholder="e.g. Ryan Gosling, Zendaya, Oscar Isaac" className={inputCls} style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>
                  Genres <span className="text-[#e8192c]">*</span>
                </label>
                <GenreCheckboxes value={form.genre} onChange={v => set("genre", v)} />
                {errors.genre && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.genre}</span>}
              </div>
            </>
          )}

          {activeSection === "media" && (
            <>
              <PosterUpload value={form.poster} onChange={v => set("poster", v)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Trailer URL</label>
                <p className="text-white/20" style={{ fontSize: "0.65rem" }}>YouTube or Vimeo link</p>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    value={form.trailerUrl}
                    onChange={e => set("trailerUrl", e.target.value)}
                    placeholder="https://youtu.be/xU47nhruN-Q"
                    className={inputCls}
                    style={{ ...inputStyle, paddingLeft: "2.75rem" }}
                    onFocus={focusBorder} onBlur={blurBorder}
                  />
                </div>
                {form.trailerUrl && (
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/8 bg-white/[0.02] mt-1">
                    <Check size={13} className="text-[#10b981] flex-shrink-0" />
                    <span className="text-white/45 truncate" style={{ fontSize: "0.75rem" }}>{form.trailerUrl}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === "screening" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Duration <span className="text-[#e8192c]">*</span></label>
                  <input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 2h 15m" className={inputCls} style={{ ...inputStyle, borderColor: errors.duration ? "#e8192c" : "rgba(255,255,255,0.1)" }} onFocus={focusBorder} onBlur={blurBorder} />
                  {errors.duration && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.duration}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 uppercase flex items-center gap-1" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Release Date <span className="text-[#e8192c]">*</span></label>
                  <input type="date" value={form.releaseDate} onChange={e => set("releaseDate", e.target.value)} className={inputCls + " [color-scheme:dark]"} style={{ ...inputStyle, borderColor: errors.releaseDate ? "#e8192c" : "rgba(255,255,255,0.1)" }} onFocus={focusBorder} onBlur={blurBorder} />
                  {errors.releaseDate && <span className="text-[#e8192c]" style={{ fontSize: "0.7rem" }}>{errors.releaseDate}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Status</label>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map(s => {
                    const on = form.status === s;
                    const ss = STATUS_STYLE[s] ?? STATUS_STYLE["Ended"];
                    return (
                      <button key={s} type="button" onClick={() => set("status", s)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
                        style={{ backgroundColor: on ? ss.bg : "rgba(255,255,255,0.02)", borderColor: on ? ss.border : "rgba(255,255,255,0.08)", color: on ? ss.color : "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: on ? 700 : 500 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: on ? ss.dot : "rgba(255,255,255,0.2)" }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em" }}>Screening Formats</label>
                <FormatCheckboxes value={form.format} onChange={v => set("format", v)} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-7 py-5 border-t border-white/6 flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
          <div className="flex items-center gap-2">
            {Object.keys(errors).length > 0 && (
              <span className="flex items-center gap-1.5 text-[#e8192c]" style={{ fontSize: "0.72rem" }}>
                <AlertTriangle size={12} /> {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? "s" : ""} need attention
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-white transition-all overflow-hidden disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #e8192c, #c8111f)", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> SAVING…</> : <><Check size={14} /> {mode === "add" ? "ADD MOVIE" : "SAVE CHANGES"}</>}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.92) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════ */
function DeleteModal({ movie, onConfirm, onClose }: { movie: Movie; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)" }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden"
        style={{ backgroundColor: "#0f0f18", boxShadow: "0 0 0 1px rgba(232,25,44,0.15), 0 32px 80px rgba(0,0,0,0.8)", animation: "modalIn 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards" }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, transparent, #e8192c 40%, transparent)" }} />

        <div className="p-7 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg,rgba(232,25,44,0.15),rgba(232,25,44,0.06))", border: "1px solid rgba(232,25,44,0.25)" }}>
            <Trash2 size={28} className="text-[#e8192c]" strokeWidth={1.5} />
          </div>
          <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "1.1rem" }}>Delete Movie?</h3>
          <p className="text-white/40 mb-1" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
            You're about to permanently delete
          </p>
          <p className="text-white mb-5" style={{ fontWeight: 700, fontSize: "0.92rem" }}>"{movie.title}"</p>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6 w-full justify-center" style={{ backgroundColor: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
            <AlertTriangle size={13} className="text-[#e8192c] flex-shrink-0" />
            <p className="text-[#e8192c]/80" style={{ fontSize: "0.74rem" }}>This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/45 hover:text-white hover:border-white/20 transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
            <button onClick={handle} disabled={loading} className="flex-1 py-3 rounded-xl text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.35)" }}>
              {loading ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export function AdminMovies() {
  const [movies, setMovies]         = useState<Movie[]>([]);
  const [search, setSearch]         = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField]   = useState<string | null>(null);
  const [sortDir, setSortDir]       = useState<SortDir>(null);
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [modal, setModal]           = useState<null | "add" | "edit">(null);
  const [editTarget, setEditTarget] = useState<Movie | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Movie | undefined>();
  const [viewTarget, setViewTarget] = useState<Movie | undefined>();
  const [toast, setToast]           = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Đồng bộ dữ liệu phim từ Database khi mở trang
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/movies");
        if (res.ok) {
          const data = await res.json();
          // Map dữ liệu từ backend (schema.prisma) sang cấu trúc giao diện Admin
          const mappedMovies: Movie[] = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            synopsis: m.description || "",
            genre: ["Action"], // Mặc định do schema DB chưa có Thể Loại
            director: "Đang cập nhật",
            cast: "Đang cập nhật",
            duration: `${Math.floor(m.duration / 60)}h ${m.duration % 60}m`,
            releaseDate: new Date(m.releaseDate).toISOString().split('T')[0],
            format: ["2D"],
            rating: "PG-13",
            status: m.status === 'NOW_SHOWING' ? 'Showing' : m.status === 'COMING_SOON' ? 'Coming Soon' : 'Ended',
            trailerUrl: "",
            poster: m.posterUrl,
            revenue: 0,
            tickets: 0,
            occupancy: 0
          }));
          setMovies(mappedMovies);
        }
      } catch (err) {
        console.error("Lỗi tải phim từ backend:", err);
      }
    };
    fetchMovies();
  }, []);

  /* Toast */
  const showToast = (msg: string) => {
    setToast(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2600);
  };

  /* Sort */
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
      if (sortDir === "desc") setSortField(null);
    } else {
      setSortField(field); setSortDir("asc");
    }
    setPage(1);
  };

  /* Filter + sort */
  let filtered = movies.filter(m => {
    const q = search.toLowerCase();
    if (q && !m.title.toLowerCase().includes(q) && !m.genre.join(",").toLowerCase().includes(q) && !m.director.toLowerCase().includes(q)) return false;
    if (genreFilter !== "All" && !m.genre.includes(genreFilter)) return false;
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    return true;
  });

  if (sortField && sortDir) {
    filtered = [...filtered].sort((a, b) => {
      let av: any = (a as any)[sortField];
      let bv: any = (b as any)[sortField];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Selection */
  const allSelected = paged.length > 0 && paged.every(m => selected.has(m.id));
  const toggleAll = () => {
    if (allSelected) setSelected(s => { const n = new Set(s); paged.forEach(m => n.delete(m.id)); return n; });
    else setSelected(s => { const n = new Set(s); paged.forEach(m => n.add(m.id)); return n; });
  };
  const toggleRow = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* CRUD */
  const handleAdd = async (data: typeof EMPTY_MOVIE) => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        setMovies(prev => [json.data, ...prev]);
        setModal(null);
        showToast(`"${data.title}" added successfully`);
      }
    } catch (e) { showToast("Error adding movie"); }
  };

  const handleEdit = async (data: typeof EMPTY_MOVIE) => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/movies/${editTarget?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        setMovies(prev => prev.map(m => m.id === editTarget?.id ? json.data : m));
        setModal(null); setEditTarget(undefined);
        showToast(`"${data.title}" updated successfully`);
      }
    } catch (e) { showToast("Error updating movie"); }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/admin/movies/${deleteTarget?.id}`, { method: "DELETE" });
      const name = deleteTarget?.title;
      setMovies(prev => prev.filter(m => m.id !== deleteTarget?.id));
      setSelected(s => { const n = new Set(s); n.delete(deleteTarget?.id ?? ""); return n; });
      setDeleteTarget(undefined);
      showToast(`"${name}" deleted`);
    } catch (e) { showToast("Error deleting movie"); }
  };

  const handleBulkDelete = () => {
    const count = selected.size;
    setMovies(prev => prev.filter(m => !selected.has(m.id)));
    setSelected(new Set());
    showToast(`${count} movie${count > 1 ? "s" : ""} deleted`);
  };

  /* ── UI ── */
  return (
    <AdminLayout
      title="Movies Management"
      subtitle={`${movies.length} total · ${movies.filter(m => m.status === "Showing").length} showing · ${movies.filter(m => m.status === "Coming Soon").length} coming soon`}
      actions={
        <button
          onClick={() => { setEditTarget(undefined); setModal("add"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all"
          style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.06em", boxShadow: "0 6px 20px rgba(232,25,44,0.4)" }}
        >
          <Plus size={15} /> Add New Movie
        </button>
      }
    >
      {/* ── STAT ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Movies", value: movies.length, color: "#e8192c" },
          { label: "Showing Now",  value: movies.filter(m => m.status === "Showing").length,     color: "#10b981" },
          { label: "Coming Soon",  value: movies.filter(m => m.status === "Coming Soon").length, color: "#3b82f6" },
          { label: "Avg Occupancy",value: `${Math.round(movies.filter(m=>m.occupancy>0).reduce((a,m)=>a+m.occupancy,0)/movies.filter(m=>m.occupancy>0).length||0)}%`, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border px-4 py-3.5" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}>
              <span style={{ fontWeight: 900, fontSize: "0.82rem", color }}>{typeof value === "number" ? value : value}</span>
            </div>
            <p className="text-white/40" style={{ fontSize: "0.72rem", fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div
        className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-2xl border"
        style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Search */}
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, genre, director..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
            style={{ border: "1.5px solid rgba(255,255,255,0.08)", fontSize: "0.85rem" }}
            onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.45)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 text-white/25 hover:text-white/60 transition-colors"><X size={13} /></button>
          )}
        </div>

        {/* Genre dropdown */}
        <div className="relative">
          <select
            value={genreFilter}
            onChange={e => { setGenreFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer transition-all"
            style={{ backgroundColor: genreFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: genreFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: genreFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}
          >
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Genres</option>
            {ALL_GENRES.map(g => <option key={g} value={g} style={{ backgroundColor: "#0f0f18" }}>{g}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer transition-all"
            style={{ backgroundColor: statusFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: statusFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: statusFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}
          >
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: "#0f0f18" }}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Clear filters */}
        {(search || genreFilter !== "All" || statusFilter !== "All") && (
          <button onClick={() => { setSearch(""); setGenreFilter("All"); setStatusFilter("All"); setPage(1); }} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-white/35 hover:text-white hover:border-white/20 transition-all" style={{ fontSize: "0.78rem" }}>
            <X size={12} /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Results count */}
          <span className="text-white/30" style={{ fontSize: "0.75rem" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/8 text-white/30 hover:text-white/60 transition-all" style={{ fontSize: "0.75rem" }}>
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* ── BULK ACTION BAR ── */}
      {selected.size > 0 && (
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl mb-4 border border-[#e8192c]/25"
          style={{ backgroundColor: "rgba(232,25,44,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e8192c" }}>{selected.size} selected</span>
            <span className="text-white/20">·</span>
            <button onClick={() => setSelected(new Set())} className="text-white/40 hover:text-white transition-colors" style={{ fontSize: "0.78rem" }}>Deselect all</button>
          </div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all"
            style={{ backgroundColor: "#e8192c", fontSize: "0.78rem", fontWeight: 700 }}
          >
            <Trash2 size={13} /> Delete Selected
          </button>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                {/* Checkbox */}
                <th className="py-3 pl-5 pr-3 w-10">
                  <button onClick={toggleAll} className="text-white/25 hover:text-white/60 transition-colors">
                    {allSelected ? <CheckSquare size={15} className="text-[#e8192c]" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="py-3 pr-4" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Poster</th>
                <SortTh label="Title" field="title" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4" />
                <SortTh label="Genre" field="genre" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4" />
                <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4" />
                <th className="py-3 pr-4" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Format</th>
                <SortTh label="Release" field="releaseDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4" />
                <SortTh label="Duration" field="duration" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4" />
                <SortTh label="Revenue" field="revenue" sortField={sortField} sortDir={sortDir} onSort={handleSort} className="pr-4 text-right" style={{ textAlign: "right" }} />
                <th className="py-3 pr-5 text-right" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                      <Film size={40} className="mb-3 opacity-20" />
                      <p style={{ fontSize: "0.9rem" }}>No movies found</p>
                      <button
                        onClick={() => { setSearch(""); setGenreFilter("All"); setStatusFilter("All"); }}
                        className="mt-2 text-[#e8192c]/60 hover:text-[#e8192c] transition-colors"
                        style={{ fontSize: "0.78rem", fontWeight: 600 }}
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((movie, i) => {
                  const isSelected = selected.has(movie.id);
                  return (
                    <tr
                      key={movie.id}
                      className="border-b group transition-colors"
                      style={{
                        borderColor: "rgba(255,255,255,0.04)",
                        backgroundColor: isSelected ? "rgba(232,25,44,0.04)" : undefined,
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(255,255,255,0.015)"; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ""; }}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 pl-5 pr-3">
                        <button onClick={() => toggleRow(movie.id)} className="text-white/20 hover:text-white/50 transition-colors">
                          {isSelected ? <CheckSquare size={14} className="text-[#e8192c]" /> : <Square size={14} />}
                        </button>
                      </td>

                      {/* Poster */}
                      <td className="py-3 pr-4">
                        <div
                          className="w-10 h-14 rounded-lg overflow-hidden border flex-shrink-0 relative group/poster"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                        >
                          {movie.poster ? (
                            <>
                              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover/poster:bg-black/40 transition-colors flex items-center justify-center">
                                <Eye size={12} className="text-white opacity-0 group-hover/poster:opacity-100 transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                              <Film size={14} className="text-white/15" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title + director */}
                      <td className="py-3.5 pr-4" style={{ minWidth: "180px" }}>
                        <p className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>{movie.title}</p>
                        <p className="text-white/30 mt-0.5" style={{ fontSize: "0.7rem" }}>{movie.director || "—"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="px-1.5 py-0.5 rounded" style={{ fontSize: "0.56rem", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>{movie.rating}</span>
                        </div>
                      </td>

                      {/* Genre */}
                      <td className="py-3.5 pr-4">
                        <div className="flex flex-col gap-1">
                          {movie.genre.slice(0, 2).map(g => (
                            <span key={g} className="inline-block px-2 py-0.5 rounded-full" style={{ fontSize: "0.62rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", width: "fit-content" }}>
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pr-4"><StatusBadge status={movie.status} /></td>

                      {/* Format */}
                      <td className="py-3.5 pr-4"><FormatPills formats={movie.format} /></td>

                      {/* Release Date */}
                      <td className="py-3.5 pr-4">
                        <p className="text-white/60" style={{ fontSize: "0.8rem", fontWeight: 500 }}>{formatDate(movie.releaseDate)}</p>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 pr-4">
                        <span className="text-white/50" style={{ fontSize: "0.8rem" }}>{movie.duration}</span>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 pr-4 text-right">
                        {movie.revenue > 0 ? (
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e8192c" }}>₫{movie.revenue}M</span>
                        ) : (
                          <span className="text-white/20" style={{ fontSize: "0.8rem" }}>—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <button
                            onClick={() => setViewTarget(movie)}
                            className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/25 hover:text-white/70 hover:border-white/18 transition-all"
                            title="View details"
                          >
                            <Eye size={12} />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => { setEditTarget(movie); setModal("edit"); }}
                            className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/25 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 transition-all"
                            title="Edit movie"
                          >
                            <Edit2 size={12} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(movie)}
                            className="w-7 h-7 rounded-lg border border-white/8 flex items-center justify-center text-white/25 hover:text-[#e8192c] hover:border-[#e8192c]/30 transition-all"
                            title="Delete movie"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-white/30" style={{ fontSize: "0.75rem" }}>
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                  style={{
                    fontSize: "0.78rem", fontWeight: p === page ? 800 : 500,
                    backgroundColor: p === page ? "#e8192c" : "transparent",
                    borderColor: p === page ? "#e8192c" : "rgba(255,255,255,0.08)",
                    color: p === page ? "white" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {(modal === "add" || modal === "edit") && (
        <MovieModal
          mode={modal}
          movie={editTarget}
          onSave={modal === "add" ? handleAdd : handleEdit}
          onClose={() => { setModal(null); setEditTarget(undefined); }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          movie={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(undefined)}
        />
      )}

      {/* View Detail Quick Panel */}
      {viewTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-end" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setViewTarget(undefined)}>
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm h-full border-l border-white/10 flex flex-col overflow-y-auto"
            style={{ backgroundColor: "#0f0f18", animation: "slideIn 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards" }}
          >
            {/* Hero */}
            <div className="relative h-56 flex-shrink-0">
              <img src={viewTarget.poster || ""} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.6)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #0f0f18 100%)" }} />
              <button onClick={() => setViewTarget(undefined)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/50 flex items-center justify-center text-white/60 hover:text-white">
                <X size={15} />
              </button>
              <div className="absolute bottom-5 left-5">
                <StatusBadge status={viewTarget.status} />
                <h2 className="text-white mt-2" style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.03em" }}>{viewTarget.title}</h2>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col gap-5">
              <p className="text-white/45" style={{ fontSize: "0.83rem", lineHeight: 1.7 }}>{viewTarget.synopsis}</p>
              {[
                { label: "Director",  value: viewTarget.director || "—" },
                { label: "Cast",      value: viewTarget.cast || "—" },
                { label: "Duration",  value: viewTarget.duration },
                { label: "Release",   value: formatDate(viewTarget.releaseDate) },
                { label: "Rating",    value: viewTarget.rating },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                  <span className="text-white/30 uppercase flex-shrink-0" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", paddingTop: "2px" }}>{label}</span>
                  <span className="text-white/70 text-right" style={{ fontSize: "0.82rem", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div>
                <p className="text-white/30 uppercase mb-2" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>Formats</p>
                <FormatPills formats={viewTarget.format} />
              </div>
              <div>
                <p className="text-white/30 uppercase mb-2" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>Genre</p>
                <div className="flex flex-wrap gap-2">
                  {viewTarget.genre.map(g => (
                    <span key={g} className="px-2.5 py-1 rounded-full" style={{ fontSize: "0.72rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>{g}</span>
                  ))}
                </div>
              </div>
              {viewTarget.revenue > 0 && (
                <div className="flex gap-3">
                  {[
                    { label: "Revenue", value: `₫${viewTarget.revenue}M`, color: "#e8192c" },
                    { label: "Tickets", value: viewTarget.tickets.toLocaleString(), color: "#3b82f6" },
                    { label: "Occupancy", value: `${viewTarget.occupancy}%`, color: "#10b981" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex-1 text-center py-2.5 rounded-xl border border-white/8" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <p style={{ fontWeight: 800, fontSize: "0.9rem", color }}>{value}</p>
                      <p className="text-white/25" style={{ fontSize: "0.6rem" }}>{label}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => { setViewTarget(undefined); setEditTarget(viewTarget); setModal("edit"); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white mt-auto"
                style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.35)" }}
              >
                <Edit2 size={14} /> Edit Movie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 z-[400] transition-all duration-300"
        style={{
          backgroundColor: "rgba(17,17,24,0.97)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          opacity: toastVisible ? 1 : 0,
          transform: toastVisible ? "translate(-50%, 0)" : "translate(-50%, 16px)",
          pointerEvents: "none",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-white" />
        </div>
        <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{toast}</span>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.92) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </AdminLayout>
  );
}
