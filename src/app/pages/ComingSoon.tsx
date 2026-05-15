import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import {
  Play, Bell, BellOff, X, Calendar, Clock,
  ChevronLeft, ChevronRight, Star, Zap,
  Film, Sparkles, Volume2, VolumeX, Maximize2,
  TrendingUp, Award, Ticket,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
interface ComingMovie {
  id: string;
  title: string;
  genre: string[];
  poster: string;
  backdrop: string;
  releaseDate: Date;
  director: string;
  cast: string[];
  synopsis: string;
  rating: string;
  duration: string;
  format: string[];
  accentColor: string;
  trailerEmbed: string; // YouTube video ID (used as mock)
}

// Today is March 3, 2026
const TODAY = new Date("2026-03-03");

const UPCOMING: ComingMovie[] = [
  {
    id: "iron-ascent",
    title: "Iron Ascent",
    genre: ["Sci-Fi", "Action"],
    poster: "https://images.unsplash.com/photo-1759395162739-84190996783c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBtZWNoJTIwc2NpLWZpJTIwY2luZW1hdGljJTIwcG9zdGVyfGVufDF8fHx8MTc3MjU1NTkxNXww&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1759395162739-84190996783c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBtZWNoJTIwc2NpLWZpJTIwY2luZW1hdGljJTIwcG9zdGVyfGVufDF8fHx8MTc3MjU1NTkxNXww&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-03-15"),
    director: "James Cameron",
    cast: ["Ryan Gosling", "Zendaya", "Oscar Isaac"],
    synopsis: "In a world where machines have surpassed human capability, one engineer discovers a rogue AI with a secret that could change everything.",
    rating: "PG-13",
    duration: "2h 24m",
    format: ["IMAX", "4DX"],
    accentColor: "#3b82f6",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "last-samurai-reborn",
    title: "Last Samurai: Reborn",
    genre: ["Action", "Drama"],
    poster: "https://images.unsplash.com/photo-1688327044868-e358b414039c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwd2FycmlvciUyMHNhbXVyYWklMjBlcGljJTIwZGFyayUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3MjU1NTkxNnww&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1688327044868-e358b414039c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwd2FycmlvciUyMHNhbXVyYWklMjBlcGljJTIwZGFyayUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3MjU1NTkxNnww&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-03-20"),
    director: "Park Chan-wook",
    cast: ["Takeshi Kitano", "Ken Watanabe", "Rinko Kikuchi"],
    synopsis: "A disgraced samurai seeks redemption in feudal Japan, uncovering a conspiracy that threatens the entire shogunate.",
    rating: "R",
    duration: "2h 38m",
    format: ["IMAX", "Dolby"],
    accentColor: "#f59e0b",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "event-horizon-2",
    title: "Event Horizon II",
    genre: ["Sci-Fi", "Horror"],
    poster: "https://images.unsplash.com/photo-1765120298918-e9932c6c0332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBuZWJ1bGElMjBnYWxheHklMjBjb3NtaWMlMjBlcGljfGVufDF8fHx8MTc3MjU1NTkxNnww&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1765120298918-e9932c6c0332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBuZWJ1bGElMjBnYWxheHklMjBjb3NtaWMlMjBlcGljfGVufDF8fHx8MTc3MjU1NTkxNnww&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-03-28"),
    director: "Ridley Scott",
    cast: ["Tom Hardy", "Cate Blanchett", "Pedro Pascal"],
    synopsis: "A rescue crew ventures into deep space to retrieve a lost ship that has returned from another dimension, bringing something back with it.",
    rating: "R",
    duration: "2h 15m",
    format: ["IMAX", "4DX", "Dolby"],
    accentColor: "#6366f1",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "shadow-protocol",
    title: "Shadow Protocol",
    genre: ["Action", "Thriller"],
    poster: "https://images.unsplash.com/photo-1736022055342-68687525d659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW5qYSUyMHNweSUyMGFjdGlvbiUyMHRocmlsbGVyJTIwY29tYmF0JTIwZGFya3xlbnwxfHx8fDE3NzI1NTU5MTh8MA&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1736022055342-68687525d659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW5qYSUyMHNweSUyMGFjdGlvbiUyMHRocmlsbGVyJTIwY29tYmF0JTIwZGFya3xlbnwxfHx8fDE3NzI1NTU5MTh8MA&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-04-05"),
    director: "Denis Villeneuve",
    cast: ["Ana de Armas", "Idris Elba", "Florence Pugh"],
    synopsis: "A covert operative must stop a rogue shadow organization from triggering a global blackout using stolen quantum technology.",
    rating: "PG-13",
    duration: "2h 08m",
    format: ["Dolby", "IMAX"],
    accentColor: "#e8192c",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "abyss-gate",
    title: "Abyss Gate",
    genre: ["Horror", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1704216145124-e24464966b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwb2NlYW4lMjBhYnlzcyUyMGRlZXAlMjBzZWElMjBjcmVhdHVyZSUyMGRyYW1hdGljfGVufDF8fHx8MTc3MjU1NTkyMXww&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1704216145124-e24464966b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwb2NlYW4lMjBhYnlzcyUyMGRlZXAlMjBzZWElMjBjcmVhdHVyZSUyMGRyYW1hdGljfGVufDF8fHx8MTc3MjU1NTkyMXww&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-04-12"),
    director: "Guillermo del Toro",
    cast: ["Michael B. Jordan", "Lupita Nyong'o", "Timothée Chalamet"],
    synopsis: "When a deep-sea drilling platform awakens an ancient terror from the ocean's darkest trench, survival becomes the only mission.",
    rating: "R",
    duration: "2h 02m",
    format: ["4DX", "3D"],
    accentColor: "#0ea5e9",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "ember-kingdom",
    title: "Ember Kingdom",
    genre: ["Fantasy", "Adventure"],
    poster: "https://images.unsplash.com/photo-1764562206914-78ab352f4658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0JTIwYXBvY2FseXB0aWMlMjBydWlucyUyMGZpcmUlMjByZWQlMjBza3klMjBkZXNlcnR8ZW58MXx8fHwxNzcyNTU1OTIxfDA&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1764562206914-78ab352f4658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3N0JTIwYXBvY2FseXB0aWMlMjBydWlucyUyMGZpcmUlMjByZWQlMjBza3klMjBkZXNlcnR8ZW58MXx8fHwxNzcyNTU1OTIxfDA&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-04-24"),
    director: "Patty Jenkins",
    cast: ["Chris Evans", "Anya Taylor-Joy", "Jonathan Majors"],
    synopsis: "A young fire mage journeys across a dying empire to relight the ancient flame that once held the kingdom together.",
    rating: "PG",
    duration: "2h 18m",
    format: ["IMAX", "3D"],
    accentColor: "#f59e0b",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "ghost-signal",
    title: "Ghost Signal",
    genre: ["Horror", "Mystery"],
    poster: "https://images.unsplash.com/photo-1672526521401-b28065d64cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm5hdHVyYWwlMjBnaG9zdCUyMGhvcnJvciUyMGFiYW5kb25lZCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MjU1NTkyMnww&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1672526521401-b28065d64cb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm5hdHVyYWwlMjBnaG9zdCUyMGhvcnJvciUyMGFiYW5kb25lZCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MjU1NTkyMnww&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-05-01"),
    director: "Jordan Peele",
    cast: ["Daniel Kaluuya", "Tessa Thompson", "Anthony Mackie"],
    synopsis: "A paranormal investigator tracks a mysterious frequency that drives people mad, leading her to a haunted broadcast station.",
    rating: "R",
    duration: "1h 58m",
    format: ["Dolby", "2D"],
    accentColor: "#8b5cf6",
    trailerEmbed: "dQw4w9WgXcQ",
  },
  {
    id: "jungle-protocol",
    title: "Jungle Protocol",
    genre: ["Adventure", "Mystery"],
    poster: "https://images.unsplash.com/photo-1637070773929-054cf3288cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdW5nbGUlMjBleHBlZGl0aW9uJTIwYWR2ZW50dXJlJTIwbXlzdGVyeSUyMGdyZWVuJTIwZGFya3xlbnwxfHx8fDE3NzI1NTU5MjJ8MA&ixlib=rb-4.1.0&q=80&w=800",
    backdrop: "https://images.unsplash.com/photo-1637070773929-054cf3288cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdW5nbGUlMjBleHBlZGl0aW9uJTIwYWR2ZW50dXJlJTIwbXlzdGVyeSUyMGdyZWVuJTIwZGFya3xlbnwxfHx8fDE3NzI1NTU5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1200",
    releaseDate: new Date("2026-05-14"),
    director: "Werner Herzog",
    cast: ["Dev Patel", "Jodie Comer", "Steven Yeun"],
    synopsis: "A team of archaeologists stumbles upon a lost civilization in the Amazon, but something ancient doesn't want them to leave.",
    rating: "PG-13",
    duration: "2h 05m",
    format: ["IMAX", "3D"],
    accentColor: "#10b981",
    trailerEmbed: "dQw4w9WgXcQ",
  },
];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function daysUntil(d: Date): number {
  return Math.max(0, Math.ceil((d.getTime() - TODAY.getTime()) / 86_400_000));
}

function formatRelease(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const FORMAT_COLORS: Record<string, string> = {
  IMAX: "#3b82f6", "4DX": "#f59e0b", Dolby: "#8b5cf6",
  "3D": "#10b981", "2D": "rgba(255,255,255,0.22)",
};

/* ══════════════════════════════════════════════════════
   POSTER CARD
══════════════════════════════════════════════════════ */
function PosterCard({ movie, notified, onToggleNotify, onOpen }: {
  movie: ComingMovie;
  notified: boolean;
  onToggleNotify: () => void;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const days = daysUntil(movie.releaseDate);

  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        width: "200px",
        aspectRatio: "2/3",
        border: `1px solid ${hovered ? movie.accentColor + "50" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered ? `0 20px 48px rgba(0,0,0,0.6), 0 0 24px ${movie.accentColor}25` : "0 8px 24px rgba(0,0,0,0.4)",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* Poster image */}
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: hovered
            ? `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.92) 100%)`
            : `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.85) 100%)`,
        }}
      />

      {/* Accent bottom glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${movie.accentColor}30, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Play Trailer button */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <div
          className="flex flex-col items-center gap-2"
          style={{ transform: hovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)", transition: "all 0.3s ease" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white/70 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.15)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <Play size={22} className="text-white" fill="white" style={{ marginLeft: "3px" }} />
          </div>
          <span
            className="text-white/85 uppercase"
            style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em" }}
          >
            Play Trailer
          </span>
        </div>
      </div>

      {/* Countdown badge top */}
      <div className="absolute top-2.5 left-2.5">
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{
            backgroundColor: days <= 7 ? "rgba(232,25,44,0.9)" : "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${days <= 7 ? "rgba(232,25,44,0.5)" : "rgba(255,255,255,0.15)"}`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: days <= 7 ? "white" : "#f59e0b" }} />
          <span className="text-white" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.08em" }}>
            {days === 0 ? "TODAY" : `${days}d`}
          </span>
        </div>
      </div>

      {/* Notify button top-right */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleNotify(); }}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: notified ? movie.accentColor : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${notified ? movie.accentColor : "rgba(255,255,255,0.2)"}`,
          boxShadow: notified ? `0 4px 12px ${movie.accentColor}60` : "none",
          opacity: hovered ? 1 : notified ? 1 : 0,
          transform: hovered || notified ? "scale(1)" : "scale(0.8)",
          transition: "all 0.2s ease",
        }}
      >
        {notified
          ? <Bell size={12} className="text-white" fill="white" />
          : <BellOff size={12} className="text-white/70" />
        }
      </button>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-8">
        <h3 className="text-white mb-0.5 line-clamp-2 leading-tight" style={{ fontWeight: 800, fontSize: "0.88rem" }}>
          {movie.title}
        </h3>
        <p className="text-white/45" style={{ fontSize: "0.65rem" }}>{movie.genre[0]}</p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {movie.format.slice(0, 2).map((f) => (
            <span
              key={f}
              className="px-1.5 py-0.5 rounded text-white"
              style={{ fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.1em", backgroundColor: FORMAT_COLORS[f] ?? "#555" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COUNTDOWN DISPLAY
══════════════════════════════════════════════════════ */
function CountdownDisplay({ days }: { days: number }) {
  const weeks  = Math.floor(days / 7);
  const remDays = days % 7;
  return (
    <div className="flex items-center gap-3">
      {days === 0 ? (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[#10b981]" style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.08em" }}>IN THEATERS TODAY</span>
        </div>
      ) : (
        <>
          {weeks > 0 && (
            <CountUnit value={weeks} label={weeks === 1 ? "Week" : "Weeks"} accent />
          )}
          <CountUnit value={remDays} label={remDays === 1 ? "Day" : "Days"} accent />
          <span className="text-white/30" style={{ fontSize: "0.78rem" }}>until release</span>
        </>
      )}
    </div>
  );
}

function CountUnit({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div
      className="flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px]"
      style={{
        backgroundColor: accent ? "rgba(232,25,44,0.1)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${accent ? "rgba(232,25,44,0.25)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <span style={{ fontWeight: 900, fontSize: "1.4rem", color: accent ? "#e8192c" : "white", lineHeight: 1, letterSpacing: "-0.03em" }}>
        {String(value).padStart(2, "0")}
      </span>
      <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRAILER MODAL
══════════════════════════════════════════════════════ */
function TrailerModal({ movie, notified, onToggleNotify, onClose }: {
  movie: ComingMovie;
  notified: boolean;
  onToggleNotify: () => void;
  onClose: () => void;
}) {
  const [videoStarted, setVideoStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const days = daysUntil(movie.releaseDate);

  // Trap focus / ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10"
        style={{
          backgroundColor: "#0e0e18",
          boxShadow: `0 0 0 1px ${movie.accentColor}20, 0 40px 100px rgba(0,0,0,0.85)`,
          animation: "modalSlide 0.38s cubic-bezier(0.34,1.4,0.64,1) forwards",
        }}
      >
        {/* Top accent */}
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${movie.accentColor} 40%, transparent)` }} />

        {/* ── Video Player Area ── */}
        <div className="relative" style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
          {!videoStarted ? (
            /* Cinematic placeholder */
            <div className="absolute inset-0">
              <img
                src={movie.backdrop}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.5) saturate(1.2)" }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18] via-transparent to-transparent" />
              {/* Film grain */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                  backgroundRepeat: "repeat",
                  backgroundSize: "128px",
                }}
              />
              {/* Cinescope bars */}
              <div className="absolute top-0 inset-x-0 h-5 bg-black" />
              <div className="absolute bottom-0 inset-x-0 h-5 bg-black" />

              {/* Big play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setVideoStarted(true)}
                  className="relative group flex items-center justify-center w-20 h-20 rounded-full border-2 border-white/60 transition-all duration-300 hover:scale-110 hover:border-white"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    boxShadow: `0 0 0 0 ${movie.accentColor}60`,
                    animation: "playPulse 2s ease-in-out infinite",
                  }}
                >
                  <Play size={32} fill="white" className="text-white" style={{ marginLeft: "5px" }} />
                </button>
              </div>

              {/* "Trailer" label */}
              <div
                className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20"
                style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#e8192c] animate-pulse" />
                <span className="text-white/80 uppercase" style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em" }}>
                  Official Trailer
                </span>
              </div>
            </div>
          ) : (
            /* Embedded iframe (mock — plays a placeholder) */
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: `linear-gradient(135deg, ${movie.accentColor}, ${movie.accentColor}80)` }}
                >
                  <Film size={28} className="text-white" />
                </div>
                <p className="text-white/60" style={{ fontSize: "0.88rem" }}>Trailer playback</p>
                <p className="text-white/30" style={{ fontSize: "0.72rem", marginTop: "4px" }}>
                  Connect to YouTube for live trailers
                </p>
              </div>
            </div>
          )}

          {/* Controls overlay (always) */}
          <div className="absolute bottom-5 inset-x-6 flex items-center justify-between pointer-events-none">
            <div />
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setMuted((v) => !v)}
                className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <Maximize2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Info Panel ── */}
        <div className="px-6 py-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded-full"
                    style={{ fontSize: "0.62rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}
                  >
                    {g}
                  </span>
                ))}
                <span className="text-white/25" style={{ fontSize: "0.62rem" }}>·</span>
                <span className="text-white/30" style={{ fontSize: "0.62rem" }}>{movie.rating}</span>
                <span className="text-white/25" style={{ fontSize: "0.62rem" }}>·</span>
                <span className="text-white/30" style={{ fontSize: "0.62rem" }}>{movie.duration}</span>
              </div>
              <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>
                {movie.title}
              </h2>
              <p className="text-white/35 mt-0.5" style={{ fontSize: "0.75rem" }}>
                Directed by {movie.director}
              </p>
            </div>

            {/* Notify toggle */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onToggleNotify}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-300"
                style={{
                  backgroundColor: notified ? `${movie.accentColor}18` : "rgba(255,255,255,0.04)",
                  borderColor: notified ? `${movie.accentColor}45` : "rgba(255,255,255,0.1)",
                  boxShadow: notified ? `0 4px 16px ${movie.accentColor}25` : "none",
                }}
              >
                {notified
                  ? <Bell size={15} style={{ color: movie.accentColor }} fill={movie.accentColor} />
                  : <BellOff size={15} className="text-white/35" />
                }
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: notified ? movie.accentColor : "rgba(255,255,255,0.35)",
                  }}
                >
                  {notified ? "Notified" : "Notify Me"}
                </span>
                {/* Toggle pill */}
                <div
                  className="w-8 h-4 rounded-full relative transition-colors duration-300"
                  style={{ backgroundColor: notified ? movie.accentColor : "rgba(255,255,255,0.12)" }}
                >
                  <span
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300"
                    style={{ left: notified ? "calc(100% - 14px)" : "2px" }}
                  />
                </div>
              </button>
              {notified && (
                <p
                  className="text-center"
                  style={{ fontSize: "0.58rem", color: movie.accentColor, fontWeight: 600, maxWidth: "120px", lineHeight: 1.4 }}
                >
                  We'll notify you 1 day before!
                </p>
              )}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-white/45 mb-5" style={{ fontSize: "0.82rem", lineHeight: 1.7 }}>
            {movie.synopsis}
          </p>

          {/* Cast */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-white/25 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em" }}>Cast:</span>
            {movie.cast.map((c) => (
              <span key={c} className="px-2 py-0.5 rounded-full text-white/50 border border-white/8" style={{ fontSize: "0.72rem", backgroundColor: "rgba(255,255,255,0.04)" }}>
                {c}
              </span>
            ))}
          </div>

          {/* Release info + countdown */}
          <div
            className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl border border-white/[0.06]"
            style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.06), rgba(255,255,255,0.02))" }}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar size={12} className="text-white/35" />
                <span className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em" }}>Release Date</span>
              </div>
              <p className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>{formatRelease(movie.releaseDate)}</p>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {movie.format.map((f) => (
                  <span key={f} className="px-1.5 py-0.5 rounded text-white" style={{ fontSize: "0.56rem", fontWeight: 900, letterSpacing: "0.12em", backgroundColor: FORMAT_COLORS[f] ?? "#555" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <CountdownDisplay days={days} />
          </div>

          {/* CTA row */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
              style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em" }}
            >
              Close
            </button>
            <Link
              to="/movies"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white transition-all"
              style={{
                background: `linear-gradient(135deg, #e8192c, #c8111f)`,
                fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em",
                boxShadow: "0 6px 20px rgba(232,25,44,0.35)",
              }}
            >
              <Ticket size={14} /> PRE-BOOK
            </Link>
          </div>
        </div>

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/70 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes modalSlide {
          from { opacity:0; transform:scale(0.9) translateY(24px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes playPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          50%      { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HORIZONTAL SCROLL ROW
══════════════════════════════════════════════════════ */
function ScrollRow({ movies, notified, onToggle, onOpen }: {
  movies: ComingMovie[];
  notified: Set<string>;
  onToggle: (id: string) => void;
  onOpen: (m: ComingMovie) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (rowRef.current) rowRef.current.scrollBy({ left: dir * 440, behavior: "smooth" });
  };

  return (
    <div className="relative group/row">
      {/* Arrow left */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full border border-white/15 bg-[#0a0a0f]/90 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all opacity-0 group-hover/row:opacity-100"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Scroll track */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
      >
        {movies.map((m) => (
          <div key={m.id} style={{ scrollSnapAlign: "start" }}>
            <PosterCard
              movie={m}
              notified={notified.has(m.id)}
              onToggleNotify={() => onToggle(m.id)}
              onOpen={() => onOpen(m)}
            />
          </div>
        ))}
        {/* Extra right padding */}
        <div className="flex-shrink-0 w-2" />
      </div>

      {/* Arrow right */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full border border-white/15 bg-[#0a0a0f]/90 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all opacity-0 group-hover/row:opacity-100"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <ChevronRight size={18} />
      </button>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export function ComingSoon() {
  const [notified, setNotified] = useState<Set<string>>(new Set());
  const [activeModal, setActiveModal] = useState<ComingMovie | null>(null);

  const toggle = (id: string) =>
    setNotified((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const soonMovies    = UPCOMING.filter((m) => daysUntil(m.releaseDate) <= 14);
  const thisMonth     = UPCOMING.filter((m) => { const d = daysUntil(m.releaseDate); return d > 14 && d <= 31; });
  const comingLater   = UPCOMING.filter((m) => daysUntil(m.releaseDate) > 31);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <Header />

      {/* ── HERO ── */}
      <section
        className="relative pt-28 pb-16 px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(232,25,44,0.06) 0%, transparent 100%)" }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)",
          }}
        />

        <div className="max-w-screen-xl mx-auto relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-[#e8192c]" />
            <span className="text-white/35 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em" }}>
              Coming Soon
            </span>
          </div>
          <h1 className="text-white mb-3" style={{ fontWeight: 900, fontSize: "clamp(2rem,5vw,3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            What's Coming<br />
            <span style={{ color: "#e8192c" }}>to the Big Screen</span>
          </h1>
          <p className="text-white/40 max-w-lg" style={{ fontSize: "0.92rem", lineHeight: 1.7 }}>
            Get notified when your most-anticipated films hit theaters. Hover over any poster to watch the official trailer.
          </p>

          {/* Stats chips */}
          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {[
              { icon: <Film size={12} />, label: `${UPCOMING.length} Upcoming Films` },
              { icon: <Zap size={12} />, label: `${soonMovies.length} Releasing This Month` },
              { icon: <Bell size={12} />, label: `${notified.size} Watchlisted` },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/8"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
              >
                <span className="text-[#e8192c]">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-screen-xl mx-auto px-6 pb-20">

        {/* RELEASING SOON */}
        {soonMovies.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(232,25,44,0.12),rgba(232,25,44,0.05))", border: "1px solid rgba(232,25,44,0.25)" }}>
                <div className="w-2 h-2 rounded-full bg-[#e8192c] animate-pulse" />
                <span className="text-[#e8192c] uppercase" style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.15em" }}>
                  Releasing Very Soon
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#e8192c]/20 to-transparent" />
            </div>
            <ScrollRow movies={soonMovies} notified={notified} onToggle={toggle} onOpen={setActiveModal} />
          </section>
        )}

        {/* THIS MONTH */}
        {thisMonth.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                <Calendar size={12} className="text-white/45" />
                <span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Later This Month
                </span>
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <ScrollRow movies={thisMonth} notified={notified} onToggle={toggle} onOpen={setActiveModal} />
          </section>
        )}

        {/* COMING LATER */}
        {comingLater.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                <Star size={12} className="text-white/45" />
                <span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                  On the Horizon
                </span>
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <ScrollRow movies={comingLater} notified={notified} onToggle={toggle} onOpen={setActiveModal} />
          </section>
        )}

        {/* Notify all CTA */}
        <div
          className="rounded-3xl p-8 border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.08) 0%, rgba(17,17,24,0.9) 100%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(ellipse at 15% 50%, rgba(232,25,44,0.1), transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(99,102,241,0.06), transparent 55%)" }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <Bell size={16} className="text-[#e8192c]" />
              <h3 className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>Never Miss a Premiere</h3>
            </div>
            <p className="text-white/40" style={{ fontSize: "0.82rem" }}>
              Subscribe to get advance notifications for every new movie added to our catalog.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-2.5 rounded-xl bg-white/6 border border-white/12 text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
              style={{ fontSize: "0.85rem", width: "220px" }}
            />
            <button
              className="px-5 py-2.5 rounded-xl text-white flex items-center gap-2 transition-all"
              style={{ backgroundColor: "#e8192c", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", boxShadow: "0 6px 20px rgba(232,25,44,0.35)" }}
            >
              <Bell size={13} /> Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {activeModal && (
        <TrailerModal
          movie={activeModal}
          notified={notified.has(activeModal.id)}
          onToggleNotify={() => toggle(activeModal.id)}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
