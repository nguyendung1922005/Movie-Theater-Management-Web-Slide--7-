import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Clock, Calendar, Film } from "lucide-react";

export function Showtimes() {
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API lấy toàn bộ lịch chiếu từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showtimesRes] = await Promise.all([
          fetch("http://localhost:3000/api/movies"),
          fetch("http://localhost:3000/api/showtimes")
        ]);
        if (moviesRes.ok && showtimesRes.ok) {
          const moviesData = await moviesRes.json();
          const showtimesData = await showtimesRes.json();
          
          // 1. Chỉ lấy phim ĐANG CHIẾU
          const nowShowingMovies = moviesData.filter((m: any) => m.status === 'NOW_SHOWING');
          
          // 2. Nhóm suất chiếu vào từng phim tương ứng
          const combinedData = nowShowingMovies.map((movie: any) => {
            return {
              movie: movie,
              showtimes: showtimesData.filter((st: any) => st.movieId === movie.id)
            };
          });

          setGroupedData(combinedData);
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch chiếu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-black mb-8 border-l-4 border-[#e8192c] pl-4">LỊCH CHIẾU PHIM</h1>

        {loading ? (
          <div className="text-center py-20 text-white/50 animate-pulse">
            Đang tải lịch chiếu từ hệ thống...
          </div>
        ) : groupedData.length === 0 ? (
          <div className="text-center py-20 text-white/50">
            <Film size={48} className="mx-auto mb-4 opacity-20" />
            <p>Hiện tại chưa có suất chiếu nào được lên lịch.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groupedData.map((group) => (
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
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-[#e8192c]" /> {new Date(group.movie.releaseDate).toLocaleDateString("vi-VN")}</span>
                  </div>

                {group.showtimes.length > 0 ? (
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
                ) : (
                  <div className="mt-auto py-3 text-white/30 text-sm">
                    Chưa có lịch chiếu nào được sắp xếp cho phim này.
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}