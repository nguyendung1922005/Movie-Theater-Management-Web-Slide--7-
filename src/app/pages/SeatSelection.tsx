import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Check, Crown } from "lucide-react";
import { Header } from "../components/Header";
import { toast } from "sonner";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: string;
  isBooked: boolean;
}

export function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: movieId } = useParams<{ id: string }>();
  const { movie, showtime } = location.state || {};

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceBase, setPriceBase] = useState(80000);

  useEffect(() => {
    if (!showtime?.id) {
      toast.error("Thiếu thông tin suất chiếu!");
      navigate("/");
      return;
    }

    const fetchSeats = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/showtimes/${showtime.id}/seats`);
        if (!res.ok) throw new Error("Không lấy được sơ đồ ghế từ server");
        const json = await res.json();
        if (json.success) {
          setSeats(json.seats);
          setPriceBase(json.priceBase);
        }
      } catch (err) {
        toast.error("Lỗi tải sơ đồ ghế rạp!");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [showtime, navigate]);

  const toggleSeat = (seat: Seat) => {
    if (seat.isBooked) return; 
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const getSeatPrice = (seat: Seat) => {
    return seat.type === "VIP" ? priceBase + 20000 : priceBase;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }

    const orderData = {
      movie: { id: movie.id, title: movie.title, posterUrl: movie.posterUrl },
      showtime: { id: showtime.id, date: showtime.date, time: showtime.time, format: showtime.format, room: showtime.room },
      seats: selectedSeats.map((s) => ({
        id: s.id,
        seatName: `${s.row}${s.number}`, // <-- ĐÃ SỬA: Bơm cái tên A1, B2 sang cho trang Checkout
        tier: s.type,
        price: getSeatPrice(s),
        color: s.type === "VIP" ? "#f5a623" : "#4a90e2",
      })),
    };

    navigate("/checkout", { state: { orderData } });
  };

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">Đang vẽ sơ đồ ghế...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 pt-24 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-medium">
            <ChevronLeft size={18} /> Quay Lại
          </button>
          <h1 className="text-xl font-bold">Chọn Ghế Ngồi: {movie?.title}</h1>
        </div>

        <div className="w-full flex flex-col items-center mb-16">
          <div className="w-2/3 h-1.5 bg-[#e8192c] rounded-full shadow-2xl shadow-[#e8192c] mb-2" />
          <p className="text-white/20 text-xs uppercase tracking-widest font-bold mb-10">Màn Hình Chiếu Phim</p>

          <div className="flex flex-col gap-3 items-center w-full overflow-x-auto pb-4">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3 min-w-max">
                <span className="text-white/30 text-sm font-bold w-5 text-right mr-2">{row}</span>
                <div className="flex gap-2">
                  {seats
                    .filter((s) => s.row === row)
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id);
                      let bgClass = "bg-white/5 border-white/10 text-white/60 hover:border-[#e8192c]/50";
                      
                      if (seat.isBooked) bgClass = "bg-white/10 text-white/10 border-transparent cursor-not-allowed line-through";
                      else if (isSelected) bgClass = "bg-[#e8192c] border-transparent text-white font-bold";
                      else if (seat.type === "VIP") bgClass = "bg-yellow-600/10 border-yellow-600/40 text-yellow-500 hover:bg-yellow-600/20";

                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isBooked}
                          onClick={() => toggleSeat(seat)}
                          className={`w-9 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${bgClass}`}
                        >
                          {/* ĐÃ SỬA: In ra A1, B2 thay vì ID */}
                          {seat.isBooked ? "X" : `${seat.row}${seat.number}`}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 border-t border-white/5 pt-8 mb-10 text-sm text-white/60">
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white/5 border border-white/10 rounded" /> Thường</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-yellow-600/20 border border-yellow-600/40 rounded" /> Ghế VIP (+20k)</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#e8192c] rounded" /> Đang chọn</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white/10 line-through text-white/20 flex items-center justify-center text-[10px] rounded">X</div> Đã có người mua</div>
        </div>

        <div className="rounded-xl bg-[#111118] border border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <p className="text-sm text-white/40 font-medium">Ghế đã chọn: <span className="text-white font-bold">
              {/* ĐÃ SỬA CHỖ NÀY LUÔN */}
              {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ") || "Chưa chọn"}
            </span></p>
            <p className="text-2xl font-black text-[#e8192c]">{calculateTotal().toLocaleString("vi-VN")} ₫</p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedSeats.length === 0}
            className="w-full md:w-52 py-3.5 rounded-lg bg-[#e8192c] text-white hover:bg-[#c8111f] font-bold transition-all disabled:bg-white/5 disabled:text-white/20"
          >
            Tiến Hành Thanh Toán
          </button>
        </div>
      </main>
    </div>
  );
}