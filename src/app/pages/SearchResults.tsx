import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import {
  Search, Star, Ticket, SlidersHorizontal, X,
  ChevronDown, ChevronRight, Sparkles, Filter,
  Clock, Calendar, Globe, DollarSign, TrendingUp,
  LayoutGrid, List, Zap,
} from "lucide-react";

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
interface Movie {
  id: string;
  title: string;
  genre: string[];
  poster: string;
  rating: number;
  year: number;
  duration: string;
  format: string[];
  price: number;
  language: string;
  isBestMatch?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

const MOVIES: Movie[] = [
  {
    id: "your-name",
    title: "Your Name",
    genre: ["Romance", "Animation"],
    poster: "https://images.unsplash.com/photo-1574439361665-4fd4721c0a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHJvbWFudGljJTIwc2t5JTIwY29tZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI1NTQ2MDN8MA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.9,
    year: 2026,
    duration: "1h 46m",
    format: ["IMAX", "2D"],
    price: 140_000,
    language: "Vietsub",
    isBestMatch: true,
  },
  {
    id: "neon-horizon",
    title: "Neon Horizon",
    genre: ["Sci-Fi", "Action"],
    poster: "https://images.unsplash.com/photo-1577885641242-62d00d75184f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbmVvbiUyMHNjaS1maSUyMGRhcmslMjBmdXR1cmV8ZW58MXx8fHwxNzcyNTU0NjAzfDA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.4,
    year: 2026,
    duration: "2h 18m",
    format: ["4DX", "IMAX"],
    price: 160_000,
    language: "Vietsub",
    isNew: true,
  },
  {
    id: "iron-legacy",
    title: "Iron Legacy",
    genre: ["Fantasy", "Action"],
    poster: "https://images.unsplash.com/photo-1515688272562-004db9d10783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlcGljJTIwZmFudGFzeSUyMHdhcnJpb3IlMjBjYXN0bGUlMjBkcmFtYXRpY3xlbnwxfHx8fDE3NzI1NTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.1,
    year: 2025,
    duration: "2h 32m",
    format: ["3D", "Dolby"],
    price: 150_000,
    language: "Lồng tiếng",
  },
  {
    id: "dark-hollow",
    title: "Dark Hollow",
    genre: ["Horror", "Thriller"],
    poster: "https://images.unsplash.com/photo-1734076458239-83541274adee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBkYXJrJTIwZm9yZXN0JTIwc2hhZG93JTIwbXlzdGVyaW91c3xlbnwxfHx8fDE3NzI1NTQ2MDR8MA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 3.8,
    year: 2025,
    duration: "1h 54m",
    format: ["2D"],
    price: 90_000,
    language: "Vietsub",
  },
  {
    id: "void-runner",
    title: "Void Runner",
    genre: ["Sci-Fi", "Adventure"],
    poster: "https://images.unsplash.com/photo-1767396866845-2d3e4efda4a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGFzdHJvbmF1dCUyMGdhbGF4eSUyMGNvc21vcyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NzI1NTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.6,
    year: 2026,
    duration: "2h 05m",
    format: ["IMAX", "4DX"],
    price: 160_000,
    language: "Vietsub",
    isTrending: true,
  },
  {
    id: "flashpoint",
    title: "Flashpoint",
    genre: ["Action", "Thriller"],
    poster: "https://images.unsplash.com/photo-1553490711-d565fc6a4956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBoZXJvJTIwc2lsaG91ZXR0ZSUyMGV4cGxvc2lvbiUyMGNpbmVtYXRpY3xlbnwxfHx8fDE3NzI1NTQ2MDV8MA&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.2,
    year: 2026,
    duration: "2h 10m",
    format: ["Dolby", "3D"],
    price: 130_000,
    language: "Lồng tiếng",
    isTrending: true,
  },
  {
    id: "last-sunrise",
    title: "Last Sunrise",
    genre: ["Romance", "Drama"],
    poster: "https://images.unsplash.com/photo-1644727783395-8bffbeba5273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldCUyMGRyYW1hdGljJTIwcG9ydHJhaXQlMjBmaWxtfGVufDF8fHx8MTc3MjU1NDYwNnww&ixlib=rb-4.1.0&q=80&w=800",
    rating: 4.3,
    year: 2025,
    duration: "1h 58m",
    format: ["2D"],
    price: 100_000,
    language: "Vietsub",
  },
  {
    id: "code-black",
    title: "Code Black",
    genre: ["Thriller", "Crime"],
    poster: "https://images.unsplash.com/photo-1646674280790-b4e8fb90f6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMGRldGVjdGl2ZSUyMHJhaW4lMjBuaWdodCUyMG5vaXIlMjBjaXR5fGVufDF8fHx8MTc3MjU1NDYwNnww&ixlib=rb-4.1.0&q=80&w=800",
    rating: 3.9,
    year: 2025,
    duration: "2h 02m",
    format: ["2D", "3D"],
    price: 110_000,
    language: "Vietsub",
  },
];

const FILTER_CHIPS = ["All", "Action", "Romance", "IMAX", "2D/3D", "Sci-Fi", "Horror"] as const;
type ChipKey = typeof FILTER_CHIPS[number];

const FORMAT_COLORS: Record<string, string> = {
  IMAX: "#3b82f6", "4DX": "#f59e0b", Dolby: "#8b5cf6",
  "3D": "#10b981", "2D": "rgba(255,255,255,0.25)",
  Premium: "#ec4899",
};

/* ── Star rating ── */
function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          style={{
            color: s <= Math.round(value) ? "#f59e0b" : "rgba(255,255,255,0.15)",
            fill: s <= Math.round(value) ? "#f59e0b" : "none",
          }}
        />
      ))}
      <span className="text-white/50 ml-1" style={{ fontSize: "0.7rem", fontWeight: 700 }}>{value.toFixed(1)}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOVIE CARD
══════════════════════════════════════════════ */
function MovieCard({ movie }: { movie: Movie }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 group cursor-pointer"
      style={{
        backgroundColor: "#111118",
        borderColor: hovered
          ? movie.isBestMatch ? "rgba(245,158,11,0.5)" : "rgba(232,25,44,0.35)"
          : movie.isBestMatch ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? movie.isBestMatch
            ? "0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.3), 0 0 32px rgba(232,25,44,0.15)"
            : "0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,25,44,0.2), 0 0 28px rgba(232,25,44,0.12)"
          : "0 4px 16px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Poster ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, #111118 0%, rgba(17,17,24,0.4) 45%, transparent 80%)",
            opacity: hovered ? 1 : 0.85,
          }}
        />

        {/* Red glow at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, rgba(232,25,44,0.2), transparent 70%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── Badges ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {movie.isBestMatch && (
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-white"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.1em",
                boxShadow: "0 4px 12px rgba(245,158,11,0.45)",
              }}
            >
              <Sparkles size={9} /> BEST MATCH
            </span>
          )}
          {movie.isNew && (
            <span className="px-2 py-1 rounded-lg text-white" style={{ backgroundColor: "#10b981", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.1em" }}>
              NEW
            </span>
          )}
          {movie.isTrending && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-white" style={{ backgroundColor: "#e8192c", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.1em" }}>
              <TrendingUp size={9} /> HOT
            </span>
          )}
        </div>

        {/* Format pills top-right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {movie.format.slice(0, 2).map((f) => (
            <span
              key={f}
              className="px-1.5 py-0.5 rounded text-white"
              style={{ fontSize: "0.56rem", fontWeight: 900, letterSpacing: "0.14em", backgroundColor: FORMAT_COLORS[f] ?? "#555" }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Duration bottom-left (on hover) */}
        <div
          className="absolute bottom-2 left-3 flex items-center gap-1 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)" }}
        >
          <Clock size={10} className="text-white/50" />
          <span className="text-white/50" style={{ fontSize: "0.68rem" }}>{movie.duration}</span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-2 p-3.5">
        {/* Genre chips */}
        <div className="flex gap-1.5 flex-wrap">
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full"
              style={{ fontSize: "0.6rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="text-white leading-tight"
          style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}
        >
          {movie.title}
        </h3>

        {/* Rating */}
        <StarRating value={movie.rating} />

        {/* Price + year */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-white/35" style={{ fontSize: "0.7rem" }}>{movie.year} · {movie.language}</span>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#e8192c" }}>
            {movie.price.toLocaleString("vi-VN")}₫
          </span>
        </div>

        {/* CTA */}
        <Link
          to={`/movie/${movie.id}`}
          className="relative mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl overflow-hidden group/btn transition-all duration-200"
          style={{
            backgroundColor: "#e8192c",
            fontSize: "0.76rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "white",
            boxShadow: hovered ? "0 6px 20px rgba(232,25,44,0.45)" : "none",
          }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
          <Ticket size={13} />
          BUY TICKETS
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DUAL RANGE SLIDER (price)
══════════════════════════════════════════════ */
function PriceRangeSlider({ min, max, value, onChange }: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMouseDown = (thumb: 0 | 1) => (e: React.MouseEvent) => {
    e.preventDefault();
    const onMove = (me: MouseEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (me.clientX - rect.left) / rect.width));
      const v = Math.round(min + pct * (max - min));
      const next: [number, number] = [...value] as [number, number];
      next[thumb] = v;
      if (next[0] <= next[1]) onChange(next);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{(value[0] / 1000).toFixed(0)}K₫</span>
        <span className="text-white/40" style={{ fontSize: "0.72rem" }}>{(value[1] / 1000).toFixed(0)}K₫</span>
      </div>
      <div ref={trackRef} className="relative h-1.5 rounded-full cursor-pointer" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
        {/* Active track */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left: `${pct(value[0])}%`,
            width: `${pct(value[1]) - pct(value[0])}%`,
            backgroundColor: "#e8192c",
          }}
        />
        {/* Thumbs */}
        {([0, 1] as const).map((thumb) => (
          <div
            key={thumb}
            onMouseDown={handleMouseDown(thumb)}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#e8192c] bg-[#0a0a0f] cursor-grab active:cursor-grabbing transition-transform hover:scale-125"
            style={{ left: `${pct(value[thumb])}%`, zIndex: 10 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
function FilterSidebar({
  priceRange, onPriceRange,
  selectedYears, onToggleYear,
  selectedLangs, onToggleLang,
  onClearAll,
}: {
  priceRange: [number, number];
  onPriceRange: (v: [number, number]) => void;
  selectedYears: number[];
  onToggleYear: (y: number) => void;
  selectedLangs: string[];
  onToggleLang: (l: string) => void;
  onClearAll: () => void;
}) {
  const [openSections, setOpenSections] = useState({ price: true, year: true, language: true, format: false });
  const toggle = (k: keyof typeof openSections) => setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  const YEARS = [2026, 2025, 2024, 2023];
  const LANGS = ["Vietsub", "Lồng tiếng", "English"];
  const FORMATS = ["IMAX", "4DX", "Dolby", "3D", "2D"];

  const activeCount = selectedYears.length + selectedLangs.length +
    (priceRange[0] > 0 || priceRange[1] < 500_000 ? 1 : 0);

  return (
    <aside
      className="flex-shrink-0 rounded-2xl border border-white/[0.07] overflow-hidden"
      style={{ width: "236px", backgroundColor: "#0e0e16", alignSelf: "flex-start", position: "sticky", top: "88px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#e8192c]" />
          <span className="text-white" style={{ fontSize: "0.83rem", fontWeight: 700 }}>Filters</span>
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#e8192c] text-white flex items-center justify-center" style={{ fontSize: "0.55rem", fontWeight: 900 }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClearAll} className="text-[#e8192c] hover:text-[#ff2d41] transition-colors" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-white/[0.05]">
        {/* Price range */}
        <FilterSection label="Price Range" icon={<DollarSign size={13} />} open={openSections.price} onToggle={() => toggle("price")}>
          <PriceRangeSlider min={0} max={500_000} value={priceRange} onChange={onPriceRange} />
        </FilterSection>

        {/* Release Year */}
        <FilterSection label="Release Year" icon={<Calendar size={13} />} open={openSections.year} onToggle={() => toggle("year")}>
          <div className="flex flex-col gap-1.5">
            {YEARS.map((y) => (
              <label key={y} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => onToggleYear(y)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: selectedYears.includes(y) ? "#e8192c" : "transparent",
                    border: `1.5px solid ${selectedYears.includes(y) ? "#e8192c" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {selectedYears.includes(y) && <Check10 />}
                </div>
                <span
                  className="transition-colors"
                  style={{ fontSize: "0.8rem", fontWeight: 500, color: selectedYears.includes(y) ? "white" : "rgba(255,255,255,0.45)" }}
                >
                  {y}
                </span>
                <span className="ml-auto text-white/20" style={{ fontSize: "0.68rem" }}>
                  {MOVIES.filter((m) => m.year === y).length}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Language */}
        <FilterSection label="Language" icon={<Globe size={13} />} open={openSections.language} onToggle={() => toggle("language")}>
          <div className="flex flex-col gap-1.5">
            {LANGS.map((l) => (
              <label key={l} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => onToggleLang(l)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: selectedLangs.includes(l) ? "#e8192c" : "transparent",
                    border: `1.5px solid ${selectedLangs.includes(l) ? "#e8192c" : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {selectedLangs.includes(l) && <Check10 />}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 500, color: selectedLangs.includes(l) ? "white" : "rgba(255,255,255,0.45)" }}>
                  {l}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Format */}
        <FilterSection label="Format" icon={<Zap size={13} />} open={openSections.format} onToggle={() => toggle("format")}>
          <div className="flex flex-wrap gap-1.5">
            {FORMATS.map((f) => (
              <span
                key={f}
                className="px-2 py-1 rounded-lg border cursor-pointer transition-all"
                style={{
                  fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
                  backgroundColor: FORMAT_COLORS[f] ? `${FORMAT_COLORS[f]}15` : "rgba(255,255,255,0.04)",
                  borderColor: FORMAT_COLORS[f] ? `${FORMAT_COLORS[f]}35` : "rgba(255,255,255,0.1)",
                  color: FORMAT_COLORS[f] ?? "rgba(255,255,255,0.4)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

function FilterSection({ label, icon, open, onToggle, children }: {
  label: string; icon: React.ReactNode; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-2 text-white/55">
          {icon}
          <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.04em", color: "rgba(255,255,255,0.7)" }}>{label}</span>
        </div>
        <ChevronDown
          size={13}
          className="text-white/30 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Check10() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export function SearchResults() {
  const [query, setQuery] = useState("Your Name");
  const [activeChip, setActiveChip] = useState<ChipKey>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500_000]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleYear  = (y: number) => setSelectedYears((p) => p.includes(y) ? p.filter((x) => x !== y) : [...p, y]);
  const toggleLang  = (l: string) => setSelectedLangs((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const clearAll    = () => { setSelectedYears([]); setSelectedLangs([]); setPriceRange([0, 500_000]); };

  /* Apply filters */
  let filtered = MOVIES.filter((m) => {
    if (activeChip !== "All") {
      if (activeChip === "IMAX" && !m.format.includes("IMAX")) return false;
      if (activeChip === "2D/3D" && !m.format.some((f) => ["2D","3D"].includes(f))) return false;
      if (!["All","IMAX","2D/3D"].includes(activeChip) && !m.genre.includes(activeChip)) return false;
    }
    if (selectedYears.length && !selectedYears.includes(m.year)) return false;
    if (selectedLangs.length && !selectedLangs.includes(m.language)) return false;
    if (m.price < priceRange[0] || m.price > priceRange[1]) return false;
    return true;
  });

  /* Sort */
  filtered = [...filtered].sort((a, b) => {
    if (a.isBestMatch) return -1;
    if (b.isBestMatch) return 1;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    return 0;
  });

  const bestMatch = filtered.find((m) => m.isBestMatch);
  const suggestions = filtered.filter((m) => !m.isBestMatch);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <Header />

      <div className="pt-16">
        {/* ── Search hero ── */}
        <div
          className="relative py-10 px-6 border-b border-white/[0.05]"
          style={{
            background: "linear-gradient(180deg, rgba(232,25,44,0.06) 0%, transparent 100%)",
          }}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
            }}
          />

          <div className="relative max-w-screen-xl mx-auto flex flex-col items-center gap-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <Search size={13} className="text-[#e8192c]" />
              <span className="text-white/35 uppercase" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em" }}>
                Search Results
              </span>
            </div>

            {/* Search bar */}
            <div
              className="w-full max-w-2xl relative"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, genres, actors..."
                className="w-full pl-12 pr-36 py-4 bg-transparent text-white placeholder-white/20 outline-none rounded-2xl"
                style={{ fontSize: "1rem", fontWeight: 500 }}
              />
              {/* Label inside */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query && (
                  <button onClick={() => setQuery("")} className="w-6 h-6 rounded-full bg-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/14 transition-all">
                    <X size={11} />
                  </button>
                )}
                <button
                  className="px-4 py-2 rounded-xl text-white transition-all"
                  style={{ backgroundColor: "#e8192c", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em" }}
                >
                  SEARCH
                </button>
              </div>
            </div>

            {/* Searching for label */}
            <div className="flex items-center gap-2">
              <span className="text-white/30" style={{ fontSize: "0.83rem" }}>Searching for:</span>
              <span
                className="px-3 py-1 rounded-full border text-white"
                style={{ fontSize: "0.83rem", fontWeight: 700, backgroundColor: "rgba(232,25,44,0.12)", borderColor: "rgba(232,25,44,0.3)" }}
              >
                "{query || "Your Name"}"
              </span>
              <span className="text-white/25" style={{ fontSize: "0.78rem" }}>— {filtered.length} results found</span>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {FILTER_CHIPS.map((chip) => {
                const active = activeChip === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveChip(chip)}
                    className="px-4 py-2 rounded-full border transition-all duration-200"
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: active ? 700 : 500,
                      backgroundColor: active ? "#e8192c" : "rgba(255,255,255,0.04)",
                      borderColor: active ? "#e8192c" : "rgba(255,255,255,0.1)",
                      color: active ? "white" : "rgba(255,255,255,0.5)",
                      boxShadow: active ? "0 4px 16px rgba(232,25,44,0.35)" : "none",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-7">

          {/* Sidebar — desktop always visible */}
          <div className="hidden lg:block">
            <FilterSidebar
              priceRange={priceRange} onPriceRange={setPriceRange}
              selectedYears={selectedYears} onToggleYear={toggleYear}
              selectedLangs={selectedLangs} onToggleLang={toggleLang}
              onClearAll={clearAll}
            />
          </div>

          {/* Sidebar — mobile drawer */}
          {showSidebar && (
            <div className="fixed inset-0 z-50 flex lg:hidden" onClick={() => setShowSidebar(false)}>
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <div className="relative z-10 ml-auto w-72 h-full overflow-y-auto" style={{ backgroundColor: "#0e0e16" }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <span className="text-white font-bold">Filters</span>
                  <button onClick={() => setShowSidebar(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    priceRange={priceRange} onPriceRange={setPriceRange}
                    selectedYears={selectedYears} onToggleYear={toggleYear}
                    selectedLangs={selectedLangs} onToggleLang={toggleLang}
                    onClearAll={clearAll}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white transition-colors"
                  style={{ fontSize: "0.8rem", fontWeight: 600 }}
                >
                  <Filter size={14} /> Filters
                </button>
                <span className="text-white/35" style={{ fontSize: "0.82rem" }}>
                  <span className="text-white font-bold">{filtered.length}</span> movies found
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
                  <TrendingUp size={12} className="text-white/30" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white/60 outline-none cursor-pointer appearance-none pr-4"
                    style={{ fontSize: "0.78rem", fontWeight: 600 }}
                  >
                    <option value="relevance" style={{ backgroundColor: "#111" }}>Relevance</option>
                    <option value="rating"    style={{ backgroundColor: "#111" }}>Top Rated</option>
                    <option value="price_asc" style={{ backgroundColor: "#111" }}>Price: Low→High</option>
                    <option value="price_desc"style={{ backgroundColor: "#111" }}>Price: High→Low</option>
                  </select>
                  <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                </div>

                {/* View mode */}
                <div className="flex items-center gap-0.5 p-1 rounded-xl border border-white/8 bg-white/[0.02]">
                  {(["grid", "list"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: viewMode === m ? "rgba(232,25,44,0.2)" : "transparent", color: viewMode === m ? "#e8192c" : "rgba(255,255,255,0.3)" }}
                    >
                      {m === "grid" ? <LayoutGrid size={13} /> : <List size={13} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Best Match section ── */}
            {bestMatch && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))", border: "1px solid rgba(245,158,11,0.3)" }}>
                    <Sparkles size={13} className="text-[#f59e0b]" />
                    <span className="text-[#f59e0b] uppercase" style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.15em" }}>Best Match</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#f59e0b]/20 to-transparent" />
                </div>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-5" : ""}>
                  {viewMode === "list" ? (
                    <MovieListRow movie={bestMatch} />
                  ) : (
                    <div className="max-w-[240px]">
                      <MovieCard movie={bestMatch} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Suggested section ── */}
            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/50 uppercase" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                    Suggested for You
                  </span>
                  <div className="h-px flex-1 bg-white/6" />
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                    {suggestions.map((m) => (
                      <MovieCard key={m.id} movie={m} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {suggestions.map((m) => (
                      <MovieListRow key={m.id} movie={m} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-white/20">
                <Search size={48} className="mb-4 opacity-20" />
                <p style={{ fontSize: "0.98rem" }}>No results matched your filters</p>
                <button onClick={clearAll} className="mt-3 text-[#e8192c] hover:text-[#ff2d41] transition-colors" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── List row (alternative view) ── */
function MovieListRow({ movie }: { movie: Movie }) {
  return (
    <div
      className="flex gap-4 p-4 rounded-2xl border border-white/7 hover:border-white/14 transition-all group"
      style={{ backgroundColor: "#111118" }}
    >
      <img src={movie.poster} alt={movie.title} className="w-16 h-22 rounded-xl object-cover flex-shrink-0" style={{ height: "88px" }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {movie.isBestMatch && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.1em" }}>
              <Sparkles size={8} /> BEST MATCH
            </span>
          )}
          {movie.format.slice(0,2).map((f) => (
            <span key={f} className="px-1.5 py-0.5 rounded text-white" style={{ fontSize: "0.56rem", fontWeight: 900, letterSpacing: "0.12em", backgroundColor: FORMAT_COLORS[f] ?? "#555" }}>{f}</span>
          ))}
        </div>
        <h3 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem" }}>{movie.title}</h3>
        <p className="text-white/35 mt-0.5" style={{ fontSize: "0.72rem" }}>{movie.genre.join(" · ")} · {movie.year} · {movie.duration}</p>
        <StarRating value={movie.rating} />
      </div>
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#e8192c" }}>{movie.price.toLocaleString("vi-VN")}₫</span>
        <Link
          to={`/movie/${movie.id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all"
          style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em" }}
        >
          <Ticket size={12} /> BUY
        </Link>
      </div>
    </div>
  );
}
