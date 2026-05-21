import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, ChevronLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getMovieById, Movie } from "../../lib/movies";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={20} className="text-[#f5c518]" fill="currentColor" />
      <span className="ml-2 text-[#f5c518]" style={{ fontWeight: 700, fontSize: "1rem" }}>{rating}</span>
      <span className="text-white/35" style={{ fontSize: "0.85rem" }}>/ 5.0</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-5 rounded bg-[#e8192c]" />
      <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
        {children}
      </h2>
    </div>
  );
}

function BookingSidebar({ movie, showtimes }: { movie: Movie; showtimes: any[] }) {
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  // Nhóm suất chiếu theo ngày
  const showtimesByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    showtimes.forEach(show => {
      const dateStr = new Date(show.startTime).toLocaleDateString("vi-VN");
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(show);
    });
    return groups;
  }, [showtimes]);

  const availableDates = Object.keys(showtimesByDate);

  useEffect(() => {
    if (availableDates.length > 0) {
      if (!selectedDate || !availableDates.includes(selectedDate)) {
        setSelectedDate(availableDates[0]);
      }
    } else {
      setSelectedDate(null);
    }
  }, [availableDates, selectedDate]);

  const currentShowtimes = selectedDate ? showtimesByDate[selectedDate] : [];

  useEffect(() => {
    if (currentShowtimes && currentShowtimes.length > 0) {
      setSelectedShowtimeId(currentShowtimes[0].id);
    }
  }, [selectedDate, currentShowtimes]);

  const selectedShowtime = showtimes.find((s) => s.id === selectedShowtimeId);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleProceed = () => {
    if (!selectedShowtimeId || !selectedShowtime) return;
    
    // Ném toàn bộ thông tin phim và suất chiếu đã chọn sang trang ghế
    navigate(`/movie/${movie.id}/seats`, {
      state: {
        movie,
        showtime: {
          id: selectedShowtime.id,
          time: formatTime(selectedShowtime.startTime),
          date: new Date(selectedShowtime.startTime).toLocaleDateString("vi-VN"),
          room: selectedShowtime.room?.name || "Phòng Chiếu",
          format: selectedShowtime.room?.name?.includes("IMAX") ? "IMAX" : "2D"
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative rounded-xl overflow-hidden border border-white/8" style={{ aspectRatio: "2/3" }}>
        <img src={movie.posterUrl || "https://via.placeholder.com/300x450"} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118]/90 via-transparent to-transparent" />
      </div>

      <div className="rounded-xl bg-[#111118] border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 uppercase mb-0.5" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em" }}>
              Chọn Ngày Chiếu
            </p>
            <span className="px-2.5 py-1 rounded-full bg-[#e8192c]/15 text-[#e8192c] uppercase" style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em" }}>
              Live
            </span>
          </div>
          
          {/* Thanh cuộn ngang chọn ngày */}
          {availableDates.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
                    selectedDate === date ? "bg-[#e8192c] border-[#e8192c] text-white" : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentShowtimes.length > 0 ? (
          <div className="p-4 grid grid-cols-2 gap-2.5">
            {currentShowtimes.map((show) => {
              const isIMAX = show.room?.name?.includes("IMAX");
              return (
                <button
                  key={show.id}
                  onClick={() => setSelectedShowtimeId(show.id)}
                  className={`relative flex flex-col items-start gap-1 p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedShowtimeId === show.id ? "border-[#e8192c] bg-[#e8192c]/10" : "border-white/8 bg-[#0d0d14]"
                  }`}
                >
                  <span className="text-white" style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1 }}>{formatTime(show.startTime)}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-white uppercase text-[0.55rem] font-bold" style={{ backgroundColor: isIMAX ? "#c47a00" : "#4a90e2" }}>
                      {isIMAX ? "IMAX" : "2D"}
                    </span>
                    <span className="text-white/40 text-[0.65rem] font-medium">{show.room?.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-5 text-center text-white/40 text-sm">Chưa có lịch chiếu cho ngày này.</div>
        )}

        <div className="px-4 pb-4 pt-1">
          <button
            onClick={handleProceed}
            disabled={currentShowtimes.length === 0}
            className="w-full py-3.5 rounded-lg bg-[#e8192c] text-white hover:bg-[#c8111f] disabled:bg-white/5 disabled:text-white/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 font-bold text-sm"
          >
            Chọn Ghế Ngồi
          </button>
        </div>
      </div>
    </div>
  );
}

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailAndShowtimes = async () => {
      if (!id) return;
      try {
        const resMovie = await fetch(`http://localhost:3000/api/movies/${id}`);
        if (resMovie.ok) {
          const jsonMovie = await resMovie.json();
          if (jsonMovie.success && jsonMovie.data) {
            setMovie(jsonMovie.data);
          }
        }

        const resShowtimes = await fetch(`http://localhost:3000/api/movies/${id}/showtimes`);
        if (resShowtimes.ok) {
          const data = await resShowtimes.json();
          setShowtimes(data);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailAndShowtimes();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white font-medium">Đang tải thông tin phim...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white font-medium">Lỗi! Không tìm thấy phim này.</div>;
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#0a0a0f", color: "#ffffff" }}>
      <Header />
      <div className="pt-16">
        <section className="relative w-full overflow-hidden" style={{ height: "clamp(420px, 62vh, 680px)" }}>
          <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${movie.posterUrl})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 to-[#0a0a0f]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/85 via-transparent to-[#0a0a0f]/40" />

          <div className="absolute top-6 left-6 z-10">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-all text-sm font-medium">
              <ChevronLeft size={16} /> Quay Lại
            </Link>
          </div>

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-screen-xl mx-auto px-6 pb-12 w-full">
              <div className="mb-5">
                <h1 className="text-white leading-none line-clamp-2" style={{ fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)", fontWeight: 900, textShadow: "0 4px 40px rgba(0,0,0,0.7)" }}>
                  {movie.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <StarRating rating={4.8} />
                <div className="w-px h-5 bg-white/15 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-white/55">
                  <Clock size={15} />
                  <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{movie.duration} Phút</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/55">
                  <Calendar size={15} />
                  <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0 flex flex-col gap-10">
              <section>
                <SectionLabel>Tóm tắt phim</SectionLabel>
                <p className="text-white/70" style={{ fontSize: "0.95rem", lineHeight: 1.85 }}>
                  {movie.description || "Chưa có mô tả cho bộ phim này."}
                </p>
              </section>
            </div>

            <div className="w-full lg:w-80 xl:w-88 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <BookingSidebar movie={movie} showtimes={showtimes} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}