import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft, Plus, Minus, CreditCard, Smartphone,
  QrCode, Wallet, Check, Lock, Shield, Star,
  ChevronRight, Ticket, Gift, Info, Zap,
} from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.3)",
  green:   "#10b981",
  amber:   "#f59e0b",
  blue:    "#3b82f6",
  purple:  "#8b5cf6",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

const SNACKS = [
  { id:"popcorn-l", name:"Large Popcorn",    desc:"Caramel or Butter",  price:75000,  emoji:"🍿" },
  { id:"cola-l",    name:"Cola Large",        desc:"Coca-Cola 32oz",     price:45000,  emoji:"🥤" },
  { id:"nachos",    name:"Nachos & Cheese",   desc:"With Jalapeño Dip",  price:60000,  emoji:"🧀" },
  { id:"combo-2",   name:"Couple Combo",      desc:"2 Popcorn + 2 Cola", price:185000, emoji:"💑" },
  { id:"hotdog",    name:"Premium Hot Dog",   desc:"Grilled + Mustard",  price:55000,  emoji:"🌭" },
  { id:"pretzel",   name:"Salted Pretzel",    desc:"With Dipping Sauce", price:42000,  emoji:"🥨" },
];

const PAYMENTS = [
  { id:"card",    label:"Credit / Debit Card", icon:<CreditCard size={18}/>,  color:C.blue,   sub:"Visa · Mastercard · JCB" },
  { id:"momo",    label:"MoMo Wallet",          icon:<Smartphone size={18}/>,  color:"#e91e8c", sub:"Instant QR Payment"      },
  { id:"zalopay", label:"ZaloPay",               icon:<Wallet size={18}/>,      color:C.blue,   sub:"ZaloPay E-Wallet"         },
  { id:"vnpay",   label:"VNPay QR",              icon:<QrCode size={18}/>,      color:C.red,    sub:"All Vietnam Banks"        },
];

function formatVND(v: number) { return v.toLocaleString("vi-VN") + " ₫"; }

function QtyControl({ qty, onDec, onInc, color }: { qty:number; onDec:()=>void; onInc:()=>void; color:string }) {
  return (
    <div className="flex items-center rounded-xl overflow-hidden border flex-shrink-0"
      style={{ borderColor: qty>0 ? `${color}40` : C.border }}>
      <button onClick={onDec} disabled={qty===0}
        className="w-9 h-9 flex items-center justify-center transition-all"
        style={{ backgroundColor: qty>0 ? `${color}18` : "rgba(255,255,255,0.03)", color: qty>0 ? color : C.dim }}>
        <Minus size={14} />
      </button>
      <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: qty>0 ? `${color}0c` : "transparent" }}>
        <span className="text-white" style={{ fontSize:"0.88rem", fontWeight:800 }}>{qty}</span>
      </div>
      <button onClick={onInc}
        className="w-9 h-9 flex items-center justify-center transition-all"
        style={{ backgroundColor:`${color}18`, color }}>
        <Plus size={14} />
      </button>
    </div>
  );
}

export function CineTabletCheckout() {
  const [qty, setQty] = useState<Record<string,number>>({});
  const [payment, setPayment] = useState("card");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv]       = useState("");
  const [name, setName]     = useState("");
  const [promo, setPromo]   = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [done, setDone]     = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const changeQty = (id: string, d: number) => setQty(q => ({ ...q, [id]: Math.max(0, (q[id]??0)+d) }));

  const TICKET_PRICE = 300000;
  const BOOKING_FEE  = 15000;
  const snackTotal   = SNACKS.reduce((a,s) => a + (qty[s.id]??0)*s.price, 0);
  const discount     = promoApplied ? Math.round(TICKET_PRICE * 0.2) : 0;
  const grandTotal   = TICKET_PRICE + BOOKING_FEE + snackTotal - discount;

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ backgroundColor: C.bg, color: C.text }}>
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#10b981,#059669)", boxShadow:"0 12px 48px rgba(16,185,129,0.45)" }}>
            <Check size={42} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor:C.amber, fontSize:"1rem" }}>🎉</div>
        </div>
        <h1 className="text-white mb-2" style={{ fontWeight:900, fontSize:"2rem", letterSpacing:"-0.04em" }}>Booking Confirmed!</h1>
        <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.7, maxWidth:400, marginBottom:36 }}>
          Your tickets for <span className="text-white font-bold">Your Name</span> on <span className="text-white font-bold">Thu, Mar 5 · 19:30</span> have been confirmed. Check your email for the e-ticket.
        </p>
        <div className="w-full max-w-sm p-5 rounded-2xl border mb-6" style={{ backgroundColor:C.card, borderColor:C.border }}>
          {[
            { label:"Booking ID",  value:"#CVS-20260305-8847" },
            { label:"Movie",       value:"Your Name · IMAX" },
            { label:"Seats",       value:"G7, G8 · Hall 01" },
            { label:"Total Paid",  value:formatVND(grandTotal), red:true },
          ].map(({ label, value, red }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor:C.border }}>
              <span style={{ fontSize:"0.78rem", color:C.dim }}>{label}</span>
              <span style={{ fontSize:"0.82rem", fontWeight:700, color:red?C.green:C.text }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <Link to="/eticket" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white no-underline"
            style={{ background:`linear-gradient(135deg,${C.red},#c8111f)`, fontWeight:800, fontSize:"0.9rem", textDecoration:"none", boxShadow:`0 8px 28px ${C.redGlow}` }}>
            <Ticket size={16}/> View E-Ticket
          </Link>
          <Link to="/cine/tablet/home" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white no-underline border"
            style={{ borderColor:C.border, backgroundColor:"rgba(255,255,255,0.04)", fontWeight:700, fontSize:"0.85rem", textDecoration:"none" }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b flex items-center gap-4 px-7 h-14"
        style={{ backgroundColor:"rgba(10,10,15,0.95)", backdropFilter:"blur(24px)", borderColor:C.border }}>
        <Link to="/cine/tablet/movie" className="flex items-center gap-2 px-3 py-2 rounded-xl border no-underline"
          style={{ borderColor:C.border, backgroundColor:"rgba(255,255,255,0.03)", color:C.muted, textDecoration:"none" }}>
          <ArrowLeft size={16}/> <span style={{ fontSize:"0.8rem", fontWeight:600 }}>Back</span>
        </Link>
        <div className="h-5 w-px" style={{ backgroundColor:C.border }} />
        <h1 className="text-white" style={{ fontWeight:800, fontSize:"0.95rem" }}>Checkout</h1>
        {/* Progress steps */}
        <div className="flex items-center gap-2 ml-auto">
          {[
            { n:1, label:"Movie",   done:true  },
            { n:2, label:"Seats",   done:true  },
            { n:3, label:"Payment", done:false },
          ].map((step, i, arr) => (
            <div key={step.n} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: step.done ? C.green : step.n===3 ? C.red : "rgba(255,255,255,0.08)", border: step.n===3 ? `2px solid ${C.red}` : "none" }}>
                  {step.done ? <Check size={11} className="text-white"/> : <span className="text-white" style={{ fontSize:"0.6rem", fontWeight:800 }}>{step.n}</span>}
                </div>
                <span style={{ fontSize:"0.7rem", fontWeight: step.n===3 ? 700 : 500, color: step.done ? C.green : step.n===3 ? C.text : C.dim }}>{step.label}</span>
              </div>
              {i < arr.length-1 && <div className="w-8 h-px" style={{ backgroundColor: step.done ? C.green : C.border }} />}
            </div>
          ))}
        </div>
      </header>

      {/* ════════ 2-COLUMN LAYOUT ════════ */}
      <div className="flex gap-0 min-h-[calc(100vh-56px)]">

        {/* ══ LEFT COLUMN ══ */}
        <div className="flex-1 overflow-y-auto border-r" style={{ borderColor:C.border }}>
          <div style={{ padding:"28px 32px 48px" }}>

            {/* ── ORDER SUMMARY ── */}
            <section className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor:C.card, borderColor:C.border }}>
              <div className="h-px" style={{ background:`linear-gradient(90deg, transparent, ${C.red} 50%, transparent)` }} />

              <div className="px-5 py-4 border-b" style={{ borderColor:C.border }}>
                <h2 className="text-white" style={{ fontWeight:800, fontSize:"1rem" }}>Order Summary</h2>
              </div>

              {/* Movie strip */}
              <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor:C.border }}>
                <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/8">
                  <img src="https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" alt="Your Name" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white mb-1" style={{ fontWeight:800, fontSize:"1.05rem" }}>Your Name</p>
                  <p style={{ fontSize:"0.72rem", color:C.dim, marginBottom:"10px" }}>Romance · Animation · 2016</p>
                  <div className="flex flex-wrap gap-2">
                    {["IMAX", "Thu Mar 5", "19:30", "Hall 01"].map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-lg border"
                        style={{ fontSize:"0.65rem", fontWeight:600, backgroundColor:"rgba(255,255,255,0.04)", borderColor:C.border, color:C.muted }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seat info */}
              <div className="px-5 py-4 border-b" style={{ borderColor:C.border }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="uppercase" style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.12em", color:C.dim }}>Seats</span>
                  <div className="flex gap-2">
                    {["G7","G8"].map(s => (
                      <span key={s} className="px-3 py-1 rounded-xl text-white"
                        style={{ fontSize:"0.75rem", fontWeight:800, background:`linear-gradient(135deg,${C.red},#c8111f)` }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize:"0.75rem", color:C.dim }}>Type</span>
                  <span style={{ fontSize:"0.75rem", fontWeight:600, color:"rgba(255,255,255,0.55)" }}>Premium · Row G</span>
                </div>
              </div>

              {/* Price rows */}
              <div className="px-5 py-4">
                {[
                  { label:"2× IMAX Ticket (G7, G8)", value:TICKET_PRICE },
                  { label:"Booking Fee",              value:BOOKING_FEE  },
                  ...(snackTotal>0 ? [{ label:"Snacks & Drinks", value:snackTotal }] : []),
                  ...(discount>0   ? [{ label:"Promo Discount (CINEMA20)", value:-discount, green:true }] : []),
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex items-center justify-between mb-2.5 last:mb-0">
                    <span style={{ fontSize:"0.78rem", color:C.muted }}>{label}</span>
                    <span style={{ fontSize:"0.82rem", fontWeight:700, color: green ? C.green : "rgba(255,255,255,0.6)" }}>
                      {green ? "-" : ""}{formatVND(Math.abs(value))}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3.5 mt-3 border-t" style={{ borderColor:C.border }}>
                  <span className="text-white" style={{ fontWeight:800, fontSize:"0.9rem" }}>Grand Total</span>
                  <span style={{ fontWeight:900, fontSize:"1.3rem", color:C.red, letterSpacing:"-0.04em" }}>{formatVND(grandTotal)}</span>
                </div>
              </div>
            </section>

            {/* ── PROMO CODE ── */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2 flex-1 px-4 h-11 rounded-xl border"
                style={{ backgroundColor:"rgba(255,255,255,0.03)", borderColor:promoApplied?`${C.green}40`:C.border }}>
                <Gift size={14} style={{ color:promoApplied?C.green:C.dim }} />
                <input type="text" value={promo} onChange={e => setPromo(e.target.value.toUpperCase())}
                  disabled={promoApplied}
                  placeholder="Enter promo code..."
                  className="flex-1 bg-transparent text-white outline-none"
                  style={{ fontSize:"0.85rem", caretColor:C.red }} />
                {promoApplied && <Check size={14} style={{ color:C.green }} />}
              </div>
              <button
                onClick={() => { if (promo.trim()) setPromoApplied(p => !p); }}
                className="px-5 h-11 rounded-xl text-white transition-all flex-shrink-0"
                style={{
                  fontSize:"0.8rem", fontWeight:800,
                  background: promoApplied ? `rgba(16,185,129,0.12)` : `linear-gradient(135deg,${C.red},#c8111f)`,
                  border: promoApplied ? `1px solid rgba(16,185,129,0.3)` : "none",
                  color: promoApplied ? C.green : "white",
                }}>
                {promoApplied ? "Remove" : "Apply"}
              </button>
            </div>

            {/* ── SNACKS ── */}
            <section className="rounded-2xl border overflow-hidden" style={{ backgroundColor:C.card, borderColor:C.border }}>
              <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor:C.border }}>
                <div>
                  <h2 className="text-white" style={{ fontWeight:800, fontSize:"1rem" }}>🍿 Add Snacks & Drinks</h2>
                  <p style={{ fontSize:"0.68rem", color:C.dim, marginTop:"2px" }}>Order now, pick up at the counter</p>
                </div>
                <span style={{ fontSize:"0.68rem", color:C.dim }}>Optional</span>
              </div>

              <div className="divide-y" style={{ divideColor:C.border }}>
                {SNACKS.map(snack => {
                  const q = qty[snack.id]??0;
                  return (
                    <div key={snack.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor:"rgba(255,255,255,0.04)", fontSize:"1.5rem", lineHeight:1 }}>
                        {snack.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white" style={{ fontWeight:700, fontSize:"0.88rem" }}>{snack.name}</p>
                        <p style={{ fontSize:"0.65rem", color:C.dim }}>{snack.desc}</p>
                        <p style={{ fontSize:"0.78rem", fontWeight:800, color:C.red, marginTop:"2px" }}>{formatVND(snack.price)}</p>
                      </div>
                      <QtyControl qty={q} onDec={() => changeQty(snack.id,-1)} onInc={() => changeQty(snack.id,1)} color={C.red} />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* ══ RIGHT COLUMN (sticky) ══ */}
        <div className="flex-shrink-0 flex flex-col" style={{ width:360, backgroundColor:C.surface }}>
          <div className="flex-1 overflow-y-auto">
            <div style={{ padding:"28px 28px 32px" }}>

              {/* ── PAYMENT METHODS ── */}
              <section className="rounded-2xl border overflow-hidden mb-5" style={{ backgroundColor:C.card, borderColor:C.border }}>
                <div className="h-px" style={{ background:`linear-gradient(90deg,transparent,${C.red} 50%,transparent)` }} />
                <div className="px-5 py-4 border-b" style={{ borderColor:C.border }}>
                  <h2 className="text-white" style={{ fontWeight:800, fontSize:"0.95rem" }}>Payment Method</h2>
                </div>

                <div className="divide-y" style={{ divideColor:C.border }}>
                  {PAYMENTS.map(pm => (
                    <button key={pm.id} onClick={() => setPayment(pm.id)}
                      className="flex items-center gap-3.5 px-5 py-4 w-full text-left transition-all"
                      style={{ backgroundColor: payment===pm.id ? `${pm.color}0d` : "transparent" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor:`${pm.color}18`, border:`1px solid ${pm.color}28`, color:pm.color }}>
                        {pm.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize:"0.85rem", fontWeight:700, color:payment===pm.id?C.text:"rgba(255,255,255,0.55)" }}>{pm.label}</p>
                        <p style={{ fontSize:"0.64rem", color:C.dim }}>{pm.sub}</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ borderColor:payment===pm.id?C.red:"rgba(255,255,255,0.15)", backgroundColor:payment===pm.id?C.red:"transparent" }}>
                        {payment===pm.id && <Check size={10} className="text-white"/>}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                {payment==="card" && (
                  <div className="px-5 pb-5 pt-3 border-t" style={{ borderColor:C.border }}>
                    <div className="flex flex-col gap-3">
                      {/* Name */}
                      <div>
                        <p className="uppercase mb-1.5" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.12em", color:C.dim }}>Cardholder Name</p>
                        <input value={name} onChange={e=>setName(e.target.value)} placeholder="JOHN DOE"
                          className="w-full bg-transparent text-white outline-none rounded-xl border px-3.5 h-10"
                          style={{ borderColor:"rgba(255,255,255,0.1)", backgroundColor:"rgba(255,255,255,0.03)", fontSize:"0.85rem", caretColor:C.red }} />
                      </div>
                      {/* Card number */}
                      <div>
                        <p className="uppercase mb-1.5" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.12em", color:C.dim }}>Card Number</p>
                        <div className="relative">
                          <input value={cardNo} onChange={e=>setCardNo(e.target.value)} placeholder="1234 5678 9012 3456" type="tel"
                            className="w-full bg-transparent text-white outline-none rounded-xl border px-3.5 h-10 pr-10"
                            style={{ borderColor:"rgba(255,255,255,0.1)", backgroundColor:"rgba(255,255,255,0.03)", fontSize:"0.88rem", caretColor:C.red }} />
                          <CreditCard size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:C.dim }} />
                        </div>
                      </div>
                      {/* Expiry + CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="uppercase mb-1.5" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.12em", color:C.dim }}>Expiry</p>
                          <input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/YY" type="tel"
                            className="w-full bg-transparent text-white outline-none rounded-xl border px-3.5 h-10"
                            style={{ borderColor:"rgba(255,255,255,0.1)", backgroundColor:"rgba(255,255,255,0.03)", fontSize:"0.88rem", caretColor:C.red }} />
                        </div>
                        <div>
                          <p className="uppercase mb-1.5" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.12em", color:C.dim }}>CVV</p>
                          <input value={cvv} onChange={e=>setCvv(e.target.value)} placeholder="•••" type="password" maxLength={3}
                            className="w-full bg-transparent text-white outline-none rounded-xl border px-3.5 h-10"
                            style={{ borderColor:"rgba(255,255,255,0.1)", backgroundColor:"rgba(255,255,255,0.03)", fontSize:"0.88rem", caretColor:C.red }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* ── FINAL SUMMARY ── */}
              <div className="rounded-2xl border p-4 mb-5" style={{ backgroundColor:C.card, borderColor:C.border }}>
                <p className="uppercase mb-3" style={{ fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.14em", color:C.dim }}>Payment Summary</p>
                {[
                  { label:"2× Tickets",    value:TICKET_PRICE },
                  { label:"Booking Fee",   value:BOOKING_FEE  },
                  ...(snackTotal>0 ? [{ label:"Snacks",   value:snackTotal }] : []),
                  ...(discount>0   ? [{ label:"Discount", value:-discount, green:true }] : []),
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between mb-2">
                    <span style={{ fontSize:"0.75rem", color:C.dim }}>{label}</span>
                    <span style={{ fontSize:"0.78rem", fontWeight:600, color:green?C.green:"rgba(255,255,255,0.55)" }}>
                      {green?"-":""}{formatVND(Math.abs(value))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t mt-2" style={{ borderColor:C.border }}>
                  <span className="text-white" style={{ fontWeight:800, fontSize:"0.85rem" }}>Total</span>
                  <span style={{ fontWeight:900, fontSize:"1.15rem", color:C.red, letterSpacing:"-0.03em" }}>{formatVND(grandTotal)}</span>
                </div>
              </div>

              {/* ── TERMS ── */}
              <button onClick={() => setAgreeTerms(v => !v)}
                className="flex items-start gap-3 w-full text-left mb-5">
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{ backgroundColor:agreeTerms?C.red:"transparent", border:`2px solid ${agreeTerms?C.red:"rgba(255,255,255,0.2)"}` }}>
                  {agreeTerms && <Check size={11} className="text-white" />}
                </div>
                <p style={{ fontSize:"0.72rem", color:C.dim, lineHeight:1.5 }}>
                  I agree to the <span style={{ color:C.red }}>Terms of Service</span> and <span style={{ color:C.red }}>Privacy Policy</span>. I understand that tickets are non-refundable.
                </p>
              </button>

              {/* ── TRUST BADGES ── */}
              <div className="flex items-center justify-around mb-5 p-3 rounded-xl border"
                style={{ backgroundColor:"rgba(255,255,255,0.02)", borderColor:C.border }}>
                {[
                  { icon:<Lock size={12}/>,    label:"SSL Secured"       },
                  { icon:<Shield size={12}/>,  label:"256-bit Encryption" },
                  { icon:<Star size={12}/>,    label:"1M+ Customers"      },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span style={{ color:C.green }}>{icon}</span>
                    <span style={{ fontSize:"0.58rem", color:C.dim }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* ── CONFIRM & PAY ── */}
              <button
                onClick={() => setDone(true)}
                disabled={!agreeTerms}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white transition-all mb-3"
                style={{
                  background: agreeTerms ? `linear-gradient(135deg, ${C.red}, #c8111f)` : "rgba(255,255,255,0.06)",
                  fontWeight: 900, fontSize: "1.05rem",
                  boxShadow: agreeTerms ? `0 10px 36px ${C.redGlow}` : "none",
                  opacity: agreeTerms ? 1 : 0.5, cursor: agreeTerms ? "pointer" : "not-allowed",
                }}>
                <Lock size={16} />
                Confirm &amp; Pay
                <span className="ml-1 opacity-70" style={{ fontSize:"0.82rem" }}>{formatVND(grandTotal)}</span>
              </button>

              {/* Secure message */}
              <div className="flex items-center justify-center gap-2">
                <Lock size={11} style={{ color:C.dim }} />
                <span style={{ fontSize:"0.64rem", color:C.dim }}>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
