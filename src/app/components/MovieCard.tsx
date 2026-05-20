import { Star, Clock } from "lucide-react";
import { Link } from "react-router"; // Thêm dòng này

interface MovieCardProps {
  id: string; // Phải có ID để biết click vào phim nào
  title: string;
  genre: string;
  rating: string;
  duration: string | number;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export function MovieCard({
  id,
  title,
  genre,
  rating,
  duration,
  image,
  badge,
  badgeColor = "#e8192c",
}: MovieCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-[#111118] border border-white/5 hover:border-[#e8192c]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e8192c]/10">
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "145%" }}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent opacity-80" />
        {badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-white uppercase"
            style={{ backgroundColor: badgeColor, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em" }}
          >
            {badge}
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          <Star size={10} fill="#f5c518" className="text-[#f5c518]" />
          <span className="text-white" style={{ fontSize: "0.7rem", fontWeight: 700 }}>{rating}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="text-white mb-1 line-clamp-1" style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}>
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[#e8192c]" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{genre}</p>
            <div className="flex items-center gap-1 text-white/40">
              <Clock size={11} />
              <span style={{ fontSize: "0.72rem" }}>{duration}</span>
            </div>
          </div>
        </div>

        {/* Nút này đã được đổi thành thẻ Link bọc lấy ID phim */}
        <Link
          to={`/movie/${id}`}
          className="w-full py-2.5 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] active:scale-[0.98] transition-all duration-200 mt-auto text-center block"
          style={{ fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em" }}
        >
          Buy Tickets
        </Link>
      </div>
    </div>
  );
}