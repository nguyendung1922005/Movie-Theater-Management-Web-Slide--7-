import { useEffect, useState } from "react";
import { Popcorn, Tag, Gift, Ticket, Star, Sparkles, CheckCircle, X } from "lucide-react";

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
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [activePromo, setActivePromo] = useState<Promo | null>(null);

  // Kiểm tra xem voucher nào đã được lưu trong Ví
  useEffect(() => {
    const checkClaimed = () => {
      try {
        const list = JSON.parse(localStorage.getItem("claimedVouchers") || "[]").map(String);
        setClaimedIds(list);
      } catch(e) {}
    };
    checkClaimed();
    window.addEventListener("voucherClaimed", checkClaimed);
    return () => window.removeEventListener("voucherClaimed", checkClaimed);
  }, []);

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

  // Hàm lưu voucher trực tiếp
  const handleClaimDirectly = (promoId: string) => {
    if (claimedIds.includes(String(promoId))) return;
    try {
      const claimedList = JSON.parse(localStorage.getItem("claimedVouchers") || "[]").map(String);
      if (!claimedList.includes(String(promoId))) {
        claimedList.push(String(promoId));
        localStorage.setItem("claimedVouchers", JSON.stringify(claimedList));
        window.dispatchEvent(new Event("voucherClaimed"));
      }
    } catch(e) {}
  };

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
            const isClaimed = claimedIds.includes(String(promo.id));

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
                  className="mt-auto w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white transition-all duration-200 active:scale-[0.98] outline-none"
                  style={{
                    backgroundColor: isClaimed ? "#10b981" : promo.color,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  {isClaimed ? <CheckCircle size={16} /> : <Gift size={16} />}
                  {isClaimed ? "ĐÃ LƯU VÀO VÍ" : "CHI TIẾT VOUCHER"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup Modal Chi tiết Voucher */}
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
              
              <button 
                onClick={() => handleClaimDirectly(activePromo.id)}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{ 
                  backgroundColor: claimedIds.includes(String(activePromo.id)) ? "#10b981" : activePromo.color 
                }}
              >
                {claimedIds.includes(String(activePromo.id)) ? <CheckCircle size={18} /> : <Gift size={18} />}
                {claimedIds.includes(String(activePromo.id)) ? "ĐÃ LƯU VÀO VÍ" : "LƯU VOUCHER NÀY"}
              </button>
            </div>
          </div>
          <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
        </div>
      )}
    </section>
  );
}