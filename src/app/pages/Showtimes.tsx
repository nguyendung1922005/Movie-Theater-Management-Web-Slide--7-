import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Clock, Calendar, Film, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api";

export function Showtimes() {
  const [groupedData, setGroupedData] = useState<Record<string, any>>({});
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weekRangeString, setWeekRangeString] = useState<string>(""); // New state for displaying week range
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = Tuần này, n = Tuần +n
  const navigate = useNavigate();

  // Gọi API lấy toàn bộ lịch chiếu từ backends
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/showtimes`);
        if (res.ok) {
          const showtimesData = await res.json();
          
          const groups: Record<string, Record<string, any>> = {};

          // Lấy mốc thời gian: từ Thứ 2 đến hết Chủ Nhật của tuần hiện tại
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const startOfWeek = new Date(today);
          const distanceToMonday = today.getDay() === 0 ? 6 : today.getDay() - 1;
          startOfWeek.setDate(today.getDate() - distanceToMonday + (weekOffset * 7));

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          // Calculate week range string for display
          const formatDisplayDate = (d: Date) => d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
          const formatDisplayDateWithYear = (d: Date) => d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });

          let currentWeekDisplay;
          const startYear = startOfWeek.getFullYear();
          const endYear = endOfWeek.getFullYear();
          if (startYear !== endYear) {
            currentWeekDisplay = `${formatDisplayDateWithYear(startOfWeek)} - ${formatDisplayDateWithYear(endOfWeek)}`;
          } else if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
            currentWeekDisplay = `${formatDisplayDate(startOfWeek)} - ${formatDisplayDate(endOfWeek)}`;
          } else {
            currentWeekDisplay = `${startOfWeek.getDate()} - ${formatDisplayDate(endOfWeek)}`;
          }

          // Tạo danh sách cố định 7 ngày trong tuần
          const fullWeekDates: string[] = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dStr = d.toLocaleDateString("vi-VN");
            fullWeekDates.push(dStr);
            groups[dStr] = {}; // Khởi tạo object rỗng cho từng ngày để luôn hiện tab
          }

          showtimesData.forEach((st: any) => {
            if (st.movie?.status !== 'NOW_SHOWING') return;

            const stDate = new Date(st.startTime);
            if (stDate < startOfWeek || stDate > endOfWeek) return; // Bỏ qua lịch chiếu ngoài tuần này

            const dateStr = stDate.toLocaleDateString("vi-VN");

            if (!groups[dateStr][st.movieId]) {
              groups[dateStr][st.movieId] = {
                movie: st.movie,
                showtimes: []
              };
            }
            groups[dateStr][st.movieId].showtimes.push(st);
          });

          setGroupedData(groups);
          setWeekRangeString(currentWeekDisplay); // Set the calculated week range
          setAvailableDates(fullWeekDates);
          
          const todayStr = today.toLocaleDateString("vi-VN");
          if (weekOffset === 0 && fullWeekDates.includes(todayStr)) {
            setSelectedDate(todayStr); // Mặc định chọn ngày hôm nay nếu có lịch chiếu
          } else if (fullWeekDates.length > 0) {
            setSelectedDate(fullWeekDates[0]);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch chiếu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weekOffset]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Khi click vào suất chiếu -> Chuyển sang trang chọn ghế
  const handleSelectShowtime = (movie: any, showtime: any) => {
    const isIMAX = showtime.room?.name?.includes("IMAX");
    navigate(`/movie/${movie.id}/seats`, {
      state: {
        movie: movie,
        showtime: {
          id: showtime.id,
          time: formatTime(showtime.startTime),
          date: new Date(showtime.startTime).toLocaleDateString("vi-VN"),
          room: showtime.room?.name || "Phòng Chiếu",
          format: isIMAX ? "IMAX" : "2D"
        }
      }
    });
  };

  const currentDayMovies = selectedDate ? Object.values(groupedData[selectedDate] || {}) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-black mb-8 border-l-4 border-[#e8192c] pl-4">LỊCH CHIẾU PHIM</h1>

        {loading ? (
          <div className="text-center py-20 text-white/50 animate-pulse">
            Đang tải lịch chiếu từ hệ thống...
          </div>
        ) : availableDates.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <Film size={48} className="mx-auto mb-4 opacity-20" />
            <p>Hiện tại chưa có suất chiếu nào được lên lịch.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Cụm Điều hướng Ngày và Tuần */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Thanh chọn ngày */}
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {availableDates.map(date => {
                  const [day, month, year] = date.split("/");
                  const dateObj = new Date(`${year}-${month}-${day}`);
                  const weekdays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
                  const weekdayStr = weekdays[dateObj.getDay()];
                  
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center px-6 py-2 rounded-xl border transition-all ${
                        selectedDate === date 
                          ? "bg-[#e8192c] border-[#e8192c] text-white shadow-[0_4px_16px_rgba(232,25,44,0.4)]" 
                          : "bg-[#111118] border-white/10 text-white/50 hover:text-white hover:border-white/30"
                      }`}
                    >
                      <span className="text-sm font-bold">{weekdayStr}</span>
                      <span className="text-xs mt-1 opacity-70">{`${day}/${month}`}</span>
                    </button>
                  );
                })}
              </div>

              {/* Nút chuyển tuần */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                  disabled={weekOffset === 0}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all bg-[#111118] text-white/50 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="px-4 py-2 rounded-xl border border-[#e8192c] bg-[#e8192c] text-white font-bold text-sm text-center min-w-[120px] shadow-[0_4px_16px_rgba(232,25,44,0.4)]">
                  {weekRangeString}
                </div>

                <button
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all bg-[#111118] text-white/50 hover:text-white hover:border-white/30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {currentDayMovies.length === 0 ? (
              <div className="text-center py-10 text-white/50">Không có suất chiếu nào trong ngày này.</div>
            ) : (
              currentDayMovies.map((group: any) => (
                <div key={group.movie.id} className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                  {/* Thông tin Phim */}
                  <div className="w-full md:w-56 h-72 md:h-auto flex-shrink-0 relative">
                    <img src={group.movie.posterUrl} alt={group.movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] to-transparent md:hidden" />
                  </div>
                  
                  {/* Danh sách các suất chiếu của phim đó */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold mb-2 text-white">{group.movie.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-6">
                      <span className="flex items-center gap-1"><Clock size={14} className="text-[#e8192c]" /> {group.movie.duration} phút</span>
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-[#e8192c]" /> {new Date(group.movie.releaseDate).getFullYear()}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-auto">
                      {group.showtimes.map((show: any) => {
                        const isIMAX = show.room?.name?.includes("IMAX");
                        return (
                          <button
                            key={show.id}
                            onClick={() => handleSelectShowtime(group.movie, show)}
                            className="flex flex-col items-center justify-center p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#e8192c]/10 hover:border-[#e8192c]/50 transition-all duration-200 group/btn"
                          >
                            <span className="text-lg font-bold text-white group-hover/btn:text-[#e8192c] transition-colors">{formatTime(show.startTime)}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[0.6rem] font-bold ${isIMAX ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-400'}`}>
                                {isIMAX ? "IMAX" : "2D"}
                              </span>
                              <span className="text-xs text-white/40">{show.room?.name?.split(" ")[0] || "Phòng"}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}