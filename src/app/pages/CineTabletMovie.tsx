import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft, Play, Star, Clock, Calendar, ChevronRight,
  Heart, Share2, Bookmark, Film, Award, Users,
  MapPin, Volume2, Maximize2, ChevronDown, ChevronUp,
  Ticket, Check, Zap,
} from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  cardB:   "#161624",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.28)",
  green:   "#10b981",
  amber:   "#f59e0b",
  blue:    "#3b82f6",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.22)",
};

const SHOWTIMES = [
  { date:"Thu, Mar 5",  times:["10:15","13:00","16:45","19:30","22:00"], avail:[true,true,false,true,true]  },
  { date:"Fri, Mar 6",  times:["11:00","14:15","17:00","20:30","23:00"], avail:[true,true,true,false,true]  },
  { date:"Sat, Mar 7",  times:["10:00","12:30","15:00","18:30","21:00"], avail:[true,false,true,true,false] },
];

const CAST = [
  { name:"Ryunosuke K.", role:"Director",   img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { name:"Mone Kamishiraishi",role:"Lead",  img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { name:"Ryusei Yokohama",role:"Lead",     img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
  { name:"Hanae Natsuki",role:"Voice",      img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80" },
];

const SEAT_TYPES = [
  { id:"standard", label:"Standard", price:80000,  desc:"Row A–F",  color:C.blue   },
  { id:"premium",  label:"Premium",  price:120000, desc:"Row G–H",  color:C.amber  },
  { id:"vip",      label:"VIP",      price:150000, desc:"Row I–J",  color:C.red    },
];

function formatVND(v: number) { return v.toLocaleString("vi-VN") + " ₫"; }

export function CineTabletMovie() {
  const [playerActive, setPlayerActive] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [synopsisOpen, setSynopsisOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [seatType, setSeatType] = useState("premium");

  const price = SEAT_TYPES.find(s => s.id === seatType)?.price ?? 120000;
  const canProceed = selectedTime !== null;

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b flex items-center justify-between px-7 h-14"
        style={{ backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(24px)", borderColor: C.border }}>
        <div className="flex items-center gap-4">
          <Link to="/cine/tablet/home" className="flex items-center gap-2 px-3 py-2 rounded-xl border no-underline transition-all"
            style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.03)", color: C.muted, textDecoration: "none" }}>
            <ArrowLeft size={16} /> <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Back</span>
          </Link>
          <div className="h-5 w-px" style={{ backgroundColor: C.border }} />
          <div>
            <span className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>Your Name</span>
            <span style={{ fontSize: "0.72rem", color: C.dim, marginLeft: 8 }}>Romance · Animation · 106m</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLiked(v => !v)} className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
            style={{ borderColor: liked ? "rgba(232,25,44,0.4)" : C.border, backgroundColor: liked ? "rgba(232,25,44,0.1)" : "rgba(255,255,255,0.03)" }}>
            <Heart size={16} fill={liked ? C.red : "none"} stroke={liked ? C.red : C.muted} />
          </button>
          <button className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.03)", color: C.muted }}>
            <Share2 size={15} />
          </button>
          <button onClick={() => setBookmarked(v => !v)} className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all"
            style={{ borderColor: bookmarked ? "rgba(232,25,44,0.4)" : C.border, backgroundColor: bookmarked ? "rgba(232,25,44,0.1)" : "rgba(255,255,255,0.03)" }}>
            <Bookmark size={15} fill={bookmarked ? C.red : "none"} stroke={bookmarked ? C.red : C.muted} />
          </button>
        </div>
      </header>

      {/* ════════ TWO-COLUMN LAYOUT ════════ */}
      <div className="flex gap-0 overflow-hidden" style={{ minHeight: "calc(100vh - 56px)" }}>

        {/* ══ LEFT COLUMN (scrollable) ══ */}
        <div className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
          <div style={{ padding: "28px 32px 48px" }}>

            {/* ── VIDEO PLAYER ── */}
            <div className="relative rounded-2xl overflow-hidden mb-6 cursor-pointer group"
              style={{ aspectRatio: "16/9", backgroundColor: "#000", boxShadow: "0 16px 60px rgba(0,0,0,0.7)" }}
              onClick={() => setPlayerActive(v => !v)}>

              {/* Poster / frame */}
              <img src="https://images.unsplash.com/photo-1769847780887-dc6f4380621e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
                alt="Your Name" className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.01]" />
              <div className="absolute inset-0" style={{ background: playerActive ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)" }} />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${playerActive ? "scale-90 opacity-60" : "scale-100 opacity-100 group-hover:scale-110"}`}
                  style={{ background: `linear-gradient(135deg, ${C.red}, #c8111f)`, boxShadow: `0 8px 32px ${C.redGlow}` }}>
                  <Play size={24} fill="white" stroke="none" className="ml-1" />
                </div>
              </div>

              {/* Top-right: player controls (subtle) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                  <Volume2 size={13} className="text-white" />
                </div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
                  <Maximize2 size={13} className="text-white" />
                </div>
              </div>

              {/* Trailer label */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <Play size={10} fill="white" stroke="none" />
                <span className="text-white" style={{ fontSize: "0.65rem", fontWeight: 700 }}>Official Trailer · 2:32</span>
              </div>
            </div>

            {/* ── MOVIE META ── */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-white mb-1.5" style={{ fontWeight: 900, fontSize: "2rem", letterSpacing: "-0.04em", lineHeight: 1 }}>Your Name</h1>
                <p style={{ fontSize: "0.82rem", color: C.dim }}>Romance · Animation · 2016 · Japan</p>
              </div>
              {/* Ratings */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <Star size={16} fill="#f59e0b" stroke="none" />
                  <span className="text-white" style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>9.0</span>
                  <span style={{ fontSize: "0.65rem", color: C.dim }}>/10</span>
                </div>
                <p style={{ fontSize: "0.62rem", color: C.dim }}>128K reviews</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["IMAX", "4DX", "Dolby Atmos", "Romance", "Animation", "Coming-of-Age", "Time Swap", "K. Shinkai"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full border"
                  style={{ fontSize: "0.65rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.04)", borderColor: C.border, color: C.muted }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Star size={14} />,    label: "Rating",   value: "9.0/10",   color: C.amber  },
                { icon: <Clock size={14} />,   label: "Runtime",  value: "106 min",  color: C.blue   },
                { icon: <Film size={14} />,    label: "Format",   value: "IMAX",     color: C.red    },
                { icon: <Award size={14} />,   label: "Awards",   value: "28 Won",   color: "#8b5cf6" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-4 rounded-2xl border text-center"
                  style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <span style={{ color }}>{icon}</span>
                  <p className="text-white" style={{ fontWeight: 800, fontSize: "0.88rem" }}>{value}</p>
                  <p style={{ fontSize: "0.58rem", color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-6">
              <button onClick={() => setSynopsisOpen(v => !v)}
                className="flex items-center justify-between w-full mb-3"
                style={{ color: C.text }}>
                <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>Synopsis</h2>
                {synopsisOpen ? <ChevronUp size={16} style={{ color: C.muted }} /> : <ChevronDown size={16} style={{ color: C.muted }} />}
              </button>
              {synopsisOpen && (
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                  Mitsuha Miyamizu, a high school girl, yearns to live the life of a boy in the bustling city of Tokyo. One day, she wakes up in the body of Taki Tachibana, a high school boy living in Tokyo. Meanwhile, Taki finds himself living Mitsuha's life in the humble town of Itomori. As the days pass, the two teenagers find themselves living each other's lives and must figure out a way to make their situation work while uncovering a deep, cosmic connection between them.
                </p>
              )}
            </div>

            {/* Cast */}
            <div className="mb-4">
              <h2 className="text-white mb-4" style={{ fontWeight: 800, fontSize: "1rem" }}>Cast & Crew</h2>
              <div className="grid grid-cols-4 gap-3">
                {CAST.map(person => (
                  <div key={person.name} className="flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all hover:border-white/15"
                    style={{ backgroundColor: C.card, borderColor: C.border }}>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white" style={{ fontWeight: 700, fontSize: "0.72rem", lineHeight: 1.3 }}>{person.name}</p>
                      <p style={{ fontSize: "0.6rem", color: C.dim }}>{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN (sticky booking sidebar) ══ */}
        <div className="flex-shrink-0 overflow-y-auto border-l"
          style={{ width: 340, borderColor: C.border, backgroundColor: C.surface }}>
          <div className="sticky top-0">

            {/* Sidebar header */}
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2 mb-1">
                <Ticket size={15} style={{ color: C.red }} />
                <h2 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem" }}>Book Tickets</h2>
              </div>
              <p style={{ fontSize: "0.68rem", color: C.dim }}>Select date, time & seat type</p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">

              {/* ── Date Picker ── */}
              <div>
                <p className="uppercase mb-2.5" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: C.dim }}>Select Date</p>
                <div className="flex gap-2 flex-wrap">
                  {SHOWTIMES.map((st, i) => (
                    <button key={st.date} onClick={() => { setSelectedDate(i); setSelectedTime(null); }}
                      className="flex-1 flex flex-col items-center py-2.5 rounded-xl border transition-all"
                      style={{
                        borderColor: selectedDate === i ? C.red + "50" : C.border,
                        backgroundColor: selectedDate === i ? C.red + "15" : "rgba(255,255,255,0.02)",
                        minWidth: 80,
                      }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: selectedDate === i ? C.red : C.dim, letterSpacing: "0.06em" }}>
                        {st.date.split(",")[0].toUpperCase()}
                      </span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: selectedDate === i ? C.text : "rgba(255,255,255,0.5)" }}>
                        {st.date.split(" ").slice(-2).join(" ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Showtimes ── */}
              <div>
                <p className="uppercase mb-2.5" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: C.dim }}>Showtime</p>
                <div className="flex flex-wrap gap-2">
                  {SHOWTIMES[selectedDate].times.map((t, i) => {
                    const avail = SHOWTIMES[selectedDate].avail[i];
                    const sel = selectedTime === t;
                    return (
                      <button key={t} onClick={() => avail && setSelectedTime(sel ? null : t)}
                        disabled={!avail}
                        className="px-3.5 py-2 rounded-xl border transition-all"
                        style={{
                          fontSize: "0.78rem", fontWeight: sel ? 800 : 600,
                          backgroundColor: sel ? C.red + "20" : avail ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                          borderColor: sel ? C.red + "60" : avail ? C.border : "rgba(255,255,255,0.04)",
                          color: sel ? C.red : avail ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                          cursor: avail ? "pointer" : "not-allowed",
                          textDecoration: !avail ? "line-through" : "none",
                        }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
                {!canProceed && (
                  <p style={{ fontSize: "0.65rem", color: C.dim, marginTop: "8px" }}>Please select a showtime</p>
                )}
              </div>

              {/* ── Seat Type ── */}
              <div>
                <p className="uppercase mb-2.5" style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.16em", color: C.dim }}>Seat Type</p>
                <div className="flex flex-col gap-2">
                  {SEAT_TYPES.map(st => (
                    <button key={st.id} onClick={() => setSeatType(st.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left"
                      style={{
                        backgroundColor: seatType === st.id ? `${st.color}14` : "rgba(255,255,255,0.02)",
                        borderColor: seatType === st.id ? `${st.color}45` : C.border,
                      }}>
                      <div className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ backgroundColor: `${st.color}40`, border: `2px solid ${seatType === st.id ? st.color : "rgba(255,255,255,0.15)"}` }} />
                      <div className="flex-1">
                        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: seatType === st.id ? C.text : "rgba(255,255,255,0.5)" }}>{st.label}</p>
                        <p style={{ fontSize: "0.6rem", color: C.dim }}>{st.desc}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: seatType === st.id ? st.color : C.muted }}>{formatVND(st.price)}</span>
                        {seatType === st.id && <Check size={10} style={{ color: st.color, marginTop: 2 }} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Venue ── */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: C.border }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", color: C.blue }}>
                  <MapPin size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white" style={{ fontWeight: 700, fontSize: "0.8rem" }}>CGV Vincom Center</p>
                  <p style={{ fontSize: "0.62rem", color: C.dim }}>IMAX Hall 01 · Ba Dinh, Hanoi</p>
                </div>
              </div>

              {/* ── Summary ── */}
              {canProceed && (
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: C.red + "0a", borderColor: C.red + "25" }}>
                  <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${C.red} 50%, transparent)` }} />
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span style={{ fontSize: "0.72rem", color: C.dim }}>Date & Time</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                        {SHOWTIMES[selectedDate].date} · {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: "0.72rem", color: C.dim }}>Seat Type</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "capitalize" }}>{seatType}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: C.red + "20" }}>
                      <span className="text-white" style={{ fontWeight: 700, fontSize: "0.78rem" }}>Price / seat</span>
                      <span style={{ fontWeight: 900, fontSize: "0.9rem", color: C.red }}>{formatVND(price)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CTA Button ── */}
              <Link
                to={canProceed ? "/cine/mobile/seats" : "#"}
                onClick={e => { if (!canProceed) e.preventDefault(); }}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white no-underline transition-all"
                style={{
                  background: canProceed ? `linear-gradient(135deg, ${C.red}, #c8111f)` : "rgba(255,255,255,0.06)",
                  fontWeight: 900, fontSize: "0.95rem", textDecoration: "none",
                  boxShadow: canProceed ? `0 8px 28px ${C.redGlow}` : "none",
                  opacity: canProceed ? 1 : 0.5, pointerEvents: canProceed ? "auto" : "none",
                  transform: canProceed ? "none" : "none",
                }}>
                <Zap size={16} fill={canProceed ? "white" : "rgba(255,255,255,0.3)"} stroke="none" />
                Select Seats
              </Link>

              {/* Members promo */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                <span style={{ fontSize: "1rem" }}>⭐</span>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700, color: "#f59e0b" }}>Gold Members</span> get 20% off + priority seating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
