import { MovieCard } from "./MovieCard";

const movies = [
  {
    id: 1,
    title: "Star Voyager",
    genre: "Sci-Fi / Adventure",
    image: "https://images.unsplash.com/photo-1653045474061-075ba29db54f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMHNjaS1maSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzcyNDQxMTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    duration: "2h 15m"
  },
  {
    id: 2,
    title: "Urban Legend",
    genre: "Action / Thriller",
    image: "https://images.unsplash.com/photo-1745564371387-7707cc41e958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFjdGlvbiUyMGhpZ2glMjBxdWFsaXR5fGVufDF8fHx8MTc3MjQ0MTE2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.5,
    duration: "1h 58m"
  },
  {
    id: 3,
    title: "Silent Echoes",
    genre: "Drama / Mystery",
    image: "https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGRyYW1hJTIwY2luZW1hdGljfGVufDF8fHx8MTc3MjQ0MTE2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    duration: "2h 05m"
  },
  {
    id: 4,
    title: "Color Pop",
    genre: "Animation / Family",
    image: "https://images.unsplash.com/photo-1561268634-bc32e4604a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFuaW1hdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MjQ0MTE2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    duration: "1h 45m"
  }
];

export function MovieGrid() {
  return (
    <section className="py-20 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-red-500 font-bold tracking-widest text-sm uppercase mb-2 block">Don't Miss Out</span>
            <h2 className="text-4xl font-black tracking-tight">NOW SHOWING</h2>
          </div>
          <button className="text-neutral-400 hover:text-white transition-colors text-sm font-medium hidden md:block">
            View All Showtimes →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieCard {...movie} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <button className="text-neutral-400 hover:text-white transition-colors text-sm font-medium border border-neutral-700 px-6 py-3 rounded-full">
            View All Showtimes
          </button>
        </div>
      </div>
    </section>
  );
}
