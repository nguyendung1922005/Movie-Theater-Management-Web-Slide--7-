import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";

// Bỏ import hàm mock, dùng Movie thật từ DB
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  duration: number;
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'ENDED';
  releaseDate: string;
}

export function NowShowing() {
  // 1. Tạo giỏ chứa phim (ban đầu là giỏ rỗng)
  const [movies, setMovies] = useState<Movie[]>([]);

  // 2. Tự động gọi API lấy phim ngay khi mở trang web
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/movies');
        if (res.ok) {
          const allMovies = await res.json();
          // Lọc chỉ lấy những phim đang chiếu
          setMovies(allMovies.filter((m: Movie) => m.status === 'NOW_SHOWING'));
        }
      } catch (err) {
        console.error("Lỗi tải phim từ backend:", err);
      }
    };
    fetchMovies();
  }, []);

  // Hàm phụ: Chuyển đổi phút (VD: 180) thành chuỗi "3h 0m" cho giao diện đẹp
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m < 10 ? '0' + m : m}m`;
  };

  return (
    <section className="bg-[#0a0a0f] py-16 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 rounded bg-[#e8192c]" />
              <span
                className="text-[#e8192c] uppercase"
                style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.18em" }}
              >
                On The Big Screen
              </span>
            </div>
            <h2
              className="text-white"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Now Showing
            </h2>
          </div>

          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-white/50 hover:text-[#e8192c] transition-colors duration-200 group"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            View All Movies
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 3. Lặp qua danh sách phim thật từ Database để in ra màn hình */}
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}  // <--- THÊM DÒNG NÀY ĐỂ TRUYỀN ID CHO NÚT BẤM
                title={movie.title}
                genre={"Phim Chiếu Rạp"}
                rating={"8.5"} 
                duration={formatDuration(movie.duration)} // Dùng hàm format ở trên
                image={movie.posterUrl || "https://via.placeholder.com/300x450"} // Lấy ảnh thật từ Database
                badge="Hot"
                badgeColor="#e8192c"
              />
            ))
          ) : (
            <div className="text-white col-span-4 text-center py-10">
              Đang tải phim hoặc rạp chưa có bộ phim nào đang chiếu...
            </div>
          )}
        </div>

        {/* Mobile view all */}
        <div className="flex sm:hidden justify-center mt-8">
          <a
            href="#"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded border border-white/10 text-white/60 hover:border-[#e8192c] hover:text-[#e8192c] transition-all duration-200"
            style={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            View All Movies
            <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}