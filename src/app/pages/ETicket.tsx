import { useState, useRef } from "react";
import { Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  Film, ArrowLeft, Download, Wallet, Share2,
  MapPin, Clock, Calendar, Armchair, Sparkles,
  Star, Check, ChevronDown, Crown,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   TICKET DATA
══════════════════════════════════════════════════════ */
const TICKET = {
  ref:       "ABC-1234",
  movie:     "Your Name",
  original:  "君の名は。",
  genre:     "Animation · Romance",
  rating:    "PG",
  duration:  "1h 46m",
  director:  "Makoto Shinkai",
  backdrop:  "https://images.unsplash.com/photo-1759059827703-754102186472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHlvdXIlMjBuYW1lJTIwa2ltaSUyMG5vJTIwbmElMjB3YSUyMHNreSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzI1NTU5MTV8MA&ixlib=rb-4.1.0&q=80&w=1200",
  date:      "Saturday, March 15, 2026",
  shortDate: "Mar 15",
  time:      "20:30",
  hall:      "IMAX 04",
  cinema:    "CGV Vincom Center",
  address:   "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
  seats:     ["G10", "G11"],
  type:      "VIP",
  format:    "IMAX",
  price:     280_000,
  customer:  "Alex Nguyen",
  booked:    "Mar 8, 2026 · 14:22",
};

/* ══════════════════════════════════════════════════════
   HOLE PUNCH ROW
══════════════════════════════════════════════════════ */
function HolePunchRow({ count = 18 }: { count?: number }) {
  return (
    <div
      className="flex items-center justify-between px-0"
      style={{ height: "16px", marginLeft: "-1px", marginRight: "-1px", position: "relative", zIndex: 1 }}
    >
      {/* Left scallop */}
      <div
        className="flex-shrink-0 w-4 h-4 rounded-full"
        style={{ backgroundColor: "#0a0a0f", border: "1.5px solid rgba(255,255,255,0.08)", marginLeft: "-8px" }}
      />
      {/* Perforated line */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-full h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 6px, transparent 6px, transparent 12px)",
          }}
        />
      </div>
      {/* Right scallop */}
      <div
        className="flex-shrink-0 w-4 h-4 rounded-full"
        style={{ backgroundColor: "#0a0a0f", border: "1.5px solid rgba(255,255,255,0.08)", marginRight: "-8px" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TICKET COMPONENT
══════════════════════════════════════════════════════ */
function DigitalTicket({ flipped }: { flipped: boolean }) {
  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      {/* Card flipper */}
      <div
        className="relative w-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ─── FRONT FACE ─── */}
        <div
          className="relative w-full rounded-3xl overflow-visible border border-white/[0.09]"
          style={{
            backfaceVisibility: "hidden",
            backgroundColor: "#141420",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(232,25,44,0.06)",
          }}
        >
          {/* Shimmer border top */}
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 40%, rgba(232,25,44,0.3) 60%, transparent)" }}
          />

          {/* ── BACKDROP SECTION ── */}
          <div className="relative h-52 rounded-t-3xl overflow-hidden">
            <img
              src={TICKET.backdrop}
              alt={TICKET.movie}
              className="w-full h-full object-cover object-top"
              style={{ filter: "saturate(1.2) brightness(0.85)" }}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,20,32,0.15) 0%, rgba(20,20,32,0.55) 60%, #141420 100%)",
              }}
            />
            {/* Film grain texture */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                backgroundRepeat: "repeat",
                backgroundSize: "128px",
              }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg,#e8192c,#a00e1f)",
                  fontSize: "0.58rem", fontWeight: 900, letterSpacing: "0.12em",
                  boxShadow: "0 4px 12px rgba(232,25,44,0.45)",
                }}
              >
                <Sparkles size={8} /> E-TICKET
              </span>
              <span
                className="px-2.5 py-1 rounded-full border text-white/70"
                style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", backgroundColor: "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.15)" }}
              >
                {TICKET.format}
              </span>
            </div>

            {/* Rating badge */}
            <div className="absolute top-4 right-4">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Star size={10} fill="#f59e0b" className="text-[#f59e0b]" />
                <span className="text-white" style={{ fontSize: "0.68rem", fontWeight: 700 }}>4.9</span>
              </div>
            </div>

            {/* Title block at bottom of backdrop */}
            <div className="absolute bottom-4 left-5 right-5">
              <p className="text-white/35 mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.12em" }}>
                {TICKET.original}
              </p>
              <h1
                className="text-white leading-none"
                style={{ fontWeight: 900, fontSize: "1.9rem", letterSpacing: "-0.04em", textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}
              >
                {TICKET.movie}
              </h1>
              <p className="text-white/45 mt-1" style={{ fontSize: "0.72rem" }}>{TICKET.genre} · {TICKET.duration}</p>
            </div>
          </div>

          {/* ── PERFORATION 1 ── */}
          <HolePunchRow />

          {/* ── DETAILS SECTION ── */}
          <div className="px-5 py-5">
            {/* Big showtime row */}
            <div
              className="flex items-center justify-between mb-5 px-4 py-3.5 rounded-2xl border border-white/[0.06]"
              style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.07), rgba(255,255,255,0.02))" }}
            >
              {/* Time */}
              <div className="text-center">
                <p className="text-white/30 uppercase mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Showtime
                </p>
                <p className="text-white" style={{ fontWeight: 900, fontSize: "1.65rem", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {TICKET.time}
                </p>
              </div>

              {/* Divider */}
              <div className="h-10 w-px bg-white/8" />

              {/* Date */}
              <div className="text-center">
                <p className="text-white/30 uppercase mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Date
                </p>
                <p className="text-white" style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                  {TICKET.shortDate}
                </p>
                <p className="text-white/40" style={{ fontSize: "0.7rem" }}>2026</p>
              </div>

              {/* Divider */}
              <div className="h-10 w-px bg-white/8" />

              {/* Hall */}
              <div className="text-center">
                <p className="text-white/30 uppercase mb-0.5" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em" }}>
                  Hall
                </p>
                <p className="text-white" style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                  {TICKET.hall}
                </p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <DetailCell icon={<Armchair size={13} />} label="Seats" value={TICKET.seats.join(" · ")} accent />
              <DetailCell icon={<Crown size={13} />} label="Type" value={TICKET.type} />
              <DetailCell icon={<MapPin size={13} />} label="Cinema" value={TICKET.cinema} />
              <DetailCell icon={<Clock size={13} />} label="Duration" value={TICKET.duration} />
            </div>

            {/* Customer row */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.05] mb-1"
              style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#e8192c,#a00e1f)", fontSize: "0.7rem", fontWeight: 900 }}
                >
                  AN
                </div>
                <div>
                  <p className="text-white" style={{ fontSize: "0.82rem", fontWeight: 700 }}>{TICKET.customer}</p>
                  <p className="text-white/30" style={{ fontSize: "0.65rem" }}>Booked {TICKET.booked}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={12} className="text-[#10b981]" />
                <span className="text-[#10b981]" style={{ fontSize: "0.7rem", fontWeight: 700 }}>Confirmed</span>
              </div>
            </div>
          </div>

          {/* ── PERFORATION 2 ── */}
          <HolePunchRow />

          {/* ── QR SECTION ── */}
          <div className="flex flex-col items-center px-5 py-6 gap-4">
            {/* QR glow */}
            <div className="relative flex flex-col items-center">
              {/* Multi-layer glow */}
              <div
                className="absolute w-44 h-44 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "#e8192c", opacity: 0.12 }}
              />
              <div
                className="absolute w-32 h-32 rounded-full blur-xl pointer-events-none"
                style={{ backgroundColor: "#e8192c", opacity: 0.18 }}
              />

              {/* QR wrapper */}
              <div
                className="relative p-4 rounded-2xl"
                style={{
                  backgroundColor: "white",
                  boxShadow:
                    "0 0 0 1px rgba(232,25,44,0.3), 0 0 32px rgba(232,25,44,0.3), 0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                <QRCodeSVG
                  value={`CINEMA:REF-${TICKET.ref}:YOUR_NAME:${TICKET.seats.join(",")}`}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0a0a0f"
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Scan label */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <p className="text-white/40" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}>
                  Scan QR at theater entrance
                </p>
              </div>
            </div>

            {/* Booking ref + barcode */}
            <div className="w-full flex flex-col items-center gap-2">
              <p className="text-white/20 font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}>
                BOOKING REFERENCE
              </p>
              <p className="text-white font-mono" style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.18em" }}>
                {TICKET.ref}
              </p>

              {/* Fake barcode */}
              <div className="flex items-end gap-px mt-1 opacity-20">
                {Array.from({ length: 44 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-white"
                    style={{
                      width: i % 3 === 0 ? "3px" : "1.5px",
                      height: `${14 + ((i * 7 + 3) % 14)}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="w-full flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <span className="text-white/30" style={{ fontSize: "0.72rem" }}>Total Paid</span>
              <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#e8192c" }}>
                {TICKET.price.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Bottom rounded strip */}
          <div
            className="h-2 rounded-b-3xl"
            style={{ background: "linear-gradient(90deg, transparent, rgba(232,25,44,0.3) 40%, rgba(232,25,44,0.12) 70%, transparent)" }}
          />
        </div>

        {/* ─── BACK FACE ─── */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/[0.09] flex flex-col items-center justify-center gap-5 p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "#141420",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          }}
        >
          <Film size={32} className="text-white/10" />
          <div className="text-center">
            <p className="text-white/60 mb-1" style={{ fontWeight: 700, fontSize: "1rem" }}>Terms & Conditions</p>
            <p className="text-white/25" style={{ fontSize: "0.75rem", lineHeight: 1.8, maxWidth: "260px" }}>
              This ticket is valid for one-time use only. Non-transferable. Must present a valid ID. No refunds after 30 minutes of showtime. Lost tickets cannot be replaced.
            </p>
          </div>
          <div className="w-full border-t border-white/5 pt-5 flex flex-col gap-2 text-center">
            <p className="text-white/20" style={{ fontSize: "0.68rem" }}>CGV Vincom Center · support@cinema.vn</p>
            <p className="text-white/15" style={{ fontSize: "0.62rem" }}>Cinema · All Rights Reserved 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCell({
  icon, label, value, accent,
}: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 px-3.5 py-3 rounded-xl border border-white/[0.05]"
      style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-white/25">{icon}</span>
        <span className="text-white/25 uppercase" style={{ fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.14em" }}>
          {label}
        </span>
      </div>
      <span
        style={{ fontSize: "0.85rem", fontWeight: 800, color: accent ? "#e8192c" : "rgba(255,255,255,0.82)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SAVE SUCCESS TOAST
══════════════════════════════════════════════════════ */
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 z-50 transition-all duration-400"
      style={{
        backgroundColor: "rgba(17,17,24,0.95)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(-50%, 0)" : "translate(-50%, 20px)",
        pointerEvents: "none",
      }}
    >
      <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
        <Check size={12} className="text-white" />
      </div>
      <span className="text-white" style={{ fontSize: "0.83rem", fontWeight: 600 }}>{msg}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export function ETicket() {
  const [flipped, setFlipped] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              `url(${TICKET.backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "blur(40px) brightness(0.06) saturate(1.5)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.7) 0%, #0a0a0f 60%)" }} />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64"
          style={{ background: "radial-gradient(ellipse, rgba(232,25,44,0.08), transparent 70%)" }}
        />
      </div>

      {/* ── Top Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>My Tickets</span>
        </Link>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#e8192c] rounded-lg flex items-center justify-center shadow-lg">
            <Film size={13} className="text-white" />
          </div>
          <span className="text-white" style={{ fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.2em" }}>CINEMA</span>
        </Link>

        <button
          onClick={() => showToast("Link copied to clipboard!")}
          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 transition-all"
        >
          <Share2 size={15} />
        </button>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-5 pt-4 pb-10 gap-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-white/35 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em" }}>
            Valid E-Ticket
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
        </div>

        {/* ── TICKET ── */}
        <div className="w-full max-w-sm">
          <DigitalTicket flipped={flipped} />
        </div>

        {/* Flip hint */}
        <button
          onClick={() => setFlipped((v) => !v)}
          className="flex items-center gap-2 text-white/25 hover:text-white/50 transition-colors"
          style={{ fontSize: "0.72rem" }}
        >
          <ChevronDown
            size={13}
            className="transition-transform duration-300"
            style={{ transform: flipped ? "rotate(180deg)" : "rotate(0deg)" }}
          />
          {flipped ? "Show ticket front" : "View terms & conditions"}
        </button>

        {/* ── ACTION BUTTONS ── */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {/* Apple Wallet */}
          <button
            onClick={() => showToast("Added to Apple Wallet!")}
            className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/20"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(255,255,255,0.04))",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Apple wallet icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18.5 6.5C18.5 8.43 16.93 10 15 10H9C7.07 10 5.5 8.43 5.5 6.5S7.07 3 9 3h6c1.93 0 3.5 1.57 3.5 3.5Z" fill="white" fillOpacity="0.9"/>
                <rect x="3" y="11" width="18" height="10" rx="2" fill="white" fillOpacity="0.25" />
                <rect x="3" y="11" width="18" height="4" rx="1" fill="white" fillOpacity="0.12" />
                <circle cx="17" cy="15" r="1.5" fill="white" fillOpacity="0.6" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white/35" style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em" }}>ADD TO</p>
              <p className="text-white" style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.02em" }}>Apple Wallet</p>
            </div>
            {/* Shimmer */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)" }}
            />
          </button>

          {/* Download PDF */}
          <button
            onClick={() => showToast("PDF ticket downloaded!")}
            className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl overflow-hidden group transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #e8192c, #c8111f)",
              boxShadow: "0 8px 28px rgba(232,25,44,0.38)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(232,25,44,0.55)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(232,25,44,0.38)"; }}
          >
            <Download size={18} className="text-white flex-shrink-0" />
            <span className="text-white" style={{ fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.1em" }}>
              DOWNLOAD PDF TICKET
            </span>
            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                animation: "shimmerPdf 2.8s ease-in-out infinite",
              }}
            />
          </button>
        </div>

        {/* Help note */}
        <p className="text-white/15 text-center" style={{ fontSize: "0.68rem", lineHeight: 1.7, maxWidth: "300px" }}>
          Having trouble? Contact{" "}
          <span className="text-[#e8192c]/50">support@cinema.vn</span> or visit the box office 30 min before your showtime.
        </p>
      </main>

      <Toast msg={toastMsg} visible={toastVisible} />

      <style>{`
        @keyframes shimmerPdf {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
