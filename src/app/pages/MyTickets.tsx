import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Ticket, Calendar, Clock, MapPin, Film } from "lucide-react";

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
        const res = await fetch("http://localhost:3000/api/user/bookings", {
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
                          {booking.tickets.map((t: any) => t.seat?.id).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider">Tổng tiền</p>
                        <p className="text-sm font-black text-[#e8192c]">
                          {booking.totalAmount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
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