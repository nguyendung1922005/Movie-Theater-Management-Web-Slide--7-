import { Calendar, Bell } from "lucide-react";

const UPCOMING = [
  { id: 1, title: "Neon Requiem", genre: "Cyberpunk / Drama", date: "Mar 14, 2026", color: "#00c8ff" },
  { id: 2, title: "Fallen Kingdoms", genre: "Epic / Historical", date: "Mar 21, 2026", color: "#f5a623" },
  { id: 3, title: "Signal Lost", genre: "Sci-Fi / Thriller", date: "Apr 04, 2026", color: "#7ed321" },
];

export function ComingSoon() {
  return (
    <section className="bg-[#0d0d14] py-16 px-6 border-t border-white/5">
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
                Mark Your Calendar
              </span>
            </div>
            <h2
              className="text-white"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Coming Soon
            </h2>
          </div>
        </div>

        {/* Upcoming list */}
        <div className="flex flex-col gap-4">
          {UPCOMING.map((movie, i) => (
            <div
              key={movie.id}
              className="group flex items-center justify-between p-5 rounded-xl bg-[#111118] border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                {/* Number */}
                <span
                  className="text-white/10 select-none"
                  style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1, minWidth: "2rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Color dot */}
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: movie.color }} />

                <div>
                  <h3 className="text-white" style={{ fontWeight: 700, fontSize: "1rem" }}>
                    {movie.title}
                  </h3>
                  <p style={{ color: movie.color, fontSize: "0.8rem", fontWeight: 500 }}>{movie.genre}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-white/40">
                  <Calendar size={14} />
                  <span style={{ fontSize: "0.85rem" }}>{movie.date}</span>
                </div>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 text-white/50 hover:border-[#e8192c] hover:text-[#e8192c] transition-all duration-200"
                  style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em" }}
                >
                  <Bell size={13} />
                  Remind Me
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
