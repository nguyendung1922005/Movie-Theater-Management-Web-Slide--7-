import { useState } from "react";
import { Link } from "react-router";
import {
  Search, Bell, Star, Clock, Play, ChevronRight,
  Flame, TrendingUp, Bookmark, Film, X,
} from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.28)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

const MOVIES = [
  {
    id:"your-name",    title:"Your Name",    genre:"Romance · Animation", rating:9.0, duration:"106m", format:"IMAX",  hot:true,
    poster:"https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
  {
    id:"neon-horizon", title:"Neon Horizon", genre:"Sci-Fi · Action",     rating:8.4, duration:"128m", format:"4DX",   hot:false,
    poster:"https://images.unsplash.com/photo-1628763228607-ead5a5881057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1628763228607-ead5a5881057?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
  {
    id:"iron-legacy",  title:"Iron Legacy",  genre:"Action · Thriller",   rating:7.8, duration:"142m", format:"3D",    hot:true,
    poster:"https://images.unsplash.com/photo-1677588027047-a15157dfce96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1677588027047-a15157dfce96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
  {
    id:"void-runner",  title:"Void Runner",  genre:"Fantasy · Epic",      rating:8.1, duration:"134m", format:"IMAX",  hot:false,
    poster:"https://images.unsplash.com/photo-1760930380017-b0f1fdad0242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1760930380017-b0f1fdad0242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
  {
    id:"code-black",   title:"Code Black",   genre:"Thriller · Crime",    rating:8.6, duration:"118m", format:"Dolby", hot:true,
    poster:"https://images.unsplash.com/photo-1762468145669-943b551430d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1762468145669-943b551430d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
  {
    id:"dark-signal",  title:"Dark Signal",  genre:"Horror · Mystery",    rating:7.5, duration:"95m",  format:"2D",    hot:false,
    poster:"https://images.unsplash.com/photo-1759230766134-e3ff1c27d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    hero:"https://images.unsplash.com/photo-1759230766134-e3ff1c27d20e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400",
  },
];

const NAV_LINKS = ["Now Showing", "Coming Soon", "Showtimes", "Promotions", "About"];
const FORMAT_CLR: Record<string,string> = { IMAX:"#3b82f6", "4DX":"#f59e0b", Dolby:"#8b5cf6", "3D":"#10b981", "2D":"rgba(255,255,255,0.2)" };

export function CineTabletHome() {
  const [activeNav, setActiveNav] = useState("Now Showing");
  const [search, setSearch] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const HERO = MOVIES[heroIdx];

  const toggleBm = (id: string) => setBookmarked(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ════════ HEADER ════════ */}
      <header className="sticky top-0 z-30 border-b"
        style={{ backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(24px)", borderColor: C.border }}>
        <div className="flex items-center gap-6 px-8 h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", boxShadow: `0 4px 16px ${C.redGlow}` }}>
              <Film size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white uppercase" style={{ fontWeight: 900, fontSize: "0.82rem", letterSpacing: "0.22em", lineHeight: 1 }}>CINEVERSE</p>
              <p style={{ fontSize: "0.44rem", fontWeight: 700, letterSpacing: "0.16em", color: C.red }}>CINEMA EXPERIENCE</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => setActiveNav(link)}
                className="px-4 py-2 rounded-xl transition-all whitespace-nowrap"
                style={{
                  fontSize: "0.8rem", fontWeight: activeNav === link ? 700 : 500,
                  backgroundColor: activeNav === link ? C.red + "18" : "transparent",
                  color: activeNav === link ? C.red : "rgba(255,255,255,0.5)",
                }}>
                {link}
              </button>
            ))}
          </nav>

          {/* Search bar */}
          <div className="flex items-center gap-2 px-3.5 rounded-xl border h-10"
            style={{ width: 220, backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
            <Search size={14} style={{ color: C.dim }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search movies..." className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: "0.82rem" }} />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: C.dim }} /></button>}
          </div>

          {/* Bell + avatar */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button className="relative w-9 h-9 rounded-xl border flex items-center justify-center"
              style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.03)", color: C.muted }}>
              <Bell size={16} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: C.red, fontSize: "0.44rem", fontWeight: 900 }}>2</span>
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.6rem", fontWeight: 900 }}>JD</div>
          </div>
        </div>
      </header>

      {/* ════════ HERO BANNER ════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: 440 }}>
        <img src={HERO.hero} alt={HERO.title} className="w-full h-full object-cover transition-all duration-500" />

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,#0a0a0f 0%,rgba(10,10,15,0.45) 55%,rgba(10,10,15,0.15) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(10,10,15,0.85) 0%,rgba(10,10,15,0.4) 40%,transparent 70%)" }} />

        {/* Live badge */}
        <div className="absolute top-6 left-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full"
          style={{ backgroundColor: C.red, boxShadow: `0 4px 20px ${C.redGlow}` }}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white uppercase" style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.18em" }}>Now Showing</span>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 px-8 pb-8" style={{ maxWidth: 480 }}>
          {/* Format + rating row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded text-white" style={{ fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.14em", backgroundColor: FORMAT_CLR[HERO.format] ?? C.red }}>{HERO.format}</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded" style={{ backgroundColor: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Star size={11} fill="#f59e0b" stroke="none" />
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#f59e0b" }}>{HERO.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={11} style={{ color: C.muted }} />
              <span style={{ fontSize: "0.72rem", color: C.muted }}>{HERO.duration}</span>
            </div>
          </div>

          <h1 className="text-white mb-2" style={{ fontWeight: 900, fontSize: "3rem", letterSpacing: "-0.05em", lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
            {HERO.title}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>{HERO.genre}</p>

          <div className="flex items-center gap-3">
            <Link to="/cine/tablet/movie"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white no-underline"
              style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontWeight: 800, fontSize: "0.9rem", boxShadow: `0 8px 28px ${C.redGlow}`, textDecoration: "none" }}>
              <Play size={16} fill="white" stroke="none" /> Book Tickets
            </Link>
            <button className="flex items-center gap-2 px-5 py-3 rounded-2xl border text-white"
              style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.06)", fontWeight: 600, fontSize: "0.85rem" }}>
              Watch Trailer
            </button>
          </div>
        </div>

        {/* Hero thumbnails — cycle */}
        <div className="absolute bottom-6 right-8 flex flex-col gap-2">
          {MOVIES.slice(0, 5).map((m, i) => (
            <button key={m.id} onClick={() => setHeroIdx(i)}
              className="w-16 h-10 rounded-xl overflow-hidden border-2 transition-all"
              style={{ borderColor: heroIdx === i ? C.red : "transparent", opacity: heroIdx === i ? 1 : 0.45, boxShadow: heroIdx === i ? `0 0 12px ${C.redGlow}` : "none" }}>
              <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ════════ NOW SHOWING GRID ════════ */}
      <div className="px-8 pt-8 pb-12">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.03em" }}>Now Showing</h2>
            <p style={{ fontSize: "0.72rem", color: C.dim }}>6 movies · Updated today</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter tabs */}
            {["All", "IMAX", "4DX", "Dolby"].map(f => (
              <button key={f} className="px-3.5 py-1.5 rounded-xl border text-sm transition-all"
                style={{ fontSize: "0.72rem", fontWeight: 600, borderColor: f === "All" ? C.red + "50" : C.border, backgroundColor: f === "All" ? C.red + "18" : "rgba(255,255,255,0.02)", color: f === "All" ? C.red : C.muted }}>
                {f}
              </button>
            ))}
            <Link to="/movies" className="flex items-center gap-1 no-underline" style={{ fontSize: "0.78rem", fontWeight: 700, color: C.red, textDecoration: "none" }}>
              See All <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-3 gap-5">
          {MOVIES.map(movie => (
            <div key={movie.id} className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1"
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>

              {/* Poster */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(19,19,32,0.95) 0%, rgba(19,19,32,0.3) 45%, transparent 70%)" }} />

                {/* Format badge */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-white"
                  style={{ fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.12em", backgroundColor: FORMAT_CLR[movie.format] ?? C.red }}>
                  {movie.format}
                </span>

                {/* Hot badge */}
                {movie.hot && (
                  <div className="absolute top-3 right-10 flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                    <Flame size={9} fill="#f59e0b" stroke="none" />
                    <span style={{ fontSize: "0.52rem", fontWeight: 800, color: "#f59e0b" }}>HOT</span>
                  </div>
                )}

                {/* Bookmark */}
                <button onClick={() => toggleBm(movie.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Bookmark size={13} fill={bookmarked.includes(movie.id) ? C.red : "none"} stroke={bookmarked.includes(movie.id) ? C.red : "rgba(255,255,255,0.5)"} />
                </button>

                {/* Rating overlay */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  <Star size={11} fill="#f59e0b" stroke="none" />
                  <span className="text-white" style={{ fontWeight: 800, fontSize: "0.75rem" }}>{movie.rating}</span>
                </div>

                {/* Play on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "2px solid rgba(255,255,255,0.2)" }}>
                    <Play size={20} fill="white" stroke="none" />
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div>
                  <h3 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>{movie.title}</h3>
                  <p style={{ fontSize: "0.68rem", color: C.dim, marginTop: "2px" }}>{movie.genre}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={11} style={{ color: C.muted }} />
                  <span style={{ fontSize: "0.68rem", color: C.muted }}>{movie.duration}</span>
                </div>

                {/* Showtimes preview */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {["10:15", "14:30", "19:45"].map(t => (
                    <span key={t} className="px-2 py-1 rounded-lg border"
                      style={{ fontSize: "0.62rem", fontWeight: 600, borderColor: C.border, backgroundColor: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)" }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Book button */}
                <Link to="/cine/tablet/movie"
                  className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl text-white no-underline transition-all"
                  style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontSize: "0.8rem", fontWeight: 800, boxShadow: `0 4px 16px ${C.redGlow}`, textDecoration: "none" }}>
                  Book Now <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon promo strip */}
        <div className="mt-8 rounded-2xl overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, #1a0810 0%, #0a0a0f 60%, #0a1020 100%)`, border: `1px solid ${C.border}` }}>
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.red} 50%, transparent)` }} />
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp size={14} style={{ color: C.red }} />
                <span className="uppercase" style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", color: C.red }}>Coming Soon</span>
              </div>
              <p className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem" }}>12 upcoming blockbusters this month</p>
              <p style={{ fontSize: "0.72rem", color: C.dim, marginTop: "3px" }}>Get early access & exclusive discounts for Gold Members</p>
            </div>
            <Link to="/coming-soon" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white no-underline flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: `0 4px 16px ${C.redGlow}` }}>
              Explore <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
