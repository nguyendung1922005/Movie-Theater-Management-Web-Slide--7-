import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft, Check, ChevronDown, ChevronUp,
  Plus, Minus, Lock, CreditCard, Smartphone,
  QrCode, Wallet, Shield, Star, Ticket,
} from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.32)",
  green:   "#10b981",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

const SNACKS = [
  { id: "popcorn-l", name: "Popcorn Large", desc: "Caramel or Butter", price: 75000, emoji: "🍿" },
  { id: "cola-l",    name: "Cola Large",    desc: "Coca-Cola 32oz",    price: 45000, emoji: "🥤" },
  { id: "nachos",    name: "Nachos",        desc: "With Cheese Dip",   price: 60000, emoji: "🧀" },
  { id: "combo-2",   name: "Couple Combo",  desc: "2 Popcorn + 2 Cola",price: 185000,emoji: "💑" },
];

const PAYMENT_METHODS = [
  { id: "card",    label: "Credit / Debit Card", icon: <CreditCard size={18} />,  color: "#3b82f6", detail: "Visa · Mastercard · JCB" },
  { id: "momo",    label: "MoMo Wallet",          icon: <Smartphone size={18} />,  color: "#e91e8c", detail: "Scan QR or Link Account" },
  { id: "zalopay", label: "ZaloPay",               icon: <Wallet size={18} />,      color: "#1877f2", detail: "ZaloPay E-Wallet" },
  { id: "vnpay",   label: "VNPay QR",              icon: <QrCode size={18} />,      color: "#e8192c", detail: "All Vietnam Banks" },
];

function formatVND(v: number) { return v.toLocaleString("vi-VN") + " ₫"; }

export function CineMobileCheckout() {
  const [snackQty, setSnackQty] = useState<Record<string, number>>({});
  const [payment, setPayment] = useState("card");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardOpen, setCardOpen] = useState(true);
  const [done, setDone] = useState(false);

  const ticketPrice = 300000;
  const bookingFee  = 15000;

  const snackTotal = SNACKS.reduce((acc, s) => acc + (snackQty[s.id] ?? 0) * s.price, 0);
  const grandTotal = ticketPrice + bookingFee + snackTotal;

  const changeQty = (id: string, delta: number) => {
    setSnackQty(q => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ backgroundColor: C.bg, color: C.text }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 32px rgba(16,185,129,0.4)" }}>
          <Check size={36} className="text-white" />
        </div>
        <h1 className="text-white mb-2" style={{ fontWeight: 900, fontSize: "1.5rem" }}>Booking Confirmed!</h1>
        <p style={{ color: C.muted, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: "32px" }}>
          Your tickets for <span className="text-white font-bold">Your Name</span><br />have been booked successfully.
        </p>
        <div className="w-full p-4 rounded-2xl border mb-6" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="flex justify-between mb-2">
            <span style={{ fontSize: "0.75rem", color: C.dim }}>Booking ID</span>
            <span className="text-white" style={{ fontWeight: 700, fontSize: "0.78rem" }}>#CVS-20260305-8847</span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: "0.75rem", color: C.dim }}>Total Paid</span>
            <span style={{ fontWeight: 900, fontSize: "0.88rem", color: C.green }}>{formatVND(grandTotal)}</span>
          </div>
        </div>
        <Link to="/eticket" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white no-underline"
          style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontWeight: 800, fontSize: "0.9rem", textDecoration: "none" }}>
          <Ticket size={16} /> View E-Ticket
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4"
        style={{ height: 56, backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <Link to="/cine/mobile/seats" className="w-9 h-9 rounded-xl border flex items-center justify-center no-underline"
          style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.04)", color: C.muted, textDecoration: "none" }}>
          <ArrowLeft size={17} />
        </Link>
        <div className="flex-1 text-center">
          <p className="text-white" style={{ fontWeight: 800, fontSize: "0.88rem" }}>Checkout</p>
          <p style={{ fontSize: "0.6rem", color: C.dim }}>Step 3 of 3 · Final Step</p>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(s => (
            <div key={s} className="rounded-full" style={{ width: s === 3 ? 16 : 6, height: 6, backgroundColor: s <= 3 ? C.red : "rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      </header>

      <div className="px-4 py-5 flex flex-col gap-4 pb-32">

        {/* ── 1. ORDER SUMMARY ── */}
        <section className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
          {/* Top accent */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.red} 50%, transparent)` }} />

          <div className="px-4 py-3.5 border-b" style={{ borderColor: C.border }}>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>Order Summary</h2>
          </div>

          {/* Movie info */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: C.border }}>
            <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" alt="Your Name" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem" }}>Your Name</p>
              <p style={{ fontSize: "0.68rem", color: C.dim, marginBottom: "6px" }}>Romance · Animation</p>
              <div className="flex flex-wrap gap-1.5">
                {["IMAX", "Thu Mar 5", "19:30"].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded" style={{ fontSize: "0.6rem", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.06)", color: C.muted }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Seat info */}
          <div className="px-4 py-3.5 border-b" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "0.72rem", color: C.dim }}>Seats Selected</span>
              <div className="flex gap-1.5">
                {["G7", "G8"].map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-lg text-white" style={{ fontSize: "0.7rem", fontWeight: 700, backgroundColor: C.red }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "0.72rem", color: C.dim }}>Hall</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>IMAX Hall 01 · Row G</span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="px-4 py-3.5 flex flex-col gap-2">
            {[
              { label: "2× IMAX Ticket (G7, G8)", value: ticketPrice },
              { label: "Booking Fee", value: bookingFee },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ fontSize: "0.75rem", color: C.muted }}>{label}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{formatVND(value)}</span>
              </div>
            ))}
            {snackTotal > 0 && (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "0.75rem", color: C.muted }}>Snacks & Drinks</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{formatVND(snackTotal)}</span>
              </div>
            )}
            <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
              <span className="text-white" style={{ fontWeight: 800, fontSize: "0.85rem" }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: "1.1rem", color: C.red, letterSpacing: "-0.03em" }}>{formatVND(grandTotal)}</span>
            </div>
          </div>
        </section>

        {/* ── 2. SNACKS ── */}
        <section className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="px-4 py-3.5 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>🍿 Add Snacks</h2>
            <span style={{ fontSize: "0.65rem", color: C.dim }}>Optional</span>
          </div>

          <div className="flex flex-col divide-y" style={{ borderColor: C.border }}>
            {SNACKS.map(snack => {
              const qty = snackQty[snack.id] ?? 0;
              return (
                <div key={snack.id} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="text-2xl flex-shrink-0" style={{ fontSize: "1.6rem", lineHeight: 1 }}>{snack.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{snack.name}</p>
                    <p style={{ fontSize: "0.62rem", color: C.dim }}>{snack.desc}</p>
                    <p style={{ fontSize: "0.72rem", fontWeight: 800, color: C.red, marginTop: "2px" }}>{formatVND(snack.price)}</p>
                  </div>

                  {/* +/- control */}
                  <div className="flex items-center gap-0 rounded-xl overflow-hidden border flex-shrink-0"
                    style={{ borderColor: qty > 0 ? `${C.red}40` : C.border }}>
                    <button
                      onClick={() => changeQty(snack.id, -1)}
                      disabled={qty === 0}
                      className="w-9 h-9 flex items-center justify-center transition-all active:scale-90"
                      style={{ backgroundColor: qty > 0 ? C.red + "18" : "rgba(255,255,255,0.04)", color: qty > 0 ? C.red : C.dim }}>
                      <Minus size={14} />
                    </button>
                    <div className="w-8 text-center" style={{ backgroundColor: qty > 0 ? C.red + "0a" : "transparent" }}>
                      <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 800 }}>{qty}</span>
                    </div>
                    <button
                      onClick={() => changeQty(snack.id, 1)}
                      className="w-9 h-9 flex items-center justify-center transition-all active:scale-90"
                      style={{ backgroundColor: C.red + "18", color: C.red }}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. PAYMENT METHOD ── */}
        <section className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
          <div className="px-4 py-3.5 border-b" style={{ borderColor: C.border }}>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.92rem" }}>Payment Method</h2>
          </div>

          <div className="flex flex-col gap-0 divide-y" style={{ borderColor: C.border }}>
            {PAYMENT_METHODS.map(pm => (
              <button key={pm.id} onClick={() => setPayment(pm.id)}
                className="flex items-center gap-3.5 px-4 py-4 text-left w-full transition-all"
                style={{ backgroundColor: payment === pm.id ? `${pm.color}10` : "transparent" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${pm.color}18`, border: `1px solid ${pm.color}30`, color: pm.color }}>
                  {pm.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{pm.label}</p>
                  <p style={{ fontSize: "0.62rem", color: C.dim }}>{pm.detail}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: payment === pm.id ? C.red : "rgba(255,255,255,0.2)", backgroundColor: payment === pm.id ? C.red : "transparent" }}>
                  {payment === pm.id && <Check size={10} className="text-white" />}
                </div>
              </button>
            ))}
          </div>

          {/* Credit card form */}
          {payment === "card" && (
            <div className="px-4 py-4 border-t" style={{ borderColor: C.border }}>
              <button onClick={() => setCardOpen(v => !v)}
                className="flex items-center justify-between w-full mb-3"
                style={{ color: C.muted }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>Card Details</span>
                {cardOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {cardOpen && (
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Card Number", value: cardNo, onChange: setCardNo, placeholder: "1234 5678 9012 3456", type: "tel" },
                  ].map(({ label, value, onChange, placeholder, type }) => (
                    <div key={label}>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: C.dim, marginBottom: "6px", textTransform: "uppercase" }}>{label}</p>
                      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
                        className="w-full bg-transparent text-white outline-none rounded-xl border px-3 h-11"
                        style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)", fontSize: "0.88rem", caretColor: C.red }} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: C.dim, marginBottom: "6px", textTransform: "uppercase" }}>Expiry</p>
                      <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" type="tel"
                        className="w-full bg-transparent text-white outline-none rounded-xl border px-3 h-11"
                        style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)", fontSize: "0.88rem", caretColor: C.red }} />
                    </div>
                    <div>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", color: C.dim, marginBottom: "6px", textTransform: "uppercase" }}>CVV</p>
                      <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="• • •" type="password" maxLength={3}
                        className="w-full bg-transparent text-white outline-none rounded-xl border px-3 h-11"
                        style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)", fontSize: "0.88rem", caretColor: C.red }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 py-2">
          {[
            { icon: <Lock size={11} />, label: "SSL Secured" },
            { icon: <Shield size={11} />, label: "256-bit Encryption" },
            { icon: <Star size={11} />, label: "Trusted by 1M+" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span style={{ color: C.dim }}>{icon}</span>
              <span style={{ fontSize: "0.6rem", color: C.dim }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY BOTTOM: CONFIRM & PAY ── */}
      <div className="fixed bottom-0 inset-x-0 z-30"
        style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, padding: "14px 16px", paddingBottom: "calc(14px + env(safe-area-inset-bottom,0px))" }}>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ fontSize: "0.62rem", color: C.dim }}>Grand Total</p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: "1.3rem", letterSpacing: "-0.04em" }}>{formatVND(grandTotal)}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ backgroundColor: C.green + "18", border: `1px solid ${C.green}25` }}>
            <Lock size={10} style={{ color: C.green }} />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: C.green }}>Secure Payment</span>
          </div>
        </div>

        <button
          onClick={() => setDone(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold"
          style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, fontSize: "1rem", fontWeight: 900, boxShadow: `0 8px 32px ${C.redGlow}` }}>
          <Lock size={16} /> Confirm &amp; Pay
        </button>
      </div>
    </div>
  );
}
