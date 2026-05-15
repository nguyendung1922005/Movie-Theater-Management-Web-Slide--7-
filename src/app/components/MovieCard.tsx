import { Star, Clock } from "lucide-react";

interface MovieCardProps {
  title: string;
  genre: string;
  rating: string;
  duration: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

export function MovieCard({
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
      {/* Poster */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: "145%" }}>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent opacity-80" />

        {/* Badge */}
        {badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-white uppercase"
            style={{
              backgroundColor: badgeColor,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {badge}
          </div>
        )}

        {/* Rating pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          <Star size={10} fill="#f5c518" className="text-[#f5c518]" />
          <span className="text-white" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
            {rating}
          </span>
        </div>

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-[#e8192c]/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-[#e8192c]/40">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <path d="M4 2.5l12 6.5-12 6.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3
            className="text-white mb-1 line-clamp-1"
            style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}
          >
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[#e8192c]" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
              {genre}
            </p>
            <div className="flex items-center gap-1 text-white/40">
              <Clock size={11} />
              <span style={{ fontSize: "0.72rem" }}>{duration}</span>
            </div>
          </div>
        </div>

        <button
          className="w-full py-2.5 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] active:scale-[0.98] transition-all duration-200 mt-auto"
          style={{ fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em" }}
        >
          Buy Tickets
        </button>
      </div>
    </div>
  );
}
