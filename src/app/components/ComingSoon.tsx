import { useEffect, useState } from "react";
import { Calendar, Bell } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  duration: number;
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'ENDED';
  releaseDate: string;
}

export function ComingSoon() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchComingSoon = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/movies");
        if (res.ok) {
          const data = await res.json();
          setUpcomingMovies(data.filter((m: Movie) => m.status === 'COMING_SOON'));
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách phim sắp chiếu:", err);
      }
    };
    fetchComingSoon();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="bg-[#0d0d14] py-16 px-6 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 rounded bg-[#e8192c]" />
              <span className="text-[#e8192c] uppercase" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em" }}>
                Mark Your Calendar
              </span>
            </div>
            <h2 className="text-white" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Coming Soon
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {upcomingMovies.length > 0 ? (
            upcomingMovies.map((movie, i) => (
              <div key={movie.id} className="group flex items-center justify-between p-5 rounded-xl bg-[#111118] border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-5">
                  <span className="text-white/10 select-none" style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1, minWidth: "2rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#00c8ff]" />
                  <div>
                    <h3 className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>{movie.title}</h3>
                    <p style={{ color: "#00c8ff", fontSize: "0.8rem", fontWeight: 500 }}>Sắp Chiếu</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-white/40">
                    <Calendar size={14} />
                    <span style={{ fontSize: "0.85rem" }}>{formatDate(movie.releaseDate)}</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 text-white/50 hover:border-[#e8192c] hover:text-[#e8192c] transition-all duration-200">
                    <Bell size={13} /> Nhắc Tôi
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white/50 text-center py-5 border border-white/10 rounded-xl bg-[#111118]">
              Đang tải lịch phim hoặc rạp chưa cập nhật phim sắp chiếu...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}