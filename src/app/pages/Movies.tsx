import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  Search,
  ChevronDown,
  Star,
  Calendar,
  Film,
  Ticket,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */

const ALL_MOVIES = [
  {
    id: "your-name",
    title: "Your Name",
    originalTitle: "君の名は。",
    poster: "https://images.unsplash.com/photo-1732384469370-ccd6605f4570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG5pZ2h0JTIwc2t5JTIwY29tZXQlMjBjaW5lbWF0aWMlMjBwb3N0ZXJ8ZW58MXx8fHwxNzcyNDQ0MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.4,
    genre: "Romance",
    formats: ["2D", "3D"],
    status: "now-showing",
    releaseDate: "Feb 15, 2026",
  },
  {
    id: "eternal-love",
    title: "Eternal Love",
    originalTitle: "Forever in Your Heart",
    poster: "https://images.unsplash.com/photo-1765510296004-614b6cc204da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbW92aWUlMjBwb3N0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzcyNDQ1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 7.8,
    genre: "Romance",
    formats: ["2D"],
    status: "now-showing",
    releaseDate: "Feb 20, 2026",
  },
  {
    id: "future-zone",
    title: "Future Zone",
    originalTitle: "The Last Frontier",
    poster: "https://images.unsplash.com/photo-1708348201502-423c75f6fe4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBtb3ZpZSUyMHBvc3RlciUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNDE5Mjg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.1,
    genre: "Sci-Fi",
    formats: ["2D", "3D", "IMAX"],
    status: "now-showing",
    releaseDate: "Jan 30, 2026",
  },
  {
    id: "midnight-horror",
    title: "Midnight Horror",
    originalTitle: "Don't Close Your Eyes",
    poster: "https://images.unsplash.com/photo-1620489867172-890a08b2228b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlciUyMGRhcmt8ZW58MXx8fHwxNzcyMzg5Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 7.3,
    genre: "Horror",
    formats: ["2D"],
    status: "now-showing",
    releaseDate: "Feb 1, 2026",
  },
  {
    id: "epic-quest",
    title: "Epic Quest",
    originalTitle: "Journey Beyond",
    poster: "https://images.unsplash.com/photo-1541938434-311f13db9500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3ZpZSUyMHBvc3RlciUyMGVwaWN8ZW58MXx8fHwxNzcyNDM0NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.6,
    genre: "Adventure",
    formats: ["2D", "3D"],
    status: "now-showing",
    releaseDate: "Feb 10, 2026",
  },
  {
    id: "laugh-out-loud",
    title: "Laugh Out Loud",
    originalTitle: "Comedy of Errors",
    poster: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHBvc3RlciUyMGJyaWdodHxlbnwxfHx8fDE3NzI0NDUzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 7.5,
    genre: "Comedy",
    formats: ["2D"],
    status: "now-showing",
    releaseDate: "Feb 25, 2026",
  },
  {
    id: "drama-life",
    title: "A Life Worth Living",
    originalTitle: "Drama of the Heart",
    poster: "https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMGNpbmVtYSUyMGZpbG0lMjBwb3N0ZXJ8ZW58MXx8fHwxNzcyNDQ1MzA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.0,
    genre: "Drama",
    formats: ["2D"],
    status: "now-showing",
    releaseDate: "Feb 5, 2026",
  },
  {
    id: "thriller-edge",
    title: "On the Edge",
    originalTitle: "Suspense Unlimited",
    poster: "https://images.unsplash.com/photo-1762115445557-967c1504ffe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMHN1c3BlbnNlJTIwbW92aWUlMjBkYXJrfGVufDF8fHx8MTc3MjQ0NTMwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 7.9,
    genre: "Thriller",
    formats: ["2D"],
    status: "now-showing",
    releaseDate: "Jan 25, 2026",
  },
  // Coming Soon
  {
    id: "magic-realm",
    title: "Magic Realm",
    originalTitle: "Kingdom of Wonders",
    poster: "https://images.unsplash.com/photo-1763244734635-72b34a167bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbWFnaWMlMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NzI0NDUzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.2,
    genre: "Fantasy",
    formats: ["2D", "3D", "IMAX"],
    status: "coming-soon",
    releaseDate: "Mar 15, 2026",
  },
  {
    id: "space-wars",
    title: "Space Wars: Reckoning",
    originalTitle: "Galactic Conflict",
    poster: "https://images.unsplash.com/photo-1708348201502-423c75f6fe4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBtb3ZpZSUyMHBvc3RlciUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNDE5Mjg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.5,
    genre: "Sci-Fi",
    formats: ["2D", "3D", "IMAX"],
    status: "coming-soon",
    releaseDate: "Apr 1, 2026",
  },
  {
    id: "love-again",
    title: "Love Again",
    originalTitle: "Second Chances",
    poster: "https://images.unsplash.com/photo-1765510296004-614b6cc204da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbW92aWUlMjBwb3N0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzcyNDQ1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 7.6,
    genre: "Romance",
    formats: ["2D"],
    status: "coming-soon",
    releaseDate: "Mar 20, 2026",
  },
  {
    id: "action-hero",
    title: "Action Hero Returns",
    originalTitle: "The Final Mission",
    poster: "https://images.unsplash.com/photo-1541938434-311f13db9500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3ZpZSUyMHBvc3RlciUyMGVwaWN8ZW58MXx8fHwxNzcyNDM0NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 8.3,
    genre: "Action",
    formats: ["2D", "3D"],
    status: "coming-soon",
    releaseDate: "Apr 10, 2026",
  },
];

const GENRES = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];
const FORMATS = ["All Formats", "2D", "3D", "IMAX"];

/* ─── Header ─────────────────────────────────────────────────── */

function StickyHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/6"
      style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-screen-xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
          style={{ fontSize: "0.82rem", fontWeight: 500 }}
        >
          <ChevronLeft size={18} />
          Home
        </Link>
        <span
          className="text-white"
          style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.15em" }}
        >
          CINEMA
        </span>
        <div className="w-20" />
      </div>
    </header>
  );
}

/* ─── Tab Bar ────────────────────────────────────────────────── */

function TabBar({ active, onChange }: { active: "now-showing" | "coming-soon"; onChange: (tab: "now-showing" | "coming-soon") => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange("now-showing")}
        className="relative px-6 py-3 rounded-xl transition-all duration-200"
        style={{
          backgroundColor: active === "now-showing" ? "#e8192c" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${active === "now-showing" ? "#e8192c" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <div className="flex items-center gap-2">
          <Film size={16} className={active === "now-showing" ? "text-white" : "text-white/40"} />
          <span
            className={active === "now-showing" ? "text-white" : "text-white/50"}
            style={{ fontWeight: 700, fontSize: "0.88rem" }}
          >
            Now Showing
          </span>
        </div>
      </button>
      <button
        onClick={() => onChange("coming-soon")}
        className="relative px-6 py-3 rounded-xl transition-all duration-200"
        style={{
          backgroundColor: active === "coming-soon" ? "#e8192c" : "rgba(255,255,255,0.04)",
          border: `1.5px solid ${active === "coming-soon" ? "#e8192c" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} className={active === "coming-soon" ? "text-white" : "text-white/40"} />
          <span
            className={active === "coming-soon" ? "text-white" : "text-white/50"}
            style={{ fontWeight: 700, fontSize: "0.88rem" }}
          >
            Coming Soon
          </span>
        </div>
      </button>
    </div>
  );
}

/* ─── Filters Bar ────────────────────────────────────────────── */

function FiltersBar({
  search,
  setSearch,
  genre,
  setGenre,
  format,
  setFormat,
}: {
  search: string;
  setSearch: (s: string) => void;
  genre: string;
  setGenre: (g: string) => void;
  format: string;
  setFormat: (f: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="flex-1 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/4 text-white placeholder-white/25 outline-none transition-all focus:border-white/20"
          style={{ fontSize: "0.88rem" }}
        />
      </div>

      {/* Genre dropdown */}
      <Dropdown
        label="Genre"
        options={GENRES}
        selected={genre}
        onSelect={setGenre}
      />

      {/* Format dropdown */}
      <Dropdown
        label="Format"
        options={FORMATS}
        selected={format}
        onSelect={setFormat}
      />
    </div>
  );
}

function Dropdown({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-white/10 flex items-center gap-2 transition-all hover:border-white/20"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", minWidth: "140px" }}
      >
        <span className="text-white/50" style={{ fontSize: "0.75rem" }}>
          {label}:
        </span>
        <span className="text-white flex-1 text-left" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
          {selected}
        </span>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 overflow-hidden z-50 max-h-64 overflow-y-auto"
            style={{ backgroundColor: "#111118" }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                style={{
                  backgroundColor: selected === opt ? "rgba(232,25,44,0.08)" : "transparent",
                  color: selected === opt ? "#ffffff" : "rgba(255,255,255,0.7)",
                  fontSize: "0.82rem",
                  fontWeight: selected === opt ? 700 : 500,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Movie Card ─────────────────────────────────────────────── */

function MovieCard({ movie }: { movie: typeof ALL_MOVIES[0] }) {
  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden flex flex-col group"
      style={{ backgroundColor: "#111118" }}
    >
      {/* Poster */}
      <Link
        to={`/movie/${movie.id}`}
        className="relative overflow-hidden"
        style={{ aspectRatio: "2/3" }}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 50%)",
          }}
        />
        {/* Format badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {movie.formats.map((fmt) => {
            const colors: Record<string, string> = {
              "2D": "#4a90e2",
              "3D": "#7b2d8b",
              "IMAX": "#c47a00",
            };
            return (
              <span
                key={fmt}
                className="px-2 py-1 rounded text-white"
                style={{
                  backgroundColor: colors[fmt],
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {fmt}
              </span>
            );
          })}
        </div>
        {/* Status badge */}
        {movie.status === "coming-soon" && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: "rgba(232,25,44,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-white" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em" }}>
              COMING SOON
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-white/35 truncate" style={{ fontSize: "0.68rem", letterSpacing: "0.05em" }}>
            {movie.originalTitle}
          </p>
          <Link
            to={`/movie/${movie.id}`}
            className="text-white hover:text-[#e8192c] transition-colors"
            style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}
          >
            <h3 className="line-clamp-2 leading-tight mt-0.5">{movie.title}</h3>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(245,197,24,0.12)" }}>
            <Star size={11} fill="#f5c518" className="text-[#f5c518]" />
            <span className="text-[#f5c518]" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
              {movie.rating}
            </span>
          </div>
          <span className="text-white/30" style={{ fontSize: "0.72rem" }}>
            {movie.genre}
          </span>
        </div>

        {movie.status === "coming-soon" && (
          <div className="flex items-center gap-1.5 text-white/40">
            <Calendar size={12} />
            <span style={{ fontSize: "0.72rem" }}>{movie.releaseDate}</span>
          </div>
        )}

        {/* Button */}
        <Link
          to={movie.status === "now-showing" ? "/showtimes" : `/movie/${movie.id}`}
          className="mt-auto w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: movie.status === "now-showing" ? "#e8192c" : "rgba(232,25,44,0.15)",
            border: `1.5px solid ${movie.status === "now-showing" ? "#e8192c" : "rgba(232,25,44,0.3)"}`,
            color: "#ffffff",
          }}
        >
          <Ticket size={16} />
          <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>
            {movie.status === "now-showing" ? "Book Tickets" : "View Details"}
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export function Movies() {
  const [tab, setTab] = useState<"now-showing" | "coming-soon">("now-showing");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [format, setFormat] = useState("All Formats");

  // Filter movies
  const filtered = ALL_MOVIES.filter((m) => {
    if (m.status !== tab) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (genre !== "All" && m.genre !== genre) return false;
    if (format !== "All Formats" && !m.formats.includes(format)) return false;
    return true;
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter','system-ui',sans-serif" }}
    >
      <StickyHeader />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1
            className="text-white"
            style={{ fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2rem)", letterSpacing: "-0.02em" }}
          >
            Browse Movies
          </h1>
          <p className="text-white/35 mt-1" style={{ fontSize: "0.88rem" }}>
            Discover and book tickets for the latest releases
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-6">
          <TabBar active={tab} onChange={setTab} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FiltersBar
            search={search}
            setSearch={setSearch}
            genre={genre}
            setGenre={setGenre}
            format={format}
            setFormat={setFormat}
          />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Film size={16} className="text-white/40" />
            <span className="text-white/50" style={{ fontSize: "0.85rem" }}>
              {filtered.length} {filtered.length === 1 ? "movie" : "movies"} found
            </span>
          </div>
          {(search || genre !== "All" || format !== "All Formats") && (
            <button
              onClick={() => {
                setSearch("");
                setGenre("All");
                setFormat("All Formats");
              }}
              className="text-[#e8192c] hover:text-[#c8111f] transition-colors"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-white/8 p-12 text-center"
            style={{ backgroundColor: "#111118" }}
          >
            <Film size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              No movies found
            </h3>
            <p className="text-white/40 mb-4" style={{ fontSize: "0.85rem" }}>
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearch("");
                setGenre("All");
                setFormat("All Formats");
              }}
              className="px-5 py-2.5 rounded-lg bg-[#e8192c] hover:bg-[#c8111f] text-white transition-all"
              style={{ fontSize: "0.85rem", fontWeight: 700 }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
