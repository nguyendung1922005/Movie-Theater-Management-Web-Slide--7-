import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Ticket, Calendar, Clock, MapPin, Film } from "lucide-react";

const API_BASE = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";

export function MyTickets() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/tickets/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) {
          setBookings(json.bookings);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử đặt vé:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const handleRefund = async (bookingId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy vé và hoàn tiền? Hành động này không thể hoàn tác.")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/refund`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Hủy vé thành công! Tiền sẽ được hoàn về tài khoản của bạn.");
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "REFUNDED" } : b));
      } else {
        alert(data.error || "Hủy vé thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <main className="max-w-screen-md mx-auto px-6 pt-24 pb-20">
        <h1 className="text-2xl font-black mb-8 flex items-center gap-2">
          <Ticket className="text-[#e8192c]" /> Vé Của Tôi
        </h1>

        {loading ? (
          <div className="text-center py-12 text-white/40">Đang lục tìm hòm vé của mày...</div>
        ) : bookings.length > 0 ? (
          <div className="flex flex-col gap-5">
            {bookings.map((booking) => {
              // Lấy thông tin vé đầu tiên đại diện
              const firstTicket = booking.tickets?.[0];
              const showtime = firstTicket?.showtime;
              const movie = showtime?.movie;
              const room = showtime?.room;

              return (
                <div key={booking.id} className="rounded-xl border border-white/5 bg-[#111118] overflow-hidden flex flex-col sm:flex-row transition-all hover:border-white/10">
                  {/* Poster */}
                  <div className="w-full sm:w-32 h-44 flex-shrink-0 bg-neutral-900">
                    <img src={movie?.posterUrl} alt={movie?.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Vé chi tiết */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie?.title}</h2>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-white/60">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#e8192c]" />
                          <span>{showtime ? new Date(showtime.startTime).toLocaleDateString("vi-VN") : "--"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#e8192c]" />
                          <span>{showtime ? new Date(showtime.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "--"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin size={13} className="text-[#e8192c]" />
                          <span>{room?.name || "Rạp Cinema X"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Ghế Ngồi</p>
                        <p className="text-sm font-bold text-white">
                          {booking.tickets.map((t: any) => t.seat ? `${t.seat.row}${t.seat.number}` : "Chưa rõ").join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Tổng tiền</p>
                        <p className="text-sm font-black text-[#e8192c]">
                          {booking.totalAmount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>

                    {/* Nút Hủy Vé */}
                    {booking.status === "COMPLETED" ? (
                      <div className="mt-3">
                        <button onClick={() => handleRefund(booking.id)} className="w-full py-2.5 rounded-lg border border-[#e8192c]/30 text-[#e8192c] hover:bg-[#e8192c] hover:text-white transition-all text-xs font-bold text-center">
                          Hủy vé & Hoàn tiền
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 w-full py-2.5 rounded-lg bg-white/5 text-white/40 text-xs font-bold text-center uppercase">
                        {booking.status === "REFUNDED" ? "Đã Hủy & Hoàn Tiền" : booking.status}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#111118] text-white/40">
            <p className="mb-2">Mày chưa đặt mua cái vé nào cả!</p>
            <p className="text-xs text-white/20">Hãy quay lại trang chủ rạp để đặt vé phim hot ngay nhé.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}