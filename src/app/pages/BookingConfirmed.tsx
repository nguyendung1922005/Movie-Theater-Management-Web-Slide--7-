import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Film,
  Calendar,
  Clock,
  MapPin,
  Armchair,
  CreditCard,
  Download,
  Ticket,
  ChevronRight,
  Star,
  Sparkles,
  Crown,
  Share2,
  User,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   MOCK BOOKING DATA
══════════════════════════════════════════════════════════ */
const BOOKING = {
  ref:       "CINEMA-8X9P2",
  movie:     "Your Name",
  original:  "君の名は。",
  genre:     "Animation · Romance",
  duration:  "1h 46m",
  poster:    "https://images.unsplash.com/photo-1561046582-8f3224fcdab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VyJTIwbmFtZSUyMGFuaW1lJTIwa2ltaSUyMG5vJTIwbmElMjB3YSUyMGNvbWV0JTIwc2t5fGVufDF8fHx8MTc3MjU1MzcwMnww&ixlib=rb-4.1.0&q=80&w=400",
  date:      "Saturday, May 17, 2026",
  shortDate: "May 17",
  time:      "7:30 PM",
  timeShort: "7:30",
  ampm:      "PM",
  hall:      "IMAX 03",
  cinema:    "CGV Vincom Center",
  address:   "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
  seats:     ["G10", "G11"],
  seatType:  "VIP",
  format:    "IMAX",
  customer:  "Nguyễn Văn Thịnh",
  initial:   "T",
  bookedAt:  "May 9, 2026 · 14:22",
  tickets:   2,
  unitPrice: 280_000,
  snacks:    75_000,
  discount:  -56_000,
  total:     299_000,
};

/* ══════════════════════════════════════════════════════════
   CONFETTI CANVAS
══════════════════════════════════════════════════════════ */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; rotation: number;
  rotSpeed: number; shape: "rect" | "circle" | "line";
  fadeSpeed: number;
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(232,25,44,",  "rgba(248,113,113,", "rgba(245,158,11,",
      "rgba(99,102,241,", "rgba(16,185,129,",  "rgba(255,255,255,",
      "rgba(251,191,36,",
    ];
    const particles: Particle[] = [];
    const shapes: Particle["shape"][] = ["rect", "circle", "line"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x:         Math.random() * window.innerWidth,
        y:         -20 - Math.random() * 300,
        vx:        (Math.random() - 0.5) * 1.8,
        vy:        1.2 + Math.random() * 2.5,
        size:      3 + Math.random() * 7,
        opacity:   0.65 + Math.random() * 0.35,
        color:     COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation:  Math.random() * Math.PI * 2,
        rotSpeed:  (Math.random() - 0.5) * 0.12,
        shape:     shapes[Math.floor(Math.random() * shapes.length)],
        fadeSpeed: 0.0015 + Math.random() * 0.003,
      });
    }

    let raf: number;
    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(tick * 0.02 + p.y * 0.01) * 0.4;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (tick > 120) p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.65 + Math.random() * 0.35;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha   = Math.max(0, p.opacity);
        ctx.fillStyle     = p.color + p.opacity + ")";
        ctx.strokeStyle   = p.color + p.opacity + ")";

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
        }
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   LIGHT LEAKS
══════════════════════════════════════════════════════════ */
function LightLeaks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.11) 0%, transparent 70%)", animation: "breathe 4s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-[480px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(232,25,44,0.08) 0%, transparent 70%)", animation: "breathe 5s ease-in-out infinite 1.5s" }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[340px] h-[340px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)", animation: "breathe 6s ease-in-out infinite 0.8s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATED CHECKMARK
══════════════════════════════════════════════════════════ */
function AnimatedCheck() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative flex items-center justify-center mb-5">
      {phase >= 1 && (
        <>
          <div
            className="absolute w-32 h-32 rounded-full border-2 border-[#10b981]/20 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute w-44 h-44 rounded-full border border-[#10b981]/[0.08] animate-ping"
            style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
          />
        </>
      )}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl transition-opacity duration-700"
        style={{ backgroundColor: "#10b981", opacity: phase >= 1 ? 0.22 : 0 }}
      />
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          background:  phase >= 1 ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.05)",
          boxShadow:   phase >= 2 ? "0 0 0 6px rgba(16,185,129,0.15), 0 16px 48px rgba(16,185,129,0.35)" : "none",
          transform:   phase >= 1 ? "scale(1)"   : "scale(0.6)",
        }}
      >
        <Check
          className="text-white"
          size={42}
          strokeWidth={3}
          style={{
            opacity:    phase >= 2 ? 1 : 0,
            transform:  phase >= 2 ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-45deg)",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PERFORATION TEAR ROW
══════════════════════════════════════════════════════════ */
function TearRow() {
  return (
    <div
      className="relative flex items-center pointer-events-none"
      style={{ height: "18px", zIndex: 10 }}
    >
      <div
        className="absolute left-0 w-[18px] h-[18px] rounded-full"
        style={{
          backgroundColor: "#0a0a0f",
          border: "1.5px solid rgba(255,255,255,0.08)",
          marginLeft: "-9px",
        }}
      />
      <div className="flex-1 mx-2">
        <div
          className="w-full h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 6px, transparent 6px, transparent 14px)",
          }}
        />
      </div>
      <div
        className="absolute right-0 w-[18px] h-[18px] rounded-full"
        style={{
          backgroundColor: "#0a0a0f",
          border: "1.5px solid rgba(255,255,255,0.08)",
          marginRight: "-9px",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DETAIL CELL (small label + value)
══════════════════════════════════════════════════════════ */
function DetailCell({
  icon, label, value, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 px-3 py-2.5 rounded-xl border"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: "rgba(255,255,255,0.22)" }}>{icon}</span>
        <span
          className="uppercase"
          style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)" }}
        >
          {label}
        </span>
      </div>
      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: accent ? "#e8192c" : "rgba(255,255,255,0.82)" }}>
        {value}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PHYSICAL TICKET CARD
══════════════════════════════════════════════════════════ */
function PhysicalTicket({ visible }: { visible: boolean }) {
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShowQR(true), 500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      className="w-full rounded-3xl overflow-hidden border"
      style={{
        borderColor:    "rgba(255,255,255,0.1)",
        backgroundColor: "#141420",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.7), 0 0 80px rgba(16,185,129,0.05), inset 0 1px 0 rgba(255,255,255,0.07)",
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.1,0.64,1)",
      }}
    >
      {/* Gradient accent stripe */}
      <div
        className="h-[3px]"
        style={{ background: "linear-gradient(90deg, #10b981 0%, #34d399 20%, #e8192c 55%, #f97316 78%, #6366f1 100%)" }}
      />

      {/* ── MAIN ROW: poster + details ── */}
      <div className="flex min-h-[260px]">

        {/* LEFT — Movie Poster Panel */}
        <div className="relative flex-shrink-0" style={{ width: "160px" }}>
          <img
            src={BOOKING.poster}
            alt={BOOKING.movie}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Right-edge fade into card surface */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 40%, rgba(20,20,32,0.98) 100%)" }}
          />
          {/* Bottom scrim */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)" }}
          />
          {/* Film grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: "128px",
            }}
          />

          {/* Badges (top-left) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white"
              style={{
                background:   "linear-gradient(135deg, #e8192c, #a00e1f)",
                fontSize:     "0.52rem",
                fontWeight:   900,
                letterSpacing:"0.1em",
                boxShadow:    "0 2px 8px rgba(232,25,44,0.5)",
              }}
            >
              <Sparkles size={7} /> E-TICKET
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-white"
              style={{
                backgroundColor: "rgba(59,130,246,0.85)",
                fontSize:        "0.52rem",
                fontWeight:      800,
                letterSpacing:   "0.1em",
                boxShadow:       "0 2px 8px rgba(59,130,246,0.4)",
              }}
            >
              {BOOKING.format}
            </span>
          </div>

          {/* Rating (top-right) */}
          <div className="absolute top-3 right-3 z-10">
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
              style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Star size={9} fill="#f59e0b" style={{ color: "#f59e0b" }} />
              <span className="text-white" style={{ fontSize: "0.62rem", fontWeight: 800 }}>4.9</span>
            </div>
          </div>

          {/* Original title at bottom */}
          <div className="absolute bottom-3 left-3 right-2 z-10">
            <p className="text-white/30" style={{ fontSize: "0.58rem", letterSpacing: "0.08em" }}>
              {BOOKING.original}
            </p>
          </div>
        </div>

        {/* Vertical perforation separator */}
        <div
          className="relative flex-shrink-0 w-4 self-stretch"
          style={{ display: "flex", alignItems: "stretch", justifyContent: "center" }}
        >
          {/* Top notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: "#0a0a0f",
              border: "1.5px solid rgba(255,255,255,0.08)",
              marginTop: "-8px",
            }}
          />
          {/* Dashed line */}
          <div
            className="absolute top-4 bottom-4"
            style={{
              left: "50%",
              width: "1px",
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 5px, transparent 5px, transparent 11px)",
            }}
          />
          {/* Bottom notch */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: "#0a0a0f",
              border: "1.5px solid rgba(255,255,255,0.08)",
              marginBottom: "-8px",
            }}
          />
        </div>

        {/* RIGHT — Booking Details Panel */}
        <div className="flex-1 px-5 py-5 flex flex-col justify-between">

          {/* Top: ref + title */}
          <div>
            {/* Booking ref badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.28)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[#10b981] font-mono" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em" }}>
                #{BOOKING.ref}
              </span>
            </div>

            <h2
              className="text-white leading-none mb-1"
              style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.03em" }}
            >
              {BOOKING.movie}
            </h2>
            <p className="text-white/35 mb-4" style={{ fontSize: "0.73rem" }}>
              {BOOKING.genre} · {BOOKING.duration}
            </p>

            {/* Showtime strip — 3 columns */}
            <div
              className="flex overflow-hidden rounded-xl mb-4 border"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              {[
                { top: "Date",     main: BOOKING.shortDate, sub: "2026" },
                { top: "Time",     main: BOOKING.timeShort, sub: BOOKING.ampm },
                { top: "Hall",     main: "IMAX",            sub: "03"   },
              ].map(({ top, main, sub }, i) => (
                <div
                  key={top}
                  className="flex-1 flex flex-col items-center py-3 gap-0.5"
                  style={{
                    backgroundColor:
                      i === 0 ? "rgba(16,185,129,0.07)"
                      : i === 1 ? "rgba(232,25,44,0.07)"
                      : "rgba(99,102,241,0.07)",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span
                    className="uppercase"
                    style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)" }}
                  >
                    {top}
                  </span>
                  <span className="text-white" style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    {main}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{sub}</span>
                </div>
              ))}
            </div>

            {/* Detail cells grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <DetailCell icon={<Armchair size={11} />} label="Seats"    value={BOOKING.seats.join(" · ")} accent />
              <DetailCell icon={<Crown size={11} />}    label="Type"     value={BOOKING.seatType} />
              <DetailCell icon={<MapPin size={11} />}   label="Cinema"   value="CGV Vincom" />
              <DetailCell icon={<Clock size={11} />}    label="Duration" value={BOOKING.duration} />
            </div>
          </div>

          {/* Customer chip */}
          <div
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #e8192c, #9b0e1d)", fontWeight: 900, fontSize: "0.68rem" }}
              >
                {BOOKING.initial}
              </div>
              <div>
                <p className="text-white" style={{ fontSize: "0.8rem", fontWeight: 700 }}>{BOOKING.customer}</p>
                <p className="text-white/28" style={{ fontSize: "0.62rem" }}>Booked {BOOKING.bookedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={11} style={{ color: "#10b981" }} />
              <span style={{ color: "#10b981", fontSize: "0.68rem", fontWeight: 700 }}>Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PERFORATION TEAR LINE ── */}
      <div className="mx-4">
        <TearRow />
      </div>

      {/* ── BOTTOM STUB: QR + barcode + price ── */}
      <div className="flex items-center gap-5 px-5 py-4">

        {/* QR code */}
        <div
          className="relative flex-shrink-0 flex flex-col items-center gap-1.5"
          style={{
            opacity:    showQR ? 1 : 0,
            transform:  showQR ? "scale(1)" : "scale(0.85)",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute w-24 h-24 rounded-full blur-2xl pointer-events-none"
            style={{ backgroundColor: "#e8192c", opacity: 0.14 }}
          />
          <div
            className="relative p-2.5 rounded-2xl bg-white"
            style={{ boxShadow: "0 0 0 1px rgba(232,25,44,0.3), 0 0 24px rgba(232,25,44,0.25), 0 8px 24px rgba(0,0,0,0.4)" }}
          >
            <QRCodeSVG
              value={`CINEMA:REF-${BOOKING.ref}:${BOOKING.movie.toUpperCase().replace(/ /g,"_")}:${BOOKING.seats.join(",")}`}
              size={72}
              bgColor="#ffffff"
              fgColor="#0a0a0f"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-white/25 font-mono text-center" style={{ fontSize: "0.5rem", letterSpacing: "0.06em" }}>
            Scan at entrance
          </p>
        </div>

        {/* Barcode + ref */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Barcode graphic */}
          <div className="flex items-end gap-px opacity-25">
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={i}
                className="bg-white"
                style={{
                  width:  i % 5 === 0 ? "3px" : i % 3 === 0 ? "2px" : "1.5px",
                  height: `${10 + ((i * 11 + 7) % 16)}px`,
                }}
              />
            ))}
          </div>
          <div>
            <p
              className="text-white font-mono"
              style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.18em" }}
            >
              {BOOKING.ref}
            </p>
            <p className="text-white/25 uppercase" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", marginTop: "2px" }}>
              Booking Reference
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div
          className="self-stretch w-px flex-shrink-0"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        />

        {/* Price column */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p
            className="uppercase"
            style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)" }}
          >
            Total Paid
          </p>
          <p style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.02em", color: "#10b981" }}>
            {BOOKING.total.toLocaleString("vi-VN")}₫
          </p>
          <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)" }}>
            {BOOKING.tickets} × {BOOKING.seatType} {BOOKING.format}
          </p>
        </div>
      </div>

      {/* Bottom gradient strip */}
      <div
        className="h-[3px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(232,25,44,0.25) 40%, rgba(99,102,241,0.15) 80%, transparent)" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MINI COST BREAKDOWN (below ticket)
══════════════════════════════════════════════════════════ */
function CostBreakdown({ visible }: { visible: boolean }) {
  const rows = [
    { label: `${BOOKING.tickets}× IMAX VIP Seats`, value: `${(BOOKING.unitPrice * BOOKING.tickets).toLocaleString("vi-VN")}₫`, color: "rgba(255,255,255,0.5)" },
    { label: "Snacks & Combos",                    value: `${BOOKING.snacks.toLocaleString("vi-VN")}₫`,                        color: "rgba(255,255,255,0.5)" },
    { label: "Promo CINEMA20",                     value: `${BOOKING.discount.toLocaleString("vi-VN")}₫`,                      color: "#10b981" },
  ];
  return (
    <div
      className="w-full rounded-2xl border px-5 py-4 transition-all duration-700"
      style={{
        backgroundColor:  "rgba(255,255,255,0.02)",
        borderColor:       "rgba(255,255,255,0.07)",
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="flex flex-col gap-2.5">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-white/35" style={{ fontSize: "0.78rem" }}>{label}</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color }}>{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/[0.07]">
          <div className="flex items-center gap-2">
            <CreditCard size={13} className="text-white/35" />
            <span className="text-white" style={{ fontSize: "0.88rem", fontWeight: 800 }}>Total Paid</span>
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 900, color: "#10b981" }}>
            {BOOKING.total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING SPARKLE
══════════════════════════════════════════════════════════ */
function FloatSparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none" style={style}>
      <Sparkles
        size={14}
        style={{ color: "#f59e0b", opacity: 0.5, animation: "sparkleFloat 3s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export function BookingConfirmed() {
  const [contentVisible, setContentVisible] = useState(false);
  const [cardVisible,    setCardVisible]    = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setContentVisible(true), 200);
    const t2 = setTimeout(() => setCardVisible(true),    800);
    const t3 = setTimeout(() => setActionsVisible(true), 1_200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundColor: "#0a0a0f", paddingTop: "48px", paddingBottom: "72px" }}
    >
      {/* Atmosphere */}
      <LightLeaks />
      <ConfettiCanvas />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto px-5">

        {/* Logo link */}
        <div
          className="self-start mb-6 transition-all duration-500"
          style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? "translateY(0)" : "translateY(-12px)" }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 transition-colors text-white/25 hover:text-white/55"
          >
            <div className="w-7 h-7 bg-[#e8192c] rounded-lg flex items-center justify-center">
              <Film size={13} className="text-white" />
            </div>
            <span className="text-white/35 uppercase" style={{ fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.72rem" }}>
              CINEMA
            </span>
          </Link>
        </div>

        {/* Animated checkmark */}
        <div
          className="transition-all duration-500"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <AnimatedCheck />
        </div>

        {/* Headline */}
        <div
          className="text-center mb-2 transition-all duration-600"
          style={{
            opacity:         contentVisible ? 1 : 0,
            transform:       contentVisible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "0.2s",
          }}
        >
          <h1
            className="text-white mb-2"
            style={{ fontWeight: 900, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Payment Successful!
          </h1>
          <p className="text-white/45" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
            Your tickets are confirmed.
            <br />
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.8rem" }}>
              A receipt has been sent to your email address.
            </span>
          </p>
        </div>

        {/* Step breadcrumb */}
        <div
          className="flex items-center gap-2 my-5 transition-all duration-500"
          style={{ opacity: contentVisible ? 1 : 0, transitionDelay: "0.35s" }}
        >
          {(["Select Seats", "Checkout", "Confirmed"] as const).map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: i < 2 ? "rgba(16,185,129,0.18)" : "#10b981",
                    border:          `1px solid ${i < 2 ? "rgba(16,185,129,0.35)" : "#10b981"}`,
                  }}
                >
                  <Check size={10} style={{ color: i === 2 ? "white" : "#10b981" }} />
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: i === 2 ? 700 : 500, color: i === 2 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }}>
                  {step}
                </span>
              </div>
              {i < 2 && <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>

        {/* ── Physical Ticket ── */}
        <PhysicalTicket visible={cardVisible} />

        {/* Cost breakdown */}
        <div className="w-full mt-4">
          <CostBreakdown visible={actionsVisible} />
        </div>

        {/* ── Action Buttons ── */}
        <div
          className="w-full flex flex-col gap-3 mt-5 transition-all duration-600"
          style={{
            opacity:   actionsVisible ? 1 : 0,
            transform: actionsVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {/* Primary: View My Tickets */}
          <Link
            to="/my-tickets"
            className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
            style={{
              background:  "linear-gradient(135deg, #e8192c, #c8111f)",
              boxShadow:   "0 8px 32px rgba(232,25,44,0.4), 0 0 0 1px rgba(232,25,44,0.3)",
              fontSize:    "0.92rem",
              fontWeight:  900,
              letterSpacing: "0.1em",
              textDecoration: "none",
            }}
          >
            {/* Shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)",
                animation:  "shimmerSweep 2.5s ease-in-out infinite",
              }}
            />
            <Ticket size={18} />
            VIEW MY TICKETS
          </Link>

          {/* Secondary row: Home + Share */}
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300 text-white/55 hover:text-white hover:border-white/22 hover:bg-white/[0.04]"
              style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.08em", borderColor: "rgba(255,255,255,0.12)", textDecoration: "none" }}
            >
              <Film size={16} />
              BACK TO HOME
            </Link>
            <button
              className="w-14 flex items-center justify-center rounded-2xl border transition-all duration-300 text-white/40 hover:text-white hover:border-white/22 hover:bg-white/[0.04]"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
              title="Share booking"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Tertiary: Download PDF */}
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl transition-colors text-white/28 hover:text-white/50"
            style={{ fontSize: "0.78rem", fontWeight: 600 }}
          >
            <Download size={14} />
            Download PDF Ticket
          </button>
        </div>

        {/* Support note */}
        <p
          className="mt-4 text-center transition-all duration-500"
          style={{
            fontSize:        "0.68rem",
            lineHeight:       1.7,
            color:            "rgba(255,255,255,0.16)",
            opacity:          actionsVisible ? 1 : 0,
            transitionDelay:  "0.3s",
          }}
        >
          Questions? Visit the box office 30 min before showtime or email{" "}
          <span style={{ color: "rgba(232,25,44,0.55)" }}>support@cinema.vn</span>
        </p>

        {/* Floating sparkles */}
        <FloatSparkle style={{ top: "10%",  left: "6%",   animationDelay: "0s"    }} />
        <FloatSparkle style={{ top: "18%",  right: "8%",  animationDelay: "0.9s"  }} />
        <FloatSparkle style={{ top: "52%",  left: "2%",   animationDelay: "1.6s"  }} />
        <FloatSparkle style={{ top: "68%",  right: "4%",  animationDelay: "0.5s"  }} />
        <FloatSparkle style={{ top: "82%",  left: "9%",   animationDelay: "2.1s"  }} />
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.12); opacity: 0.7; }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0)    rotate(0deg);   opacity: 0.5; }
          33%       { transform: translateY(-8px) rotate(15deg);  opacity: 0.85; }
          66%       { transform: translateY(4px)  rotate(-10deg); opacity: 0.35; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
      `}</style>
    </div>
  );
}
