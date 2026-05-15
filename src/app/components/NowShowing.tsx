import { ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";

const MOVIES = [
  {
    id: 1,
    title: "Eclipse Protocol",
    genre: "Action / Thriller",
    rating: "7.9",
    duration: "2h 18m",
    badge: "Hot",
    badgeColor: "#e8192c",
    image:
      "https://images.unsplash.com/photo-1598472237441-b5422956195e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcmhlcm8lMjBtb3ZpZSUyMGNpbmVtYXRpYyUyMHBvc3RlcnxlbnwxfHx8fDE3NzI0NDE4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Void Runner",
    genre: "Sci-Fi / Adventure",
    rating: "8.1",
    duration: "2h 05m",
    badge: "New",
    badgeColor: "#0066ff",
    image:
      "https://images.unsplash.com/photo-1690906379371-9513895a2615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBzcGFjZSUyMG1vdmllJTIwcG9zdGVyJTIwZGFya3xlbnwxfHx8fDE3NzI0NDE4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "The Shadow Within",
    genre: "Horror / Mystery",
    rating: "7.5",
    duration: "1h 54m",
    badge: "Trending",
    badgeColor: "#7b2d8b",
    image:
      "https://images.unsplash.com/photo-1643677841226-d6427625f118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMGhvcnJvciUyMG1vdmllJTIwcG9zdGVyJTIwZGFyayUyMGRyYW1hdGljfGVufDF8fHx8MTc3MjQ0MTg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "Chronicles of Aether",
    genre: "Fantasy / Adventure",
    rating: "8.3",
    duration: "2h 35m",
    badge: "Epic",
    badgeColor: "#c47a00",
    image:
      "https://images.unsplash.com/photo-1680909426935-1c907d543577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBmYW50YXN5JTIwbW92aWUlMjBlcGljJTIwY2luZW1hdGljfGVufDF8fHx8MTc3MjQ0MTg1MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function NowShowing() {
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
          {MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              genre={movie.genre}
              rating={movie.rating}
              duration={movie.duration}
              image={movie.image}
              badge={movie.badge}
              badgeColor={movie.badgeColor}
            />
          ))}
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
