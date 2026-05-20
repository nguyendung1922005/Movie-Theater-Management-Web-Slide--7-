import { useEffect, useState } from "react";
import { Popcorn, Tag, Gift, Ticket, Star, Sparkles } from "lucide-react";

// 1. Từ điển dịch chữ từ DB thành Icon thật
const ICON_MAP: Record<string, any> = {
  Ticket,
  Gift,
  Tag,
  Popcorn,
  Star,
  Sparkles
};

// Khai báo khuôn mẫu dữ liệu
interface Promo {
  id: string;
  title: string;
  desc: string;
  cta: string;
  icon: string;
  color: string;
}

export function PromoBanner() {
  const [promos, setPromos] = useState<Promo[]>([]);

  // 2. Gọi món từ Backend
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/promotions');
        const json = await res.json();
        if (json.success && json.data) {
          setPromos(json.data);
        }
      } catch (error) {
        console.error("Lỗi lấy data promo:", error);
      }
    };
    fetchPromos();
  }, []);

  // Nếu DB chưa có khuyến mãi nào thì ẩn section này đi cho đỡ trống
  if (promos.length === 0) return null;

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

        {/* Danh sách Khuyến Mãi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {promos.map((promo) => {
            // Lấy Icon tương ứng từ từ điển, nếu ghi sai tên thì mặc định lấy Tag
            const IconComponent = ICON_MAP[promo.icon] || Tag;

            return (
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
                  <IconComponent size={20} style={{ color: promo.color }} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}