import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { signIn, signUp, resetPassword, signInWithSocial, signInWithGoogleReal, signInWithFacebookReal } from "../../lib/auth";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import {
  Film,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Check,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
 
/* ─── Background images ──────────────────────────────── */
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1636755393526-a2249074de99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNpbmVtYXRpYyUyMGNpdHklMjBuaWdodCUyMGxpZ2h0cyUyMGF0bW9zcGhlcmljfGVufDF8fHx8MTc3MjU0ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1765029973087-11d8d63c6983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMHNjZW5pYyUyMGxhbmRzY2FwZSUyMGZhbnRhc3klMjBza3l8ZW58MXx8fHwxNzcyNTQ4MTA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1755756383664-af3cf523242b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMG1vdmllJTIwcG9zdGVyJTIwYXJ0JTIwY29sb3JmdWwlMjBkcmFtYXRpY3xlbnwxfHx8fDE3NzI1NDgxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
];
 
/* ─── Password strength helper ───────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];
  return { score, label: labels[score] || "", color: colors[score] || "" };
}
 
/* ─── Social icons ───────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
 
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
    </svg>
  );
}
 
/* ─── Social Button ───────────────────────────────────── */
function SocialButton({ icon, label, onClick, loading }: { icon: React.ReactNode; label: string; onClick?: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2.5 py-3 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/16 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.55)" }}
    >
      {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : icon}
      {loading ? "Connecting..." : label}
    </button>
  );
}
 
/* ─── Input Field ────────────────────────────────────── */
function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  autoComplete,
  suffix,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  error?: string;
  autoComplete?: string;
  suffix?: React.ReactNode;
}) {
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-white/60" style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em" }}>
        {label}
      </label>
      <div className="relative group">
        {/* Leading icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/25 group-focus-within:text-[#e8192c] transition-colors duration-200">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full pl-11 pr-${suffix ? "12" : "4"} py-3.5 rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 bg-white/5 border ${
            hasError
              ? "border-red-500/60 focus:border-red-500"
              : "border-white/8 focus:border-[#e8192c]/60 hover:border-white/15"
          } focus:bg-white/8`}
          style={{ fontSize: "0.84rem", letterSpacing: "0.02em" }}
        />
        {/* Suffix */}
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}
 
/* ─── Left Panel ─────────────────────────────────────── */
function LeftPanel({ mode }: { mode: "login" | "signup" }) {
  const [bgIdx, setBgIdx] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => setBgIdx((i) => (i + 1) % BG_IMAGES.length), 8000);
    return () => clearInterval(interval);
  }, []);
 
  const features = mode === "login"
    ? ["Personalized recommendations", "Exclusive member offers", "Quick rebooking", "Loyalty rewards"]
    : ["Create personalized watchlists", "Rate & review movies", "Track viewing history", "Join cinema community"];
 
  return (
    <div
      className="hidden lg:flex flex-1 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_IMAGES[bgIdx]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
        backgroundColor: "rgba(10,10,15,0.85)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
 
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />
 
      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ backgroundColor: "#e8192c" }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />
 
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center px-12 text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#e8192c] rounded-xl flex items-center justify-center shadow-2xl">
            <Film size={24} className="text-white" />
          </div>
          <span className="text-white uppercase" style={{ fontWeight: 900, fontSize: "1.8rem", letterSpacing: "0.15em" }}>
            CINEMA
          </span>
        </div>
        <h1 className="text-white mb-4" style={{ fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.02em" }}>
          {mode === "login" ? "Welcome Back" : "Join Cinema"}
        </h1>
        <p className="text-white/45 max-w-sm" style={{ fontSize: "0.92rem", lineHeight: 1.75 }}>
          {mode === "login"
            ? "Sign in to access your personalized dashboard, manage bookings, and discover exclusive member offers."
            : "Create your free account and step into a premium cinema experience tailored just for you."}
        </p>
 
        {/* Feature list */}
        <ul className="flex flex-col gap-3">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#e8192c]/20 border border-[#e8192c]/40 flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-[#e8192c]" />
              </div>
              <span className="text-white/50" style={{ fontSize: "0.83rem" }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
 
      {/* Bottom image indicator */}
      <div className="flex items-center gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setBgIdx(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === bgIdx ? "24px" : "6px",
              height: "6px",
              backgroundColor: i === bgIdx ? "#e8192c" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
 
/* ─── Login Form ─────────────────────────────────────── */
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const navigate = useNavigate();
 
  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: "Please enter your email address first" });
      return;
    }
 
    setResetLoading(true);
    const result = await resetPassword(email);
    setResetLoading(false);
 
    if (!result.success) {
      setErrors({ email: result.error });
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading("google");
      const result = await signInWithGoogleReal(tokenResponse.access_token);
      setSocialLoading(null);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setErrors({ email: result.error || "Google login failed" });
      }
    },
    onError: () => {
      setErrors({ email: "Google login cancelled or failed" });
    }
  });

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      loginWithGoogle();
      return;
    }
    setSocialLoading(provider);
    const result = await signInWithSocial(provider);
    setSocialLoading(null);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);
    }
  };
 
  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
 
    setLoading(true);
    setErrors({});
 
    const result = await signIn(email, password);
 
    if (result.success) {
      setSuccess(true);
      // Navigate after a short delay to show success state
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      // Set error message from auth result
      if (result.error?.includes("email")) {
        setErrors({ email: result.error });
      } else if (result.error?.includes("password")) {
        setErrors({ password: result.error });
      } else {
        setErrors({ email: result.error || "Login failed" });
      }
    }
 
    setLoading(false);
  };
 
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <InputField
        id="login-email"
        label="EMAIL ADDRESS"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail size={16} />}
        error={errors.email}
        autoComplete="email"
      />
      <InputField
        id="login-password"
        label="PASSWORD"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        icon={<Lock size={16} />}
        error={errors.password}
        autoComplete="current-password"
        suffix={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-white/25 hover:text-white/60 transition-colors p-1"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />
 
      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => setRemember((v) => !v)}
            className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              remember ? "bg-[#e8192c] border-[#e8192c]" : "border-white/20 hover:border-white/40"
            }`}
            style={{ width: "18px", height: "18px" }}
          >
            {remember && <Check size={10} className="text-white" />}
          </div>
          <span className="text-white/40 group-hover:text-white/60 transition-colors select-none" style={{ fontSize: "0.78rem" }}>
            Remember me
          </span>
        </label>
        <button 
          type="button" 
          onClick={handleForgotPassword}
          disabled={resetLoading}
          className="text-[#e8192c] hover:text-[#ff2d41] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          style={{ fontSize: "0.78rem", fontWeight: 600 }}
        >
          {resetLoading ? "Sending..." : "Forgot password?"}
        </button>
      </div>
 
      {/* Submit */}
      <button
        type="submit"
        disabled={loading || success}
        className={`relative w-full py-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden ${
          success ? "bg-green-500" : "bg-[#e8192c] hover:bg-[#c8111f] active:scale-[0.99]"
        } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
        style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.12em" }}
      >
        {/* Shimmer */}
        {!loading && !success && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
              animation: "shimmer 2.5s infinite",
            }}
          />
        )}
        {loading ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : success ? (
          <>
            <Check size={17} />
            SIGNED IN!
          </>
        ) : (
          <>
            SIGN IN
            <ArrowRight size={17} />
          </>
        )}
      </button>
 
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-white/25" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>OR SIGN IN WITH</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
 
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton 
          icon={<GoogleIcon />} 
          label="Google" 
          onClick={() => handleSocialLogin('google')}
          loading={socialLoading === 'google'}
        />
        <FacebookLogin
          appId={(import.meta as any).env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
          scope="public_profile,email"
          onSuccess={async (response) => {
            setSocialLoading("facebook");
            const result = await signInWithFacebookReal(response.accessToken);
            setSocialLoading(null);
            if (result.success) {
              setSuccess(true);
              setTimeout(() => navigate("/"), 1000);
            }
          }}
          onFail={(error) => setErrors({ email: "Facebook login cancelled or failed" })}
          render={({ onClick }) => (
            <SocialButton 
              icon={<FacebookIcon />} 
              label="Facebook" 
              onClick={onClick}
              loading={socialLoading === 'facebook'}
            />
          )}
        />
      </div>
 
      {/* Switch */}
      <p className="text-center text-white/35" style={{ fontSize: "0.82rem" }}>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#e8192c] hover:text-[#ff2d41] transition-colors" style={{ fontWeight: 700 }}>
          Sign up free
        </button>
      </p>
    </form>
  );
}
 
/* ─── Sign Up Form ───────────────────────────────────── */
function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; agree?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);
  const navigate = useNavigate();
 
  const strength = getStrength(password);
 
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading("google");
      const result = await signInWithGoogleReal(tokenResponse.access_token);
      setSocialLoading(null);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setErrors({ email: result.error || "Google sign up failed" });
      }
    },
    onError: () => {
      setErrors({ email: "Google sign up cancelled or failed" });
    }
  });

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      loginWithGoogle();
      return;
    }
    setSocialLoading(provider);
    const result = await signInWithSocial(provider);
    setSocialLoading(null);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);
    }
  };
 
  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!confirmPw) e.confirm = "Please confirm your password";
    else if (confirmPw !== password) e.confirm = "Passwords do not match";
    if (!agree) e.agree = "You must accept the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
 
    setLoading(true);
    setErrors({});
 
    const result = await signUp(email, password, name, "customer");
 
    if (result.success) {
      setSuccess(true);
      // Navigate after a short delay to show success state
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      // Set error message from auth result
      if (result.error?.includes("email")) {
        setErrors({ email: result.error });
      } else if (result.error?.includes("password")) {
        setErrors({ password: result.error });
      } else if (result.error?.includes("name")) {
        setErrors({ name: result.error });
      } else {
        setErrors({ email: result.error || "Registration failed" });
      }
    }
 
    setLoading(false);
  };
 
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <InputField
        id="su-name"
        label="FULL NAME"
        value={name}
        onChange={setName}
        placeholder="John Doe"
        icon={<User size={16} />}
        error={errors.name}
        autoComplete="name"
      />
      <InputField
        id="su-email"
        label="EMAIL ADDRESS"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail size={16} />}
        error={errors.email}
        autoComplete="email"
      />
      <div className="flex flex-col gap-1.5">
        <InputField
          id="su-password"
          label="PASSWORD"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={setPassword}
          placeholder="Min. 8 characters"
          icon={<Lock size={16} />}
          error={errors.password}
          autoComplete="new-password"
          suffix={
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-white/25 hover:text-white/60 transition-colors p-1">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />
        {/* Strength bar */}
        {password && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: n <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }}
                />
              ))}
            </div>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: strength.color, minWidth: "38px" }}>
              {strength.label}
            </span>
          </div>
        )}
      </div>
      <InputField
        id="su-confirm"
        label="CONFIRM PASSWORD"
        type={showConfirm ? "text" : "password"}
        value={confirmPw}
        onChange={setConfirmPw}
        placeholder="Repeat your password"
        icon={<Lock size={16} />}
        error={errors.confirm}
        autoComplete="new-password"
        suffix={
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-white/25 hover:text-white/60 transition-colors p-1">
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />
 
      {/* Terms */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <div
            onClick={() => setAgree((v) => !v)}
            className={`mt-0.5 w-[18px] h-[18px] rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              agree ? "bg-[#e8192c] border-[#e8192c]" : "border-white/20 hover:border-white/40"
            }`}
          >
            {agree && <Check size={10} className="text-white" />}
          </div>
          <span className="text-white/35 group-hover:text-white/50 transition-colors select-none" style={{ fontSize: "0.77rem", lineHeight: 1.5 }}>
            I agree to the{" "}
            <a href="#" className="text-[#e8192c] hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-[#e8192c] hover:underline">Privacy Policy</a>
          </span>
        </label>
        {errors.agree && (
          <div className="flex items-center gap-1.5 text-red-400" style={{ fontSize: "0.72rem" }}>
            <AlertCircle size={11} />
            {errors.agree}
          </div>
        )}
      </div>
 
      {/* Submit */}
      <button
        type="submit"
        disabled={loading || success}
        className={`relative w-full py-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden mt-1 ${
          success ? "bg-green-500" : "bg-[#e8192c] hover:bg-[#c8111f] active:scale-[0.99]"
        } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
        style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.12em" }}
      >
        {!loading && !success && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
              animation: "shimmer 2.5s infinite",
            }}
          />
        )}
        {loading ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : success ? (
          <><Check size={17} />ACCOUNT CREATED!</>
        ) : (
          <>CREATE ACCOUNT<ArrowRight size={17} /></>
        )}
      </button>
 
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-white/25" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>OR SIGN UP WITH</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
 
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton 
          icon={<GoogleIcon />} 
          label="Google" 
          onClick={() => handleSocialLogin('google')}
          loading={socialLoading === 'google'}
        />
        <FacebookLogin
          appId={(import.meta as any).env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
          scope="public_profile,email"
          onSuccess={async (response) => {
            setSocialLoading("facebook");
            const result = await signInWithFacebookReal(response.accessToken);
            setSocialLoading(null);
            if (result.success) {
              setSuccess(true);
              setTimeout(() => navigate("/"), 1000);
            }
          }}
          onFail={(error) => setErrors({ email: "Facebook sign up cancelled or failed" })}
          render={({ onClick }) => (
            <SocialButton 
              icon={<FacebookIcon />} 
              label="Facebook" 
              onClick={onClick}
              loading={socialLoading === 'facebook'}
            />
          )}
        />
      </div>
 
      {/* Switch */}
      <p className="text-center text-white/35" style={{ fontSize: "0.82rem" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-[#e8192c] hover:text-[#ff2d41] transition-colors" style={{ fontWeight: 700 }}>
          Sign in
        </button>
      </p>
    </form>
  );
}
 
/* ─── Right Panel ────────────────────────────────────── */
function RightPanel({ mode, onSwitch }: { mode: "login" | "signup"; onSwitch: () => void }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      {/* Subtle bg glow */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-[0.06] blur-3xl pointer-events-none" style={{ backgroundColor: "#e8192c" }} />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-[0.04] blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />
 
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-[#e8192c] rounded-lg flex items-center justify-center">
          <Film size={15} className="text-white" />
        </div>
        <span className="text-white uppercase" style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "0.25em" }}>
          CINEMA
        </span>
      </div>
 
      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/8 p-8 md:p-10"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full opacity-30" style={{ backgroundColor: "#e8192c", filter: "blur(24px)" }} />
        </div>
 
        {/* Header */}
        <div className="mb-8 relative">
          {/* Mode tabs */}
          <div className="flex rounded-xl bg-white/4 border border-white/6 p-1 mb-7">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => m !== mode && onSwitch()}
                className="flex-1 py-2.5 rounded-lg transition-all duration-250"
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  backgroundColor: mode === m ? "#e8192c" : "transparent",
                  color: mode === m ? "white" : "rgba(255,255,255,0.3)",
                }}
              >
                {m === "login" ? "SIGN IN" : "SIGN UP"}
              </button>
            ))}
          </div>
 
          <div
            key={mode}
            style={{ animation: "fadeSlideIn 0.3s ease" }}
          >
            <h2 className="text-white mb-1.5" style={{ fontWeight: 800, fontSize: "1.55rem", letterSpacing: "-0.02em" }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/35" style={{ fontSize: "0.83rem" }}>
              {mode === "login"
                ? "Sign in to your Cinema account to continue."
                : "Join millions enjoying premium cinema experiences."}
            </p>
          </div>
        </div>
 
        {/* Form with animated transition */}
        <div key={mode} style={{ animation: "fadeSlideIn 0.35s ease" }}>
          {mode === "login" ? (
            <LoginForm onSwitch={onSwitch} />
          ) : (
            <SignupForm onSwitch={onSwitch} />
          )}
        </div>
      </div>
 
      {/* Back to home */}
      <Link
        to="/"
        className="mt-6 flex items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors"
        style={{ fontSize: "0.78rem" }}
      >
        <ChevronLeft size={13} />
        Back to Home
      </Link>
    </div>
  );
}
 
/* ─── Page ───────────────────────────────────────────── */
export function Auth() {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initial);
 
  return (
    <GoogleOAuthProvider clientId={(import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="min-h-screen flex" style={{ backgroundColor: "#0a0a0f" }}>
        <LeftPanel mode={mode} />
        <RightPanel mode={mode} onSwitch={() => setMode((m) => (m === "login" ? "signup" : "login"))} />
 
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          .duration-1500 { transition-duration: 1500ms; }
          .duration-250  { transition-duration: 250ms; }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
}