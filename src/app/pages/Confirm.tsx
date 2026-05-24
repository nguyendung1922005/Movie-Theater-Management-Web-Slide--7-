import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";

function ProgressBar({ current }: { current: number }) {
  const steps = ["Select Seats", "Review", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const done = idx <= current;
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

export function Confirm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter','system-ui',sans-serif" }}>
      <header className="sticky top-0 z-40 border-b border-white/6" style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-white/50 hover:text-white"><ChevronLeft size={18} /> Về trang chủ</button>
          <div className="flex-1 flex justify-center"><ProgressBar current={3} /></div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-md mx-auto text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <Check size={40} strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-black mb-4">Thanh toán thành công!</h1>
          <p className="text-white/50 mb-10 leading-relaxed">
            Cảm ơn bạn đã đặt vé. Thông tin vé của bạn đã được ghi nhận trong hệ thống.
            Hãy mang theo vé để xuất trình tại cửa rạp nhé.
          </p>
          <div className="flex flex-col w-full gap-4">
            <Link to="/my-tickets" className="py-3.5 rounded-xl bg-[#e8192c] text-white font-bold transition-all hover:bg-[#c8111f] shadow-lg shadow-[#e8192c]/30">
              Xem vé của tôi
            </Link>
            <Link to="/" className="py-3.5 rounded-xl border border-white/10 text-white/70 font-bold transition-all hover:bg-white/5 hover:text-white">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}