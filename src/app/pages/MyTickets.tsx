import { useEffect, useState } from "react";
import { Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  Ticket, MapPin, Clock, Calendar, Armchair,
  Download, Star, Film, ChevronRight, Search,
  CheckCircle2, XCircle, Sparkles,
} from "lucide-react";
import { Header } from "../components/Header";
import type { TicketRecord } from "../lib/ticketsData";
import { TICKETS } from "../lib/ticketsData";

/* ─────────────────────────────────────────────────────────
   PALETTE
───────────────────────────────────────────────────────── */
const C = {
  bg: "#0a0a0f",
  surface: "#0f0f18",
  card: "#13131e",
  border: "rgba(255,255,255,0.07)",
  red: "#e8192c",
  redSoft: "rgba(232,25,44,0.10)",
  green: "#10b981",
  amber: "#f59e0b",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  muted: "rgba(255,255,255,0.38)",
  dim: "rgba(255,255,255,0.07)",
};

/* ─────────────────────────────────────────────────────────
   PENDING ORDER BANNER (mocked)
───────────────────────────────────────────────────────── */
function PendingOrderBanner() {
  const [secondsLeft, setSecondsLeft] = useState(600);

  const pending = {
    movie: "Your Name",
    seats: "G10, G11",
    price: "280,000 VND",
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <section
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "rgba(19,19,30,0.72)",
        borderColor: "rgba(232,25,44,0.22)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 16px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 70px rgba(232,25,44,0.16)",
      }}
    >
      <div
        className="h-0.5"
        style={{
          background:
            "linear-gradient(90deg, rgba(232,25,44,0.0) 0%, rgba(232,25,44,0.85) 50%, rgba(232,25,44,0.0) 100%)",
          opacity: 0.85,
        }}
      />

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border flex-shrink-0"
            style={{
              backgroundColor: "rgba(232,25,44,0.12)",
              borderColor: "rgba(232,25,44,0.30)",
              boxShadow: "0 0 28px rgba(232,25,44,0.20)",
            }}
          >
            <Ticket size={18} style={{ color: C.red }} />
          </div>

          <div className="min-w-0">
            <p className="text-white/50 uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em" }}>
              Pending Order
            </p>
            <h2 className="text-white mt-0.5 truncate" style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>
              {pending.movie}
            </h2>
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${C.dim}`,
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                }}
              >
                <Armchair size={11} /> {pending.seats}
              </span>
              <span style={{ color: C.red, fontWeight: 900, fontSize: "0.9rem", letterSpacing: "-0.01em" }}>
                {pending.price}
              </span>
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{
                  marginLeft: "auto",
                  backgroundColor: "rgba(232,25,44,0.10)",
                  border: "1px solid rgba(232,25,44,0.25)",
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                }}
              >
                <Clock size={12} style={{ color: C.red }} /> {mm}:{ss} left
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-stretch sm:w-[180px]">
          <Link
            to="/checkout"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all active:scale-95"
            style={{
              backgroundColor: C.red,
              color: "white",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "0.88rem",
              letterSpacing: "0.06em",
              boxShadow: "0 12px 40px rgba(232,25,44,0.32), 0 2px 10px rgba(232,25,44,0.15)",
            }}
          >
            Pay Now <ChevronRight size={14} />
          </Link>
          <div className="hidden sm:flex items-center justify-center text-white/25" style={{ fontSize: "0.72rem" }}>
            Session recovery enabled
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type Tab = "all" | "upcoming" | "past";

/* ─────────────────────────────────────────────────────────
   FORMAT BADGE
───────────────────────────────────────────────────────── */
const FORMAT_COLOR: Record<string, { bg: string; text: string }> = {
  IMAX:  { bg: "rgba(59,130,246,0.15)",  text: "#3b82f6" },
  "4DX": { bg: "rgba(245,158,11,0.15)",  text: "#f59e0b" },
  Dolby: { bg: "rgba(139,92,246,0.15)",  text: "#8b5cf6" },
  "2D":  { bg: "rgba(255,255,255,0.07)", text: "rgba(255,255,255,0.45)" },
};
function FormatBadge({ fmt }: { fmt: string }) {
  const style = FORMAT_COLOR[fmt] ?? FORMAT_COLOR["2D"];
  return (
    <span
      className="px-2 py-0.5 rounded text-xs"
      style={{ backgroundColor: style.bg, color: style.text, fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.1em" }}
    >
      {fmt}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   STAR RATING (read-only display)
───────────────────────────────────────────────────────── */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={12}
          style={{ color: i <= n ? "#f59e0b" : "rgba(255,255,255,0.15)", fill: i <= n ? "#f59e0b" : "transparent" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TICKET CARD
───────────────────────────────────────────────────────── */
function TicketCard({ t }: { t: TicketRecord }) {
  const [qrOpen, setQrOpen] = useState(false);

  const statusMeta = {
    upcoming:  { label: "UPCOMING",  icon: <Sparkles size={10} />,     bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  text: C.green },
    past:      { label: "WATCHED",   icon: <CheckCircle2 size={10} />, bg: "rgba(255,255,255,0.05)", border: C.dim,                   text: "rgba(255,255,255,0.4)" },
    cancelled: { label: "CANCELLED", icon: <XCircle size={10} />,      bg: "rgba(232,25,44,0.1)",   border: "rgba(232,25,44,0.25)",  text: C.red },
  }[t.status];

  return (
    <article
      className="rounded-2xl border overflow-hidden transition-all duration-200 group hover:-translate-y-0.5"
      style={{
        backgroundColor: C.card,
        borderColor: C.border,
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* Accent top stripe */}
      <div className="h-0.5" style={{ backgroundColor: t.accentColor, opacity: 0.7 }} />

      <div className="flex gap-0 sm:gap-4 p-4 sm:p-5">
        {/* Poster */}
        <div
          className="hidden sm:flex w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border"
          style={{ borderColor: C.dim }}
        >
          <img src={t.poster} alt={t.movie} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-white" style={{ fontWeight: 700, fontSize: "0.97rem" }}>{t.movie}</h3>
                <FormatBadge fmt={t.format} />
              </div>
              <p style={{ color: C.muted, fontSize: "0.73rem" }}>{t.genre}</p>
            </div>

            {/* Status badge */}
            <span
              className="flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusMeta.bg, border: `1px solid ${statusMeta.border}`, fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", color: statusMeta.text }}
            >
              {statusMeta.icon} {statusMeta.label}
            </span>
          </div>

          {/* Info chips */}
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="flex items-center gap-1.5" style={{ color: C.muted, fontSize: "0.76rem" }}>
              <Calendar size={12} /> {t.shortDate}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: C.muted, fontSize: "0.76rem" }}>
              <Clock size={12} /> {t.time}
            </span>
            <span className="flex items-center gap-1.5" style={{ color: C.muted, fontSize: "0.76rem" }}>
              <MapPin size={12} /> {t.cinema}
            </span>
          </div>

          {/* Seat + hall row */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.dim}`, fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}
            >
              <Armchair size={11} /> {t.seats.join(", ")}
            </span>
            <span style={{ color: C.muted, fontSize: "0.75rem" }}>{t.hall}</span>
            <span className="ml-auto" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", fontWeight: 700 }}>
              {(t.price * t.seats.length).toLocaleString()}₫
            </span>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Ref */}
            <span
              className="px-2.5 py-1 rounded-lg font-mono"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.dim}`, fontSize: "0.68rem", color: C.muted, letterSpacing: "0.06em" }}
            >
              #{t.bookingRef}
            </span>

            {/* Star rating for past tickets */}
            {t.status === "past" && (
              <div className="flex items-center gap-2 ml-1">
                {t.rating ? (
                  <Stars n={t.rating} />
                ) : (
                  <button
                    className="flex items-center gap-1 transition-colors hover:text-amber-400"
                    style={{ color: C.muted, fontSize: "0.72rem", fontWeight: 600 }}
                  >
                    <Star size={11} /> Rate
                  </button>
                )}
              </div>
            )}

            {/* Upcoming actions */}
            {t.status === "upcoming" && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setQrOpen(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all hover:text-white hover:border-white/25"
                  style={{ borderColor: C.dim, color: C.muted, fontSize: "0.76rem", fontWeight: 600 }}
                >
                  <Ticket size={12} /> {qrOpen ? "Hide QR" : "Show QR"}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: C.redSoft, border: `1px solid rgba(232,25,44,0.25)`, color: C.red, fontSize: "0.76rem", fontWeight: 700 }}
                >
                  <Download size={12} /> Download
                </button>
              </div>
            )}
          </div>

          {/* QR panel (expand on demand) */}
          {qrOpen && t.status === "upcoming" && (
            <div
              className="mt-4 pt-4 flex flex-col sm:flex-row items-center gap-5"
              style={{ borderTop: `1px solid ${C.dim}` }}
            >
              {/* QR */}
              <div
                className="p-3 rounded-2xl flex-shrink-0"
                style={{ backgroundColor: "white" }}
              >
                <QRCodeSVG
                  value={`CINEMA:${t.bookingRef}:${t.seats.join(",")}`}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#0a0a0f"
                  level="M"
                />
              </div>
              {/* Instructions */}
              <div>
                <p className="text-white mb-1" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                  Show at the entrance
                </p>
                <p style={{ color: C.muted, fontSize: "0.76rem", lineHeight: 1.6 }}>
                  Present this QR code at the scanning terminal. Valid for {t.seats.length} seat{t.seats.length > 1 ? "s" : ""} on{" "}
                  <strong className="text-white">{t.shortDate}</strong> at{" "}
                  <strong className="text-white">{t.time}</strong>.
                </p>
                <p className="mt-2 font-mono" style={{ color: C.muted, fontSize: "0.68rem", letterSpacing: "0.06em" }}>
                  Ref: {t.bookingRef}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────── */
export function MyTickets() {
  const [tab,    setTab]    = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const filtered = TICKETS.filter(t => {
    const matchTab    = tab === "all" ? true : tab === "upcoming" ? t.status === "upcoming" : t.status !== "upcoming";
    const matchSearch = search.trim() === "" || t.movie.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all:      TICKETS.length,
    upcoming: TICKETS.filter(t => t.status === "upcoming").length,
    past:     TICKETS.filter(t => t.status !== "upcoming").length,
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "all",      label: `All (${counts.all})`           },
    { key: "upcoming", label: `Upcoming (${counts.upcoming})`  },
    { key: "past",     label: `Past & Cancelled (${counts.past})` },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      <Header />

      <div className="pt-16">
        {/* ── Page header ───────────────────────────── */}
        <div
          className="px-6 py-8"
          style={{
            background: `linear-gradient(180deg, rgba(232,25,44,0.06) 0%, transparent 100%)`,
            borderBottom: `1px solid ${C.dim}`,
          }}
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-white mb-1" style={{ fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
                  My Tickets
                </h1>
                <p style={{ color: C.muted, fontSize: "0.88rem" }}>
                  {counts.upcoming} upcoming · {counts.past} past bookings
                </p>
              </div>
              <Link
                to="/movies"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ backgroundColor: C.red, color: "white", fontSize: "0.88rem", fontWeight: 700, textDecoration: "none" }}
              >
                <Film size={15} /> Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── Pending order ───────────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-6 pt-6">
          <PendingOrderBanner />
        </div>

        {/* ── Filters bar ───────────────────────────── */}
        <div
          className="sticky px-6 py-3"
          style={{
            top: "64px",
            zIndex: 40,
            backgroundColor: `${C.bg}f5`,
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${C.dim}`,
          }}
        >
          <div className="max-w-screen-xl mx-auto flex items-center gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: C.surface }}>
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="px-3.5 py-1.5 rounded-lg transition-all"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: tab === key ? 700 : 500,
                    backgroundColor: tab === key ? C.red : "transparent",
                    color: tab === key ? "white" : C.muted,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border ml-auto"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <Search size={13} style={{ color: C.muted, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search movies…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder-white/30 outline-none"
                style={{ fontSize: "0.82rem", width: "160px" }}
              />
            </div>
          </div>
        </div>

        {/* ── Ticket list ───────────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map(t => (
                <TicketCard key={t.id} t={t} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
              >
                <Ticket size={32} style={{ color: C.muted }} />
              </div>
              <p className="text-white mb-2" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                {search ? "No tickets match your search" : "No tickets here yet"}
              </p>
              <p style={{ color: C.muted, fontSize: "0.88rem", marginBottom: "24px" }}>
                {search
                  ? "Try a different movie title"
                  : "Browse our latest movies and book your first seat"}
              </p>
              {!search && (
                <Link
                  to="/movies"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all active:scale-95"
                  style={{ backgroundColor: C.red, color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}
                >
                  <Film size={16} /> Browse Movies <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
