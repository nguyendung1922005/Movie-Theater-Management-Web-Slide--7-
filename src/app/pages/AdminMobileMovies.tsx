import { useState, useMemo, useRef } from "react";
import {
  Search, Plus, MoreVertical, Edit2, Trash2, Eye,
  Star, Clock, Calendar, X, Filter, TrendingUp,
  TrendingDown, ChevronDown, Film, Check,
} from "lucide-react";
import {
  C, AdminMobileDrawer, AdminMobileHeader, AdminMobileBottomNav, AM_KEYFRAMES,
} from "../components/AdminMobileLayout";

/* ══════════════════════════════════
   DATA
══════════════════════════════════ */
const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  now_showing: { label: "Now Showing",  color: C.green,  bg: "rgba(16,185,129,0.12)"  },
  coming_soon: { label: "Coming Soon",  color: C.amber,  bg: "rgba(245,158,11,0.12)"  },
  archived:    { label: "Archived",     color: C.muted,  bg: "rgba(255,255,255,0.07)" },
};

const FORMAT_COLOR: Record<string, string> = {
  IMAX: C.blue, "4DX": C.amber, Dolby: C.purple, "3D": C.green, "2D": "rgba(255,255,255,0.35)",
};

const MOVIES = [
  {
    id: 1, title: "Your Name",    genres: ["Animation","Romance"],  rating: 9.0,
    duration: "106m", release: "Jan 2016",  formats: ["IMAX","4DX"],       status: "now_showing",
    revenue: 442, tickets: 5120, trending: +18.4,
    poster: "https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 2, title: "Neon Horizon", genres: ["Sci-Fi","Action"],     rating: 8.4,
    duration: "128m", release: "Mar 2026",  formats: ["4DX","3D"],         status: "now_showing",
    revenue: 388, tickets: 4580, trending: +12.1,
    poster: "https://images.unsplash.com/photo-1628763228607-ead5a5881057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 3, title: "Iron Legacy",  genres: ["Action","Thriller"],   rating: 7.8,
    duration: "142m", release: "Feb 2026",  formats: ["3D"],               status: "now_showing",
    revenue: 298, tickets: 3490, trending: -3.2,
    poster: "https://images.unsplash.com/photo-1677588027047-a15157dfce96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 4, title: "Void Runner",  genres: ["Fantasy","Epic"],      rating: 8.1,
    duration: "134m", release: "Apr 2026",  formats: ["IMAX"],             status: "coming_soon",
    revenue: 0,   tickets: 0,    trending: 0,
    poster: "https://images.unsplash.com/photo-1760930380017-b0f1fdad0242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 5, title: "Code Black",   genres: ["Thriller","Crime"],    rating: 8.6,
    duration: "118m", release: "Feb 2026",  formats: ["Dolby","3D"],       status: "now_showing",
    revenue: 265, tickets: 3080, trending: +2.8,
    poster: "https://images.unsplash.com/photo-1762468145669-943b551430d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 6, title: "Dark Signal",  genres: ["Horror","Mystery"],    rating: 7.5,
    duration: "95m",  release: "May 2026",  formats: ["2D"],               status: "coming_soon",
    revenue: 0,   tickets: 0,    trending: 0,
    poster: "https://images.unsplash.com/photo-1759230766134-e3ff1c27d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 7, title: "Star Breaker", genres: ["Sci-Fi","Adventure"],  rating: 8.9,
    duration: "151m", release: "Jun 2026",  formats: ["IMAX","4DX","Dolby"],status: "coming_soon",
    revenue: 0,   tickets: 0,    trending: 0,
    poster: "https://images.unsplash.com/photo-1597366812780-bc0f837f6ca6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
  {
    id: 8, title: "Midnight Heir",genres: ["Drama","Romance"],     rating: 7.2,
    duration: "112m", release: "Aug 2025",  formats: ["2D"],               status: "archived",
    revenue: 182, tickets: 2140, trending: 0,
    poster: "https://images.unsplash.com/photo-1668007470566-bd1e18d05fe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=160",
  },
];

/* ══════════════════════════════════
   KEBAB DROPDOWN
══════════════════════════════════ */
function KebabMenu({ movieId, onClose }: { movieId: number; onClose: () => void }) {
  const actions = [
    { icon: <Eye size={14} />,     label: "View Detail",     color: C.muted  },
    { icon: <Edit2 size={14} />,   label: "Edit Movie",      color: C.blue   },
    { icon: <Trash2 size={14} />,  label: "Delete Movie",    color: C.red    },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-8 z-50 rounded-2xl border overflow-hidden"
        style={{ minWidth: 172, backgroundColor: "#1a1a2e", borderColor: C.borderHi, boxShadow: "0 12px 40px rgba(0,0,0,0.7)", animation: "amPanelIn .2s both" }}>
        <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />
        {actions.map(({ icon, label, color }) => (
          <button key={label} onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 transition-colors hover:bg-white/5 text-left"
            style={{ borderBottom: label !== "Delete Movie" ? `1px solid rgba(255,255,255,0.05)` : "none" }}>
            <span style={{ color }}>{icon}</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: label === "Delete Movie" ? C.red : "rgba(255,255,255,0.65)" }}>{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════
   MOVIE CARD
══════════════════════════════════ */
function MovieCard({ movie }: { movie: typeof MOVIES[0] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sm = STATUS_META[movie.status];
  const pos = movie.trending > 0;

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, animation: "amSlideUp .28s both" }}>
      <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red}60,transparent)` }} />

      <div className="flex gap-3 p-4">
        {/* Poster */}
        <div className="rounded-xl overflow-hidden flex-shrink-0 border border-white/8"
          style={{ width: 64, height: 92 }}>
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white leading-tight" style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>{movie.title}</h3>
            <div className="relative flex-shrink-0">
              <button onClick={() => setMenuOpen(v => !v)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ backgroundColor: menuOpen ? "rgba(255,255,255,0.08)" : "transparent", color: C.muted }}>
                <MoreVertical size={16} />
              </button>
              {menuOpen && <KebabMenu movieId={movie.id} onClose={() => setMenuOpen(false)} />}
            </div>
          </div>

          {/* Rating + duration row */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              <Star size={10} fill="#f59e0b" stroke="none" />
              <span className="text-white" style={{ fontSize: "0.75rem", fontWeight: 800 }}>{movie.rating}</span>
            </div>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-1">
              <Clock size={10} style={{ color: C.dim }} />
              <span style={{ fontSize: "0.72rem", color: C.muted }}>{movie.duration}</span>
            </div>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center gap-1">
              <Calendar size={10} style={{ color: C.dim }} />
              <span style={{ fontSize: "0.72rem", color: C.muted }}>{movie.release}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {movie.genres.map(g => (
              <span key={g} className="px-2 py-0.5 rounded" style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.06)", color: C.muted }}>{g}</span>
            ))}
          </div>

          {/* Format tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {movie.formats.map(f => (
              <span key={f} className="px-2 py-0.5 rounded"
                style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", backgroundColor: `${FORMAT_COLOR[f]}18`, color: FORMAT_COLOR[f], border: `1px solid ${FORMAT_COLOR[f]}30` }}>
                {f}
              </span>
            ))}
          </div>

          {/* Status + trending row */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ fontSize: "0.6rem", fontWeight: 700, backgroundColor: sm.bg, color: sm.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sm.color }} />
              {sm.label}
            </span>
            {movie.trending !== 0 && (
              <span className="flex items-center gap-1" style={{ fontSize: "0.68rem", fontWeight: 700, color: pos ? C.green : C.red }}>
                {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {pos ? "+" : ""}{movie.trending}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Revenue strip (only for showing movies) */}
      {movie.revenue > 0 && (
        <div className="flex items-center justify-between px-4 py-2 border-t"
          style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.015)" }}>
          <span style={{ fontSize: "0.62rem", color: C.dim }}>Revenue this month</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: C.red }}>₫{movie.revenue}M</span>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   ADD MOVIE BOTTOM SHEET
══════════════════════════════════ */
function AddMovieSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
      <div className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl border-t border-x overflow-hidden"
        style={{ backgroundColor: "#0e0e16", borderColor: C.borderHi, maxHeight: "85vh", animation: "amSlideUp .32s cubic-bezier(.34,1.1,.64,1) both" }}>
        <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${C.red},transparent)` }} />

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: C.border }}>
          <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>Add New Movie</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border flex items-center justify-center" style={{ borderColor: C.border, color: C.muted }}>
            <X size={15} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4 pb-8">
          {[
            { label: "Movie Title", placeholder: "Enter movie title...", type: "text" },
            { label: "Director",    placeholder: "Director name",         type: "text" },
            { label: "Duration",    placeholder: "e.g. 120m",            type: "text" },
            { label: "Release Date",placeholder: "DD/MM/YYYY",           type: "text" },
          ].map(({ label, placeholder, type }) => (
            <div key={label}>
              <p className="uppercase mb-1.5" style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", color: C.dim }}>{label}</p>
              <input type={type} placeholder={placeholder}
                className="w-full bg-transparent text-white outline-none rounded-xl border px-4 h-11"
                style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)", fontSize: "0.88rem", caretColor: C.red }} />
            </div>
          ))}
          <button onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-white mt-2"
            style={{ background: `linear-gradient(135deg,${C.red},#c8111f)`, fontWeight: 900, fontSize: "0.95rem", boxShadow: `0 6px 24px ${C.redGlow}` }}>
            Create Movie
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════
   PAGE
══════════════════════════════════ */
export function AdminMobileMovies() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const STATUS_TABS = [
    { id: "all",         label: "All",         count: MOVIES.length },
    { id: "now_showing", label: "Showing",      count: MOVIES.filter(m => m.status === "now_showing").length },
    { id: "coming_soon", label: "Coming Soon",  count: MOVIES.filter(m => m.status === "coming_soon").length },
    { id: "archived",    label: "Archived",     count: MOVIES.filter(m => m.status === "archived").length },
  ];

  const FORMAT_CHIPS = ["all", "IMAX", "4DX", "Dolby", "3D", "2D"];

  const filtered = useMemo(() => MOVIES.filter(m => {
    const matchSearch = search === "" || m.title.toLowerCase().includes(search.toLowerCase()) || m.genres.some(g => g.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchFormat = formatFilter === "all" || m.formats.includes(formatFilter);
    return matchSearch && matchStatus && matchFormat;
  }), [search, statusFilter, formatFilter]);

  const hasFilters = search !== "" || statusFilter !== "all" || formatFilter !== "all";

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>
      <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activeId="movies" />
      <AdminMobileHeader onMenuOpen={() => setDrawerOpen(true)} />
      <AddMovieSheet open={addOpen} onClose={() => setAddOpen(false)} />

      {/* ── SEARCH ── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 h-11 rounded-2xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: search ? "rgba(255,255,255,0.15)" : C.border }}>
            <Search size={15} style={{ color: C.dim, flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search movies, genres..."
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: "0.85rem", caretColor: C.red }} />
            {search && (
              <button onClick={() => setSearch("")}><X size={13} style={{ color: C.dim }} /></button>
            )}
          </div>
          <button onClick={() => setSortOpen(v => !v)}
            className="w-11 h-11 rounded-2xl border flex items-center justify-center transition-all"
            style={{ borderColor: sortOpen ? `${C.red}40` : C.border, backgroundColor: sortOpen ? C.redSoft : "rgba(255,255,255,0.04)", color: sortOpen ? C.red : C.muted }}>
            <Filter size={16} />
          </button>
        </div>

        {/* Sort dropdown */}
        {sortOpen && (
          <div className="mt-2 rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#1a1a2e", borderColor: C.borderHi, animation: "amPanelIn .2s both" }}>
            {["Rating (High → Low)", "Revenue (High → Low)", "Release Date (Newest)", "Title (A → Z)"].map((opt, i) => (
              <button key={opt} onClick={() => setSortOpen(false)}
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 transition-colors"
                style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{opt}</span>
                {i === 0 && <Check size={12} style={{ color: C.red }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── STATUS TABS ── */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {STATUS_TABS.map(tab => (
          <button key={tab.id} onClick={() => setStatusFilter(tab.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              backgroundColor: statusFilter === tab.id ? (tab.id === "now_showing" ? "rgba(16,185,129,0.12)" : tab.id === "coming_soon" ? "rgba(245,158,11,0.12)" : tab.id === "archived" ? "rgba(255,255,255,0.06)" : C.redSoft) : "rgba(255,255,255,0.02)",
              borderColor: statusFilter === tab.id ? (tab.id === "now_showing" ? "rgba(16,185,129,0.3)" : tab.id === "coming_soon" ? "rgba(245,158,11,0.3)" : tab.id === "archived" ? "rgba(255,255,255,0.1)" : `${C.red}40`) : C.border,
              color: statusFilter === tab.id ? (tab.id === "now_showing" ? C.green : tab.id === "coming_soon" ? C.amber : tab.id === "archived" ? C.muted : C.red) : "rgba(255,255,255,0.35)",
              fontSize: "0.72rem", fontWeight: statusFilter === tab.id ? 700 : 500,
            }}>
            {tab.label}
            <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: "0.55rem", fontWeight: 800, backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── FORMAT CHIPS ── */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FORMAT_CHIPS.map(f => {
          const active = formatFilter === f;
          const clr = f === "all" ? C.red : FORMAT_COLOR[f];
          return (
            <button key={f} onClick={() => setFormatFilter(f)}
              className="px-3 py-1.5 rounded-xl border whitespace-nowrap flex-shrink-0 transition-all"
              style={{
                backgroundColor: active ? `${clr}18` : "rgba(255,255,255,0.02)",
                borderColor:     active ? `${clr}40` : C.border,
                color:           active ? clr : "rgba(255,255,255,0.3)",
                fontSize: "0.65rem", fontWeight: active ? 800 : 500,
              }}>
              {f === "all" ? "All Formats" : f}
            </button>
          );
        })}
      </div>

      {/* ── ADD MOVIE BUTTON ── */}
      <div className="px-4 pb-4">
        <button onClick={() => setAddOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white"
          style={{ background: `linear-gradient(135deg,${C.red},#c8111f)`, fontWeight: 900, fontSize: "0.9rem", boxShadow: `0 6px 24px ${C.redGlow}` }}>
          <Plus size={18} /> Add New Movie
        </button>
      </div>

      {/* ── STATS BAR ── */}
      <div className="flex items-center gap-3 mx-4 mb-4 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
        <Film size={13} style={{ color: C.red, flexShrink: 0 }} />
        <span style={{ fontSize: "0.72rem", color: C.muted }}>
          <span className="text-white font-bold">{filtered.length}</span> movies found
          {hasFilters && <span style={{ color: C.dim }}> (filtered)</span>}
        </span>
        {hasFilters && (
          <button onClick={() => { setSearch(""); setStatusFilter("all"); setFormatFilter("all"); }}
            className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ fontSize: "0.62rem", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.06)", color: C.muted }}>
            <X size={10} /> Reset
          </button>
        )}
      </div>

      {/* ── MOVIE LIST ── */}
      <div className="px-4 flex flex-col gap-3 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }}>
              <Film size={28} style={{ color: C.dim }} />
            </div>
            <p className="text-white" style={{ fontWeight: 700, fontSize: "0.95rem" }}>No movies found</p>
            <p style={{ fontSize: "0.72rem", color: C.dim, marginTop: 4 }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          filtered.map(movie => <MovieCard key={movie.id} movie={movie} />)
        )}
      </div>

      <AdminMobileBottomNav active="movies" />
      <style>{AM_KEYFRAMES}</style>
    </div>
  );
}
