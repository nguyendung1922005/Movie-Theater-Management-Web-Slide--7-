import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import {
  ChevronLeft, Check, Clock, Calendar, Crown,
  Plus, Minus, Film, Ticket, ChevronDown, ArrowRight,
} from "lucide-react";

const CONVENIENCE_FEE = 15000;
const TAX_RATE = 0.10;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

export interface OrderData {
  movie: { id: string; title: string; posterUrl: string };
  showtime: { id: string; date: string; time: string; format: string; room: string };
  seats: Array<{ id: string; seatName: string; tier: string; price: number; color: string }>; 
}

function ProgressBar({ current }: { current: number }) {
  const steps = ["Select Seats", "Review", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300" style={{ backgroundColor: done ? "#e8192c" : active ? "rgba(232,25,44,0.15)" : "rgba(255,255,255,0.05)", border: active || done ? "2px solid #e8192c" : "2px solid rgba(255,255,255,0.1)" }}>
                {done ? <Check size={14} className="text-white" strokeWidth={3} /> : <span className={active ? "text-[#e8192c]" : "text-white/25"} style={{ fontSize: "0.72rem", fontWeight: 700 }}>{idx + 1}</span>}
              </div>
              <span className={active ? "text-white" : done ? "text-[#e8192c]" : "text-white/25"} style={{ fontSize: "0.65rem", fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{step}</span>
            </div>
            {idx < steps.length - 1 && <div className="w-10 sm:w-16 h-px mb-5 mx-1" style={{ backgroundColor: done ? "#e8192c" : "rgba(255,255,255,0.08)" }} />}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummaryCard({ orderData }: { orderData: OrderData }) {
  const formatBadge = orderData.showtime.format;
  const formatColor = formatBadge === "3D" ? "#7b2d8b" : formatBadge === "IMAX" ? "#c47a00" : "#4a90e2";

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-2"><Film size={14} className="text-[#e8192c]" /><span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>Booking Summary</span></div>
        <Link to={`/movie/${orderData.movie.id}/seats`} className="flex items-center gap-1 text-white/35 hover:text-[#e8192c] transition-colors" style={{ fontSize: "0.72rem" }}><ChevronLeft size={12} /> Edit seats</Link>
      </div>
      <div className="p-5 flex gap-4">
        <div className="flex-shrink-0 rounded-xl overflow-hidden border border-white/10" style={{ width: "72px", height: "108px" }}><img src={orderData.movie.posterUrl} alt={orderData.movie.title} className="w-full h-full object-cover" /></div>
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div><h2 className="text-white leading-tight mt-0.5 line-clamp-2" style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>{orderData.movie.title}</h2><div className="flex items-center gap-2 mt-2"><span className="px-2 py-0.5 rounded text-white uppercase" style={{ backgroundColor: formatColor, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em" }}>{formatBadge}</span></div></div>
          <div className="flex flex-col gap-1.5 mt-3"><div className="flex items-center gap-1.5 text-white/50"><Calendar size={12} className="text-[#e8192c] flex-shrink-0" /><span style={{ fontSize: "0.78rem" }}>{orderData.showtime.date}</span></div><div className="flex items-center gap-1.5 text-white/50"><Clock size={12} className="text-[#e8192c] flex-shrink-0" /><span style={{ fontSize: "0.78rem" }}>{orderData.showtime.time} · {orderData.showtime.room}</span></div></div>
        </div>
      </div>
      <div className="px-5 pb-5 border-t border-white/5 pt-4">
        <p className="text-white/30 uppercase mb-2.5" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em" }}>Selected Seats</p>
        <div className="flex flex-wrap gap-2">
          {orderData.seats.map((s) => (
            <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {s.tier === "VIP" && <Crown size={10} className="text-yellow-500" />}
              <span className="text-white" style={{ fontWeight: 700, fontSize: "0.82rem" }}>{s.seatName}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: s.color + "22", color: s.color, fontSize: "0.6rem", fontWeight: 700 }}>{s.tier}</span>
              <span className="text-white/40" style={{ fontSize: "0.75rem" }}>{formatVND(s.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnacksSection({ cart, setCart, snackItems }: { cart: Record<string, number>; setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>, snackItems: any[] }) {
  const [expanded, setExpanded] = useState(true);
  const adjust = (id: string, delta: number) => setCart((prev) => { const next = { ...prev }; const n = (next[id] || 0) + delta; if (n <= 0) delete next[id]; else next[id] = n; return next; });
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <button className="w-full px-5 py-4 border-b border-white/6 flex items-center justify-between group" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2"><span style={{ fontSize: "1.1rem" }}>🍿</span><span className="text-white" style={{ fontWeight: 700, fontSize: "0.92rem" }}>Add Snacks & Drinks</span>{cartCount > 0 && <span className="px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#e8192c", fontSize: "0.65rem", fontWeight: 700 }}>{cartCount}</span>}</div>
        <ChevronDown size={16} className={`text-white/40 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {snackItems.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ backgroundColor: qty > 0 ? "rgba(232,25,44,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${qty > 0 ? "rgba(232,25,44,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                <span style={{ fontSize: "1.6rem" }}>{item.emoji}</span>
                <div className="flex-1 min-w-0"><p className="text-white truncate" style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.name}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-[#e8192c]" style={{ fontWeight: 700, fontSize: "0.78rem" }}>{formatVND(item.price)}</span></div></div>
                <div className="flex items-center gap-2">
                  {qty > 0 ? (
                    <><button onClick={() => adjust(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center border border-white/15 text-white/60"><Minus size={11} /></button><span className="text-white" style={{ fontWeight: 700, fontSize: "0.9rem" }}>{qty}</span><button onClick={() => adjust(item.id, +1)} className="w-7 h-7 rounded-full flex items-center justify-center bg-[#e8192c] text-white"><Plus size={11} /></button></>
                  ) : (
                    <button onClick={() => adjust(item.id, +1)} className="w-7 h-7 rounded-full flex items-center justify-center border border-white/12 text-white/40"><Plus size={11} /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CostBreakdown({ snackCart, orderData, snackItems, discount }: { snackCart: Record<string, number>; orderData: OrderData, snackItems: any[], discount: number }) {
  const ticketSubtotal = orderData.seats.reduce((a, s) => a + s.price, 0);
  const snackSubtotal = snackItems.reduce((a, item) => a + (snackCart[item.id] || 0) * item.price, 0) || 0;
  const tax = Math.round(ticketSubtotal * TAX_RATE);
  const grandTotal = Math.max(0, ticketSubtotal + snackSubtotal + CONVENIENCE_FEE + tax - discount);

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: "#111118" }}>
      <div className="px-5 py-3.5 border-b border-white/6 flex items-center gap-2"><Ticket size={14} className="text-[#e8192c]" /><span className="text-white/50 uppercase" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>Cost Breakdown</span></div>
      <div className="p-5 space-y-2.5">
        <div className="flex items-center justify-between"><span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tickets ({orderData.seats.length}x)</span><span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{formatVND(ticketSubtotal)}</span></div>
        {orderData.seats.map((s) => (
          <div key={s.id} className="flex items-center justify-between pl-4">
            <span className="text-white/35" style={{ fontSize: "0.78rem" }}>Ghế {s.seatName} ({s.tier})</span>
            <span className="text-white/35" style={{ fontSize: "0.78rem" }}>{formatVND(s.price)}</span>
          </div>
        ))}
        {snackSubtotal > 0 && (
          <><div className="h-px bg-white/5 my-1" /><div className="flex items-center justify-between"><span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Snacks</span><span className="text-white/55" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{formatVND(snackSubtotal)}</span></div></>
        )}
        {discount > 0 && (
          <><div className="h-px bg-white/5 my-1" /><div className="flex items-center justify-between"><span className="text-[#10b981]" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Discount</span><span className="text-[#10b981]" style={{ fontSize: "0.85rem", fontWeight: 600 }}>-{formatVND(discount)}</span></div></>
        )}
        <div className="h-px bg-white/5 my-1" />
        <div className="flex items-center justify-between"><span className="text-white/35" style={{ fontSize: "0.8rem" }}>Fee & Tax</span><span className="text-white/35" style={{ fontSize: "0.8rem" }}>{formatVND(CONVENIENCE_FEE + tax)}</span></div>
        <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-dashed" style={{ borderColor: "rgba(255,255,255,0.08)" }}><span className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span><span className="text-[#e8192c]" style={{ fontWeight: 900, fontSize: "1.35rem", letterSpacing: "-0.02em" }}>{formatVND(grandTotal)}</span></div>
      </div>
    </div>
  );
}

// ─── ĐÃ SỬA: NÚT THANH TOÁN BẮN API THẬT XUỐNG DB ───
function ConfirmButton({ total, orderData, snackCart }: { total: number; orderData: OrderData; snackCart: Record<string, number> }) {
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  const navigate = useNavigate();

  const handleClick = async () => {
    if (state !== "idle") return;

    // Chặn lỗi do người dùng F5 trang làm mất dữ liệu giỏ hàng
    if (orderData.showtime.id === "0" || orderData.seats.length === 0) {
      alert("Giỏ hàng rỗng hoặc đã hết hạn. Vui lòng chọn lại vé!");
      navigate("/");
      return;
    }

    // Bắt buộc phải có token đăng nhập mới cho mua vé
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Hãy đăng nhập trước khi mua vé");
      navigate("/login"); 
      return;
    }

    setState("processing");

    try {
      const comboItems = Object.entries(snackCart).map(([comboId, quantity]) => ({ comboId, quantity }));

      // Đóng gói data gửi xuống bếp
      const payload = {
        showtimeId: orderData.showtime.id,
        seats: orderData.seats.map(s => ({ id: s.id, price: s.price })),
        comboItems,
        paymentMethod: "CREDIT_CARD",
        totalAmount: total
      };

      const res = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setState("done");
      } else {
        alert(json.error || "Lỗi khi thanh toán!");
        setState("idle");
        
        // Nếu lỗi 401 (Hết hạn hoặc user bị xóa do reset DB) -> Ép đăng nhập lại
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    } catch (err) {
      alert("Lỗi kết nối server! Backend có đang chạy không đó?");
      setState("idle");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button onClick={handleClick} disabled={state === "done"} className="relative w-full py-4 rounded-2xl transition-all duration-300" style={{ backgroundColor: state === "done" ? "#16a34a" : "#e8192c" }}>
        <div className="relative flex items-center justify-center gap-3">
          {state === "idle" && <><span className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>Thanh Toán {formatVND(total)}</span> <ArrowRight size={18} className="text-white" /></>}
          {state === "processing" && <span className="text-white" style={{ fontWeight: 700 }}>Đang xử lý thanh toán…</span>}
          {state === "done" && <span className="text-white" style={{ fontWeight: 700 }}>Thanh Toán Thành Công!</span>}
        </div>
      </button>
      {state === "done" && (
        <div className="rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)" }}>
          <p className="text-green-400 text-center" style={{ fontWeight: 700, fontSize: "0.88rem" }}>Đã chốt đơn vé thành công!</p>
          <button onClick={() => navigate("/dashboard")} className="px-3 py-1.5 rounded-lg border border-[#e8192c]/30 text-[#e8192c]">Mở Kho Vé Của Tôi</button>
        </div>
      )}
    </div>
  );
}

function VoucherSection({ setDiscount, ticketSubtotal }: { setDiscount: React.Dispatch<React.SetStateAction<number>>, ticketSubtotal: number }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleApply = () => {
    if (code.toUpperCase() === "CINEMA20") {
      setDiscount(Math.round(ticketSubtotal * 0.2));
      setStatus("success");
      setMessage("Đã áp dụng giảm giá 20%!");
    } else if (code.toUpperCase() === "WELCOME50K") {
      setDiscount(50000);
      setStatus("success");
      setMessage("Đã giảm 50.000đ!");
    } else {
      setDiscount(0);
      setStatus("error");
      setMessage("Mã giảm giá không hợp lệ. Hãy thử CINEMA20");
    }
  };

  const handleRemove = () => {
    setCode("");
    setDiscount(0);
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden p-5" style={{ backgroundColor: "#111118" }}>
      <p className="text-white/50 uppercase mb-3" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>Mã Giảm Giá / Voucher</p>
      {status === "success" ? (
        <div className="flex items-center justify-between p-3 rounded-xl border border-green-500/30 bg-green-500/10">
          <div>
            <span className="text-green-400 font-bold">{code.toUpperCase()}</span>
            <p className="text-green-400/80 text-xs mt-0.5">{message}</p>
          </div>
          <button onClick={handleRemove} className="text-white/50 hover:text-white text-sm">Gỡ</button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input 
              value={code} 
              onChange={e => { setCode(e.target.value); setStatus("idle"); setMessage(""); }}
              placeholder="Nhập mã (VD: CINEMA20)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#e8192c]"
            />
            <button onClick={handleApply} className="bg-[#e8192c] hover:bg-[#c8111f] text-white px-5 rounded-xl font-bold transition-all">
              Áp Dụng
            </button>
          </div>
          {status === "error" && <p className="text-[#e8192c] text-xs mt-2">{message}</p>}
        </div>
      )}
    </div>
  );
}

export function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [snackCart, setSnackCart] = useState<Record<string, number>>({});
  const [snackItems, setSnackItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);

  const orderData: OrderData = location.state?.orderData || {
    movie: { id: "0", title: "Vui lòng quay lại chọn ghế!", posterUrl: "https://via.placeholder.com/300" },
    showtime: { id: "0", date: "--", time: "--", format: "2D", room: "--" },
    seats: []
  };

  // Lấy dữ liệu Combo từ backend database
  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/combos");
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((c: any) => ({
            id: c.id, name: c.name, price: c.price, 
            emoji: c.name.toLowerCase().includes("bắp") ? "🍿" : "🥤"
          }));
          setSnackItems(mapped);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách bắp nước từ DB:", err);
      }
    };
    fetchSnacks();
  }, []);

  const ticketSubtotal = orderData.seats.reduce((a, s) => a + s.price, 0);
  const snackSubtotal = snackItems.reduce((a, item) => a + (snackCart[item.id] || 0) * item.price, 0) || 0;
  const tax = Math.round(ticketSubtotal * TAX_RATE);
  const grandTotal = Math.max(0, ticketSubtotal + snackSubtotal + CONVENIENCE_FEE + tax - discount);

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter','system-ui',sans-serif" }}>
      <header className="sticky top-0 z-40 border-b border-white/6" style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/50 hover:text-white"><ChevronLeft size={18} /> Back</button>
          <div className="flex-1 flex justify-center"><ProgressBar current={2} /></div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-white" style={{ fontWeight: 800, fontSize: "clamp(1.4rem,3vw,1.9rem)" }}>Review & Payment</h1>
        </div>

        {orderData.seats.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <p className="mb-4">Bạn chưa chọn ghế hoặc dữ liệu bị mất.</p>
            <button onClick={() => navigate("/")} className="px-5 py-2 bg-[#e8192c] text-white rounded-lg">Về trang chủ</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <OrderSummaryCard orderData={orderData} />
              <SnacksSection cart={snackCart} setCart={setSnackCart} snackItems={snackItems} />
              <VoucherSection setDiscount={setDiscount} ticketSubtotal={ticketSubtotal} />
              <CostBreakdown snackCart={snackCart} orderData={orderData} snackItems={snackItems} discount={discount} />
            </div>
            <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-5 lg:sticky lg:top-20">
              <ConfirmButton total={grandTotal} orderData={orderData} snackCart={snackCart} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}