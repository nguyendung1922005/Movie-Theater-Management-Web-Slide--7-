import { useState } from "react";
import { Link } from "react-router";
import {
  Menu, X, Search, Star, Clock, ChevronRight,
  Play, Bookmark, TrendingUp, Flame, Film,
} from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#111118",
  card:    "#161620",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.32)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

const MOVIES = [
  {
    id: "your-name", title: "Your Name", genre: "Romance · Animation",
    rating: 9.0, duration: "106m", badge: "IMAX",
    poster: "https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: true,
  },
  {
    id: "neon-horizon", title: "Neon Horizon", genre: "Sci-Fi · Action",
    rating: 8.4, duration: "128m", badge: "4DX",
    poster: "https://images.unsplash.com/photo-1628763228607-ead5a5881057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: false,
  },
  {
    id: "iron-legacy", title: "Iron Legacy", genre: "Action · Thriller",
    rating: 7.8, duration: "142m", badge: "3D",
    poster: "https://images.unsplash.com/photo-1677588027047-a15157dfce96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: true,
  },
  {
    id: "void-runner", title: "Void Runner", genre: "Fantasy · Epic",
    rating: 8.1, duration: "134m", badge: "IMAX",
    poster: "https://images.unsplash.com/photo-1760930380017-b0f1fdad0242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: false,
  },
  {
    id: "code-black", title: "Code Black", genre: "Thriller · Crime",
    rating: 8.6, duration: "118m", badge: "Dolby",
    poster: "https://images.unsplash.com/photo-1762468145669-943b551430d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: true,
  },
  {
    id: "dark-signal", title: "Dark Signal", genre: "Horror · Mystery",
    rating: 7.5, duration: "95m", badge: "2D",
    poster: "https://images.unsplash.com/photo-1759230766134-e3ff1c27d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    hot: false,
  },
];

const HERO = MOVIES[0];

function DrawerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 transition-all duration-300"
        style={{ backgroundColor: open ? "rgba(0,0,0,0.7)" : "transparent", backdropFilter: open ? "blur(6px)" : "none", pointerEvents: open ? "auto" : "none" }} />
      <div className="fixed top-0 left-0 h-full z-50 flex flex-col"
        style={{ width: "72vw", maxWidth: 280, backgroundColor: C.surface, borderRight: `1px solid ${C.border}`, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(.34,1.1,.64,1)" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.2em" }}>CINEVERSE</p>
            <p style={{ fontSize: "0.55rem", color: C.red, fontWeight: 700, letterSpacing: "0.15em" }}>CINEMA EXPERIENCE</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center border" style={{ borderColor: C.border, color: C.muted }}>
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
          {[
            { icon: <Flame size={16} />, label: "Now Showing", active: true },
            { icon: <TrendingUp size={16} />, label: "Coming Soon", active: false },
            { icon: <Film size={16} />, label: "All Movies", active: false },
            { icon: <Clock size={16} />, label: "Showtimes", active: false },
            { icon: <Star size={16} />, label: "Promotions", active: false },
          ].map(({ icon, label, active }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all cursor-pointer"
              style={{ backgroundColor: active ? C.red + "18" : "transparent", border: `1px solid ${active ? C.red + "30" : "transparent"}` }}>
              <span style={{ color: active ? C.red : C.muted }}>{icon}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: active ? 700 : 500, color: active ? C.red : "rgba(255,255,255,0.65)" }}>{label}</span>
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div className="px-4 pb-6">
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: C.card, borderColor: C.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8192c] to-[#a00e1f] flex items-center justify-center text-white" style={{ fontSize: "0.7rem", fontWeight: 900 }}>JD</div>
              <div>
                <p className="text-white" style={{ fontWeight: 700, fontSize: "0.85rem" }}>John Doe</p>
                <p style={{ fontSize: "0.65rem", color: C.muted }}>Gold Member · 2,450 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CineMobileHome() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4"
        style={{ height: 56, backgroundColor: "rgba(10,10,15,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.04)" }}>
          <Menu size={18} style={{ color: C.muted }} />
        </button>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.25em" }}>CINEVERSE</p>
        </div>

        <button onClick={() => setSearchOpen(v => !v)} className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ borderColor: searchOpen ? C.red + "50" : C.border, backgroundColor: searchOpen ? C.red + "18" : "rgba(255,255,255,0.04)", color: searchOpen ? C.red : C.muted }}>
          <Search size={17} />
        </button>
      </header>

      {/* Search expand */}
      {searchOpen && (
        <div className="sticky top-14 z-20 px-4 py-2" style={{ backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 px-3 rounded-xl border h-10" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
            <Search size={14} style={{ color: C.dim }} />
            <input autoFocus type="text" placeholder="Search movies, genres..." className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: "0.85rem" }} />
          </div>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 480 }}>
        <img src={HERO.poster} alt={HERO.title} className="w-full h-full object-cover" />
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #0a0a0f 0%, rgba(10,10,15,0.55) 50%, rgba(10,10,15,0.15) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,15,0.6) 0%, transparent 60%)" }} />

        {/* Now Showing pill */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: C.red, boxShadow: `0 4px 16px ${C.redGlow}` }}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white uppercase" style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.16em" }}>Now Showing</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          {/* Badge */}
          <span className="inline-block px-2 py-0.5 rounded mb-3 text-white"
            style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.14em", backgroundColor: C.red }}>
            {HERO.badge}
          </span>

          <h1 className="text-white mb-1.5" style={{ fontWeight: 900, fontSize: "2.2rem", letterSpacing: "-0.04em", lineHeight: 1, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
            {HERO.title}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginBottom: "10px" }}>{HERO.genre}</p>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              <Star size={13} fill="#f59e0b" stroke="none" />
              <span className="text-white" style={{ fontWeight: 800, fontSize: "0.85rem" }}>{HERO.rating}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-1">
              <Clock size={12} style={{ color: C.muted }} />
              <span style={{ fontSize: "0.78rem", color: C.muted }}>{HERO.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cine/mobile/seats" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white no-underline"
              style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, boxShadow: `0 6px 24px ${C.redGlow}`, fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
              <Play size={16} fill="white" stroke="none" /> Book Now
            </Link>
            <button className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center"
              style={{ borderColor: C.red + "60", backgroundColor: C.red + "12" }}>
              <Bookmark size={18} style={{ color: C.red }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── NOW SHOWING ── */}
      <div className="px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Now Showing</h2>
            <p style={{ fontSize: "0.65rem", color: C.dim }}>6 movies available today</p>
          </div>
          <Link to="/movies" className="flex items-center gap-1 no-underline" style={{ fontSize: "0.72rem", fontWeight: 700, color: C.red, textDecoration: "none" }}>
            See All <ChevronRight size={13} />
          </Link>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-2 gap-3">
          {MOVIES.map(movie => (
            <div key={movie.id} className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              
              {/* Poster */}
              <div className="relative" style={{ aspectRatio: "2/3", overflow: "hidden" }}>
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,10,15,0.9) 0%, transparent 50%)" }} />

                {/* Format badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-white"
                  style={{ fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.1em", backgroundColor: C.red }}>
                  {movie.badge}
                </span>

                {/* Hot badge */}
                {movie.hot && (
                  <span className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: "#f59e0b18", border: "1px solid #f59e0b40" }}>
                    <Flame size={11} fill="#f59e0b" stroke="none" />
                  </span>
                )}

                {/* Bookmark */}
                <button
                  onClick={() => setBookmarked(b => b.includes(movie.id) ? b.filter(x => x !== movie.id) : [...b, movie.id])}
                  className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Bookmark size={12} fill={bookmarked.includes(movie.id) ? C.red : "none"} stroke={bookmarked.includes(movie.id) ? C.red : "rgba(255,255,255,0.5)"} />
                </button>

                {/* Rating */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <Star size={10} fill="#f59e0b" stroke="none" />
                  <span className="text-white" style={{ fontSize: "0.68rem", fontWeight: 800 }}>{movie.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-white" style={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.25 }}>{movie.title}</p>
                  <p style={{ fontSize: "0.62rem", color: C.dim, marginTop: "2px" }}>{movie.genre}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-auto">
                  <Clock size={10} style={{ color: C.muted }} />
                  <span style={{ fontSize: "0.6rem", color: C.muted }}>{movie.duration}</span>
                </div>
                <Link to="/cine/mobile/seats"
                  className="flex items-center justify-center py-2 rounded-xl text-white no-underline mt-1"
                  style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontSize: "0.72rem", fontWeight: 800, boxShadow: `0 4px 12px ${C.redGlow}`, textDecoration: "none" }}>
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
