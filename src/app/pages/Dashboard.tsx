import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  Film,
  User,
  Ticket,
  Clock,
  Star,
  LogOut,
  Calendar,
  MapPin,
  Armchair,
  Download,
  Gift,
  CreditCard,
  Bell,
  Shield,
  TrendingUp,
  Crown,
  Check,
  X,
  Settings,
  History,
  Sparkles,
  ChevronRight,
  Zap,
  Award,
  MoreHorizontal,
  Filter,
  Search,
  Eye,
  ChevronDown,
  BarChart3,
  Wallet,
} from "lucide-react";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type NavSection = "tickets" | "history" | "rewards" | "settings";
type TicketStatus = "upcoming" | "watched" | "cancelled";

interface TicketData {
  id: string;
  movie: string;
  genre: string;
  poster: string;
  date: string;
  shortDate: string;
  time: string;
  hall: string;
  seats: string[];
  format: string;
  price: number;
  status: TicketStatus;
  bookingRef: string;
  cinema: string;
  duration: string;
  accentColor: string;
  rating: number;
}

/* ══════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════ */
const USER = {
  name: "Alex Nguyen",
  email: "alex.nguyen@gmail.com",
  avatar: "AN",
  memberSince: "Jan 2024",
  tier: "VIP",
  points: 3_480,
  nextTierPoints: 5_000,
  totalMovies: 24,
  totalSpend: 1_260_000,
  phone: "+84 901 234 567",
};

const TICKETS: TicketData[] = [
  {
    id: "TK-001",
    movie: "Your Name",
    genre: "Animation · Romance",
    poster: "https://images.unsplash.com/photo-1561046582-8f3224fcdab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VyJTIwbmFtZSUyMGFuaW1lJTIwa2ltaSUyMG5vJTIwbmElMjB3YSUyMGNvbWV0JTIwc2t5fGVufDF8fHx8MTc3MjU1MzcwMnww&ixlib=rb-4.1.0&q=80&w=400",
    date: "Saturday, March 8, 2026",
    shortDate: "Mar 8, 2026",
    time: "7:30 PM",
    hall: "Hall 3 – IMAX",
    seats: ["VIP G10", "VIP G11"],
    format: "IMAX",
    price: 280_000,
    status: "upcoming",
    bookingRef: "ABC1234",
    cinema: "CGV Vincom Center",
    duration: "1h 46m",
    accentColor: "#6366f1",
    rating: 0,
  },
  {
    id: "TK-002",
    movie: "Stellar Void",
    genre: "Sci-Fi · Epic",
    poster: "https://images.unsplash.com/photo-1710270822096-ccfa274be004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMG5lYnVsYSUyMHN0YXJzJTIwZGFyayUyMGJsdWUlMjBwdXJwbGV8ZW58MXx8fHwxNzcyNTUzNzA4fDA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Sunday, March 9, 2026",
    shortDate: "Mar 9, 2026",
    time: "9:00 PM",
    hall: "Hall 1 – 4DX",
    seats: ["VIP H8"],
    format: "4DX",
    price: 320_000,
    status: "upcoming",
    bookingRef: "XY7890",
    cinema: "Lotte Cinema Landmark",
    duration: "2h 28m",
    accentColor: "#0ea5e9",
    rating: 0,
  },
  {
    id: "TK-003",
    movie: "Shadow Realm",
    genre: "Fantasy · Action",
    poster: "https://images.unsplash.com/photo-1764515836276-00a873baf511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZm9yZXN0JTIwbWFnaWNhbCUyMGdsb3dpbmclMjB0cmVlc3xlbnwxfHx8fDE3NzI1NTM3MDh8MA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Friday, Feb 28, 2026",
    shortDate: "Feb 28, 2026",
    time: "8:00 PM",
    hall: "Hall 5 – Premium",
    seats: ["E3", "E4", "E5"],
    format: "Premium",
    price: 450_000,
    status: "watched",
    bookingRef: "PQ3344",
    cinema: "BHD Star Bitexco",
    duration: "2h 15m",
    accentColor: "#f59e0b",
    rating: 5,
  },
  {
    id: "TK-004",
    movie: "Storm Protocol",
    genre: "Action · Thriller",
    poster: "https://images.unsplash.com/photo-1592407304867-8c7a2174f460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMGRhcmslMjBkcmFtYXRpYyUyMGhlcm8lMjBzaWxob3VldHRlfGVufDF8fHx8MTc3MjU1MzcwOHww&ixlib=rb-4.1.0&q=80&w=400",
    date: "Mon, Jan 27, 2026",
    shortDate: "Jan 27, 2026",
    time: "6:45 PM",
    hall: "Hall 4 – Dolby Atmos",
    seats: ["D7", "D8"],
    format: "Dolby",
    price: 340_000,
    status: "cancelled",
    bookingRef: "MN5566",
    cinema: "Lotte Cinema",
    duration: "2h 05m",
    accentColor: "#e8192c",
    rating: 0,
  },
  {
    id: "TK-005",
    movie: "Night Bloom",
    genre: "Drama · Romance",
    poster: "https://images.unsplash.com/photo-1608875004752-2fdb6a39ba4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNpdHklMjBuaWdodCUyMGxpZ2h0cyUyMGJva2VoJTIwcHVycGxlJTIwYmx1ZXxlbnwxfHx8fDE3NzI1NTM3MDN8MA&ixlib=rb-4.1.0&q=80&w=400",
    date: "Thu, Jan 15, 2026",
    shortDate: "Jan 15, 2026",
    time: "4:15 PM",
    hall: "Hall 2 – Standard",
    seats: ["B10", "B11"],
    format: "2D",
    price: 160_000,
    status: "watched",
    bookingRef: "RS9988",
    cinema: "CGV Vincom",
    duration: "1h 52m",
    accentColor: "#10b981",
    rating: 4,
  },
];

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

/* ══════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════ */
function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = {
    upcoming:  { label: "Upcoming",  bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.4)",  text: "#10b981", pulse: true  },
    watched:   { label: "Watched",   bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)", text: "rgba(255,255,255,0.4)", pulse: false },
    cancelled: { label: "Cancelled", bg: "rgba(232,25,44,0.12)",   border: "rgba(232,25,44,0.35)",  text: "#e8192c", pulse: false },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.text }} />
        {cfg.pulse && (
          <span
            className="absolute w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: cfg.text, opacity: 0.4 }}
          />
        )}
      </span>
      <span style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", color: cfg.text }}>
        {cfg.label.toUpperCase()}
      </span>
    </span>
  );
}

/* ══════════════════════════════════════════════
   FORMAT PILL
══════════════════════════════════════════════ */
const FORMAT_COLORS: Record<string, string> = {
  IMAX: "#3b82f6", "4DX": "#f59e0b", Dolby: "#8b5cf6",
  Premium: "#10b981", "2D": "rgba(255,255,255,0.22)",
};
function FormatPill({ format }: { format: string }) {
  return (
    <span
      className="px-1.5 py-0.5 rounded text-white"
      style={{ fontSize: "0.56rem", fontWeight: 900, letterSpacing: "0.14em", backgroundColor: FORMAT_COLORS[format] ?? "#555" }}
    >
      {format}
    </span>
  );
}

/* ══════════════════════════════════════════════
   PHYSICAL TICKET CARD
══════════════════════════════════════════════ */
function TicketCard({ ticket, onOpen }: { ticket: TicketData; onOpen: () => void }) {
  const upcoming = ticket.status === "upcoming";
  const cancelled = ticket.status === "cancelled";

  return (
    <div
      className="relative group"
      style={{
        filter: cancelled ? "brightness(0.65) saturate(0.4)" : "none",
        transition: "transform 0.2s ease, filter 0.2s ease",
      }}
      onMouseEnter={(e) => { if (!cancelled) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* ── Glow aura for upcoming ── */}
      {upcoming && (
        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-20 pointer-events-none -z-10"
          style={{ backgroundColor: ticket.accentColor, transform: "scale(1.04)" }}
        />
      )}

      {/* ── TICKET SHAPE ── */}
      <div
        className="flex rounded-2xl overflow-hidden border"
        style={{
          backgroundColor: "#121219",
          borderColor: upcoming ? `${ticket.accentColor}40` : "rgba(255,255,255,0.07)",
          boxShadow: upcoming
            ? `0 0 0 1px ${ticket.accentColor}22, 0 12px 40px rgba(0,0,0,0.55)`
            : "0 6px 24px rgba(0,0,0,0.45)",
          minHeight: "168px",
        }}
      >
        {/* ── Colored left stripe ── */}
        <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: ticket.accentColor, opacity: upcoming ? 1 : 0.5 }} />

        {/* ── Poster column ── */}
        <div className="relative flex-shrink-0 w-[104px] overflow-hidden">
          <img
            src={ticket.poster}
            alt={ticket.movie}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient right */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121219]/70" />
          {/* Format badge pinned bottom-left */}
          <div className="absolute bottom-2.5 left-2">
            <FormatPill format={ticket.format} />
          </div>
        </div>

        {/* ── Perforation divider ── */}
        <PerforationLine />

        {/* ── Main details ── */}
        <div className="flex-1 flex flex-col justify-between px-4 py-4 min-w-0 gap-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="text-white truncate"
                style={{ fontWeight: 900, fontSize: "1.05rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}
              >
                {ticket.movie}
              </h3>
              <p className="text-white/35 mt-0.5 truncate" style={{ fontSize: "0.72rem" }}>{ticket.genre}</p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <InfoCell icon={<Calendar size={11} />} label="DATE" value={ticket.shortDate} />
            <InfoCell icon={<Clock size={11} />} label="TIME" value={ticket.time} />
            <InfoCell icon={<Film size={11} />} label="HALL" value={ticket.hall} />
            <InfoCell
              icon={<Armchair size={11} />}
              label="SEATS"
              value={ticket.seats.join(" · ")}
              highlight
            />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <MapPin size={10} className="text-white/25" />
              <span className="text-white/35 truncate" style={{ fontSize: "0.68rem" }}>{ticket.cinema}</span>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: upcoming ? ticket.accentColor : "rgba(255,255,255,0.5)" }}>
              {fmtVND(ticket.price)}
            </span>
          </div>
        </div>

        {/* ── Perforation divider ── */}
        <PerforationLine />

        {/* ── QR + actions column ── */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 px-4 py-4 bg-white/[0.018]">
          {/* QR Code */}
          <div className="relative">
            <div
              className="p-2 rounded-xl"
              style={{
                backgroundColor: "white",
                boxShadow: upcoming
                  ? `0 0 24px ${ticket.accentColor}55`
                  : "0 4px 12px rgba(0,0,0,0.4)",
                opacity: cancelled ? 0.25 : 1,
              }}
            >
              <QRCodeSVG
                value={`CINEMA:REF-${ticket.bookingRef}:${ticket.movie.replace(/\s/g, "_").toUpperCase()}:${ticket.seats.join(",")}`}
                size={80}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="M"
              />
            </div>
            {cancelled && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="rotate-[-35deg] border-2 border-[#e8192c] text-[#e8192c] px-2 py-0.5 rounded"
                  style={{ fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.12em" }}
                >
                  VOID
                </span>
              </div>
            )}
          </div>
          {/* Booking ref */}
          <div className="text-center">
            <p className="text-white/20 font-mono" style={{ fontSize: "0.58rem", letterSpacing: "0.05em" }}>REF #</p>
            <p className="text-white/55 font-mono" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em" }}>
              {ticket.bookingRef}
            </p>
          </div>
          {/* Action button */}
          {!cancelled && (
            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                backgroundColor: upcoming ? `${ticket.accentColor}20` : "rgba(255,255,255,0.05)",
                color: upcoming ? ticket.accentColor : "rgba(255,255,255,0.35)",
                border: `1px solid ${upcoming ? ticket.accentColor + "35" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <Eye size={10} /> EXPAND
            </button>
          )}
        </div>
      </div>

      {/* Hole punch decorations on top */}
      {upcoming && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Perforation Line Component ── */
function PerforationLine() {
  return (
    <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: "22px" }}>
      {/* Top scallop */}
      <div
        className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-2.5 rounded-b-full"
        style={{ backgroundColor: "#0a0a0f", border: "1px solid rgba(255,255,255,0.06)", borderTop: "none" }}
      />
      {/* Dashed vertical line */}
      <div
        className="flex-1 w-px my-3"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 4px, transparent 4px, transparent 9px)",
        }}
      />
      {/* Bottom scallop */}
      <div
        className="absolute -bottom-px left-1/2 -translate-x-1/2 w-5 h-2.5 rounded-t-full"
        style={{ backgroundColor: "#0a0a0f", border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none" }}
      />
    </div>
  );
}

/* ── Info Cell ── */
function InfoCell({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-white/25">{icon}</span>
        <span className="text-white/25 uppercase" style={{ fontSize: "0.57rem", fontWeight: 700, letterSpacing: "0.12em" }}>{label}</span>
      </div>
      <span
        className="block truncate"
        style={{ fontSize: "0.78rem", fontWeight: 700, color: highlight ? "#e8192c" : "rgba(255,255,255,0.78)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TICKET EXPAND MODAL
══════════════════════════════════════════════ */
function TicketModal({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10"
        style={{
          backgroundColor: "#121219",
          boxShadow: `0 0 0 1px ${ticket.accentColor}25, 0 40px 80px rgba(0,0,0,0.8)`,
          animation: "ticketPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${ticket.accentColor}, transparent 70%)` }} />

        {/* Poster hero */}
        <div className="relative h-44 overflow-hidden">
          <img src={ticket.poster} alt={ticket.movie} className="w-full h-full object-cover scale-105" style={{ filter: "brightness(0.55) saturate(1.3)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121219] via-[#121219]/40 to-transparent" />
          {/* Close btn */}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/70 transition-all">
            <X size={16} />
          </button>
          {/* Info overlay on poster */}
          <div className="absolute bottom-4 left-5">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={ticket.status} />
              <FormatPill format={ticket.format} />
            </div>
            <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>{ticket.movie}</h2>
            <p className="text-white/40" style={{ fontSize: "0.78rem" }}>{ticket.genre} · {ticket.duration}</p>
          </div>
        </div>

        {/* Scallop divider */}
        <div className="relative h-0 flex items-center justify-between pointer-events-none px-0 z-10">
          <div className="w-5 h-10 rounded-r-full" style={{ backgroundColor: "#0a0a0f", marginLeft: "-1px" }} />
          <div
            className="flex-1 mx-1 border-t"
            style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.1)", borderWidth: "1px" }}
          />
          <div className="w-5 h-10 rounded-l-full" style={{ backgroundColor: "#0a0a0f", marginRight: "-1px" }} />
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex gap-6">
          {/* Details */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { icon: <Calendar size={13} />, label: "Date", value: ticket.date },
              { icon: <Clock size={13} />, label: "Time", value: ticket.time },
              { icon: <MapPin size={13} />, label: "Cinema", value: ticket.cinema },
              { icon: <Film size={13} />, label: "Hall", value: ticket.hall },
              { icon: <Armchair size={13} />, label: "Seats", value: ticket.seats.join(", ") },
              { icon: <CreditCard size={13} />, label: "Total Paid", value: fmtVND(ticket.price) },
            ].map(({ icon, label, value }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-white/25">{icon}</span>
                  <span className="text-white/30 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em" }}>{label}</span>
                </div>
                <p className="text-white" style={{ fontSize: "0.83rem", fontWeight: 700 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* QR */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div
              className="p-3 rounded-2xl"
              style={{
                backgroundColor: "white",
                boxShadow: `0 0 32px ${ticket.accentColor}55`,
              }}
            >
              <QRCodeSVG
                value={`CINEMA:REF-${ticket.bookingRef}:${ticket.movie.replace(/\s/g, "_").toUpperCase()}:${ticket.seats.join(",")}`}
                size={108}
                bgColor="#ffffff"
                fgColor="#0a0a0f"
                level="H"
              />
            </div>
            <p className="text-white/25 font-mono text-center" style={{ fontSize: "0.62rem" }}>#{ticket.bookingRef}</p>
            <p className="text-white/20 text-center" style={{ fontSize: "0.58rem", maxWidth: "96px" }}>Show at entrance for check‑in</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          <Link
            to="/booking-confirmed"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#e8192c] hover:bg-[#c8111f] text-white transition-all"
            style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em" }}
          >
            <Eye size={14} /> VIEW E-TICKET
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-3.5 rounded-2xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
            style={{ fontSize: "0.78rem", fontWeight: 600 }}
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes ticketPop {
          from { opacity: 0; transform: scale(0.88) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MY TICKETS VIEW
══════════════════════════════════════════════ */
function MyTicketsView() {
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [search, setSearch] = useState("");
  const [openTicket, setOpenTicket] = useState<TicketData | null>(null);

  const displayed = TICKETS.filter((t) => {
    const matchStatus = filter === "all" || t.status === filter;
    const matchSearch = t.movie.toLowerCase().includes(search.toLowerCase()) || t.cinema.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: TICKETS.length,
    upcoming: TICKETS.filter((t) => t.status === "upcoming").length,
    watched: TICKETS.filter((t) => t.status === "watched").length,
    cancelled: TICKETS.filter((t) => t.status === "cancelled").length,
  };

  return (
    <>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>My Tickets</h2>
          <p className="text-white/35" style={{ fontSize: "0.78rem", marginTop: "2px" }}>
            {counts.upcoming} upcoming · {counts.watched} watched
          </p>
        </div>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e8192c] hover:bg-[#c8111f] text-white transition-all self-start sm:self-auto"
          style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.08em" }}
        >
          <Ticket size={14} /> BOOK A TICKET
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
            style={{ fontSize: "0.83rem" }}
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "upcoming", "watched", "cancelled"] as const).map((f) => {
            const active = filter === f;
            const colors: Record<string, string> = { all: "#e8192c", upcoming: "#10b981", watched: "rgba(255,255,255,0.5)", cancelled: "#e8192c" };
            const c = colors[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200"
                style={{
                  fontSize: "0.76rem",
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? `${c}15` : "transparent",
                  borderColor: active ? `${c}45` : "rgba(255,255,255,0.08)",
                  color: active ? c : "rgba(255,255,255,0.35)",
                }}
              >
                <span className="capitalize">{f}</span>
                <span
                  className="px-1.5 rounded-full"
                  style={{ fontSize: "0.6rem", fontWeight: 700, backgroundColor: active ? `${c}30` : "rgba(255,255,255,0.06)", color: active ? c : "rgba(255,255,255,0.25)" }}
                >
                  {counts[f as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets grid */}
      {displayed.length > 0 ? (
        <div className="flex flex-col gap-5">
          {displayed.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onOpen={() => setOpenTicket(ticket)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-white/5" style={{ backgroundColor: "#0f0f16" }}>
          <Ticket size={44} className="text-white/10 mb-4" />
          <p className="text-white/30" style={{ fontSize: "0.92rem" }}>No tickets found</p>
          <p className="text-white/15" style={{ fontSize: "0.78rem", marginTop: "4px" }}>Try adjusting your search or filter</p>
        </div>
      )}

      {openTicket && <TicketModal ticket={openTicket} onClose={() => setOpenTicket(null)} />}
    </>
  );
}

/* ══════════════════════════════════════════════
   PURCHASE HISTORY VIEW
══════════════════════════════════════════════ */
function PurchaseHistoryView() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>Purchase History</h2>
          <p className="text-white/35" style={{ fontSize: "0.78rem", marginTop: "2px" }}>All your cinema transactions</p>
        </div>
        <button className="flex items-center gap-1.5 text-[#e8192c] hover:text-[#ff2d41] transition-colors" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
          <Download size={13} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Spent",   value: `${(USER.totalSpend / 1000).toFixed(0)}K₫`,  icon: <Wallet size={15} />,    color: "#e8192c" },
          { label: "Total Tickets", value: TICKETS.length,                               icon: <Ticket size={15} />,    color: "#10b981" },
          { label: "Avg Per Visit", value: `${Math.round(USER.totalSpend / USER.totalMovies / 1000)}K₫`, icon: <BarChart3 size={15} />, color: "#f59e0b" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="rounded-2xl p-4 border border-white/6 flex flex-col gap-2" style={{ backgroundColor: "#111118" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
              {icon}
            </div>
            <div className="text-white" style={{ fontWeight: 800, fontSize: "1.15rem" }}>{value}</div>
            <div className="text-white/30" style={{ fontSize: "0.68rem", letterSpacing: "0.04em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ backgroundColor: "#111118" }}>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5">
          {["Movie", "Date", "Amount", "Status"].map((h) => (
            <span key={h} className="text-white/25 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>{h}</span>
          ))}
        </div>
        {TICKETS.map((t, i) => (
          <div
            key={t.id}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
            style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={t.poster} alt="" className="w-8 h-10 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white truncate" style={{ fontSize: "0.83rem", fontWeight: 700 }}>{t.movie}</p>
                <p className="text-white/30 truncate" style={{ fontSize: "0.68rem" }}>{t.cinema}</p>
              </div>
            </div>
            <span className="text-white/40" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>{t.shortDate}</span>
            <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap" }}>{fmtVND(t.price)}</span>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MEMBERSHIP POINTS VIEW
══════════════════════════════════════════════ */
const ACHIEVEMENTS = [
  { icon: <Star size={15} />,     label: "Movie Buff",    desc: "Watched 20+ films",       earned: true,  pts: 500  },
  { icon: <Zap size={15} />,      label: "Early Bird",    desc: "10 first screenings",      earned: true,  pts: 300  },
  { icon: <Crown size={15} />,    label: "VIP Member",    desc: "Reached VIP tier",         earned: true,  pts: 1000 },
  { icon: <Sparkles size={15} />, label: "Combo King",    desc: "Ordered 15 combos",        earned: false, pts: 400  },
  { icon: <Award size={15} />,    label: "Platinum Elite",desc: "Reach 5,000 points",       earned: false, pts: 2000 },
  { icon: <Gift size={15} />,     label: "Referral Star", desc: "Refer 5 friends",          earned: false, pts: 600  },
];

function MembershipPointsView() {
  const pct = Math.round((USER.points / USER.nextTierPoints) * 100);
  return (
    <div className="flex flex-col gap-6">
      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-[#f59e0b]/20 p-6" style={{ background: "linear-gradient(135deg, #1a1105 0%, #12120f 60%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 85% 40%, rgba(245,158,11,0.18), transparent 55%), radial-gradient(ellipse at 15% 70%, rgba(232,25,44,0.12), transparent 50%)" }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                <Crown size={14} className="text-[#f59e0b]" />
              </div>
              <span className="text-[#f59e0b] uppercase" style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.18em" }}>
                {USER.tier} Member
              </span>
            </div>
            <div className="text-white mb-0.5" style={{ fontWeight: 900, fontSize: "2.8rem", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {USER.points.toLocaleString()}
            </div>
            <div className="text-white/40" style={{ fontSize: "0.82rem" }}>Points available to redeem</div>
          </div>
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #e8192c)", boxShadow: "0 12px 32px rgba(245,158,11,0.35)" }}>
            <Star size={38} className="text-white" fill="white" />
          </div>
        </div>
        {/* Progress */}
        <div className="relative mt-5">
          <div className="flex justify-between mb-2">
            <span className="text-white/40" style={{ fontSize: "0.73rem" }}>Progress to Platinum</span>
            <span className="text-[#f59e0b]" style={{ fontSize: "0.73rem", fontWeight: 700 }}>{pct}% · {(USER.nextTierPoints - USER.points).toLocaleString()} pts left</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #f59e0b, #e8192c)" }} />
          </div>
        </div>
      </div>

      {/* Redeem */}
      <div>
        <h3 className="text-white mb-3" style={{ fontWeight: 800, fontSize: "0.95rem" }}>Redeem Points</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Ticket size={17} />,     label: "Free Ticket",   pts: 1000, color: "#e8192c" },
            { icon: <Gift size={17} />,        label: "Popcorn Combo", pts: 400,  color: "#f59e0b" },
            { icon: <CreditCard size={17} />,  label: "50K Voucher",   pts: 600,  color: "#10b981" },
          ].map(({ icon, label, pts, color }) => (
            <button key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/8 hover:border-white/16 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}18`, color }}>
                {icon}
              </div>
              <span className="text-white/65" style={{ fontSize: "0.75rem", fontWeight: 700, textAlign: "center" }}>{label}</span>
              <div className="flex items-center gap-1">
                <Star size={9} className="text-[#f59e0b]" fill="#f59e0b" />
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#f59e0b" }}>{pts} pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-white mb-3" style={{ fontWeight: 800, fontSize: "0.95rem" }}>Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(({ icon, label, desc, earned, pts }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 p-4 rounded-2xl border transition-all"
              style={{
                backgroundColor: earned ? "rgba(245,158,11,0.04)" : "rgba(255,255,255,0.01)",
                borderColor: earned ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.06)",
                opacity: earned ? 1 : 0.5,
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: earned ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)", color: earned ? "#f59e0b" : "rgba(255,255,255,0.2)" }}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/80" style={{ fontSize: "0.83rem", fontWeight: 700 }}>{label}</span>
                  {earned && <Check size={11} className="text-[#10b981]" />}
                </div>
                <span className="text-white/30" style={{ fontSize: "0.7rem" }}>{desc}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star size={9} style={{ color: earned ? "#f59e0b" : "rgba(255,255,255,0.15)" }} fill={earned ? "#f59e0b" : "none"} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: earned ? "#f59e0b" : "rgba(255,255,255,0.2)" }}>{pts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SETTINGS VIEW
══════════════════════════════════════════════ */
function SettingsView() {
  const [name, setName] = useState(USER.name);
  const [email, setEmail] = useState(USER.email);
  const [phone, setPhone] = useState(USER.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <h2 className="text-white" style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>Settings</h2>
        <p className="text-white/35" style={{ fontSize: "0.78rem", marginTop: "2px" }}>Manage your account preferences</p>
      </div>

      {/* Profile info */}
      <div className="rounded-2xl border border-white/8 p-6 flex flex-col gap-4" style={{ backgroundColor: "#111118" }}>
        <h3 className="text-white/70 uppercase" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em" }}>Profile Information</h3>
        {[
          { label: "Full Name",     value: name,  set: setName,  type: "text",  icon: <User size={14} /> },
          { label: "Email Address", value: email, set: setEmail, type: "email", icon: <MapPin size={14} /> },
          { label: "Phone Number",  value: phone, set: setPhone, type: "tel",   icon: <Bell size={14} /> },
        ].map(({ label, value, set, type, icon }) => (
          <div key={label}>
            <label className="text-white/35 block mb-1.5 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em" }}>{label}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20">{icon}</span>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white outline-none focus:border-[#e8192c]/50 transition-colors"
                style={{ fontSize: "0.88rem" }}
              />
            </div>
          </div>
        ))}
        <button
          onClick={handleSave}
          className="mt-2 w-full py-3.5 rounded-xl text-white transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: saved ? "#10b981" : "#e8192c", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em" }}
        >
          {saved ? <><Check size={15} /> SAVED!</> : "SAVE CHANGES"}
        </button>
      </div>

      {/* Quick toggles */}
      <div className="rounded-2xl border border-white/8 p-6 flex flex-col gap-4" style={{ backgroundColor: "#111118" }}>
        <h3 className="text-white/70 uppercase" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em" }}>Preferences</h3>
        {[
          { label: "Email Notifications", desc: "Booking confirmations & promos", icon: <Bell size={15} />, on: true },
          { label: "Two-Factor Auth",     desc: "SMS verification on login",      icon: <Shield size={15} />, on: false },
          { label: "Auto-Renewal",        desc: "Renew membership automatically", icon: <Crown size={15} />, on: true },
        ].map(({ label, desc, icon, on: initialOn }) => {
          const [on, setOn] = useState(initialOn);
          return (
            <div key={label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">{icon}</div>
                <div>
                  <p className="text-white/75" style={{ fontSize: "0.83rem", fontWeight: 600 }}>{label}</p>
                  <p className="text-white/30" style={{ fontSize: "0.7rem" }}>{desc}</p>
                </div>
              </div>
              <button
                onClick={() => setOn((v) => !v)}
                className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
                style={{ backgroundColor: on ? "#e8192c" : "rgba(255,255,255,0.1)" }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all"
                  style={{ left: on ? "calc(100% - 22px)" : "2px" }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
const NAV: { id: NavSection; icon: React.ReactNode; label: string; badge?: number }[] = [
  { id: "tickets",  icon: <Ticket size={18} />,  label: "My Tickets",        badge: 2 },
  { id: "history",  icon: <History size={18} />, label: "Purchase History" },
  { id: "rewards",  icon: <Star size={18} />,    label: "Membership Points", badge: 3 },
  { id: "settings", icon: <Settings size={18} />,label: "Settings" },
];

function Sidebar({ active, onSelect }: { active: NavSection; onSelect: (s: NavSection) => void }) {
  const navigate = useNavigate();

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06]"
      style={{ backgroundColor: "#0c0c13" }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.05] flex-shrink-0"
      >
        <div className="w-8 h-8 bg-[#e8192c] rounded-lg flex items-center justify-center shadow-lg shadow-[#e8192c]/25">
          <Film size={15} className="text-white" />
        </div>
        <span className="text-white uppercase" style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.22em" }}>CINEMA</span>
      </Link>

      {/* User card */}
      <div className="mx-4 mt-5 mb-1 rounded-2xl p-4 border border-white/[0.06]" style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.07), rgba(255,255,255,0.02))" }}>
        {/* Avatar with VIP badge */}
        <div className="relative w-fit mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#e8192c]/20"
            style={{ background: "linear-gradient(135deg, #e8192c, #a00e1f)", fontSize: "1.1rem", fontWeight: 900 }}
          >
            {USER.avatar}
          </div>
          {/* VIP Badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 2px 8px rgba(245,158,11,0.5)" }}
          >
            <Crown size={8} className="text-white" />
            <span className="text-white" style={{ fontSize: "0.52rem", fontWeight: 900, letterSpacing: "0.08em" }}>VIP</span>
          </div>
        </div>

        <p className="text-white mb-0.5" style={{ fontWeight: 800, fontSize: "0.92rem" }}>{USER.name}</p>
        <p className="text-white/35 truncate" style={{ fontSize: "0.71rem" }}>{USER.email}</p>

        {/* Points chip */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-1" style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Star size={10} className="text-[#f59e0b]" fill="#f59e0b" />
            <span className="text-[#f59e0b]" style={{ fontSize: "0.72rem", fontWeight: 800 }}>{USER.points.toLocaleString()} pts</span>
          </div>
          <div className="px-2 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="text-[#10b981]" style={{ fontSize: "0.68rem", fontWeight: 800 }}>GOLD</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-3 overflow-y-auto">
        <p className="text-white/20 uppercase px-3 mb-1" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Navigation</p>
        {NAV.map(({ id, icon, label, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group w-full text-left"
              style={{
                backgroundColor: isActive ? "rgba(232,25,44,0.1)" : "transparent",
                border: `1px solid ${isActive ? "rgba(232,25,44,0.22)" : "transparent"}`,
              }}
            >
              {/* Active left bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#e8192c]" />
              )}
              <span className={`flex-shrink-0 transition-colors ${isActive ? "text-[#e8192c]" : "text-white/30 group-hover:text-white/55"}`}>
                {icon}
              </span>
              <span
                className="flex-1 transition-colors"
                style={{ fontSize: "0.87rem", fontWeight: isActive ? 700 : 500, color: isActive ? "white" : "rgba(255,255,255,0.45)" }}
              >
                {label}
              </span>
              {badge !== undefined && (
                <span
                  className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white px-1"
                  style={{ fontSize: "0.58rem", fontWeight: 900, backgroundColor: isActive ? "#e8192c" : "rgba(255,255,255,0.1)", color: isActive ? "white" : "rgba(255,255,255,0.4)" }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: logout */}
      <div className="p-3 pt-0 border-t border-white/[0.05] mt-0">
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/30 hover:text-[#e8192c] hover:bg-[#e8192c]/8 transition-all group"
        >
          <LogOut size={17} className="flex-shrink-0" />
          <span style={{ fontSize: "0.87rem", fontWeight: 500 }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════════ */
const SECTION_LABELS: Record<NavSection, string> = {
  tickets: "My Tickets",
  history: "Purchase History",
  rewards: "Membership Points",
  settings: "Settings",
};

function TopBar({ section, onMobileMenu }: { section: NavSection; onMobileMenu: () => void }) {
  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-6 h-16 border-b border-white/[0.05]"
      style={{ backgroundColor: "#0c0c13" }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenu} className="md:hidden text-white/40 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
        <div>
          <h1 className="text-white" style={{ fontWeight: 800, fontSize: "0.98rem" }}>{SECTION_LABELS[section]}</h1>
          <p className="text-white/25" style={{ fontSize: "0.7rem" }}>
            Welcome back, <span className="text-[#e8192c] font-semibold">{USER.name.split(" ")[0]}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Notification */}
        <button className="relative w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/35 hover:text-white hover:border-white/18 transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e8192c]" />
        </button>

        {/* Avatar chip */}
        <div
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-white/8 cursor-pointer hover:border-white/16 transition-all"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #e8192c, #a00e1f)", fontSize: "0.7rem", fontWeight: 900 }}
          >
            {USER.avatar}
          </div>
          <span className="text-white/55 hidden sm:block" style={{ fontSize: "0.8rem", fontWeight: 600 }}>{USER.name.split(" ")[0]}</span>
          <ChevronDown size={12} className="text-white/25 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════
   PAGE EXPORT
══════════════════════════════════════════════ */
export function Dashboard() {
  const [section, setSection] = useState<NavSection>("tickets");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar active={section} onSelect={setSection} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
            <Sidebar active={section} onSelect={(s) => { setSection(s); setMobileSidebarOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar section={section} onMobileMenu={() => setMobileSidebarOpen(true)} />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: "28px 28px 48px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {section === "tickets"  && <MyTicketsView />}
            {section === "history"  && <PurchaseHistoryView />}
            {section === "rewards"  && <MembershipPointsView />}
            {section === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
