import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Film,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ChevronRight,
} from "lucide-react";

/* ══════════════════════════════════════════════
   FLOATING PARTICLES
══════════════════════════════════════════════ */
interface Dot { x: number; y: number; r: number; opacity: number; speed: number; }

function AmbientDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const dots: Dot[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.8 + Math.random() * 1.8,
      opacity: 0.06 + Math.random() * 0.14,
      speed: 0.12 + Math.random() * 0.22,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.y -= d.speed;
        if (d.y < -4) { d.y = canvas.height + 4; d.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,25,44,${d.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ══════════════════════════════════════════════
   COUNTDOWN HOOK
══════════════════════════════════════════════ */
function useCountdown(initial: number) {
  const [count, setCount] = useState(initial);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 1_000);
    return () => clearTimeout(t);
  }, [running, count]);
  const start = () => { setCount(initial); setRunning(true); };
  const done = count <= 0;
  return { count, running, done, start };
}

/* ══════════════════════════════════════════════
   STEP TYPES
══════════════════════════════════════════════ */
type Step = "request" | "sent" | "reset";

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export function ForgotPassword() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const countdown = useCountdown(59);

  /* Validate and submit */
  const handleSend = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1_800));
    setLoading(false);
    setStep("sent");
    countdown.start();
  };

  /* Password strength */
  const strength = (() => {
    let s = 0;
    if (newPass.length >= 8) s++;
    if (/[A-Z]/.test(newPass)) s++;
    if (/[0-9]/.test(newPass)) s++;
    if (/[^A-Za-z0-9]/.test(newPass)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#e8192c", "#f59e0b", "#3b82f6", "#10b981"][strength];

  const handleReset = async () => {
    if (!newPass || newPass !== confirmPass) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1_400));
    setLoading(false);
    setStep("reset");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* ── Blurred poster background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574439361665-4fd4721c0a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHJvbWFudGljJTIwc2t5JTIwY29tZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI1NTQ2MDN8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "blur(28px) brightness(0.12) saturate(1.4)", transform: "scale(1.08)" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.85) 100%)" }} />
        {/* Red/purple light leaks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(232,25,44,0.07) 0%, transparent 65%)" }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 65%)" }} />
        </div>
      </div>

      <AmbientDots />

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ animation: "cardRise 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-8 h-8 bg-[#e8192c] rounded-lg flex items-center justify-center shadow-lg shadow-[#e8192c]/25 group-hover:scale-105 transition-transform">
            <Film size={15} className="text-white" />
          </div>
          <span className="text-white uppercase" style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.22em" }}>CINEMA</span>
        </Link>

        {/* Glass card */}
        <div
          className="rounded-3xl overflow-hidden border border-white/[0.09]"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top accent */}
          <div className="h-0.5" style={{ background: "linear-gradient(90deg, transparent, #e8192c 40%, transparent)" }} />

          <div className="p-8">
            {/* ── STEP: REQUEST ── */}
            {step === "request" && (
              <RequestStep
                email={email} setEmail={setEmail}
                focused={emailFocused} setFocused={setEmailFocused}
                error={emailError} setError={setEmailError}
                loading={loading} onSubmit={handleSend}
              />
            )}

            {/* ── STEP: SENT ── */}
            {step === "sent" && (
              <SentStep
                email={email}
                countdown={countdown}
                onResend={() => { countdown.start(); }}
                onContinue={() => setStep("reset")}
              />
            )}

            {/* ── STEP: RESET ── */}
            {step === "reset" && (
              <ResetStep
                newPass={newPass} setNewPass={setNewPass}
                showPass={showPass} setShowPass={setShowPass}
                confirmPass={confirmPass} setConfirmPass={setConfirmPass}
                strength={strength} strengthLabel={strengthLabel} strengthColor={strengthColor}
                loading={loading} onSubmit={handleReset}
              />
            )}

            {/* ── STEP: DONE (success message inline) ── */}
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {(["request","sent","reset"] as Step[]).map((s, i) => {
            const done = ["request","sent","reset"].indexOf(step) > i;
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="transition-all duration-300 flex items-center justify-center rounded-full"
                  style={{
                    width: active ? "28px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: done ? "#10b981" : active ? "#e8192c" : "rgba(255,255,255,0.12)",
                  }}
                />
                {i < 2 && <div className="w-8 h-px" style={{ backgroundColor: done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes cardRise {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes iconPop {
          0%  { transform: scale(0.6) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(4deg); }
          100%{ transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes checkBounce {
          0%  { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.2); }
          100%{ transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STEP COMPONENTS
══════════════════════════════════════════════ */

/* ── Request ── */
function RequestStep({ email, setEmail, focused, setFocused, error, setError, loading, onSubmit }: {
  email: string; setEmail: (v: string) => void;
  focused: boolean; setFocused: (v: boolean) => void;
  error: string; setError: (v: string) => void;
  loading: boolean; onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col items-center" style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(232,25,44,0.15), rgba(232,25,44,0.08))",
          border: "1px solid rgba(232,25,44,0.25)",
          boxShadow: "0 0 40px rgba(232,25,44,0.18)",
          animation: "iconPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <KeyRound size={36} className="text-[#e8192c]" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h1 className="text-white text-center mb-2" style={{ fontWeight: 900, fontSize: "1.55rem", letterSpacing: "-0.03em" }}>
        Reset Your Password
      </h1>
      <p className="text-white/40 text-center mb-7" style={{ fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "320px" }}>
        Don't worry! Enter your email and we'll send you a recovery link.
      </p>

      {/* Email field */}
      <div className="w-full mb-5">
        <label className="text-white/40 mb-2 block uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
            style={{ color: focused ? "#e8192c" : error ? "#e8192c" : "rgba(255,255,255,0.25)" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            placeholder="your@email.com"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all duration-200"
            style={{
              border: `1.5px solid ${error ? "#e8192c" : focused ? "rgba(232,25,44,0.6)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: focused ? "0 0 0 3px rgba(232,25,44,0.08)" : error ? "0 0 0 3px rgba(232,25,44,0.06)" : "none",
              fontSize: "0.92rem",
            }}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-[#e8192c] flex items-center gap-1.5" style={{ fontSize: "0.73rem" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8192c] flex-shrink-0" />
            {error}
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="relative w-full py-4 rounded-xl text-white font-bold overflow-hidden transition-all duration-300 disabled:opacity-70"
        style={{
          background: "linear-gradient(135deg, #e8192c, #c8111f)",
          fontSize: "0.88rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          boxShadow: loading ? "none" : "0 8px 28px rgba(232,25,44,0.4)",
        }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(232,25,44,0.55)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(232,25,44,0.4)"; }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)", animation: "shimmerSweep 2.5s ease-in-out infinite" }}
        />
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> SENDING…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Mail size={15} /> SEND RESET LINK
          </span>
        )}
      </button>

      {/* Back */}
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 mt-5 text-white/35 hover:text-white transition-colors"
        style={{ fontSize: "0.83rem", fontWeight: 600 }}
      >
        <ArrowLeft size={14} /> Back to Login
      </Link>

      <style>{`@keyframes shimmerSweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }`}</style>
    </div>
  );
}

/* ── Sent ── */
function SentStep({ email, countdown, onResend, onContinue }: {
  email: string;
  countdown: ReturnType<typeof useCountdown>;
  onResend: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center" style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
      {/* Check icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.06))",
          border: "1px solid rgba(16,185,129,0.3)",
          boxShadow: "0 0 40px rgba(16,185,129,0.15)",
          animation: "iconPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <CheckCircle2 size={38} className="text-[#10b981]" strokeWidth={1.5} />
      </div>

      <h2 className="text-white text-center mb-2" style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>
        Check Your Inbox
      </h2>
      <p className="text-white/40 text-center mb-2" style={{ fontSize: "0.87rem", lineHeight: 1.6, maxWidth: "300px" }}>
        We've sent a recovery link to
      </p>
      <span
        className="px-3 py-1.5 rounded-full mb-7 border text-white/80"
        style={{ fontSize: "0.84rem", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        {email || "your@email.com"}
      </span>

      {/* Instructions */}
      <div className="w-full rounded-2xl p-4 mb-6 border border-white/[0.06]" style={{ backgroundColor: "rgba(255,255,255,0.025)" }}>
        <div className="flex flex-col gap-3">
          {[
            "Open the email from CINEMA",
            "Click the \"Reset Password\" link",
            "Set your new password",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ backgroundColor: "#e8192c", fontSize: "0.65rem", fontWeight: 900 }}
              >
                {i + 1}
              </div>
              <span className="text-white/55" style={{ fontSize: "0.82rem" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 rounded-xl text-white mb-4 flex items-center justify-center gap-2 transition-all duration-200 hover:gap-3"
        style={{
          background: "linear-gradient(135deg, #e8192c, #c8111f)",
          fontSize: "0.88rem", fontWeight: 800, letterSpacing: "0.1em",
          boxShadow: "0 8px 28px rgba(232,25,44,0.35)",
        }}
      >
        SET NEW PASSWORD <ChevronRight size={15} />
      </button>

      {/* Resend timer */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-white/30" style={{ fontSize: "0.78rem" }}>Didn't receive code?</span>
        {countdown.done ? (
          <button
            onClick={onResend}
            className="flex items-center gap-1.5 text-[#e8192c] hover:text-[#ff2d41] transition-colors"
            style={{ fontSize: "0.78rem", fontWeight: 700 }}
          >
            <RefreshCw size={11} /> Resend now
          </button>
        ) : (
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
            Resend in{" "}
            <span
              className="tabular-nums"
              style={{ color: countdown.count <= 10 ? "#f59e0b" : "rgba(255,255,255,0.6)" }}
            >
              {countdown.count}s
            </span>
          </span>
        )}
      </div>

      <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-white/25 hover:text-white/50 transition-colors" style={{ fontSize: "0.8rem" }}>
        <ArrowLeft size={13} /> Back to Login
      </Link>
    </div>
  );
}

/* ── Reset ── */
function ResetStep({ newPass, setNewPass, showPass, setShowPass, confirmPass, setConfirmPass, strength, strengthLabel, strengthColor, loading, onSubmit }: {
  newPass: string; setNewPass: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  confirmPass: string; setConfirmPass: (v: string) => void;
  strength: number; strengthLabel: string; strengthColor: string;
  loading: boolean; onSubmit: () => void;
}) {
  const [done, setDone] = useState(false);
  const [pass1Focused, setPass1Focused] = useState(false);
  const [pass2Focused, setPass2Focused] = useState(false);
  const mismatch = confirmPass.length > 0 && newPass !== confirmPass;

  const handleSubmit = async () => {
    await onSubmit();
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center py-4" style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.07))",
            border: "1px solid rgba(16,185,129,0.4)",
            boxShadow: "0 0 48px rgba(16,185,129,0.2)",
            animation: "iconPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <ShieldCheck size={38} className="text-[#10b981]" strokeWidth={1.5} />
        </div>
        <h2 className="text-white text-center mb-2" style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>
          Password Updated!
        </h2>
        <p className="text-white/40 text-center mb-8" style={{ fontSize: "0.87rem", lineHeight: 1.6 }}>
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <Link
          to="/login"
          className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-all"
          style={{
            background: "linear-gradient(135deg, #e8192c, #c8111f)",
            fontSize: "0.88rem", fontWeight: 800, letterSpacing: "0.1em",
            boxShadow: "0 8px 28px rgba(232,25,44,0.4)",
          }}
        >
          SIGN IN NOW <ChevronRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center" style={{ animation: "fadeSlideUp 0.4s ease forwards" }}>
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(232,25,44,0.15), rgba(232,25,44,0.06))",
          border: "1px solid rgba(232,25,44,0.25)",
          boxShadow: "0 0 40px rgba(232,25,44,0.15)",
          animation: "iconPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <KeyRound size={36} className="text-[#e8192c]" strokeWidth={1.5} />
      </div>

      <h2 className="text-white text-center mb-2" style={{ fontWeight: 900, fontSize: "1.45rem", letterSpacing: "-0.03em" }}>
        Set New Password
      </h2>
      <p className="text-white/40 text-center mb-7" style={{ fontSize: "0.87rem", lineHeight: 1.6 }}>
        Create a strong password for your account.
      </p>

      {/* New password */}
      <div className="w-full mb-4">
        <label className="text-white/40 mb-2 block uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          New Password
        </label>
        <div className="relative">
          <KeyRound
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: pass1Focused ? "#e8192c" : "rgba(255,255,255,0.25)" }}
          />
          <input
            type={showPass ? "text" : "password"}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            onFocus={() => setPass1Focused(true)}
            onBlur={() => setPass1Focused(false)}
            placeholder="Create password"
            className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
            style={{
              border: `1.5px solid ${pass1Focused ? "rgba(232,25,44,0.5)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: pass1Focused ? "0 0 0 3px rgba(232,25,44,0.07)" : "none",
              fontSize: "0.92rem",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Strength bar */}
        {newPass.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: s <= strength ? strengthColor : "rgba(255,255,255,0.08)" }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "0.68rem", color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
              <span className="text-white/20" style={{ fontSize: "0.65rem" }}>Min. 8 chars</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="w-full mb-6">
        <label className="text-white/40 mb-2 block uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
          Confirm Password
        </label>
        <div className="relative">
          <KeyRound
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: mismatch ? "#e8192c" : pass2Focused ? "#e8192c" : "rgba(255,255,255,0.25)" }}
          />
          <input
            type={showPass ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            onFocus={() => setPass2Focused(true)}
            onBlur={() => setPass2Focused(false)}
            placeholder="Repeat password"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all"
            style={{
              border: `1.5px solid ${mismatch ? "#e8192c" : pass2Focused ? "rgba(232,25,44,0.5)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: pass2Focused ? "0 0 0 3px rgba(232,25,44,0.07)" : "none",
              fontSize: "0.92rem",
            }}
          />
          {!mismatch && confirmPass.length > 0 && newPass === confirmPass && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>
        {mismatch && <p className="mt-1.5 text-[#e8192c]" style={{ fontSize: "0.72rem" }}>Passwords do not match</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !newPass || mismatch || newPass !== confirmPass}
        className="w-full py-4 rounded-xl text-white transition-all duration-300 disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #e8192c, #c8111f)",
          fontSize: "0.88rem", fontWeight: 800, letterSpacing: "0.1em",
          boxShadow: "0 8px 28px rgba(232,25,44,0.35)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> UPDATING…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck size={15} /> UPDATE PASSWORD
          </span>
        )}
      </button>

      <Link to="/login" className="flex items-center justify-center gap-2 mt-5 text-white/25 hover:text-white/50 transition-colors" style={{ fontSize: "0.8rem" }}>
        <ArrowLeft size={13} /> Back to Login
      </Link>
    </div>
  );
}
