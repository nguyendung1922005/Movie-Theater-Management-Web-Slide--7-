import { useMemo, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Inbox, MessageSquareText, Search, Star } from "lucide-react";
import { TICKETS } from "../lib/ticketsData";

/* ════════════════════════════════════════
   PALETTE
════════════════════════════════════════ */
const C = {
  bg: "#0a0a0f",
  surface: "#0f0f18",
  card: "#13131e",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.13)",
  red: "#e8192c",
  redSoft: "rgba(232,25,44,0.12)",
  redGlow: "rgba(232,25,44,0.28)",
  muted: "rgba(255,255,255,0.45)",
  dim: "rgba(255,255,255,0.2)",
  amber: "#f59e0b",
};

function PosterThumb({ src, title, accent }: { src: string; title: string; accent: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div
      className="w-12 h-12 rounded-2xl overflow-hidden border flex-shrink-0 flex items-center justify-center text-[0.55rem] font-black text-white/50"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        backgroundColor: broken ? `${accent}33` : "rgba(255,255,255,0.04)",
      }}
    >
      {!broken ? (
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="px-1 text-center leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
          No art
        </span>
      )}
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          style={{
            color: i <= n ? C.amber : "rgba(255,255,255,0.15)",
            fill: i <= n ? C.amber : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export function AdminFeedback() {
  const [q, setQ] = useState("");
  const feedback = useMemo(() => {
    const base = TICKETS.filter((t) => t.status === "past" && typeof t.rating === "number");
    const s = q.trim().toLowerCase();
    if (!s) return base;
    return base.filter((t) => (t.movie + " " + (t.comment ?? "")).toLowerCase().includes(s));
  }, [q]);

  return (
    <AdminLayout
      title="Feedback"
      subtitle="Customer ratings & comments (extracted from MyTickets mock data)."
    >
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: C.surface, borderColor: C.border }}
          >
            <Search size={14} style={{ color: C.muted }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search feedback…"
              className="bg-transparent text-white placeholder-white/25 outline-none"
              style={{ fontSize: "0.82rem", width: "260px" }}
            />
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: C.border, fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}
          >
            <MessageSquareText size={14} style={{ color: C.red }} />
            Showing <span style={{ color: "white", fontWeight: 800 }}>{feedback.length}</span> review{feedback.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* List */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: C.border }}>
            <MessageSquareText size={14} style={{ color: C.red }} />
            <p className="text-white/55 uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em" }}>
              Recent Feedback
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {feedback.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center" style={{ color: C.muted }}>
                <Inbox size={44} strokeWidth={1.25} style={{ opacity: 0.28, marginBottom: 14 }} />
                <p style={{ fontWeight: 800, color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>No data available</p>
                <p className="mt-2 max-w-sm" style={{ fontSize: "0.82rem", lineHeight: 1.55 }}>
                  No feedback matches your search. Clear the search box or try another keyword.
                </p>
              </div>
            ) : (
            feedback.map((t) => (
              <div
                key={t.id}
                className="px-5 py-4 duration-200 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-4">
                  <PosterThumb src={t.poster} title={t.movie} accent={t.accentColor} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white truncate" style={{ fontWeight: 800, fontSize: "0.95rem" }}>
                          {t.movie}
                        </p>
                        <p className="text-white/35 mt-0.5" style={{ fontSize: "0.75rem" }}>
                          {t.shortDate} · {t.cinema}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Stars n={t.rating ?? 0} />
                        <span className="text-white/25 font-mono" style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}>
                          #{t.bookingRef}
                        </span>
                      </div>
                    </div>

                    <div
                      className="mt-3 rounded-2xl border p-3"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <p style={{ color: "rgba(255,255,255,0.70)", fontSize: "0.82rem", lineHeight: 1.65 }}>
                        {t.comment ?? "No written comment provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

