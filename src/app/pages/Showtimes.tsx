import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Film,
  Star,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */

const THEATERS = [
  { id: "hollywood", name: "CINEMA Hollywood", address: "123 Cinema Blvd, CA" },
  { id: "downtown", name: "CINEMA Downtown", address: "456 Main St, CA" },
  { id: "sunset", name: "CINEMA Sunset", address: "789 Sunset Ave, CA" },
  { id: "beach", name: "CINEMA Beach", address: "321 Ocean Dr, CA" },
];

const MOVIES = [
  {
    id: "your-name",
    title: "Your Name",
    originalTitle: "君の名は。",
    poster: "https://images.unsplash.com/photo-1732384469370-ccd6605f4570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG5pZ2h0JTIwc2t5JTIwY29tZXQlMjBjaW5lbWF0aWMlMjBwb3N0ZXJ8ZW58MXx8fHwxNzcyNDQ0MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D", "3D"],
    rating: 8.4,
    showtimes: {
      "2D": ["10:00 AM", "1:30 PM", "4:15 PM", "7:00 PM", "9:45 PM"],
      "3D": ["11:30 AM", "2:45 PM", "5:30 PM", "8:15 PM", "10:30 PM"],
    },
  },
  {
    id: "eternal-love",
    title: "Eternal Love",
    originalTitle: "Forever in Your Heart",
    poster: "https://images.unsplash.com/photo-1765510296004-614b6cc204da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbW92aWUlMjBwb3N0ZXIlMjBjaW5lbWF8ZW58MXx8fHwxNzcyNDQ1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D"],
    rating: 7.8,
    showtimes: {
      "2D": ["9:30 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"],
    },
  },
  {
    id: "future-zone",
    title: "Future Zone",
    originalTitle: "The Last Frontier",
    poster: "https://images.unsplash.com/photo-1708348201502-423c75f6fe4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBtb3ZpZSUyMHBvc3RlciUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNDE5Mjg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D", "3D", "IMAX"],
    rating: 8.1,
    showtimes: {
      "2D": ["10:30 AM", "1:00 PM", "4:00 PM", "7:30 PM"],
      "3D": ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM", "10:45 PM"],
      "IMAX": ["12:30 PM", "3:30 PM", "6:30 PM", "9:30 PM"],
    },
  },
  {
    id: "midnight-horror",
    title: "Midnight Horror",
    originalTitle: "Don't Close Your Eyes",
    poster: "https://images.unsplash.com/photo-1620489867172-890a08b2228b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlciUyMGRhcmt8ZW58MXx8fHwxNzcyMzg5Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D"],
    rating: 7.3,
    showtimes: {
      "2D": ["4:30 PM", "7:15 PM", "9:45 PM", "11:59 PM"],
    },
  },
  {
    id: "epic-quest",
    title: "Epic Quest",
    originalTitle: "Journey Beyond",
    poster: "https://images.unsplash.com/photo-1541938434-311f13db9500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3ZpZSUyMHBvc3RlciUyMGVwaWN8ZW58MXx8fHwxNzcyNDM0NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D", "3D"],
    rating: 8.6,
    showtimes: {
      "2D": ["9:00 AM", "12:30 PM", "3:45 PM", "7:00 PM", "10:15 PM"],
      "3D": ["10:45 AM", "2:00 PM", "5:15 PM", "8:30 PM"],
    },
  },
  {
    id: "laugh-out-loud",
    title: "Laugh Out Loud",
    originalTitle: "Comedy of Errors",
    poster: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBtb3ZpZSUyMHBvc3RlciUyMGJyaWdodHxlbnwxfHx8fDE3NzI0NDUzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    formats: ["2D"],
    rating: 7.5,
    showtimes: {
      "2D": ["11:00 AM", "1:45 PM", "4:30 PM", "7:15 PM", "10:00 PM"],
    },
  },
];

function generateDates() {
  const dates = [];
  const today = new Date(2026, 2, 2); // March 2, 2026 (0-indexed month)
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
      weekday: date.toLocaleString("en-US", { weekday: "short" }),
      fullDate: date,
      isToday: i === 0,
    });
  }
  return dates;
}

const DATES = generateDates();

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

/* ─── Date Carousel ──────────────────────────────────────────── */

function DateCarousel({ selected, onSelect }: { selected: number; onSelect: (idx: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "linear-gradient(to right, rgba(10,10,15,0.95), transparent)",
        }}
      >
        <ChevronLeft size={20} className="text-white/60 hover:text-white transition-colors" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide flex gap-3 px-5 py-4"
        style={{ scrollbarWidth: "none" }}
      >
        {DATES.map((date, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: selected === idx ? "#e8192c" : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selected === idx ? "#e8192c" : "rgba(255,255,255,0.08)"}`,
              minWidth: "70px",
            }}
          >
            <span
              className={selected === idx ? "text-white/60" : "text-white/30"}
              style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              {date.weekday}
            </span>
            <span
              className="text-white"
              style={{ fontSize: "1.35rem", fontWeight: 800, lineHeight: 1 }}
            >
              {date.day}
            </span>
            <span
              className={selected === idx ? "text-white/80" : "text-white/40"}
              style={{ fontSize: "0.72rem", fontWeight: 600 }}
            >
              {date.month}
            </span>
            {date.isToday && (
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{
                  backgroundColor: selected === idx ? "rgba(255,255,255,0.2)" : "#e8192c",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                TODAY
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "linear-gradient(to left, rgba(10,10,15,0.95), transparent)",
        }}
      >
        <ChevronRight size={20} className="text-white/60 hover:text-white transition-colors" />
      </button>
    </div>
  );
}

/* ─── Theater Selector ───────────────────────────────────────── */

function TheaterSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const selectedTheater = THEATERS.find((t) => t.id === selected) || THEATERS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 rounded-xl border border-white/10 flex items-center justify-between transition-all hover:border-white/20"
        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-[#e8192c]" />
          <div className="text-left">
            <p className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
              {selectedTheater.name}
            </p>
            <p className="text-white/40" style={{ fontSize: "0.72rem" }}>
              {selectedTheater.address}
            </p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 overflow-hidden z-50"
            style={{ backgroundColor: "#111118" }}
          >
            {THEATERS.map((theater) => (
              <button
                key={theater.id}
                onClick={() => {
                  onSelect(theater.id);
                  setOpen(false);
                }}
                className="w-full px-5 py-3.5 flex items-center gap-3 transition-colors hover:bg-white/5 text-left"
                style={{
                  backgroundColor: selected === theater.id ? "rgba(232,25,44,0.08)" : "transparent",
                }}
              >
                <MapPin
                  size={16}
                  className={selected === theater.id ? "text-[#e8192c]" : "text-white/30"}
                />
                <div className="flex-1">
                  <p
                    className={selected === theater.id ? "text-white" : "text-white/70"}
                    style={{ fontWeight: selected === theater.id ? 700 : 600, fontSize: "0.85rem" }}
                  >
                    {theater.name}
                  </p>
                  <p className="text-white/35" style={{ fontSize: "0.7rem" }}>
                    {theater.address}
                  </p>
                </div>
                {selected === theater.id && (
                  <div className="w-2 h-2 rounded-full bg-[#e8192c]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Movie Row ──────────────────────────────────────────────── */

function MovieRow({ movie }: { movie: typeof MOVIES[0] }) {
  const [selectedFormat, setSelectedFormat] = useState(movie.formats[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const formatColors: Record<string, string> = {
    "2D": "#4a90e2",
    "3D": "#7b2d8b",
    "IMAX": "#c47a00",
  };

  return (
    <div
      className="rounded-2xl border border-white/8 p-5 flex flex-col sm:flex-row gap-5"
      style={{ backgroundColor: "#111118" }}
    >
      {/* Poster */}
      <Link
        to={`/movie/${movie.id}`}
        className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10 group"
        style={{ width: "120px", height: "180px" }}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Title + Rating */}
        <div>
          <p className="text-white/40" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
            {movie.originalTitle}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <Link
              to={`/movie/${movie.id}`}
              className="text-white hover:text-[#e8192c] transition-colors"
              style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}
            >
              {movie.title}
            </Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(245,197,24,0.12)" }}>
              <Star size={12} fill="#f5c518" className="text-[#f5c518]" />
              <span className="text-[#f5c518]" style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                {movie.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Format tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/30" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
            Format:
          </span>
          {movie.formats.map((format) => (
            <button
              key={format}
              onClick={() => {
                setSelectedFormat(format);
                setSelectedTime(null);
              }}
              className="px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                backgroundColor:
                  selectedFormat === format
                    ? formatColors[format]
                    : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${
                  selectedFormat === format
                    ? formatColors[format]
                    : "rgba(255,255,255,0.08)"
                }`,
                color: selectedFormat === format ? "#ffffff" : "rgba(255,255,255,0.5)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Showtimes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-white/30" />
            <span className="text-white/30" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
              Showtimes:
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
            {movie.showtimes[selectedFormat as keyof typeof movie.showtimes]?.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className="px-3 py-2.5 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor:
                    selectedTime === time
                      ? "#e8192c"
                      : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${
                    selectedTime === time
                      ? "#e8192c"
                      : "rgba(255,255,255,0.1)"
                  }`,
                  color: selectedTime === time ? "#ffffff" : "rgba(255,255,255,0.6)",
                  fontSize: "0.82rem",
                  fontWeight: selectedTime === time ? 700 : 600,
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Selected info */}
        {selectedTime && (
          <Link
            to="/movie/your-name/seats"
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#e8192c] hover:bg-[#c8111f] transition-all"
          >
            <span className="text-white" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
              Book {selectedFormat} · {selectedTime}
            </span>
            <ChevronRight size={16} className="text-white" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export function Showtimes() {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTheater, setSelectedTheater] = useState(THEATERS[0].id);

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
            Showtimes
          </h1>
          <p className="text-white/35 mt-1" style={{ fontSize: "0.88rem" }}>
            Select a date and theater to view available showtimes
          </p>
        </div>

        {/* Date carousel */}
        <div
          className="rounded-2xl border border-white/8 mb-6"
          style={{ backgroundColor: "#111118" }}
        >
          <div className="px-5 py-3 border-b border-white/6 flex items-center gap-2">
            <Calendar size={14} className="text-[#e8192c]" />
            <span
              className="text-white/50 uppercase"
              style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}
            >
              Select Date
            </span>
          </div>
          <DateCarousel selected={selectedDate} onSelect={setSelectedDate} />
        </div>

        {/* Theater selector */}
        <div className="mb-8">
          <TheaterSelector selected={selectedTheater} onSelect={setSelectedTheater} />
        </div>

        {/* Movies list */}
        <div className="flex items-center gap-2 mb-5">
          <Film size={16} className="text-white/40" />
          <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Now Playing
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-white/60"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", fontSize: "0.7rem", fontWeight: 600 }}
          >
            {MOVIES.length} movies
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {MOVIES.map((movie) => (
            <MovieRow key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}
