import { useEffect, useState } from "react";
import { Play, Star, Clock, Calendar } from "lucide-react";
import { Link } from "react-router"; 
import { getActiveMovies, Movie } from "../../lib/movies";

export function HeroBanner() {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      const result = await getActiveMovies();
      if (result.success && result.data && result.data.length > 0) {
        setHeroMovie(result.data[0]); // Bắt luôn thằng phim đầu tiên làm Banner
      }
    };
    fetchHero();
  }, []);

  // Tránh lỗi khi DB chưa có phim nào
  if (!heroMovie) {
    return (
      <section className="relative w-full h-[92vh] min-h-[600px] flex items-end overflow-hidden bg-[#0a0a0f]">
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16 w-full text-center">
            <h1 className="text-white">Đang tải Banner...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[92vh] min-h-[600px] flex items-end overflow-hidden">
      {/* Nền phim lấy từ Database */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${heroMovie.posterUrl || 'https://via.placeholder.com/1920x1080'})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-[#0a0a0f]/30 to-transparent" />
      <div className="absolute inset-0 bg-[#e8192c]/5" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)" }} />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-16 w-full">
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8192c] text-white uppercase" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Now Showing
          </span>
        </div>

        <h1 className="text-white mb-3 leading-none line-clamp-2" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "-0.02em", textShadow: "0 4px 30px rgba(0,0,0,0.6)", lineHeight: 1.05 }}>
          {heroMovie.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 mb-7 mt-5">
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock size={14} />
            <span style={{ fontSize: "0.85rem" }}>{heroMovie.duration} Phút</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Calendar size={14} />
            <span style={{ fontSize: "0.85rem" }}>{new Date(heroMovie.releaseDate).getFullYear()}</span>
          </div>
        </div>

        <p className="text-white/65 mb-8 max-w-xl line-clamp-3" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
          {heroMovie.description || "Hãy ra rạp để trải nghiệm bộ phim tuyệt vời này cùng bạn bè và người thân!"}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link to={`/movie/${heroMovie.id}`} className="flex items-center gap-2.5 px-7 py-3.5 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all duration-200 shadow-lg shadow-[#e8192c]/30" style={{ fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em" }}>
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Play size={12} fill="white" className="ml-0.5" />
            </span>
            Mua Vé Ngay
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}