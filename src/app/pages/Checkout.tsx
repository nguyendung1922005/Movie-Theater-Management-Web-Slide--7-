import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findVoucherByCode, SNACK_ITEMS } from "../lib/commerceData";
import { BOOKING } from "../lib/bookingData";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Clock,
  Calendar,
  Crown,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Tag,
  Plus,
  Minus,
  Film,
  Ticket,
  Lock,
  ChevronDown,
  Zap,
  X,
  Star,
  ArrowRight,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────── */

const MOVIE_POSTER =
  "https://images.unsplash.com/photo-1732384469370-ccd6605f4570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG5pZ2h0JTIwc2t5JTIwY29tZXQlMjBjaW5lbWF0aWMlMjBwb3N0ZXJ8ZW58MXx8fHwxNzcyNDQ0MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const CONVENIENCE_FEE = 15000;
const TAX_RATE = 0.10;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

/* ─── Progress Bar ───────────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  const steps = ["Select Seats", "Review", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: done
                    ? "#e8192c"
                    : active
                    ? "rgba(232,25,44,0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: active
                    ? "2px solid #e8192c"
                    : done
                    ? "2px solid #e8192c"
                    : "2px solid rgba(255,255,255,0.1)",
                }}
              >
                {done ? (
                  <Check size={14} className="text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={active ? "text-[#e8192c]" : "text-white/25"}
                    style={{ fontSize: "0.72rem", fontWeight: 700 }}
                  >
                    {idx + 1}
                  </span>
                )}
              </div>
              <span
                className={
                  active
                    ? "text-white"
                    : done
                    ? "text-[#e8192c]"
                    : "text-white/25"
                }
                style={{ fontSize: "0.65rem", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className="w-10 sm:w-16 h-px mb-5 mx-1"
                style={{
                  backgroundColor: done ? "#e8192c" : "rgba(255,255,255,0.08)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Order Summary Card ─────────────────────────────────────── */

function OrderSummaryCard() {
  const formatBadge = BOOKING.format;
  const formatColor = formatBadge === "3D" ? "#7b2d8b" : formatBadge === "IMAX" ? "#c47a00" : "#4a90e2";

  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ backgroundColor: "#111118" }}
    >
      {/* Header label */}
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-[#e8192c]" />
          <span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
            Booking Summary
          </span>
        </div>
        <Link
          to="/movie/your-name/seats"
          className="flex items-center gap-1 text-white/35 hover:text-[#e8192c] transition-colors"
          style={{ fontSize: "0.72rem" }}
        >
          <ChevronLeft size={12} />
          Edit seats
        </Link>
      </div>

      {/* Movie info */}
      <div className="p-5 flex gap-4">
        {/* Poster */}
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10"
          style={{ width: "72px", height: "108px" }}
        >
          <img src={MOVIE_POSTER} alt="Your Name" className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <p className="text-white/40" style={{ fontSize: "0.68rem", letterSpacing: "0.1em" }}>
              {BOOKING.originalTitle}
            </p>
            <h2
              className="text-white leading-tight mt-0.5"
              style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}
            >
              {BOOKING.movie}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="px-2 py-0.5 rounded text-white uppercase"
                style={{ backgroundColor: formatColor, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em" }}
              >
                {BOOKING.format}
              </span>
              <div className="flex items-center gap-1">
                {[1,2,3,4].map(i => <Star key={i} size={10} fill="#f5c518" className="text-[#f5c518]" />)}
                <Star size={10} className="text-white/20" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Time + location */}
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex items-center gap-1.5 text-white/50">
              <Calendar size={12} className="text-[#e8192c] flex-shrink-0" />
              <span style={{ fontSize: "0.78rem" }}>{BOOKING.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <Clock size={12} className="text-[#e8192c] flex-shrink-0" />
              <span style={{ fontSize: "0.78rem" }}>{BOOKING.time} · {BOOKING.hall}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50">
              <MapPin size={12} className="text-[#e8192c] flex-shrink-0" />
              <span style={{ fontSize: "0.78rem" }} className="truncate">{BOOKING.theater}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seat tags */}
      <div className="px-5 pb-5 border-t border-white/5 pt-4">
        <p className="text-white/30 uppercase mb-2.5" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          Selected Seats
        </p>
        <div className="flex flex-wrap gap-2">
          {BOOKING.seats.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {s.tier === "VIP" && <Crown size={10} className="text-yellow-500" />}
              <span className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{s.id}</span>
              <span
                className="px-1.5 py-0.5 rounded"
                style={{ backgroundColor: s.color + "22", color: s.color, fontSize: "0.6rem", fontWeight: 700 }}
              >
                {s.tier}
              </span>
              <span className="text-white/40" style={{ fontSize: "0.75rem" }}>{formatVND(s.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Snacks Section ─────────────────────────────────────────── */

function SnacksSection({ cart, setCart }: {
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [expanded, setExpanded] = useState(true);

  const adjust = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const n = (next[id] || 0) + delta;
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <button
        className="w-full px-5 py-4 border-b border-white/6 flex items-center justify-between group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "1.1rem" }}>🍿</span>
          <span className="text-white" style={{ fontWeight: 700, fontSize: "0.92rem" }}>Add Snacks & Drinks</span>
          {cartCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: "#e8192c", fontSize: "0.65rem", fontWeight: 700 }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30" style={{ fontSize: "0.75rem" }}>Optional</span>
          <ChevronDown
            size={16}
            className={`text-white/40 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SNACK_ITEMS.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: qty > 0 ? "rgba(232,25,44,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${qty > 0 ? "rgba(232,25,44,0.2)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate" style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/35" style={{ fontSize: "0.7rem" }}>{item.size}</span>
                    <span className="text-[#e8192c]" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                      {formatVND(item.price)}
                    </span>
                  </div>
                </div>
                {/* Qty control */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {qty > 0 ? (
                    <>
                      <button
                        onClick={() => adjust(item.id, -1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-white/15 text-white/60 hover:border-[#e8192c]/50 hover:text-[#e8192c] transition-all"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-white" style={{ fontWeight: 700, fontSize: "0.9rem", minWidth: "16px", textAlign: "center" }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => adjust(item.id, +1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all"
                      >
                        <Plus size={11} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => adjust(item.id, +1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center border border-white/12 text-white/40 hover:border-[#e8192c]/50 hover:text-[#e8192c] transition-all"
                    >
                      <Plus size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Cost Breakdown ─────────────────────────────────────────── */

function CostBreakdown({
  snackCart,
}: {
  snackCart: Record<string, number>;
}) {
  const ticketSubtotal = BOOKING.seats.reduce((a, s) => a + s.price, 0);
  const snackSubtotal = SNACK_ITEMS.reduce((a, item) => a + (snackCart[item.id] || 0) * item.price, 0);
  const subtotalBeforeTax = ticketSubtotal + snackSubtotal + CONVENIENCE_FEE;
  const tax = Math.round(ticketSubtotal * TAX_RATE);
  const grandTotal = subtotalBeforeTax + tax;

  const rows: { label: string; amount: number; sub?: boolean; dimmed?: boolean; highlight?: boolean }[] = [
    ...BOOKING.seats.map((s) => ({
      label: `Seat ${s.id} (${s.tier})`,
      amount: s.price,
      sub: true,
    })),
    ...SNACK_ITEMS.filter((i) => (snackCart[i.id] || 0) > 0).map((item) => ({
      label: `${item.name} × ${snackCart[item.id]}`,
      amount: item.price * (snackCart[item.id] || 0),
      sub: true,
    })),
    { label: "Convenience Fee", amount: CONVENIENCE_FEE, dimmed: true },
    { label: `Tax (${TAX_RATE * 100}% on tickets)`, amount: tax, dimmed: true },
  ];

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center gap-2">
        <Ticket size={14} className="text-[#e8192c]" />
        <span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
          Cost Breakdown
        </span>
      </div>

      <div className="p-5 space-y-2.5">
        {/* Ticket subtotal line */}
        <div className="flex items-center justify-between">
          <span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Tickets ({BOOKING.seats.length}x)
          </span>
          <span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {formatVND(ticketSubtotal)}
          </span>
        </div>

        {/* Individual seat rows */}
        {BOOKING.seats.map((s) => (
          <div key={s.id} className="flex items-center justify-between pl-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/35" style={{ fontSize: "0.78rem" }}>
                Seat {s.id}
              </span>
              <span
                className="px-1.5 py-0.5 rounded"
                style={{ backgroundColor: s.color + "22", color: s.color, fontSize: "0.58rem", fontWeight: 700 }}
              >
                {s.tier}
              </span>
            </div>
            <span className="text-white/35" style={{ fontSize: "0.78rem" }}>{formatVND(s.price)}</span>
          </div>
        ))}

        {/* Snacks */}
        {snackSubtotal > 0 && (
          <>
            <div className="h-px bg-white/5 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                Snacks & Drinks
              </span>
              <span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {formatVND(snackSubtotal)}
              </span>
            </div>
            {SNACK_ITEMS.filter((i) => (snackCart[i.id] || 0) > 0).map((item) => (
              <div key={item.id} className="flex items-center justify-between pl-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/35" style={{ fontSize: "0.78rem" }}>
                    {item.emoji} {item.name} × {snackCart[item.id]}
                  </span>
                </div>
                <span className="text-white/35" style={{ fontSize: "0.78rem" }}>
                  {formatVND(item.price * (snackCart[item.id] || 0))}
                </span>
              </div>
            ))}
          </>
        )}

        <div className="h-px bg-white/5 my-1" />

        {/* Fees */}
        <div className="flex items-center justify-between">
          <span className="text-white/35" style={{ fontSize: "0.8rem" }}>Convenience Fee</span>
          <span className="text-white/35" style={{ fontSize: "0.8rem" }}>{formatVND(CONVENIENCE_FEE)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/35" style={{ fontSize: "0.8rem" }}>Tax (10%)</span>
          <span className="text-white/35" style={{ fontSize: "0.8rem" }}>{formatVND(tax)}</span>
        </div>

        {/* Total */}
        <div
          className="flex items-center justify-between pt-4 mt-3 border-t-2 border-dashed"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
          <span
            className="text-[#e8192c]"
            style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.02em" }}
          >
            {formatVND(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Promo Code ─────────────────────────────────────────────── */

function PromoCode() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [applied, setApplied] = useState(false);

  const apply = () => {
    if (findVoucherByCode(code)) {
      setStatus("success");
      setApplied(true);
    } else {
      setStatus("error");
    }
  };

  const remove = () => {
    setCode("");
    setStatus("idle");
    setApplied(false);
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden p-4"
      style={{
        backgroundColor: "#111118",
        borderColor: applied ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag size={14} className={applied ? "text-green-400" : "text-white/40"} />
        <span
          className={applied ? "text-green-400" : "text-white/50"}
          style={{ fontWeight: 600, fontSize: "0.85rem" }}
        >
          {applied ? "Promo code applied! –20%" : "Promo / Voucher Code"}
        </span>
        {applied && (
          <button onClick={remove} className="ml-auto text-white/30 hover:text-white/60 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {!applied && (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder="Enter code (try CINEMA20)"
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/4 border text-white placeholder-white/20 outline-none transition-all"
            style={{
              borderColor:
                status === "error"
                  ? "rgba(232,25,44,0.5)"
                  : status === "success"
                  ? "rgba(34,197,94,0.5)"
                  : "rgba(255,255,255,0.1)",
              fontSize: "0.85rem",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.05em",
            }}
          />
          <button
            onClick={apply}
            className="px-4 py-2.5 rounded-lg transition-all duration-200 flex-shrink-0"
            style={{
              backgroundColor: "rgba(232,25,44,0.15)",
              border: "1px solid rgba(232,25,44,0.3)",
              color: "#e8192c",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            Apply
          </button>
        </div>
      )}

      {status === "error" && (
        <p className="text-[#e8192c] mt-1.5" style={{ fontSize: "0.72rem" }}>
          Invalid code. Please try again.
        </p>
      )}
      {applied && (
        <p className="text-green-400 mt-1" style={{ fontSize: "0.72rem" }}>
          Code <span style={{ fontFamily: "monospace", fontWeight: 700 }}>CINEMA20</span> — 20% off applied to your order.
        </p>
      )}
    </div>
  );
}

/* ─── Animated Credit Card ───────────────────────────────────── */

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

function AnimatedCard({ data, flipped }: { data: CardData; flipped: boolean }) {
  const display = (v: string, len: number, ph: string) =>
    v ? v : ph.repeat(len);

  const rawNum = data.number.replace(/\s/g, "");
  const formattedNum = [0, 4, 8, 12]
    .map((s) => (rawNum.slice(s, s + 4) || "····"))
    .join("  ");

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none transition-all duration-500"
      style={{
        aspectRatio: "1.586",
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front */}
      <div
        className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d1060 40%, #0d1640 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          backfaceVisibility: "hidden",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(100,60,200,0.15)",
        }}
      >
        {/* Holographic shimmer */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)",
          }}
        />
        {/* Circles deco */}
        <div
          className="absolute -right-10 -top-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(150,80,255,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -left-6 -bottom-6 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(232,25,44,0.08) 0%, transparent 70%)" }}
        />

        <div className="flex items-start justify-between relative z-10">
          {/* Chip */}
          <div
            className="w-10 h-7 rounded-md"
            style={{
              background: "linear-gradient(135deg, #d4a847, #f0c060, #c8962a)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-full h-full rounded-md opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
              }}
            />
          </div>
          {/* Network logo */}
          <div className="flex items-center">
            <div
              className="w-7 h-7 rounded-full opacity-80"
              style={{ background: "linear-gradient(135deg, #e8192c, #ff6b6b)" }}
            />
            <div
              className="w-7 h-7 rounded-full -ml-3 opacity-70"
              style={{ background: "linear-gradient(135deg, #ff9500, #ffcc00)" }}
            />
          </div>
        </div>

        {/* Number */}
        <div
          className="text-white/90 tracking-widest relative z-10"
          style={{ fontFamily: "'Courier New', monospace", fontSize: "clamp(0.9rem,2.2vw,1.05rem)", letterSpacing: "0.18em", fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          {formattedNum}
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-white/30 uppercase mb-0.5" style={{ fontSize: "0.52rem", letterSpacing: "0.18em" }}>Card Holder</p>
            <p className="text-white/85 uppercase tracking-wider" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
              {data.name || "YOUR NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/30 uppercase mb-0.5" style={{ fontSize: "0.52rem", letterSpacing: "0.18em" }}>Expires</p>
            <p className="text-white/85" style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 600 }}>
              {data.expiry || "MM/YY"}
            </p>
          </div>
        </div>
      </div>

      {/* Back */}
      <div
        className="absolute inset-0 rounded-2xl flex flex-col justify-center transition-all duration-500"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d1060 40%, #0d1640 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          backfaceVisibility: "hidden",
          transform: flipped ? "rotateY(0deg)" : "rotateY(-180deg)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Magnetic stripe */}
        <div className="w-full h-10 mb-5" style={{ backgroundColor: "#111" }} />
        {/* Signature strip */}
        <div className="mx-5 flex items-center gap-3">
          <div
            className="flex-1 h-8 rounded px-3 flex items-center justify-end"
            style={{ background: "repeating-linear-gradient(45deg, #f5f5f0, #f5f5f0 4px, #e8e8e2 4px, #e8e8e2 8px)" }}
          >
            <span className="text-gray-800" style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.2em" }}>
              {data.cvv || "•••"}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full opacity-80" style={{ background: "linear-gradient(135deg, #e8192c, #ff6b6b)" }} />
            <div className="w-5 h-5 rounded-full -ml-2 opacity-70" style={{ background: "linear-gradient(135deg, #ff9500, #ffcc00)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Credit Card Form ───────────────────────────────────────── */

function CreditCardForm() {
  const [card, setCard] = useState<CardData>({ number: "", name: "", expiry: "", cvv: "" });
  const [cvvFocused, setCvvFocused] = useState(false);

  const fmtNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const inputStyle = (focused?: boolean) => ({
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1.5px solid ${focused ? "rgba(232,25,44,0.6)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Animated card preview */}
      <div className="px-2">
        <AnimatedCard data={card} flipped={cvvFocused} />
      </div>

      {/* Card number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          Card Number
        </label>
        <input
          value={card.number}
          onChange={(e) => setCard({ ...card, number: fmtNumber(e.target.value) })}
          placeholder="0000 0000 0000 0000"
          className="w-full px-4 py-3 placeholder-white/20"
          style={{ ...inputStyle(), fontFamily: "'Courier New', monospace", letterSpacing: "0.12em" }}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          Cardholder Name
        </label>
        <input
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
          placeholder="FULL NAME ON CARD"
          className="w-full px-4 py-3 placeholder-white/20"
          style={{ ...inputStyle(), letterSpacing: "0.05em" }}
        />
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>
            Expiry Date
          </label>
          <input
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: fmtExpiry(e.target.value) })}
            placeholder="MM/YY"
            className="w-full px-4 py-3 placeholder-white/20"
            style={{ ...inputStyle(), fontFamily: "'Courier New', monospace" }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/40 uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>
            CVV / CVC
          </label>
          <input
            value={card.cvv}
            onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            onFocus={() => setCvvFocused(true)}
            onBlur={() => setCvvFocused(false)}
            placeholder="•••"
            type="password"
            className="w-full px-4 py-3 placeholder-white/20"
            style={{ ...inputStyle(cvvFocused), fontFamily: "'Courier New', monospace" }}
          />
        </div>
      </div>

      {/* Save card checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-4 h-4 rounded border border-white/20 group-hover:border-white/40 flex items-center justify-center transition-colors flex-shrink-0">
        </div>
        <span className="text-white/40" style={{ fontSize: "0.78rem" }}>Save card for future bookings</span>
      </label>
    </div>
  );
}

/* ─── E-Wallet Panel ─────────────────────────────────────────── */

function EWalletPanel({ provider }: { provider: "momo" | "zalopay" }) {
  const [phone, setPhone] = useState("");
  const isMomo = provider === "momo";

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {/* QR Code mockup */}
      <div
        className="rounded-xl p-4 border border-white/8"
        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="w-36 h-36 rounded-lg relative overflow-hidden"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* QR pattern mockup */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <rect x="5" y="5" width="28" height="28" fill="none" stroke={isMomo ? "#ae2070" : "#006699"} strokeWidth="4" />
            <rect x="12" y="12" width="14" height="14" fill={isMomo ? "#ae2070" : "#006699"} />
            <rect x="67" y="5" width="28" height="28" fill="none" stroke={isMomo ? "#ae2070" : "#006699"} strokeWidth="4" />
            <rect x="74" y="12" width="14" height="14" fill={isMomo ? "#ae2070" : "#006699"} />
            <rect x="5" y="67" width="28" height="28" fill="none" stroke={isMomo ? "#ae2070" : "#006699"} strokeWidth="4" />
            <rect x="12" y="74" width="14" height="14" fill={isMomo ? "#ae2070" : "#006699"} />
            {[40,50,60,45,55,42,58].map((x, i) => (
              <rect key={i} x={x} y={[10,20,30,50,60,70,80][i]} width="6" height="6" fill={isMomo ? "#ae2070" : "#006699"} opacity="0.7" />
            ))}
            {[10,20,30,40,50,60,70,80,15,25,35,45,55,65,75].map((y, i) => (
              <rect key={`h${i}`} x={[40,50,60,45,55,65,42,48,53,58,63,44,56,47,61][i]} y={y} width="5" height="5" fill={isMomo ? "#ae2070" : "#006699"} opacity="0.5" />
            ))}
          </svg>
          {/* Logo overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,1) 22%, transparent 40%)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: isMomo ? "#ae2070" : "#006699",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <span className="text-white" style={{ fontSize: "0.6rem", fontWeight: 900 }}>
                {isMomo ? "M" : "Z"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/70" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          Scan with {isMomo ? "MoMo" : "ZaloPay"}
        </p>
        <p className="text-white/35 mt-1" style={{ fontSize: "0.78rem" }}>
          Open your {isMomo ? "MoMo" : "ZaloPay"} app and scan the QR code above
        </p>
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-white/25" style={{ fontSize: "0.72rem" }}>or pay with phone number</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="w-full flex gap-2">
        <div
          className="flex items-center justify-center px-3 rounded-lg border border-white/10 text-white/40 flex-shrink-0"
          style={{ fontSize: "0.82rem" }}
        >
          🇻🇳 +84
        </div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="Enter phone number"
          className="flex-1 px-4 py-3 rounded-xl placeholder-white/20 text-white outline-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.1)",
            fontSize: "0.88rem",
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Banking Panel ────────────────────���─────────────────────── */

const BANKS = [
  { id: "vcb",  name: "Vietcombank", short: "VCB", color: "#006b3c" },
  { id: "tcb",  name: "Techcombank", short: "TCB", color: "#cc0000" },
  { id: "bida", name: "BIDV",        short: "BID", color: "#005baa" },
  { id: "vtb",  name: "Vietinbank",  short: "VTB", color: "#0072bc" },
  { id: "mbv",  name: "MBBank",      short: "MB",  color: "#003087" },
  { id: "acb",  name: "ACB",         short: "ACB", color: "#004a97" },
  { id: "vpb",  name: "VPBank",      short: "VPB", color: "#00843d" },
  { id: "sab",  name: "Sacombank",   short: "STB", color: "#0e3875" },
];

function BankingPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-white/40" style={{ fontSize: "0.8rem" }}>Select your bank to continue</p>
      <div className="grid grid-cols-4 gap-2">
        {BANKS.map((bank) => (
          <button
            key={bank.id}
            onClick={() => setSelected(bank.id)}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200"
            style={{
              backgroundColor: selected === bank.id ? bank.color + "22" : "rgba(255,255,255,0.02)",
              borderColor: selected === bank.id ? bank.color + "99" : "rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: bank.color }}
            >
              <span className="text-white" style={{ fontSize: "0.52rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                {bank.short}
              </span>
            </div>
            <span
              className="text-white/50 text-center leading-tight truncate w-full"
              style={{ fontSize: "0.6rem", fontWeight: selected === bank.id ? 700 : 500 }}
            >
              {bank.name}
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}
        >
          <Check size={13} className="text-green-400 flex-shrink-0" />
          <p className="text-green-400/80" style={{ fontSize: "0.78rem" }}>
            You will be redirected to{" "}
            <span style={{ fontWeight: 700 }}>{BANKS.find((b) => b.id === selected)?.name}</span>{" "}
            to complete payment securely.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Payment Method Section ─────────────────────────────────── */

type PayMethod = "card" | "momo" | "zalopay" | "banking";

interface MethodOption {
  id: PayMethod;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

function PaymentMethodSection() {
  const [method, setMethod] = useState<PayMethod>("card");

  const methods: MethodOption[] = [
    {
      id: "card",
      label: "Credit / Debit Card",
      sublabel: "Visa, Mastercard, JCB",
      icon: <CreditCard size={20} className="text-blue-400" />,
    },
    {
      id: "momo",
      label: "MoMo",
      sublabel: "E-Wallet",
      icon: (
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#ae2070" }}>
          <span className="text-white" style={{ fontSize: "0.6rem", fontWeight: 900 }}>M</span>
        </div>
      ),
      badge: "Popular",
      badgeColor: "#ae2070",
    },
    {
      id: "zalopay",
      label: "ZaloPay",
      sublabel: "E-Wallet",
      icon: (
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "#006699" }}>
          <Zap size={13} className="text-white" fill="white" />
        </div>
      ),
    },
    {
      id: "banking",
      label: "Internet Banking",
      sublabel: "ATM / Online Transfer",
      icon: <Building2 size={20} className="text-emerald-400" />,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center gap-2">
        <CreditCard size={14} className="text-[#e8192c]" />
        <span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
          Payment Method
        </span>
      </div>

      {/* Method tabs */}
      <div className="p-4 grid grid-cols-2 gap-2.5">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className="relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200"
            style={{
              backgroundColor: method === m.id ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.02)",
              borderColor: method === m.id ? "rgba(232,25,44,0.4)" : "rgba(255,255,255,0.07)",
            }}
          >
            {/* Radio dot */}
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                borderColor: method === m.id ? "#e8192c" : "rgba(255,255,255,0.2)",
                backgroundColor: method === m.id ? "#e8192c" : "transparent",
              }}
            >
              {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {m.icon}
                <span className="text-white truncate" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
                  {m.label}
                </span>
                {m.badge && (
                  <span
                    className="px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: m.badgeColor, fontSize: "0.55rem", fontWeight: 700 }}
                  >
                    {m.badge}
                  </span>
                )}
              </div>
              <p className="text-white/30 mt-0.5" style={{ fontSize: "0.7rem" }}>{m.sublabel}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Form area */}
      <div className="px-5 pb-5">
        <div
          className="p-4 rounded-xl border border-white/6"
          style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
        >
          {method === "card" && <CreditCardForm />}
          {method === "momo" && <EWalletPanel provider="momo" />}
          {method === "zalopay" && <EWalletPanel provider="zalopay" />}
          {method === "banking" && <BankingPanel />}
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm Button ─────────────────────────────────────────── */

function ConfirmButton({ total }: { total: number }) {
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  const navigate = useNavigate();

  const handleClick = () => {
    if (state !== "idle") return;
    setState("processing");
    setTimeout(() => setState("done"), 2200);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        disabled={state === "done"}
        className="relative w-full py-4 rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.99]"
        style={{
          backgroundColor:
            state === "done" ? "#16a34a" : "#e8192c",
          boxShadow:
            state === "done"
              ? "0 8px 30px rgba(22,163,74,0.35)"
              : "0 8px 30px rgba(232,25,44,0.35), 0 2px 8px rgba(232,25,44,0.2)",
          border: "none",
          cursor: state === "done" ? "default" : "pointer",
        }}
      >
        {/* Animated shine */}
        {state === "idle" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            }}
          />
        )}

        {state === "processing" && (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            />
          </div>
        )}

        <div className="relative flex items-center justify-center gap-3">
          {state === "idle" && (
            <>
              <Lock size={18} className="text-white" />
              <span className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.04em" }}>
                Confirm & Pay {formatVND(total)}
              </span>
              <ArrowRight size={18} className="text-white" />
            </>
          )}
          {state === "processing" && (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M 12 2 A 10 10 0 0 1 22 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-white" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Processing Payment…
              </span>
            </>
          )}
          {state === "done" && (
            <>
              <div
                className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
              >
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-white" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Payment Successful!
              </span>
            </>
          )}
        </div>
      </button>

      {state === "done" && (
        <div
          className="rounded-xl p-4 flex items-start gap-3 animate-pulse"
          style={{
            backgroundColor: "rgba(22,163,74,0.08)",
            border: "1px solid rgba(22,163,74,0.25)",
            animationDuration: "2s",
          }}
        >
          <Check size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
              Booking Confirmed!
            </p>
            <p className="text-green-400/60 mt-0.5" style={{ fontSize: "0.78rem" }}>
              Your e-ticket has been sent to your email. Booking ref: <span style={{ fontFamily: "monospace", fontWeight: 700 }}>CIN-2026-84729</span>
            </p>
            <button
              onClick={() => navigate("/my-tickets")}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all active:scale-[0.99]"
              style={{
                backgroundColor: "rgba(232,25,44,0.12)",
                border: "1px solid rgba(232,25,44,0.28)",
                color: "#e8192c",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
              }}
            >
              View My Tickets <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Security badges */}
      <div className="flex items-center justify-center gap-5">
        <div className="flex items-center gap-1.5 text-white/25">
          <ShieldCheck size={13} />
          <span style={{ fontSize: "0.7rem" }}>256-bit SSL</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-1.5 text-white/25">
          <Lock size={11} />
          <span style={{ fontSize: "0.7rem" }}>Secured Payment</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-1.5 text-white/25">
          <ShieldCheck size={13} />
          <span style={{ fontSize: "0.7rem" }}>PCI DSS</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export function Checkout() {
  const [snackCart, setSnackCart] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  const [holdSecondsLeft, setHoldSecondsLeft] = useState(600);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (sessionExpired) return;
    if (holdSecondsLeft <= 0) {
      setSessionExpired(true);
      return;
    }

    const id = window.setInterval(() => {
      setHoldSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [holdSecondsLeft, sessionExpired]);

  const mm = String(Math.floor(holdSecondsLeft / 60)).padStart(2, "0");
  const ss = String(holdSecondsLeft % 60).padStart(2, "0");

  const ticketSubtotal = BOOKING.seats.reduce((a, s) => a + s.price, 0);
  const snackSubtotal = SNACK_ITEMS.reduce((a, item) => a + (snackCart[item.id] || 0) * item.price, 0);
  const tax = Math.round(ticketSubtotal * TAX_RATE);
  const grandTotal = ticketSubtotal + snackSubtotal + CONVENIENCE_FEE + tax;

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter','system-ui',sans-serif" }}
    >
      {/* ── HEADER ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-white/6"
        style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-4">
          <Link
            to="/movie/your-name/seats"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors flex-shrink-0"
            style={{ fontSize: "0.82rem", fontWeight: 500 }}
          >
            <ChevronLeft size={18} />
            Back
          </Link>
          <div className="w-px h-5 bg-white/10 flex-shrink-0" />
          <span
            className="text-white flex-shrink-0"
            style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.15em" }}
          >
            CINEMA
          </span>
          <div className="flex-1 flex justify-center">
            <ProgressBar current={2} />
          </div>
          <div className="flex items-center gap-1.5 text-white/30 flex-shrink-0">
            <Lock size={12} />
            <span style={{ fontSize: "0.72rem" }}>Secure</span>
          </div>
        </div>
      </header>

      {/* ── SEAT HOLD TIMER ───────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4">
        <div
          className="rounded-2xl border px-4 py-3 flex items-center justify-between gap-3"
          style={{
            backgroundColor: "rgba(17,17,24,0.72)",
            borderColor: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 50px rgba(232,25,44,0.10)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: "rgba(232,25,44,0.12)",
                borderColor: "rgba(232,25,44,0.28)",
                boxShadow: "0 0 26px rgba(232,25,44,0.22)",
              }}
            >
              <Zap size={16} className="text-[#e8192c] animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem", letterSpacing: "-0.01em" }}>
                Seats held for:{" "}
                <span style={{ color: "#e8192c", fontFamily: "'Courier New', monospace", letterSpacing: "0.08em" }}>
                  {mm}:{ss}
                </span>
              </p>
              <p className="text-white/35" style={{ fontSize: "0.78rem" }}>
                Complete payment before the timer ends to keep your selected seats.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/25" style={{ fontSize: "0.72rem" }}>
            <Lock size={12} className="text-white/30" />
            Soft hold active
          </div>
        </div>
      </div>

      {/* ── MAIN ───────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {/* Page title */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-white" style={{ fontWeight: 800, fontSize: "clamp(1.4rem,3vw,1.9rem)", letterSpacing: "-0.02em" }}>
            Review & Payment
          </h1>
          <p className="text-white/35 mt-1" style={{ fontSize: "0.88rem" }}>
            Check your order details and complete your booking
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT COLUMN ────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <OrderSummaryCard />
            <SnacksSection cart={snackCart} setCart={setSnackCart} />
            <CostBreakdown snackCart={snackCart} />
            <PromoCode />
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────── */}
          <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-5 lg:sticky lg:top-20">
            <PaymentMethodSection />
            <ConfirmButton total={grandTotal} />

            {/* Fine print */}
            <p className="text-white/20 text-center" style={{ fontSize: "0.7rem", lineHeight: 1.6 }}>
              By confirming, you agree to our{" "}
              <span className="text-white/40 underline underline-offset-2 cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="text-white/40 underline underline-offset-2 cursor-pointer">Refund Policy</span>.
              Tickets are non-transferable.
            </p>
          </div>
        </div>
      </main>

      {/* ── SESSION EXPIRED OVERLAY ───────────────────── */}
      {sessionExpired && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{
            backgroundColor: "rgba(10,10,15,0.80)",
            backdropFilter: "blur(18px)",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(232,25,44,0.22) 0%, rgba(10,10,15,0.0) 55%)",
            }}
          />

          <div
            className="relative w-full max-w-md rounded-3xl border overflow-hidden"
            style={{
              backgroundColor: "rgba(17,17,24,0.72)",
              borderColor: "rgba(255,255,255,0.10)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.75), 0 0 60px rgba(232,25,44,0.18)",
              backdropFilter: "blur(18px)",
            }}
          >
            <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                  style={{
                    backgroundColor: "rgba(232,25,44,0.14)",
                    borderColor: "rgba(232,25,44,0.30)",
                  }}
                >
                  <Zap size={18} className="text-[#e8192c] animate-pulse" />
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 900, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
                    Session Expired
                  </p>
                  <p className="text-white/35 mt-0.5" style={{ fontSize: "0.82rem" }}>
                    Your seat hold has ended. Please start a new booking.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <button
                onClick={() => navigate("/movies")}
                className="w-full py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.99]"
                style={{
                  backgroundColor: "#e8192c",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  letterSpacing: "0.06em",
                  boxShadow: "0 10px 35px rgba(232,25,44,0.35), 0 2px 10px rgba(232,25,44,0.18)",
                }}
              >
                Return to Movies
              </button>
              <p className="text-center text-white/20 mt-4" style={{ fontSize: "0.72rem", lineHeight: 1.6 }}>
                For security, checkout actions are disabled after expiration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}