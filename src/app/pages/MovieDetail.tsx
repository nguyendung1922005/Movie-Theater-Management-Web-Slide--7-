import { useState, useRef } from "react";
import { Link } from "react-router";
import {
  Star,
  Clock,
  Calendar,
  Play,
  ChevronLeft,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  MapPin,
  Check,
  Volume2,
  Maximize2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

/* ─── Constants ──────────────────────────────────────────────── */

const HERO_BG =
  "https://images.unsplash.com/photo-1642970047659-f8af20bc8f18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNpbmVtYXRpYyUyMGNvbWV0JTIwbmlnaHQlMjBza3klMjBkcmFtYXRpY3xlbnwxfHx8fDE3NzI0NDI0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1920";

const MOVIE_POSTER =
  "https://images.unsplash.com/photo-1636755393526-a2249074de99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNpbmVtYXRpYyUyMG5pZ2h0JTIwc2t5JTIwY2l0eXNjYXBlJTIweW91ciUyMG5hbWV8ZW58MXx8fHwxNzcyNDQxODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080";

const TRAILER_THUMB =
  "https://images.unsplash.com/photo-1763471388390-acc428addf0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHN0aWxsJTIwc2t5JTIwY2xvdWRzJTIwYmVhdXRpZnVsJTIwc2NlbmVyeXxlbnwxfHx8fDE3NzI0NDI0NDd8MA&ixlib=rb-4.1.0&q=80&w=1920";

const CAST = [
  {
    id: 1,
    name: "Ryunosuke Kamiki",
    role: "Taki Tachibana (Voice)",
    img: "https://images.unsplash.com/photo-1632653223454-ca18a3777b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGphcGFuZXNlJTIwbWFuJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0NDI0MzR8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 2,
    name: "Mone Kamishiraishi",
    role: "Mitsuha Miyamizu (Voice)",
    img: "https://images.unsplash.com/photo-1769132685503-5fe927404d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGphcGFuZXNlJTIwd29tYW4lMjBwb3J0cmFpdCUyMGFjdHJlc3MlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0NDI0NDB8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 3,
    name: "Makoto Shinkai",
    role: "Director / Writer",
    img: "https://images.unsplash.com/photo-1582828102977-7210c1096e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGRpcmVjdG9yJTIwZmlsbW1ha2VyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNDQyNDQzfDA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 4,
    name: "RADWIMPS",
    role: "Music Composer",
    img: "https://images.unsplash.com/photo-1585224332260-8d7f40fc4c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY29tcG9zZXIlMjBtdXNpY2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjQ0MjQ0NHww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 5,
    name: "Aoi Yuki",
    role: "Yotsuha Miyamizu (Voice)",
    img: "https://images.unsplash.com/photo-1753434463009-c1c2a3cf1857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBhY3RyZXNzJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NzI0NDI0NDd8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    id: 6,
    name: "Nobunaga Shimazaki",
    role: "Katsuhiko Teshigawara (Voice)",
    img: "https://images.unsplash.com/photo-1767607746719-38c73b45cd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGFjdG9yJTIwcG9ydHJhaXQlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzI0NDI0NDN8MA&ixlib=rb-4.1.0&q=80&w=400",
  },
];

const SHOWTIMES = [
  { id: 1, time: "10:15 AM", format: "2D", seats: 42, available: true },
  { id: 2, time: "12:30 PM", format: "3D", seats: 18, available: true },
  { id: 3, time: "03:00 PM", format: "IMAX", seats: 7, available: true },
  { id: 4, time: "05:45 PM", format: "2D", seats: 0, available: false },
  { id: 5, time: "08:15 PM", format: "3D", seats: 55, available: true },
  { id: 6, time: "10:30 PM", format: "IMAX", seats: 31, available: true },
];

const FORMAT_COLORS: Record<string, string> = {
  "2D": "#4a90e2",
  "3D": "#7b2d8b",
  IMAX: "#c47a00",
};

/* ─── Sub-components ─────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <div key={i} className="relative w-5 h-5">
            {/* background star */}
            <Star size={20} className="text-white/15" fill="currentColor" />
            {/* filled overlay */}
            {(filled || half) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star size={20} className="text-[#f5c518]" fill="currentColor" />
              </div>
            )}
          </div>
        );
      })}
      <span className="ml-2 text-[#f5c518]" style={{ fontWeight: 700, fontSize: "1rem" }}>
        {rating}
      </span>
      <span className="text-white/35" style={{ fontSize: "0.85rem" }}>
        / 5.0
      </span>
      <span className="ml-1 text-white/30" style={{ fontSize: "0.8rem" }}>
        (128,430 reviews)
      </span>
    </div>
  );
}

function CastScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CAST.map((member) => (
          <div key={member.id} className="flex-shrink-0 flex flex-col items-center gap-3 w-24 group">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#e8192c]/60 transition-colors duration-300">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="text-center">
              <p
                className="text-white leading-tight"
                style={{ fontWeight: 600, fontSize: "0.78rem", lineHeight: 1.3 }}
              >
                {member.name}
              </p>
              <p className="text-white/40 mt-0.5" style={{ fontSize: "0.68rem", lineHeight: 1.3 }}>
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-[#1a1a24] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function TrailerPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
      {/* Thumbnail + overlay */}
      {!playing && (
        <>
          <img
            src={TRAILER_THUMB}
            alt="Trailer thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Cinematic letterbox lines */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-black" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black" />

          {/* Play button */}
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
          >
            <div className="w-20 h-20 rounded-full bg-[#e8192c]/90 border-4 border-white/20 flex items-center justify-center shadow-2xl shadow-[#e8192c]/40 group-hover:scale-110 group-hover:bg-[#e8192c] transition-all duration-300">
              <Play size={28} fill="white" className="text-white ml-1.5" />
            </div>
            <span className="text-white/80 uppercase" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em" }}>
              Play Official Trailer
            </span>
          </button>

          {/* Bottom controls mockup */}
          <div className="absolute bottom-10 left-0 right-0 px-5 pb-3 pt-6 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-[#e8192c] rounded-full" />
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <Volume2 size={14} />
              <span style={{ fontSize: "0.72rem" }}>0:00 / 2:34</span>
              <Maximize2 size={14} />
            </div>
          </div>
        </>
      )}

      {/* Actual YouTube embed when playing */}
      {playing && (
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/xU47nhruN-Q?autoplay=1&rel=0"
          title="Your Name Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

function BookingSidebar() {
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(2);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const selected = SHOWTIMES.find((s) => s.id === selectedShowtime);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Poster card */}
      <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ aspectRatio: "2/3" }}>
        <img src={MOVIE_POSTER} alt="Your Name Poster" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/90 via-transparent to-transparent" />

        {/* Action buttons on poster */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200 ${
              liked ? "bg-[#e8192c] border-[#e8192c]" : "bg-black/50 border-white/20 hover:border-white/40"
            }`}
          >
            <Heart size={15} fill={liked ? "white" : "none"} className="text-white" />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200 ${
              saved ? "bg-[#4a90e2] border-[#4a90e2]" : "bg-black/50 border-white/20 hover:border-white/40"
            }`}
          >
            <Bookmark size={15} fill={saved ? "white" : "none"} className="text-white" />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all text-white">
            <Share2 size={15} />
          </button>
        </div>

        {/* Bottom poster info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={11} className="text-[#e8192c]" />
            <span className="text-white/60" style={{ fontSize: "0.72rem" }}>
              CINEMA Hollywood, CA
            </span>
          </div>
          <div className="h-px bg-white/10 mb-2" />
          <p className="text-white/40" style={{ fontSize: "0.7rem" }}>PG · 1h 46m · Japanese / English Sub</p>
        </div>
      </div>

      {/* Booking Card */}
      <div className="rounded-xl bg-[#111118] border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
          <div>
            <p className="text-white/40 uppercase mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
              Today's Showtimes
            </p>
            <div className="flex items-center gap-1.5 text-white/70">
              <Calendar size={13} className="text-[#e8192c]" />
              <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{today}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#e8192c]/15 text-[#e8192c] uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em" }}>
            Live
          </span>
        </div>

        {/* Showtimes Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5">
          {SHOWTIMES.map((show) => (
            <button
              key={show.id}
              disabled={!show.available}
              onClick={() => setSelectedShowtime(show.id)}
              className={`relative flex flex-col items-start gap-1 p-3 rounded-lg border transition-all duration-200 text-left ${
                !show.available
                  ? "opacity-35 cursor-not-allowed border-white/5 bg-transparent"
                  : selectedShowtime === show.id
                  ? "border-[#e8192c] bg-[#e8192c]/10"
                  : "border-white/8 bg-[#0d0d14] hover:border-white/20"
              }`}
            >
              {/* Selected checkmark */}
              {selectedShowtime === show.id && show.available && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#e8192c] flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>
              )}

              <span
                className="text-white"
                style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1 }}
              >
                {show.time}
              </span>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="px-1.5 py-0.5 rounded text-white uppercase"
                  style={{
                    backgroundColor: FORMAT_COLORS[show.format],
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {show.format}
                </span>
                <span
                  className={show.available ? (show.seats <= 10 ? "text-[#f5a623]" : "text-white/40") : "text-white/25"}
                  style={{ fontSize: "0.68rem" }}
                >
                  {show.available ? `${show.seats} seats` : "Sold out"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="mx-4 h-px bg-white/6" />

        {/* Selected summary */}
        {selected && (
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>Selected showtime</p>
              <p className="text-white" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {selected.time}{" "}
                <span
                  className="px-1.5 py-0.5 rounded text-white ml-1"
                  style={{
                    backgroundColor: FORMAT_COLORS[selected.format],
                    fontSize: "0.6rem",
                    fontWeight: 700,
                  }}
                >
                  {selected.format}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40" style={{ fontSize: "0.7rem" }}>From</p>
              <p className="text-white" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                $12.50
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-4 pb-4 pt-1">
          <Link
            to="/movie/your-name/seats"
            className="w-full py-3.5 rounded-lg bg-[#e8192c] text-white hover:bg-[#c8111f] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#e8192c]/25 flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: "0.92rem", letterSpacing: "0.04em" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9l9-6 9 6M3 9h18" />
            </svg>
            Select Seats
          </Link>
          <p className="text-center text-white/25 mt-3" style={{ fontSize: "0.72rem" }}>
            Free cancellation up to 2 hours before showtime
          </p>
        </div>
      </div>

      {/* Venue info */}
      <div className="rounded-xl bg-[#111118] border border-white/8 p-4">
        <p className="text-white/40 uppercase mb-3" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
          Venue
        </p>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#e8192c]/15 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-[#e8192c]" />
          </div>
          <div>
            <p className="text-white" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
              CINEMA Hollywood
            </p>
            <p className="text-white/40" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
              123 Cinema Blvd<br />Hollywood, CA 90028
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export function MovieDetail() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter', 'system-ui', sans-serif" }}
    >
      <Header />

      <div className="pt-16">
        {/* ── HERO SECTION ─────────────────────────────── */}
        <section className="relative w-full overflow-hidden" style={{ height: "clamp(420px, 62vh, 680px)" }}>
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />

          {/* Layered overlays for cinematic depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-[#0a0a0f]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/85 via-transparent to-[#0a0a0f]/40" />
          <div className="absolute inset-0 bg-[#1a0a1e]/20" />

          {/* Subtle grain texture */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
          />

          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200"
              style={{ fontSize: "0.82rem", fontWeight: 500 }}
            >
              <ChevronLeft size={16} />
              Back to Movies
            </Link>
          </div>

          {/* Hero content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-screen-xl mx-auto px-6 pb-12 w-full">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8192c] text-white uppercase"
                  style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Now Showing
                </span>
                {["Anime", "Romance", "Drama"].map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full border border-white/20 text-white/70 backdrop-blur-sm"
                    style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em" }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Title block */}
              <div className="mb-5">
                <p
                  className="text-white/50 mb-1.5"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                    fontWeight: 300,
                    letterSpacing: "0.3em",
                  }}
                >
                  君の名は。
                </p>
                <h1
                  className="text-white leading-none"
                  style={{
                    fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.025em",
                    textShadow: "0 4px 40px rgba(0,0,0,0.7)",
                    lineHeight: 1.0,
                  }}
                >
                  Your Name
                </h1>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Stars */}
                <StarRating rating={4.5} />

                <div className="w-px h-5 bg-white/15 hidden sm:block" />

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-white/55">
                  <Clock size={15} />
                  <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>1h 46m</span>
                </div>

                {/* Year */}
                <div className="flex items-center gap-1.5 text-white/55">
                  <Calendar size={15} />
                  <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>2016 · Remastered 2026</span>
                </div>

                {/* Rating badge */}
                <span
                  className="px-2.5 py-0.5 rounded border border-white/20 text-white/55"
                  style={{ fontSize: "0.78rem", fontWeight: 600 }}
                >
                  PG
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ─────────────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT COLUMN ─────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">

              {/* Synopsis */}
              <section>
                <SectionLabel>Synopsis</SectionLabel>
                <div className="space-y-4">
                  <p className="text-white/70" style={{ fontSize: "0.95rem", lineHeight: 1.85 }}>
                    High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places. Mitsuha wakes up in Taki's body, living his city life in Tokyo, while Taki finds himself in Mitsuha's body in the small mountain town of Itomori.
                  </p>
                  <p className="text-white/70" style={{ fontSize: "0.95rem", lineHeight: 1.85 }}>
                    As the two navigate each other's lives, they leave notes, rearrange schedules, and adjust to their bizarre circumstances. They begin to fall for each other — but when the connection suddenly and inexplicably severs, Taki sets out on a journey to find the girl who has been living inside him.
                  </p>
                  <p className="text-white/70" style={{ fontSize: "0.95rem", lineHeight: 1.85 }}>
                    A breathtaking exploration of love, time, and the invisible threads that connect two souls across space and time. Directed by Makoto Shinkai with a stunning original score by RADWIMPS.
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-7 p-5 rounded-xl bg-[#111118] border border-white/6">
                  {[
                    { label: "Director", value: "Makoto Shinkai" },
                    { label: "Studio", value: "CoMix Wave Films" },
                    { label: "Language", value: "Japanese" },
                    { label: "Subtitles", value: "English, Korean" },
                    { label: "Release", value: "August 26, 2016" },
                    { label: "Box Office", value: "$380M worldwide" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-white/35 uppercase mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                        {item.label}
                      </p>
                      <p className="text-white" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cast & Crew */}
              <section>
                <SectionLabel>Cast &amp; Crew</SectionLabel>
                <CastScroll />
              </section>

              {/* Trailer */}
              <section>
                <SectionLabel>Official Trailer</SectionLabel>
                <TrailerPlayer />
                <p className="text-white/30 mt-3" style={{ fontSize: "0.78rem" }}>
                  Official Trailer — Subtitled English Version · Toho Animation © 2016
                </p>
              </section>

              {/* Review snippet */}
              <section>
                <SectionLabel>Audience Reviews</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Alex K.",
                      rating: 5,
                      text: "An absolute masterpiece of animation storytelling. The visuals are breathtaking and the story left me in tears. A timeless film.",
                      date: "Feb 12, 2026",
                    },
                    {
                      name: "Mia R.",
                      rating: 5,
                      text: "Saw it in IMAX — completely worth it. The score by RADWIMPS perfectly complements every emotional beat. Highly recommend!",
                      date: "Jan 29, 2026",
                    },
                  ].map((review) => (
                    <div key={review.name} className="p-5 rounded-xl bg-[#111118] border border-white/6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#e8192c]/20 border border-[#e8192c]/30 flex items-center justify-center">
                            <span className="text-[#e8192c]" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                              {review.name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-white" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                              {review.name}
                            </p>
                            <p className="text-white/30" style={{ fontSize: "0.72rem" }}>{review.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="#f5c518" className="text-[#f5c518]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/55" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
                        "{review.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── RIGHT SIDEBAR ────────────────────────── */}
            <div className="w-full lg:w-80 xl:w-88 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <BookingSidebar />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

/* Small helper */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-5 rounded bg-[#e8192c]" />
      <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
        {children}
      </h2>
    </div>
  );
}