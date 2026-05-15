import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  Crown,
  Ticket,
  ArrowRight,
  Film,
  Clock,
  MapPin,
  Info,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────── */

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const TOTAL_COLS = 15;

const SEAT_TIERS: Record<string, { label: string; price: number; color: string }> = {
  A: { label: "VIP", price: 150000, color: "#c47a00" },
  B: { label: "VIP", price: 150000, color: "#c47a00" },
  C: { label: "Premium", price: 120000, color: "#7b2d8b" },
  D: { label: "Premium", price: 120000, color: "#7b2d8b" },
  E: { label: "Premium", price: 120000, color: "#7b2d8b" },
  F: { label: "Premium", price: 120000, color: "#7b2d8b" },
  G: { label: "Standard", price: 90000, color: "#4a90e2" },
  H: { label: "Standard", price: 90000, color: "#4a90e2" },
  I: { label: "Standard", price: 90000, color: "#4a90e2" },
  J: { label: "Standard", price: 90000, color: "#4a90e2" },
};

const OCCUPIED_SEATS = new Set([
  "A2","A3","A9","A10","A11","A14",
  "B1","B5","B6","B7","B12","B13",
  "C4","C5","C8","C9","C14","C15",
  "D3","D4","D5","D11","D12","D13",
  "E6","E7","E8","E9","E10",
  "F2","F3","F12","F13","F14",
  "G5","G6","G9","G10","G11",
  "H1","H2","H3","H8","H9","H14","H15",
  "I4","I5","I6","I10","I11","I12",
  "J3","J4","J7","J8","J13","J14",
]);

const MAX_SEATS = 8;

/* ─── Helpers ────────────────────────────────────────────────── */

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " ₫";
}

/* ─── Seat Component ─────────────────────────────────────────── */

type SeatStatus = "available" | "selected" | "occupied";

interface SeatProps {
  id: string;
  status: SeatStatus;
  tier: string;
  onClick: () => void;
}

function Seat({ id, status, tier, onClick }: SeatProps) {
  const isVip = tier === "VIP";

  const bgColor =
    status === "selected"
      ? "#e8192c"
      : status === "occupied"
      ? "#18181f"
      : isVip
      ? "#2a2010"
      : "#252535";

  const borderColor =
    status === "selected"
      ? "#ff4a58"
      : status === "occupied"
      ? "#22222e"
      : isVip
      ? "#5a4010"
      : "#38384e";

  const cursor = status === "occupied" ? "default" : "pointer";

  return (
    <button
      onClick={onClick}
      disabled={status === "occupied"}
      title={status === "occupied" ? "Occupied" : id}
      className="relative group flex-shrink-0 transition-all duration-150"
      style={{
        width: "28px",
        height: "24px",
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: "4px 4px 2px 2px",
        cursor,
        boxShadow:
          status === "selected"
            ? "0 0 10px rgba(232,25,44,0.5), 0 0 20px rgba(232,25,44,0.2)"
            : isVip && status === "available"
            ? "0 0 6px rgba(196,122,0,0.2)"
            : "none",
        outline: "none",
      }}
    >
      {/* Seat base bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "5px",
          backgroundColor:
            status === "selected"
              ? "#c8111f"
              : status === "occupied"
              ? "#141419"
              : isVip
              ? "#3a2a08"
              : "#1e1e2c",
          borderRadius: "0 0 2px 2px",
        }}
      />

      {/* VIP crown icon */}
      {isVip && status !== "occupied" && (
        <Crown
          size={8}
          className={`absolute -top-2 left-1/2 -translate-x-1/2 ${
            status === "selected" ? "text-yellow-300" : "text-yellow-600/60"
          }`}
          strokeWidth={2.5}
        />
      )}

      {/* Hover overlay */}
      {status === "available" && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"
          style={{
            backgroundColor: isVip ? "rgba(196,122,0,0.25)" : "rgba(232,25,44,0.25)",
            border: `1.5px solid ${isVip ? "rgba(196,122,0,0.5)" : "rgba(232,25,44,0.5)"}`,
            borderRadius: "4px 4px 2px 2px",
          }}
        />
      )}
    </button>
  );
}

/* ─── Screen SVG ─────────────────────────────────────────────── */

function CinemaScreen() {
  return (
    <div className="flex flex-col items-center mb-12 w-full">
      <div className="relative" style={{ width: "min(90%, 680px)" }}>
        {/* Ambient glow behind screen */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "30%",
            left: "10%",
            right: "10%",
            height: "60px",
            background:
              "radial-gradient(ellipse, rgba(96,165,250,0.18) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Screen SVG */}
        <svg
          viewBox="0 0 680 52"
          className="w-full overflow-visible"
          style={{ filter: "drop-shadow(0 0 12px rgba(96,165,250,0.35))" }}
        >
          <defs>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(37,99,235,0)" />
              <stop offset="20%" stopColor="rgba(96,165,250,0.45)" />
              <stop offset="50%" stopColor="rgba(191,219,254,0.9)" />
              <stop offset="80%" stopColor="rgba(96,165,250,0.45)" />
              <stop offset="100%" stopColor="rgba(37,99,235,0)" />
            </linearGradient>
            <linearGradient id="screenFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(96,165,250,0.12)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </linearGradient>
          </defs>

          {/* Fill area under curve */}
          <path
            d="M 15,48 Q 340,10 665,48 L 665,52 L 15,52 Z"
            fill="url(#screenFill)"
          />

          {/* Outer glow line */}
          <path
            d="M 15,48 Q 340,10 665,48"
            fill="none"
            stroke="rgba(147,197,253,0.15)"
            strokeWidth="12"
          />
          {/* Mid glow */}
          <path
            d="M 15,48 Q 340,10 665,48"
            fill="none"
            stroke="rgba(96,165,250,0.3)"
            strokeWidth="5"
          />
          {/* Main bright line */}
          <path
            d="M 15,48 Q 340,10 665,48"
            fill="none"
            stroke="url(#screenGrad)"
            strokeWidth="2"
          />
        </svg>

        {/* SCREEN label */}
        <p
          className="text-center"
          style={{
            color: "rgba(147,197,253,0.55)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.5em",
            marginTop: "-2px",
          }}
        >
          SCREEN
        </p>
      </div>

      {/* Perspective depth gradient beneath screen */}
      <div
        className="pointer-events-none"
        style={{
          width: "min(70%,500px)",
          height: "24px",
          background:
            "linear-gradient(to bottom, rgba(96,165,250,0.07), transparent)",
          filter: "blur(6px)",
          marginTop: "-4px",
        }}
      />
    </div>
  );
}

/* ─── Legend ─────────────────────────────────────────────────── */

function Legend() {
  const items = [
    { color: "#252535", border: "#38384e", label: "Available" },
    { color: "#e8192c", border: "#ff4a58", label: "Selected", glow: true },
    { color: "#18181f", border: "#22222e", label: "Occupied" },
    { color: "#2a2010", border: "#5a4010", label: "VIP", crown: true },
    { color: "#1c1228", border: "#3a1a5a", label: "Premium", premium: true },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
      {items.map(({ color, border, label, glow, crown, premium }) => (
        <div key={label} className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <div
              style={{
                width: "22px",
                height: "18px",
                backgroundColor: color,
                border: `1.5px solid ${border}`,
                borderRadius: "3px 3px 2px 2px",
                boxShadow: glow ? "0 0 8px rgba(232,25,44,0.5)" : "none",
              }}
            />
            {crown && (
              <Crown
                size={7}
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-yellow-600"
                strokeWidth={2.5}
              />
            )}
          </div>
          <span className="text-white/55" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Sticky Footer ──────────────────────────────────────────── */

interface BookingFooterProps {
  selectedSeats: Set<string>;
  totalPrice: number;
  onClear: () => void;
}

function BookingFooter({ selectedSeats, totalPrice, onClear }: BookingFooterProps) {
  const sorted = Array.from(selectedSeats).sort((a, b) => {
    if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
    return parseInt(a.slice(1)) - parseInt(b.slice(1));
  });

  const isEmpty = sorted.length === 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/8"
      style={{
        backgroundColor: "#0d0d14",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Left: seat tags */}
          <div className="flex-1 min-w-0">
            {isEmpty ? (
              <div className="flex items-center gap-2 text-white/25">
                <Ticket size={15} />
                <span style={{ fontSize: "0.85rem" }}>No seats selected — click a grey seat to select</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/40 flex-shrink-0" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                  SEATS ({sorted.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sorted.map((seatId) => {
                    const row = seatId[0];
                    const tier = SEAT_TIERS[row];
                    return (
                      <span
                        key={seatId}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(232,25,44,0.15)",
                          border: "1px solid rgba(232,25,44,0.35)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: "#ff7a87",
                        }}
                      >
                        {seatId}
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: tier.color,
                            fontWeight: 600,
                          }}
                        >
                          {tier.label}
                        </span>
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={onClear}
                  className="text-white/30 hover:text-white/60 transition-colors text-xs ml-1 flex-shrink-0"
                  style={{ fontSize: "0.72rem" }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Right: price + button */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Price */}
            <div className="text-right">
              <p className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em" }}>
                Total
              </p>
              <p
                className="text-white"
                style={{ fontWeight: 800, fontSize: isEmpty ? "1rem" : "1.2rem", letterSpacing: "-0.02em" }}
              >
                {isEmpty ? "—" : formatVND(totalPrice)}
              </p>
            </div>

            {/* CTA button */}
            {isEmpty ? (
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/8 text-white/25 cursor-not-allowed"
                style={{ fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
              >
                Proceed to Payment
                <ArrowRight size={16} />
              </button>
            ) : (
              <Link
                to="/movie/your-name/checkout"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#e8192c] text-white hover:bg-[#c8111f] active:scale-[0.98] shadow-lg shadow-[#e8192c]/30 transition-all duration-200"
                style={{ fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
              >
                Proceed to Payment
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Pricing breakdown when seats selected */}
        {!isEmpty && (
          <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t border-white/5">
            {(["VIP", "Premium", "Standard"] as const).map((tierLabel) => {
              const tierSeats = sorted.filter((s) => SEAT_TIERS[s[0]].label === tierLabel);
              if (tierSeats.length === 0) return null;
              const tierInfo = Object.values(SEAT_TIERS).find((t) => t.label === tierLabel)!;
              return (
                <span key={tierLabel} className="text-white/30" style={{ fontSize: "0.72rem" }}>
                  {tierSeats.length} × {tierLabel} ({formatVND(tierInfo.price)}) ={" "}
                  <span className="text-white/50">{formatVND(tierSeats.length * tierInfo.price)}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  const toggleSeat = (seatId: string) => {
    if (OCCUPIED_SEATS.has(seatId)) return;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        if (next.size >= MAX_SEATS) return prev;
        next.add(seatId);
      }
      return next;
    });
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedSeats.forEach((seatId) => {
      total += SEAT_TIERS[seatId[0]].price;
    });
    return total;
  }, [selectedSeats]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter','system-ui',sans-serif" }}
    >
      {/* ── TOP HEADER BAR ─────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-white/6"
        style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-4">
          {/* Back */}
          <Link
            to="/movie/your-name"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            style={{ fontSize: "0.82rem", fontWeight: 500 }}
          >
            <ChevronLeft size={18} />
            Back
          </Link>

          <div className="w-px h-5 bg-white/10" />

          {/* Movie info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Film size={15} className="text-[#e8192c] flex-shrink-0" />
            <div className="min-w-0">
              <span
                className="text-white truncate"
                style={{ fontWeight: 700, fontSize: "0.9rem" }}
              >
                Your Name
              </span>
              <span className="text-white/30 mx-2" style={{ fontSize: "0.8rem" }}>·</span>
              <span className="text-white/50" style={{ fontSize: "0.82rem" }}>君の名は。</span>
            </div>
          </div>

          {/* Showtime badge */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/45">
              <Clock size={13} />
              <span style={{ fontSize: "0.78rem" }}>Today, 8:15 PM</span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-white"
              style={{ backgroundColor: "#7b2d8b", fontSize: "0.62rem", fontWeight: 700 }}
            >
              3D
            </span>
            <div className="flex items-center gap-1 text-white/35">
              <MapPin size={12} />
              <span style={{ fontSize: "0.72rem" }}>Hall 3</span>
            </div>
          </div>

          {/* Seat counter */}
          <div
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgba(232,25,44,0.12)", border: "1px solid rgba(232,25,44,0.2)" }}
          >
            <Ticket size={13} className="text-[#e8192c]" />
            <span className="text-[#e8192c]" style={{ fontWeight: 700, fontSize: "0.8rem" }}>
              {selectedSeats.size} / {MAX_SEATS}
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 pt-10 pb-48">

        {/* ── SCREEN ─────────────────────────────────── */}
        <CinemaScreen />

        {/* ── SEAT GRID ──────────────────────────────── */}
        <div className="flex justify-center">
          <div className="overflow-x-auto pb-4">
            <div
              className="inline-flex flex-col gap-2"
              style={{ minWidth: "fit-content" }}
            >
              {/* Column numbers */}
              <div className="flex items-center gap-1.5 mb-1 pl-12">
                {Array.from({ length: TOTAL_COLS }, (_, i) => i + 1).map((col) => (
                  <div
                    key={col}
                    className="flex items-center justify-center text-white/20 flex-shrink-0"
                    style={{ width: "28px", fontSize: "0.6rem", fontWeight: 600 }}
                  >
                    {col === 8 ? (
                      <span className="invisible">8</span>
                    ) : (
                      col
                    )}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {ROWS.map((row) => {
                const tier = SEAT_TIERS[row];
                return (
                  <div key={row} className="flex items-center gap-3">
                    {/* Row label */}
                    <div
                      className="flex items-center justify-end gap-1.5 flex-shrink-0"
                      style={{ width: "44px" }}
                    >
                      {(row === "A" || row === "B") && (
                        <Crown size={9} className="text-yellow-600/50" />
                      )}
                      <span
                        className="text-white/40"
                        style={{ fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}
                      >
                        {row}
                      </span>
                    </div>

                    {/* Seats */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: TOTAL_COLS }, (_, colIdx) => {
                        const col = colIdx + 1;
                        const seatId = `${row}${col}`;
                        const status: SeatStatus = selectedSeats.has(seatId)
                          ? "selected"
                          : OCCUPIED_SEATS.has(seatId)
                          ? "occupied"
                          : "available";

                        return (
                          <div key={seatId} className="flex-shrink-0">
                            {/* Aisle gap after column 7 */}
                            {col === 8 && (
                              <div
                                className="inline-flex items-center justify-center mr-1.5"
                                style={{ width: "16px" }}
                              >
                                <div className="w-px h-5 bg-white/5" />
                              </div>
                            )}
                            <Seat
                              id={seatId}
                              status={status}
                              tier={tier.label}
                              onClick={() => toggleSeat(seatId)}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Right row label */}
                    <div className="flex-shrink-0 flex items-center gap-1.5" style={{ width: "44px" }}>
                      <span
                        className="text-white/40"
                        style={{ fontWeight: 700, fontSize: "0.75rem" }}
                      >
                        {row}
                      </span>
                      {/* Tier price hint */}
                      <span
                        style={{ fontSize: "0.55rem", color: tier.color, fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        {tier.label === "VIP" ? "VIP" : tier.label === "Premium" ? "PRE" : "STD"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── LEGEND ─────────────────────────────────── */}
        <Legend />

        {/* ── PRICING INFO CARD ──────────────────────── */}
        <div className="mt-10 max-w-lg mx-auto rounded-xl border border-white/6 bg-[#111118] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
            <Info size={14} className="text-white/30" />
            <span className="text-white/40 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
              Ticket Pricing
            </span>
          </div>
          <div className="divide-y divide-white/4">
            {[
              { tier: "VIP", rows: "Rows A–B", price: 150000, color: "#c47a00", icon: "👑" },
              { tier: "Premium", rows: "Rows C–F", price: 120000, color: "#7b2d8b", icon: "⭐" },
              { tier: "Standard", rows: "Rows G–J", price: 90000, color: "#4a90e2", icon: "🎬" },
            ].map(({ tier, rows, price, color, icon }) => (
              <div key={tier} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "1rem" }}>{icon}</span>
                  <div>
                    <p className="text-white" style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                      {tier}
                    </p>
                    <p className="text-white/35" style={{ fontSize: "0.72rem" }}>{rows}</p>
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.92rem", color }}>
                  {formatVND(price)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-white/2">
            <p className="text-white/25 text-center" style={{ fontSize: "0.72rem" }}>
              Max {MAX_SEATS} seats per booking · Free cancellation up to 2 hours before showtime
            </p>
          </div>
        </div>
      </main>

      {/* ── BOOKING FOOTER ─────────────────────────────── */}
      <BookingFooter
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        onClear={() => setSelectedSeats(new Set())}
      />
    </div>
  );
}