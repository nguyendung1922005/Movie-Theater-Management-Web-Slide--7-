import { Play, Star, Clock, Calendar } from "lucide-react";
import { Link } from "react-router";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1636755393526-a2249074de99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNpbmVtYXRpYyUyMG5pZ2h0JTIwc2t5JTIwY2l0eXNjYXBlJTIweW91ciUyMG5hbWV8ZW58MXx8fHwxNzcyNDQxODQ2fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function HeroBanner() {
  return (
    <section className="relative w-full h-[92vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      {/* Multi-layer cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-[#0a0a0f]/30 to-transparent" />

      {/* Subtle red tint overlay for drama */}
      <div className="absolute inset-0 bg-[#e8192c]/5" />

      {/* Animated scan line effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16 w-full">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8192c] text-white uppercase"
            style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Now Showing
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 text-white/70"
            style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            #1 This Week
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-white mb-3 leading-none"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
            lineHeight: 1.05,
          }}
        >
          Your Name
        </h1>
        <p
          className="text-white/50 mb-5"
          style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", fontWeight: 400, letterSpacing: "0.15em" }}
        >
          君の名は。
        </p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-5 mb-7">
          <div className="flex items-center gap-1.5 text-[#f5c518]">
            <Star size={15} fill="#f5c518" />
            <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>8.4</span>
            <span className="text-white/40" style={{ fontSize: "0.8rem" }}>/ 10</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock size={14} />
            <span style={{ fontSize: "0.85rem" }}>1h 52m</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Calendar size={14} />
            <span style={{ fontSize: "0.85rem" }}>2026</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Animation", "Romance", "Drama"].map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 rounded border border-white/20 text-white/60"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p
          className="text-white/65 mb-8 max-w-xl"
          style={{ fontSize: "0.95rem", lineHeight: 1.7 }}
        >
          Two strangers find themselves linked in a bizarre way. When a connection forms, will distance keep them apart forever, or can love transcend time and space?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/movie/your-name"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all duration-200 active:scale-95 shadow-lg shadow-[#e8192c]/30"
            style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em" }}
          >
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Play size={12} fill="white" className="ml-0.5" />
            </span>
            Buy Tickets
          </Link>
          <Link
            to="/movie/your-name"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
            style={{ fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.05em" }}
          >
            <Play size={15} />
            Watch Trailer
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/30">
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", writingMode: "vertical-rl" }}>SCROLL DOWN</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}