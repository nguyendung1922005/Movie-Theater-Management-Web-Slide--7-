/**
 * Screen 2 — Movie & Content Status Management
 * Simplified list view focused on status lifecycle:
 *   Now Showing → Coming Soon → End of Run
 * Plus an Available / Archived quick toggle.
 * Bulk-select toolbar for mass state/type updates.
 */

import { useState, useMemo } from "react";
import {
  Search, Plus, X, Check, ChevronDown, Filter,
  Edit2, Trash2, AlertTriangle, Film, Star, Clock,
  TrendingUp, TrendingDown, ToggleLeft, ToggleRight,
  CheckSquare, Square, Tag, RefreshCw, Loader2,
} from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";

/* ══════════════════════════════════
   TYPES
══════════════════════════════════ */
type State = "Now Showing" | "Coming Soon" | "End of Run";

interface StaffMovie {
  id:        string;
  title:     string;
  poster:    string;
  genres:    string[];
  director:  string;
  duration:  string;
  rating:    string;
  formats:   string[];
  state:     State;
  available: boolean;  // true = Available, false = Archived
  revenue:   number;   // $K
  tickets:   number;
  occupancy: number;
  trend:     number;   // %
  releaseDate: string;
}

/* ══════════════════════════════════
   SEED DATA
══════════════════════════════════ */
const SEED: StaffMovie[] = [
  {
    id: "your-name",
    title: "Your Name",
    poster: "https://images.unsplash.com/photo-1629058545686-f9acd8608d63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Animation","Romance"], director: "Makoto Shinkai",
    duration: "1h 46m", rating: "PG", formats: ["IMAX","2D"],
    state: "Now Showing", available: true,
    revenue: 442, tickets: 5120, occupancy: 94, trend: +18.4, releaseDate: "Mar 1, 2026",
  },
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    poster: "https://images.unsplash.com/photo-1728457848586-fc2c468b4689?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Sci-Fi","Action"], director: "James Cameron",
    duration: "2h 18m", rating: "PG-13", formats: ["4DX","IMAX"],
    state: "Now Showing", available: true,
    revenue: 388, tickets: 4580, occupancy: 87, trend: +12.1, releaseDate: "Feb 14, 2026",
  },
  {
    id: "iron-legacy",
    title: "Iron Legacy",
    poster: "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Action","Fantasy"], director: "Ridley Scott",
    duration: "2h 32m", rating: "R", formats: ["3D","Dolby"],
    state: "Now Showing", available: true,
    revenue: 298, tickets: 3490, occupancy: 75, trend: -3.2, releaseDate: "Feb 5, 2026",
  },
  {
    id: "code-black",
    title: "Code Black",
    poster: "https://images.unsplash.com/photo-1641328824708-b9df9d9ab697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Thriller","Crime"], director: "Denis Villeneuve",
    duration: "1h 58m", rating: "PG-13", formats: ["Dolby","2D"],
    state: "Now Showing", available: true,
    revenue: 265, tickets: 3080, occupancy: 68, trend: +2.8, releaseDate: "Feb 20, 2026",
  },
  {
    id: "void-runner",
    title: "Void Runner",
    poster: "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Sci-Fi","Adventure"], director: "Christopher Nolan",
    duration: "2h 14m", rating: "PG", formats: ["IMAX"],
    state: "Coming Soon", available: true,
    revenue: 0, tickets: 0, occupancy: 0, trend: 0, releaseDate: "May 22, 2026",
  },
  {
    id: "dark-hollow",
    title: "Dark Hollow",
    poster: "https://images.unsplash.com/photo-1768121496378-0644c37e7fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Horror","Mystery"], director: "Jordan Peele",
    duration: "1h 54m", rating: "R", formats: ["2D"],
    state: "Coming Soon", available: true,
    revenue: 0, tickets: 0, occupancy: 0, trend: 0, releaseDate: "Jun 12, 2026",
  },
  {
    id: "star-breaker",
    title: "Star Breaker",
    poster: "https://images.unsplash.com/photo-1676911810007-9ef7e4d78f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Sci-Fi","Epic"], director: "Luc Besson",
    duration: "2h 31m", rating: "PG-13", formats: ["IMAX","4DX","Dolby"],
    state: "Coming Soon", available: true,
    revenue: 0, tickets: 0, occupancy: 0, trend: 0, releaseDate: "Jul 4, 2026",
  },
  {
    id: "midnight-heir",
    title: "Midnight Heir",
    poster: "https://images.unsplash.com/photo-1537985302844-6073c6a61e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Drama","Romance"], director: "Wong Kar-wai",
    duration: "1h 52m", rating: "PG", formats: ["2D"],
    state: "End of Run", available: false,
    revenue: 182, tickets: 2140, occupancy: 44, trend: -14.2, releaseDate: "Aug 10, 2025",
  },
  {
    id: "phantom-gate",
    title: "Phantom Gate",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
    genres: ["Action","Thriller"], director: "Guy Ritchie",
    duration: "2h 04m", rating: "PG-13", formats: ["3D","2D"],
    state: "End of Run", available: false,
    revenue: 147, tickets: 1840, occupancy: 38, trend: -22.6, releaseDate: "Sep 28, 2025",
  },
];

/* ══════════════════════════════════
   METADATA
══════════════════════════════════ */
const STATE_META: Record<State, { color: string; bg: string; border: string }> = {
  "Now Showing": { color: SC.green,  bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.28)"  },
  "Coming Soon": { color: SC.amber,  bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.28)"  },
  "End of Run":  { color: SC.muted,  bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" },
};

const FORMAT_COLOR: Record<string,string> = {
  IMAX: SC.blue, "4DX": SC.amber, Dolby: SC.purple, "3D": SC.green, "2D": "rgba(255,255,255,0.35)",
};

const ALL_FORMATS = ["IMAX","4DX","Dolby","3D","2D"];
const ALL_STATES: State[]  = ["Now Showing","Coming Soon","End of Run"];

/* ══════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════ */
function ToggleSwitch({
  value, onChange, loading,
}: {
  value:    boolean;
  onChange: (v: boolean) => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative flex-shrink-0 rounded-full transition-all"
      style={{
        width: 40, height: 22,
        backgroundColor: value ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)",
        border: `1.5px solid ${value ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.12)"}`,
      }}
    >
      {loading ? (
        <Loader2 size={10} className="absolute inset-0 m-auto text-white/40 animate-spin" />
      ) : (
        <span
          className="absolute top-0.5 rounded-full transition-all duration-200"
          style={{
            width: 15, height: 15,
            backgroundColor: value ? SC.green : "rgba(255,255,255,0.3)",
            left: value ? "calc(100% - 17px)" : "1px",
            boxShadow: value ? `0 0 6px ${SC.green}80` : "none",
          }}
        />
      )}
    </button>
  );
}

/* ══════════════════════════════════
   EDIT MODAL
══════════════════════════════════ */
function EditModal({
  movie, onClose, onSave,
}: {
  movie:   StaffMovie;
  onClose: () => void;
  onSave:  (id: string, updates: Partial<StaffMovie>) => void;
}) {
  const [state,   setState]   = useState<State>(movie.state);
  const [formats, setFormats] = useState<string[]>([...movie.formats]);
  const [saving,  setSaving]  = useState(false);

  const toggleFormat = (f: string) => {
    setFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    onSave(movie.id, { state, formats });
    setSaving(false);
    onClose();
  };

  const sm = STATE_META[state];

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
          maxWidth: 480,
          backgroundColor: "#0d0d18",
          borderColor: SC.borderHi,
          boxShadow: "0 0 0 1px rgba(232,25,44,0.1), 0 40px 100px rgba(0,0,0,0.85)",
          animation: "sfModalIn .3s cubic-bezier(.34,1.4,.64,1) forwards",
        }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <img src={movie.poster} alt={movie.title} className="w-10 h-14 rounded-xl object-cover border border-white/10" />
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>{movie.title}</h2>
              <p style={{ fontSize: "0.7rem", color: SC.dim, marginTop: 1 }}>
                {movie.genres.join(" · ")} · {movie.duration}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/30 hover:text-white/70 transition-all" style={{ borderColor: SC.border }}>
            <X size={14} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* State selector */}
          <div>
            <label className="block mb-3 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Content State</label>
            <div className="flex flex-col gap-2">
              {ALL_STATES.map(s => {
                const meta = STATE_META[s];
                const sel  = state === s;
                return (
                  <button
                    key={s}
                    onClick={() => setState(s)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                    style={{
                      backgroundColor: sel ? meta.bg : "rgba(255,255,255,0.02)",
                      borderColor:     sel ? meta.border : SC.border,
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: sel ? 700 : 500, color: sel ? meta.color : SC.muted }}>{s}</span>
                    {sel && <Check size={13} className="ml-auto" style={{ color: meta.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format selector */}
          <div>
            <label className="block mb-3 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Screening Formats</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_FORMATS.map(f => (
                <button
                  key={f}
                  onClick={() => toggleFormat(f)}
                  className="px-3.5 py-1.5 rounded-xl border transition-all"
                  style={{
                    fontSize: "0.72rem", fontWeight: formats.includes(f) ? 800 : 500,
                    backgroundColor: formats.includes(f) ? `${FORMAT_COLOR[f]}18` : "rgba(255,255,255,0.02)",
                    borderColor: formats.includes(f) ? `${FORMAT_COLOR[f]}50` : SC.border,
                    color: formats.includes(f) ? FORMAT_COLOR[f] : SC.muted,
                  }}
                >
                  {formats.includes(f) && <Check size={9} className="inline mr-1" />}{f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.01)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border text-white/35 hover:text-white/70 transition-all" style={{ fontSize: "0.82rem", fontWeight: 600, borderColor: SC.border }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}>
            {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Check size={13} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   BULK ACTIONS MODAL
══════════════════════════════════ */
function BulkModal({
  count, onClose, onApply,
}: {
  count:   number;
  onClose: () => void;
  onApply: (state: State, formats: string[]) => void;
}) {
  const [state,   setState]   = useState<State>("Now Showing");
  const [formats, setFormats] = useState<string[]>([]);
  const [saving,  setSaving]  = useState(false);

  const handleApply = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    onApply(state, formats);
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
          maxWidth: 440,
          backgroundColor: "#0d0d18",
          borderColor: SC.borderHi,
          boxShadow: "0 40px 100px rgba(0,0,0,0.85)",
          animation: "sfModalIn .3s cubic-bezier(.34,1.4,.64,1) forwards",
        }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>Bulk Update</h2>
            <p style={{ fontSize: "0.7rem", color: SC.dim }}>{count} movie{count !== 1 ? "s" : ""} selected</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/30 hover:text-white/70" style={{ borderColor: SC.border }}>
            <X size={14} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="block mb-3 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Set State To</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_STATES.map(s => {
                const meta = STATE_META[s];
                return (
                  <button key={s} onClick={() => setState(s)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all"
                    style={{
                      backgroundColor: state === s ? meta.bg : "rgba(255,255,255,0.02)",
                      borderColor:     state === s ? meta.border : SC.border,
                      color:           state === s ? meta.color : SC.muted,
                      fontSize: "0.75rem", fontWeight: state === s ? 700 : 500,
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-3 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Add Formats (optional)</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_FORMATS.map(f => (
                <button key={f} onClick={() => setFormats(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev,f])}
                  className="px-3 py-1.5 rounded-xl border transition-all"
                  style={{
                    fontSize: "0.72rem", fontWeight: formats.includes(f) ? 800 : 500,
                    backgroundColor: formats.includes(f) ? `${FORMAT_COLOR[f]}18` : "rgba(255,255,255,0.02)",
                    borderColor: formats.includes(f) ? `${FORMAT_COLOR[f]}50` : SC.border,
                    color: formats.includes(f) ? FORMAT_COLOR[f] : SC.muted,
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border text-white/35 hover:text-white/70 transition-all" style={{ fontSize: "0.82rem", fontWeight: 600, borderColor: SC.border }}>
            Cancel
          </button>
          <button onClick={handleApply} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}>
            {saving ? <><Loader2 size={13} className="animate-spin" /> Applying…</> : <><Check size={13} /> Apply to {count}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export function StaffMovies() {
  const [movies,       setMovies]       = useState<StaffMovie[]>(SEED);
  const [search,       setSearch]       = useState("");
  const [stateFilter,  setStateFilter]  = useState<State | "All">("All");
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [editMovie,    setEditMovie]    = useState<StaffMovie | null>(null);
  const [bulkModal,    setBulkModal]    = useState(false);
  const [loadingToggle,setLoadingToggle]= useState<string | null>(null);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [formatFilter, setFormatFilter] = useState("All");

  /* filtering */
  const filtered = useMemo(() =>
    movies.filter(m => {
      if (search && !m.title.toLowerCase().includes(search.toLowerCase()) &&
        !m.genres.some(g => g.toLowerCase().includes(search.toLowerCase()))) return false;
      if (stateFilter !== "All" && m.state !== stateFilter) return false;
      if (formatFilter !== "All" && !m.formats.includes(formatFilter)) return false;
      return true;
    }),
    [movies, search, stateFilter, formatFilter]
  );

  const allSelectedOnPage = filtered.length > 0 && filtered.every(m => selected.has(m.id));

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(m => n.delete(m.id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(m => n.add(m.id)); return n; });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAvailable = async (id: string) => {
    setLoadingToggle(id);
    await new Promise(r => setTimeout(r, 500));
    setMovies(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
    setLoadingToggle(null);
  };

  const handleSaveEdit = (id: string, updates: Partial<StaffMovie>) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleBulkApply = (state: State, formats: string[]) => {
    setMovies(prev => prev.map(m => {
      if (!selected.has(m.id)) return m;
      return {
        ...m,
        state,
        formats: formats.length > 0 ? [...new Set([...m.formats, ...formats])] : m.formats,
      };
    }));
    setSelected(new Set());
  };

  const selectedCount = selected.size;

  const STATUS_TABS: Array<{ id: State | "All"; label: string }> = [
    { id: "All",         label: `All (${movies.length})`                                         },
    { id: "Now Showing", label: `Now Showing (${movies.filter(m=>m.state==="Now Showing").length})` },
    { id: "Coming Soon", label: `Coming Soon (${movies.filter(m=>m.state==="Coming Soon").length})` },
    { id: "End of Run",  label: `End of Run (${movies.filter(m=>m.state==="End of Run").length})`   },
  ];

  return (
    <StaffRouteGuard allow={["general_staff"]}>
    <StaffPage
      title="Movie Status"
      subtitle="Manage content lifecycle and screening availability"
      actions={
        <>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="flex items-center gap-2 px-3.5 h-9 rounded-xl border transition-all"
            style={{
              borderColor: formatFilter !== "All" ? "rgba(232,25,44,0.35)" : SC.border,
              backgroundColor: formatFilter !== "All" ? SC.redSoft : "rgba(255,255,255,0.03)",
              color: formatFilter !== "All" ? SC.red : SC.muted,
              fontSize: "0.78rem", fontWeight: 600,
            }}
          >
            <Filter size={13} />
            {formatFilter === "All" ? "Format" : formatFilter}
            <ChevronDown size={11} />
          </button>
          {filterOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setFilterOpen(false)} />
              {/* positioned by parent */}
            </>
          )}

          <button
            className="flex items-center gap-2 px-4 h-9 rounded-xl text-white transition-all"
            style={{
              background: "linear-gradient(135deg,#e8192c,#c8111f)",
              fontSize: "0.82rem", fontWeight: 800,
              boxShadow: "0 4px 16px rgba(232,25,44,0.38)",
            }}
          >
            <Plus size={15} /> Add Movie
          </button>
        </>
      }
    >

      <div style={{ padding: "0 2rem 3rem" }}>

        {/* ── SEARCH + STATE TABS ── */}
        <div className="flex flex-col gap-4 pt-6 pb-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 px-4 h-11 rounded-2xl border flex-1 max-w-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: search ? "rgba(255,255,255,0.15)" : SC.border,
              }}
            >
              <Search size={15} style={{ color: SC.dim, flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, genre, director…"
                className="flex-1 bg-transparent text-white outline-none"
                style={{ fontSize: "0.88rem", caretColor: SC.red }}
              />
              {search && <button onClick={() => setSearch("")}><X size={13} style={{ color: SC.dim }} /></button>}
            </div>

            {/* Format filter pills */}
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {["All", ...ALL_FORMATS].map(f => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  className="px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all"
                  style={{
                    fontSize: "0.68rem", fontWeight: formatFilter === f ? 800 : 500,
                    backgroundColor: formatFilter === f ? `${FORMAT_COLOR[f] ?? SC.red}18` : "rgba(255,255,255,0.02)",
                    borderColor:     formatFilter === f ? `${FORMAT_COLOR[f] ?? SC.red}45` : SC.border,
                    color:           formatFilter === f ? (FORMAT_COLOR[f] ?? SC.red) : SC.dim,
                  }}
                >{f === "All" ? "All Formats" : f}</button>
              ))}
            </div>
          </div>

          {/* State tabs */}
          <div className="flex gap-1 border-b" style={{ borderColor: SC.border }}>
            {STATUS_TABS.map(tab => {
              const active = stateFilter === tab.id;
              const meta   = tab.id !== "All" ? STATE_META[tab.id] : null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStateFilter(tab.id)}
                  className="relative px-4 py-2.5 transition-all"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? (meta?.color ?? SC.red) : SC.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                      style={{ backgroundColor: meta?.color ?? SC.red }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BULK ACTION TOOLBAR ── */}
        {selectedCount > 0 && (
          <div
            className="flex items-center gap-4 px-5 py-3 rounded-2xl border mb-4"
            style={{
              backgroundColor: SC.redSoft,
              borderColor: "rgba(232,25,44,0.28)",
              animation: "sfFadeIn .2s both",
            }}
          >
            <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
              <span style={{ color: SC.red }}>{selectedCount}</span> movie{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setBulkModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white transition-all"
              style={{ backgroundColor: SC.red, fontSize: "0.75rem", fontWeight: 700 }}
            >
              <Tag size={12} /> Bulk Edit State / Format
            </button>
            <button
              onClick={() => setMovies(prev => prev.map(m => selected.has(m.id) ? { ...m, available: false } : m))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", fontSize: "0.75rem", fontWeight: 600, color: SC.muted }}
            >
              <ToggleLeft size={12} /> Archive All
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto p-1.5 rounded-lg text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: SC.border }}>

          {/* Table header */}
          <div
            className="grid items-center px-5 py-3 border-b"
            style={{
              gridTemplateColumns: "40px 56px 1fr 140px 180px 120px 100px 80px",
              borderColor: SC.border,
              backgroundColor: "rgba(255,255,255,0.025)",
            }}
          >
            <button onClick={toggleSelectAll} className="flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
              {allSelectedOnPage
                ? <CheckSquare size={15} style={{ color: SC.red }} />
                : <Square size={15} />
              }
            </button>
            <div />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>Title</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>Genre</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>State</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>Formats</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>Available</span>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: SC.dim, textTransform: "uppercase" }}>Actions</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${SC.border}` }}>
                <Film size={28} style={{ color: SC.dim }} />
              </div>
              <p className="text-white" style={{ fontWeight: 700, fontSize: "0.95rem" }}>No movies found</p>
              <p style={{ fontSize: "0.72rem", color: SC.dim, marginTop: 4 }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((movie, idx) => {
              const isSel = selected.has(movie.id);
              const sm    = STATE_META[movie.state];
              const isLoading = loadingToggle === movie.id;
              const isLast = idx === filtered.length - 1;

              return (
                <div
                  key={movie.id}
                  className="grid items-center px-5 py-3.5 transition-all"
                  style={{
                    gridTemplateColumns: "40px 56px 1fr 140px 180px 120px 100px 80px",
                    borderBottom: isLast ? "none" : `1px solid rgba(255,255,255,0.04)`,
                    backgroundColor: isSel ? "rgba(232,25,44,0.04)" : "transparent",
                  }}
                >
                  {/* Checkbox */}
                  <button onClick={() => toggleSelect(movie.id)} className="flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                    {isSel
                      ? <CheckSquare size={15} style={{ color: SC.red }} />
                      : <Square size={15} />
                    }
                  </button>

                  {/* Poster */}
                  <div className="w-10 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Title info */}
                  <div className="pr-4 min-w-0">
                    <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{movie.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} style={{ color: SC.dim }} />
                      <span style={{ fontSize: "0.65rem", color: SC.dim }}>{movie.duration}</span>
                      <span style={{ fontSize: "0.65rem", color: SC.dim }}>·</span>
                      <span style={{ fontSize: "0.65rem", color: SC.dim }}>{movie.rating}</span>
                      {movie.trend !== 0 && (
                        <span
                          className="flex items-center gap-0.5"
                          style={{ fontSize: "0.65rem", fontWeight: 700, color: movie.trend > 0 ? SC.green : SC.red }}
                        >
                          {movie.trend > 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                          {Math.abs(movie.trend)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 pr-3">
                    {movie.genres.map(g => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded"
                        style={{ fontSize: "0.58rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.07)", color: SC.muted }}
                      >{g}</span>
                    ))}
                  </div>

                  {/* State badge — clickable to cycle */}
                  <div>
                    <button
                      onClick={() => {
                        const idx = ALL_STATES.indexOf(movie.state);
                        const next = ALL_STATES[(idx + 1) % ALL_STATES.length];
                        setMovies(prev => prev.map(m => m.id === movie.id ? { ...m, state: next } : m));
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all group"
                      style={{ backgroundColor: sm.bg, borderColor: sm.border }}
                      title="Click to cycle state"
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sm.color }} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: sm.color }}>{movie.state}</span>
                      <RefreshCw size={9} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: sm.color }} />
                    </button>
                  </div>

                  {/* Formats */}
                  <div className="flex flex-wrap gap-1 pr-3">
                    {movie.formats.map(f => (
                      <span
                        key={f}
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.06em",
                          backgroundColor: `${FORMAT_COLOR[f]}18`,
                          color: FORMAT_COLOR[f],
                          border: `1px solid ${FORMAT_COLOR[f]}30`,
                        }}
                      >{f}</span>
                    ))}
                  </div>

                  {/* Available toggle */}
                  <div className="flex flex-col items-start gap-1">
                    <ToggleSwitch
                      value={movie.available}
                      onChange={() => toggleAvailable(movie.id)}
                      loading={isLoading}
                    />
                    <span style={{ fontSize: "0.58rem", fontWeight: 600, color: movie.available ? SC.green : SC.dim }}>
                      {isLoading ? "…" : movie.available ? "Available" : "Archived"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditMovie(movie)}
                      className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:bg-white/[0.05]"
                      style={{ borderColor: SC.border, color: SC.muted }}
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setMovies(prev => prev.filter(m => m.id !== movie.id))}
                      className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                      style={{ borderColor: SC.border, color: SC.dim }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between mt-4 px-1">
          <span style={{ fontSize: "0.72rem", color: SC.dim }}>
            Showing <strong className="text-white">{filtered.length}</strong> of <strong className="text-white">{movies.length}</strong> movies
          </span>
          {(search || stateFilter !== "All" || formatFilter !== "All") && (
            <button
              onClick={() => { setSearch(""); setStateFilter("All"); setFormatFilter("All"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ fontSize: "0.68rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.05)", color: SC.muted, border: `1px solid ${SC.border}` }}
            >
              <X size={10} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {editMovie && (
        <EditModal
          movie={editMovie}
          onClose={() => setEditMovie(null)}
          onSave={handleSaveEdit}
        />
      )}
      {bulkModal && (
        <BulkModal
          count={selectedCount}
          onClose={() => setBulkModal(false)}
          onApply={handleBulkApply}
        />
      )}
    </StaffPage>
    </StaffRouteGuard>
  );
}
