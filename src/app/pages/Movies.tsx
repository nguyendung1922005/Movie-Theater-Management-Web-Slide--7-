import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Film, Calendar, Clock } from "lucide-react";

export function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách phim từ backend khi vào trang
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/movies");
        if (res.ok) {
          const data = await res.json();
          // Chỉ hiển thị phim ĐANG CHIẾU (NOW_SHOWING)
          setMovies(data.filter((m: any) => m.status === 'NOW_SHOWING'));
        }
      } catch (err) {
        console.error("Lỗi kết nối tới backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <main className="max-w-screen-xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-black mb-8 border-l-4 border-[#e8192c] pl-4">PHIM ĐANG CHIẾU</h1>

        {loading ? (
          <div className="text-center py-20 text-white/50 animate-pulse">
            Đang tải dữ liệu phim từ hệ thống...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link 
                key={movie.id} 
                to={`/movie/${movie.id}`} 
                className="group relative rounded-2xl overflow-hidden bg-[#111118] border border-white/10 hover:border-[#e8192c]/50 transition-all duration-300"
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 truncate group-hover:text-[#e8192c] transition-colors">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Clock size={12} className="text-[#e8192c]" /> {movie.duration} phút</span>
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-[#e8192c]" /> {new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                </div>

                {/* Nút đặt vé hiện lên khi hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <span className="px-6 py-2 bg-[#e8192c] text-white font-bold rounded flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Film size={16} /> MUA VÉ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
