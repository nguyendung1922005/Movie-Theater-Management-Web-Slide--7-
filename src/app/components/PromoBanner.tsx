import { useEffect, useState } from "react";
import { Popcorn, Tag, Gift, Ticket, Star, Sparkles, X, CheckCircle, Copy } from "lucide-react";

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
  const [activePromo, setActivePromo] = useState<Promo | null>(null);
  const [copied, setCopied] = useState(false);

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
                  onClick={() => setActivePromo(promo)}
                  className="inline-block px-5 py-2 rounded text-white transition-all duration-200 hover:brightness-110 active:scale-95 text-center outline-none"
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

      {/* Popup Modal Nhận Mã */}
      {activePromo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={() => setActivePromo(null)}>
          <div onClick={e => e.stopPropagation()} className="relative bg-[#111118] rounded-3xl border border-white/10 w-full max-w-sm overflow-hidden" style={{ animation: "popIn 0.3s cubic-bezier(0.34, 1.4, 0.64, 1)" }}>
            <div className="h-2 w-full" style={{ backgroundColor: activePromo.color }} />
            <div className="p-6">
              <button onClick={() => setActivePromo(null)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <X size={16} />
              </button>
              
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${activePromo.color}20`, border: `1px solid ${activePromo.color}40` }}>
                {(() => { const Ico = ICON_MAP[activePromo.icon] || Tag; return <Ico size={20} style={{ color: activePromo.color }} />; })()}
              </div>
              
              <h2 className="text-white font-bold text-xl mb-2">{activePromo.title}</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">{activePromo.desc}</p>
              
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-4">
                <div>
                  <p className="text-white/30 text-xs font-bold tracking-wider mb-1">MÃ KHUYẾN MÃI</p>
                  <p className="text-white font-mono text-xl font-black tracking-widest">
                    CINE{String(activePromo.id).substring(0, 4).toUpperCase() || "VIP"}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`CINE${String(activePromo.id).substring(0, 4).toUpperCase() || "VIP"}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
                  style={{ backgroundColor: activePromo.color }}
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? "Đã copy" : "Copy mã"}
                </button>
              </div>
            </div>
          </div>
          <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        </div>
      )}
    </section>
  );
}