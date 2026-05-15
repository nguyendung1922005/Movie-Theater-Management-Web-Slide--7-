import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Ticket,
  UtensilsCrossed,
  Crown,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  Copy,
  Sparkles,
  Gift,
  Zap,
  BadgePercent,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
type Category = "All" | "Ticket Deals" | "Food & Drink" | "Membership" | "Special Events";

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  badgeColor: string;
  category: Category;
  discount: string;
  validFrom: string;
  validTo: string;
  code?: string;
  isHot?: boolean;
  isNew?: boolean;
  conditions: string[];
}

/* ─── Data ───────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    tag: "LIMITED TIME",
    title: "Student Discount",
    subtitle: "Giảm 30% cho sinh viên",
    description:
      "Show your valid student ID and enjoy 30% off any ticket purchase. Valid for all screenings Monday–Thursday.",
    discount: "30% OFF",
    cta: "CLAIM NOW",
    code: "STUDENT30",
    bg: "https://images.unsplash.com/photo-1732029541807-1eede3bec4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGlzY291bnQlMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzcyNTQ2NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#e8192c",
    icon: <Tag size={20} />,
  },
  {
    id: 2,
    tag: "DEAL OF THE WEEK",
    title: "Combo Deal",
    subtitle: "Bắp + Nước + 2 Vé chỉ 199K",
    description:
      "Get 2 tickets + large popcorn + 2 drinks at an unbeatable price. Available every weekend for a limited time.",
    discount: "SAVE 45%",
    cta: "GET COMBO",
    code: "COMBO45",
    bg: "https://images.unsplash.com/photo-1670737940853-0ce76fc0d54d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwb3Bjb3JuJTIwY29tYm8lMjBkZWFsfGVufDF8fHx8MTc3MjU0Njc0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#f59e0b",
    icon: <UtensilsCrossed size={20} />,
  },
  {
    id: 3,
    tag: "EXCLUSIVE",
    title: "VIP Membership",
    subtitle: "Ưu đãi thành viên VIP",
    description:
      "Join our VIP club and unlock premium seating, exclusive screenings, priority booking, and monthly free tickets.",
    discount: "FREE JOIN",
    cta: "JOIN NOW",
    code: "VIPFREE",
    bg: "https://images.unsplash.com/photo-1710131459450-7c384b8be18f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBsdXh1cnklMjBwcmVtaXVtJTIwY2luZW1hJTIwZXhwZXJpZW5jZXxlbnwxfHx8fDE3NzI1NDY3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#8b5cf6",
    icon: <Crown size={20} />,
  },
];

const PROMOS: Promo[] = [
  {
    id: 1,
    title: "Member Day – Tặng Bắp",
    subtitle: "Free popcorn every Monday",
    description:
      "Members get a complimentary medium popcorn every Monday with any ticket purchase. Show your membership card at the counter.",
    image:
      "https://images.unsplash.com/photo-1670737940853-0ce76fc0d54d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwb3Bjb3JuJTIwY29tYm8lMjBkZWFsfGVufDF8fHx8MTc3MjU0Njc0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "MEMBERS ONLY",
    badgeColor: "#8b5cf6",
    category: "Membership",
    discount: "FREE ITEM",
    validFrom: "Mar 1, 2026",
    validTo: "Mar 31, 2026",
    code: "MEMBERMON",
    isHot: true,
    conditions: ["Valid Mondays only", "One per member per day", "Medium size popcorn"],
  },
  {
    id: 2,
    title: "Student Discount",
    subtitle: "30% off for students",
    description:
      "Present a valid student ID to receive 30% off your ticket. Applicable Mon–Thu on all standard and 3D screenings.",
    image:
      "https://images.unsplash.com/photo-1732029541807-1eede3bec4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGlzY291bnQlMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzcyNTQ2NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "TICKET DEAL",
    badgeColor: "#e8192c",
    category: "Ticket Deals",
    discount: "30% OFF",
    validFrom: "Feb 1, 2026",
    validTo: "Apr 30, 2026",
    code: "STUDENT30",
    isNew: true,
    conditions: ["Valid student ID required", "Mon–Thu only", "Not valid on holidays"],
  },
  {
    id: 3,
    title: "Couple's Night Out",
    subtitle: "2 tickets + drinks for couples",
    description:
      "Bring your partner and enjoy a romantic movie night — 2 premium tickets + 2 signature cocktails at a special price.",
    image:
      "https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMG5pZ2h0JTIwY291cGxlJTIwcG9wY29ybnxlbnwxfHx8fDE3NzI1NDY3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "ROMANTIC",
    badgeColor: "#e8192c",
    category: "Ticket Deals",
    discount: "SAVE 25%",
    validFrom: "Mar 1, 2026",
    validTo: "Mar 14, 2026",
    code: "COUPLE25",
    isHot: true,
    conditions: ["Fri–Sun evenings", "Advance booking required", "Select screens only"],
  },
  {
    id: 4,
    title: "Birthday Bonanza",
    subtitle: "Free ticket on your birthday month",
    description:
      "Celebrate your birthday with us! Show your ID and get one free ticket during your birthday month. Cake optional.",
    image:
      "https://images.unsplash.com/photo-1700701982617-cdc730361997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNlbGVicmF0aW9uJTIwc3BlY2lhbCUyMG9mZmVyfGVufDF8fHx8MTc3MjU0Njc0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "BIRTHDAY",
    badgeColor: "#f59e0b",
    category: "Special Events",
    discount: "1 FREE TICKET",
    validFrom: "Jan 1, 2026",
    validTo: "Dec 31, 2026",
    code: "BDAY2026",
    conditions: ["Must match birthday month", "Valid ID required", "Standard screens only"],
  },
  {
    id: 5,
    title: "Family Pack",
    subtitle: "4 tickets + 2 combos",
    description:
      "Make family movie day special — 4 tickets + 2 large popcorns + 4 drinks bundled at one incredible price.",
    image:
      "https://images.unsplash.com/photo-1771574203200-0ec88f162fe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBtb3ZpZSUyMHRoZWF0ZXIlMjBzZWF0c3xlbnwxfHx8fDE3NzI1NDY3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "FAMILY",
    badgeColor: "#10b981",
    category: "Ticket Deals",
    discount: "SAVE 35%",
    validFrom: "Mar 1, 2026",
    validTo: "May 31, 2026",
    code: "FAMILY35",
    isNew: true,
    conditions: ["Min. 4 tickets required", "Weekend screenings only", "Pre-booking only"],
  },
  {
    id: 6,
    title: "Snack Fiesta",
    subtitle: "Tặng kèm nachos & sauce",
    description:
      "Buy any large combo and get a free nachos + dipping sauce combo. The ultimate snack upgrade for your movie night.",
    image:
      "https://images.unsplash.com/photo-1686976703258-930ffa4fd7c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmluayUyMG5hY2hvcyUyMHNuYWNrcyUyMGNpbmVtYSUyMGZvb2R8ZW58MXx8fHwxNzcyNTQ2NzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "FOOD DEAL",
    badgeColor: "#f59e0b",
    category: "Food & Drink",
    discount: "FREE NACHOS",
    validFrom: "Mar 10, 2026",
    validTo: "Mar 31, 2026",
    code: "SNACK10",
    isHot: true,
    conditions: ["Purchase large combo", "One per transaction", "In-cinema only"],
  },
  {
    id: 7,
    title: "Weekend Early Bird",
    subtitle: "First show of the day – 40% off",
    description:
      "Be the early bird! Grab 40% off on the very first screening each day, Friday through Sunday.",
    image:
      "https://images.unsplash.com/photo-1538905386057-4a5a580c45a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWVrZW5kJTIwc3BlY2lhbCUyMGRlYWwlMjBjaW5lbWElMjB0aWNrZXRzfGVufDF8fHx8MTc3MjU0Njc0OHww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "EARLY BIRD",
    badgeColor: "#06b6d4",
    category: "Ticket Deals",
    discount: "40% OFF",
    validFrom: "Mar 7, 2026",
    validTo: "Apr 30, 2026",
    code: "EARLY40",
    conditions: ["First showtime only", "Fri–Sun", "Limited seats per show"],
  },
  {
    id: 8,
    title: "VIP Membership",
    subtitle: "Ưu đãi hội viên cao cấp",
    description:
      "Join VIP today — enjoy unlimited priority booking, exclusive screenings, premium lounge access, and a monthly free ticket.",
    image:
      "https://images.unsplash.com/photo-1710131459450-7c384b8be18f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBsdXh1cnklMjBwcmVtaXVtJTIwY2luZW1hJTIwZXhwZXJpZW5jZXxlbnwxfHx8fDE3NzI1NDY3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "VIP",
    badgeColor: "#8b5cf6",
    category: "Membership",
    discount: "FREE JOIN",
    validFrom: "Jan 1, 2026",
    validTo: "Dec 31, 2026",
    code: "VIPFREE",
    conditions: ["Annual subscription", "Includes lounge access", "1 free ticket/month"],
  },
  {
    id: 9,
    title: "Loyalty Points Bonus",
    subtitle: "2x điểm thưởng mỗi thứ Tư",
    description:
      "Every Wednesday is double-points day! All purchases earn 2× loyalty points — redeem for free tickets and snacks.",
    image:
      "https://images.unsplash.com/photo-1518206075495-4e901709d372?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW1iZXJzaGlwJTIwbG95YWx0eSUyMGNhcmQlMjByZXdhcmRzfGVufDF8fHx8MTc3MjU0Njc0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    badge: "LOYALTY",
    badgeColor: "#10b981",
    category: "Membership",
    discount: "2× POINTS",
    validFrom: "Mar 1, 2026",
    validTo: "Jun 30, 2026",
    code: "DOUBLE2X",
    isNew: true,
    conditions: ["Wednesdays only", "Members only", "Points expire after 6 months"],
  },
];

const CATEGORIES: { label: Category | "All"; icon: React.ReactNode }[] = [
  { label: "All", icon: <Tag size={15} /> },
  { label: "Ticket Deals", icon: <Ticket size={15} /> },
  { label: "Food & Drink", icon: <UtensilsCrossed size={15} /> },
  { label: "Membership", icon: <Crown size={15} /> },
  { label: "Special Events", icon: <Sparkles size={15} /> },
];

/* ─── Copied code badge ──────────────────────────────── */
function CodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1 rounded border border-dashed border-white/20 bg-white/5 hover:border-[#e8192c]/60 hover:bg-[#e8192c]/10 transition-all duration-200 group/code"
    >
      <span className="text-white/50 group-hover/code:text-white/80 font-mono transition-colors" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
        {code}
      </span>
      {copied ? (
        <CheckCircle size={11} className="text-green-400" />
      ) : (
        <Copy size={11} className="text-white/30 group-hover/code:text-white/60 transition-colors" />
      )}
    </button>
  );
}

/* ─── Promo Card ─────────────────────────────────────── */
function PromoCard({ promo, onClaim }: { promo: Promo; onClaim: (p: Promo) => void }) {
  return (
    <div className="group relative bg-[#111118] rounded-2xl overflow-hidden border border-white/6 hover:border-white/15 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/20 to-transparent" />
        {/* Badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded text-white flex items-center gap-1.5"
          style={{ backgroundColor: promo.badgeColor, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em" }}
        >
          {promo.badge}
        </div>
        {/* Hot / New tag */}
        {(promo.isHot || promo.isNew) && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              backgroundColor: promo.isHot ? "#e8192c" : "#10b981",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.08em",
            }}
          >
            {promo.isHot ? <Zap size={10} /> : <Sparkles size={10} />}
            {promo.isHot ? "HOT" : "NEW"}
          </div>
        )}
        {/* Discount pill */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
          <span className="text-white" style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.06em" }}>
            {promo.discount}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title */}
        <div>
          <h3 className="text-white mb-0.5" style={{ fontWeight: 700, fontSize: "1rem" }}>
            {promo.title}
          </h3>
          <p className="text-[#e8192c]" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
            {promo.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-white/45 flex-1" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
          {promo.description}
        </p>

        {/* Validity */}
        <div className="flex items-center gap-2 text-white/35" style={{ fontSize: "0.76rem" }}>
          <Calendar size={12} className="text-[#e8192c] flex-shrink-0" />
          <span>
            {promo.validFrom} – {promo.validTo}
          </span>
        </div>

        {/* Code */}
        {promo.code && (
          <div className="flex items-center gap-2">
            <span className="text-white/30" style={{ fontSize: "0.72rem" }}>Code:</span>
            <CodeBadge code={promo.code} />
          </div>
        )}

        {/* Conditions */}
        <div className="flex flex-wrap gap-1.5">
          {promo.conditions.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/8"
              style={{ fontSize: "0.68rem" }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onClaim(promo)}
          className="mt-1 w-full py-3 rounded-xl bg-[#e8192c] hover:bg-[#c8111f] active:scale-[0.98] text-white transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.1em" }}
        >
          <Gift size={15} className="group-hover/btn:scale-110 transition-transform duration-200" />
          CLAIM OFFER
        </button>
      </div>
    </div>
  );
}

/* ─── Claim Modal ────────────────────────────────────── */
function ClaimModal({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!promo.code) return;
    navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#111118] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.25s ease" }}
      >
        {/* Image header */}
        <div className="relative h-40 overflow-hidden">
          <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111118] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-4">
            <span
              className="px-2.5 py-1 rounded text-white"
              style={{ backgroundColor: promo.badgeColor, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em" }}
            >
              {promo.badge}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-white mb-1" style={{ fontWeight: 800, fontSize: "1.25rem" }}>
              {promo.title}
            </h2>
            <p className="text-[#e8192c]" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
              {promo.subtitle}
            </p>
          </div>

          <p className="text-white/50" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
            {promo.description}
          </p>

          {/* Validity */}
          <div className="flex items-center gap-2 text-white/40" style={{ fontSize: "0.8rem" }}>
            <Clock size={13} className="text-[#e8192c]" />
            Valid: {promo.validFrom} – {promo.validTo}
          </div>

          {/* Code */}
          {promo.code && (
            <div className="rounded-xl bg-white/5 border border-dashed border-white/15 p-4 flex items-center justify-between">
              <div>
                <p className="text-white/30 mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}>PROMO CODE</p>
                <span className="text-white font-mono" style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                  {promo.code}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#e8192c]/15 hover:bg-[#e8192c]/25 border border-[#e8192c]/30 text-[#e8192c] transition-all"
                style={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {/* Conditions */}
          <div>
            <p className="text-white/30 mb-2 uppercase" style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em" }}>
              Terms & Conditions
            </p>
            <ul className="flex flex-col gap-1.5">
              {promo.conditions.map((c) => (
                <li key={c} className="flex items-center gap-2 text-white/40" style={{ fontSize: "0.78rem" }}>
                  <span className="w-1 h-1 rounded-full bg-[#e8192c] flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#e8192c] hover:bg-[#c8111f] active:scale-[0.98] text-white transition-all duration-200"
            style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em" }}
          >
            GOT IT, LET'S GO
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn { from { opacity: 0; transform: scale(0.94) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}

/* ─── Hero Carousel ──────────────────────────────────── */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent((idx + HERO_SLIDES.length) % HERO_SLIDES.length);
      setTimeout(() => setAnimating(false), 500);
    },
    [animating]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const slide = HERO_SLIDES[current];

  return (
    <div className="relative h-[520px] md:h-[600px] overflow-hidden">
      {/* BG image with transition */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img src={s.bg} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-screen-xl mx-auto px-6 flex items-center">
        <div
          key={current}
          className="max-w-xl"
          style={{ animation: "slideIn 0.5s ease" }}
        >
          {/* Tag */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: slide.accent, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em" }}
            >
              {slide.icon}
              {slide.tag}
            </div>
          </div>
          {/* Title */}
          <h1 className="text-white mb-2" style={{ fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {slide.title}
          </h1>
          <p className="mb-3" style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", fontWeight: 600, color: slide.accent }}>
            {slide.subtitle}
          </p>
          <p className="text-white/55 mb-6 max-w-md" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
            {slide.description}
          </p>
          {/* Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: slide.accent, fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em" }}
            >
              <Gift size={17} />
              {slide.cta}
            </button>
            {slide.code && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/8 border border-white/12 backdrop-blur-sm">
                <BadgePercent size={15} className="text-white/50" />
                <span className="text-white/70 font-mono" style={{ fontSize: "0.85rem", letterSpacing: "0.1em" }}>
                  {slide.code}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/30" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
        {String(current + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
      </div>

      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

/* ─── Stats Bar ──────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { icon: <Tag size={18} className="text-[#e8192c]" />, value: "24+", label: "Active Offers" },
    { icon: <Users size={18} className="text-[#e8192c]" />, value: "50K+", label: "Happy Members" },
    { icon: <Ticket size={18} className="text-[#e8192c]" />, value: "Up to 40%", label: "Max Savings" },
    { icon: <Clock size={18} className="text-[#e8192c]" />, value: "Daily", label: "New Deals" },
  ];
  return (
    <div className="bg-[#0e0e15] border-y border-white/5">
      <div className="max-w-screen-xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e8192c]/10 flex items-center justify-center flex-shrink-0">
              {s.icon}
            </div>
            <div>
              <div className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>{s.value}</div>
              <div className="text-white/35" style={{ fontSize: "0.75rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export function Promotions() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [claimTarget, setClaimTarget] = useState<Promo | null>(null);

  const filtered =
    activeCategory === "All"
      ? PROMOS
      : PROMOS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0f" }}>
      <Header />

      {/* Hero */}
      <div className="pt-16">
        <HeroCarousel />
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-0.5 bg-[#e8192c]" />
              <span className="text-[#e8192c] uppercase" style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em" }}>
                Exclusive Deals
              </span>
            </div>
            <h2 className="text-white" style={{ fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              Current Promotions
            </h2>
          </div>
          <p className="text-white/35" style={{ fontSize: "0.85rem" }}>
            {filtered.length} offer{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {CATEGORIES.map(({ label, icon }) => {
            const active = activeCategory === label;
            return (
              <button
                key={label}
                onClick={() => setActiveCategory(label as Category | "All")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? "#e8192c" : "transparent",
                  borderColor: active ? "#e8192c" : "rgba(255,255,255,0.1)",
                  color: active ? "white" : "rgba(255,255,255,0.45)",
                  letterSpacing: "0.03em",
                }}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((promo) => (
              <PromoCard key={promo.id} promo={promo} onClaim={setClaimTarget} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-white/25">
            <Tag size={40} className="mb-4 opacity-30" />
            <p style={{ fontSize: "1rem" }}>No promotions in this category right now.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 relative rounded-2xl overflow-hidden border border-white/8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8192c]/20 via-[#e8192c]/5 to-transparent" />
          <div className="relative px-8 md:px-14 py-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <Sparkles size={16} className="text-[#e8192c]" />
                <span className="text-[#e8192c] uppercase" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em" }}>
                  Never Miss a Deal
                </span>
              </div>
              <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}>
                Get Exclusive Offers First
              </h3>
              <p className="text-white/40" style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
                Subscribe to our newsletter and be the first to know about flash sales, member days, and limited-time combo deals.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-white/25 outline-none focus:border-[#e8192c]/50 transition-colors"
                style={{ fontSize: "0.88rem" }}
              />
              <button
                className="px-5 py-3 rounded-xl bg-[#e8192c] hover:bg-[#c8111f] text-white transition-all duration-200 active:scale-95 flex-shrink-0"
                style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em" }}
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {claimTarget && (
        <ClaimModal promo={claimTarget} onClose={() => setClaimTarget(null)} />
      )}
    </div>
  );
}
