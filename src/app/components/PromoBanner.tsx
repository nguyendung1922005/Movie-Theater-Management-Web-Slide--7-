import { Popcorn, Tag, Gift, Ticket } from "lucide-react";

const PROMOS = [
  {
    id: 1,
    icon: Ticket,
    title: "Tuesday Special",
    desc: "All tickets at half price every Tuesday. Unlimited genres.",
    cta: "Get Deal",
    color: "#e8192c",
  },
  {
    id: 2,
    icon: Gift,
    title: "Membership Card",
    desc: "Join CINEMA+ for exclusive screenings, discounts & rewards.",
    cta: "Join Now",
    color: "#7b2d8b",
  },
  {
    id: 3,
    icon: Tag,
    title: "Group Booking",
    desc: "Book 5 or more seats and get 20% off on all combo meals.",
    cta: "Book Group",
    color: "#c47a00",
  },
];

export function PromoBanner() {
  return (
    <section className="bg-[#0a0a0f] py-16 px-6 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 rounded bg-[#e8192c]" />
            <span
              className="text-[#e8192c] uppercase"
              style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em" }}
            >
              Deals & Offers
            </span>
          </div>
          <h2
            className="text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Promotions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMOS.map((promo) => (
            <div
              key={promo.id}
              className="relative group p-6 rounded-xl bg-[#111118] border border-white/5 hover:border-white/10 overflow-hidden transition-all duration-300"
            >
              {/* BG glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
                style={{ backgroundColor: promo.color }}
              />

              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: `${promo.color}20`, border: `1px solid ${promo.color}30` }}
              >
                <promo.icon size={20} style={{ color: promo.color }} />
              </div>

              <h3 className="text-white mb-2" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                {promo.title}
              </h3>
              <p className="text-white/50 mb-5" style={{ fontSize: "0.88rem", lineHeight: 1.6 }}>
                {promo.desc}
              </p>

              <button
                className="px-5 py-2 rounded text-white transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: promo.color,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {promo.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
