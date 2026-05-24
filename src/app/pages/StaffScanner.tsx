/**
 * QR / manual ticket check — validates against TICKETS list (same source as MyTickets)
 */

import { useState } from "react";
import { toast } from "sonner";
import { QrCode, Search, ShieldCheck, XCircle } from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";
import { TICKETS, loadPosIssuedTickets, parseCinemaQrPayload } from "../lib/ticketsData";
import type { TicketRecord } from "../lib/ticketsData";

function normRef(s: string) {
  return s.trim().toUpperCase().replace(/\s+/g, "");
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= n ? "#fbbf24" : "rgba(255,255,255,0.12)", fontSize: "0.9rem" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export function StaffScanner() {
  const [refInput, setRefInput] = useState("");
  /** undefined = not searched yet */
  const [result, setResult] = useState<TicketRecord | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [posTickets, setPosTickets] = useState<TicketRecord[]>([]);

  async function lookupBooking(code: string) {
    const trimmed = code.trim();
    const parsed = parseCinemaQrPayload(trimmed);
    const bookingId = parsed?.bookingRef ?? trimmed;
    if (!bookingId) {
      setResult(undefined);
      toast.error("Vui lòng nhập mã hóa đơn hợp lệ!");
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/staff/tickets/${bookingId}/scan`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setResult({
          id: bookingId,
          bookingRef: bookingId.substring(0, 8).toUpperCase(),
          movie: data.data.movieTitle,
          shortDate: "Hôm nay",
          time: "Bây giờ",
          hall: data.data.roomName,
          seats: data.data.seats,
          rating: 5,
          status: "past",
          price: 0,
          cinema: "CGV Vincom",
          accentColor: "#10b981",
          poster: "https://via.placeholder.com/300x450"
        } as unknown as TicketRecord);
      } else {
        toast.error(data.error);
        setResult(null);
      }
    } catch (error) {
      console.error('Error looking up booking:', error);
      toast.error("Lỗi kết nối máy chủ");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function mockCamScan() {
    try {
      const posList = posTickets.length > 0 ? posTickets : await loadPosIssuedTickets();
      const rnd = [
        ...TICKETS.filter((t) => t.status === "upcoming"),
        ...posList.filter((t) => t.status === "upcoming"),
      ];
      if (rnd.length === 0) {
        setRefInput("");
        setResult(null);
        return;
      }
      const hit = rnd[Math.floor(Math.random() * rnd.length)]!;
      setRefInput(`CINEMA:${hit.bookingRef}:${hit.seats.join(",")}`);
      setResult(hit);
    } catch (error) {
      console.error('Error mocking scan:', error);
      toast.error("Failed to generate mock scan");
    }
  }

  const showDenied = result === null && refInput.trim() !== "";

  return (
    <StaffRouteGuard allow={["ticket_checker"]}>
      <StaffPage
        title="QR Ticket Scanner"
        subtitle="Validate CINEMA:… QR payloads · Catalog TICKETS + counter POS sales stored in this browser"
      >
        <div className="flex flex-col lg:flex-row gap-6 pt-6 w-full max-w-6xl mx-auto">
          {/* Mock camera */}
          <div className="w-full lg:flex-1 min-w-0 rounded-3xl border overflow-hidden" style={{ borderColor: SC.border, backgroundColor: SC.card }}>
            <div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: SC.border }}>
              <div className="flex items-center gap-2">
                <QrCode size={18} style={{ color: SC.red }} />
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "white" }}>Live scan viewport</span>
              </div>
              <button
                type="button"
                onClick={mockCamScan}
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest duration-200 transition-transform active:scale-95 self-start sm:self-auto"
                style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.35)`, color: SC.red }}
              >
                Simulate scan
              </button>
            </div>

            <div className="flex justify-center px-4 sm:px-6 py-8 sm:py-10">
              <div
                className="relative w-full max-w-md aspect-[4/3] min-h-[200px] max-h-[min(52vh,420px)] rounded-2xl border flex items-center justify-center overflow-hidden mx-auto"
                style={{
                  borderColor: SC.borderHi,
                  background:
                    "radial-gradient(circle at 45% 30%, rgba(232,25,44,0.18) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.12) 0%, transparent 45%), repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.02) 2px,rgba(255,255,255,.02) 4px), #08080f",
                  boxShadow: "inset 0 0 80px rgba(0,0,0,0.55)",
                }}
              >
                <div
                  className="absolute rounded-xl animate-pulse border border-red-500/45"
                  style={{ inset: "clamp(12px, 6vw, 40px)" }}
                />

                {/* corner brackets */}
                {[
                  { t: true, l: true },
                  { t: true, l: false },
                  { t: false, l: true },
                  { t: false, l: false },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 sm:w-8 sm:h-8"
                    style={{
                      ...(c.t ? { top: "clamp(16px, 5vw, 48px)" } : { bottom: "clamp(16px, 5vw, 48px)" }),
                      ...(c.l ? { left: "clamp(16px, 5vw, 48px)" } : { right: "clamp(16px, 5vw, 48px)" }),
                      borderTop: c.t ? `3px solid ${SC.red}` : undefined,
                      borderBottom: !c.t ? `3px solid ${SC.red}` : undefined,
                      borderLeft: c.l ? `3px solid ${SC.red}` : undefined,
                      borderRight: !c.l ? `3px solid ${SC.red}` : undefined,
                    }}
                  />
                ))}
                <p className="relative z-[1] text-white/35 text-[0.65rem] sm:text-xs font-semibold uppercase text-center px-4" style={{ letterSpacing: "0.2em" }}>
                  Mock camera preview
                </p>
              </div>
            </div>
          </div>

          {/* Controls + result */}
          <div className="w-full lg:w-[420px] lg:max-w-[420px] flex-shrink-0 flex flex-col gap-5 min-w-0">
            <div className="rounded-3xl border p-6" style={{ backgroundColor: SC.cardAlt, borderColor: SC.border }}>
              <p className="text-white/40 uppercase" style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.14em", marginBottom: 10 }}>
                Manual verification
              </p>
              <div className="flex gap-2">
                <div
                  className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl border"
                  style={{ borderColor: SC.border, backgroundColor: "rgba(255,255,255,0.03)" }}
                >
                  <Search size={14} className="text-white/35" />
                  <input
                    value={refInput}
                    onChange={(e) => {
                      setRefInput(e.target.value);
                      setResult(undefined);
                    }}
                    placeholder="Booking ref (TH-ABC1234)…"
                    className="bg-transparent outline-none flex-1 text-white placeholder-white/25 text-sm font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => lookupBooking(refInput)}
                  className="px-5 py-2.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest"
                  style={{
                    background: `linear-gradient(135deg,${SC.red},#99101c)`,
                    boxShadow: "0 6px 26px rgba(232,25,44,0.42)",
                  }}
                >
                  Check
                </button>
              </div>
              <p className="mt-3 text-xs" style={{ color: SC.dim, lineHeight: 1.5 }}>
                Data source: shared <strong style={{ color: SC.red }}>TICKETS</strong> with MyTickets.
              </p>
            </div>

            {/* Result card */}
            {typeof result === "object" && result !== null && (
              <div
                className="rounded-3xl border p-6"
                style={{
                  borderColor: "rgba(16,185,129,0.35)",
                  backgroundColor: "rgba(16,185,129,0.06)",
                  boxShadow: `0 0 40px rgba(16,185,129,0.12)`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                    style={{ borderColor: "rgba(16,185,129,0.45)", backgroundColor: "rgba(16,185,129,0.15)" }}
                  >
                    <ShieldCheck size={20} style={{ color: SC.green }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", fontWeight: 800 }}>
                      Valid Ticket
                    </p>
                    <p className="text-white mt-1" style={{ fontWeight: 900, fontSize: "1.05rem" }}>
                      {result.movie}
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                      Ref <span style={{ fontFamily: "monospace", color: "white", fontWeight: 700 }}>{result.bookingRef}</span> · {result.shortDate}{" "}
                      · {result.time}
                    </p>
                    <p className="text-white/50 text-xs mt-1">{result.hall} · Seats {result.seats.join(", ")}</p>
                  </div>
                </div>
                {typeof result.rating === "number" && (
                  <div className="mt-4 flex items-center gap-2 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "0.72rem", color: SC.dim }}>Guest rating snapshot</span>
                    <Stars n={result.rating} />
                  </div>
                )}
              </div>
            )}

            {showDenied && (
              <div
                className="rounded-3xl border p-6 flex gap-4"
                style={{ borderColor: "rgba(232,25,44,0.38)", backgroundColor: SC.redSoft, boxShadow: `0 0 40px rgba(232,25,44,0.12)` }}
              >
                <XCircle className="text-[#e8192c] flex-shrink-0" />
                <div>
                  <p className="text-white font-black">No match found</p>
                  <p className="text-white/50 text-sm mt-1">
                    &quot;<span style={{ fontFamily: "monospace" }}>{normRef(refInput)}</span>&quot; is not recognised in TICKETS demo data.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = TICKETS.filter((t) => t.status === "upcoming")[0];
                      setRefInput(sample?.bookingRef ?? "TH-ABC1234");
                      if (sample) setResult(sample);
                    }}
                    className="mt-3 text-[#e8192c] text-xs font-bold underline underline-offset-2"
                  >
                    Load sample booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </StaffPage>
    </StaffRouteGuard>
  );
}
