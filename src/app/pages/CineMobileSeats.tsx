import { useState, useRef } from "react";
import { Link } from "react-router";
import { ArrowLeft, Info, ChevronRight } from "lucide-react";

const C = {
  bg:      "#0a0a0f",
  surface: "#0e0e16",
  card:    "#131320",
  border:  "rgba(255,255,255,0.07)",
  red:     "#e8192c",
  redGlow: "rgba(232,25,44,0.32)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  dim:     "rgba(255,255,255,0.2)",
};

const ROWS = 10;
const COLS = 15;
const PRICE_MAP: Record<string, number> = {
  A: 80000, B: 80000, C: 90000, D: 90000,
  E: 100000, F: 100000, G: 120000, H: 120000,
  I: 150000, J: 150000,
};
const ROW_LABELS = Array.from({ length: ROWS }, (_, i) => String.fromCharCode(65 + i));
const TAKEN = new Set([
  "A3","A4","A12","B7","B8","B9","C2","C10","C14",
  "D5","D6","E3","E11","F4","F13","G2","G7","G8",
  "H5","H6","I3","I4","I10","J1","J8","J9","J14",
]);
const VIP_ROWS = ["I","J"];
const PREMIUM_ROWS = ["G","H"];

function formatVND(v: number) {
  return v.toLocaleString("vi-VN") + " ₫";
}

export function CineMobileSeats() {
  const [selected, setSelected] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    if (TAKEN.has(id)) return;
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const total = selected.reduce((acc, id) => {
    const row = id[0];
    return acc + (PRICE_MAP[row] ?? 90000);
  }, 0);

  const getSeatColor = (id: string, row: string) => {
    if (TAKEN.has(id)) return { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.04)", glow: "none" };
    if (selected.includes(id)) return { bg: C.red, border: C.red, glow: `0 0 10px ${C.redGlow}` };
    if (VIP_ROWS.includes(row)) return { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.35)", glow: "none" };
    if (PREMIUM_ROWS.includes(row)) return { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", glow: "none" };
    return { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.14)", glow: "none" };
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: C.bg, minHeight: "100vh", color: C.text }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4"
        style={{ height: 56, backgroundColor: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <Link to="/cine/mobile/home" className="w-9 h-9 rounded-xl border flex items-center justify-center no-underline"
          style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.04)", color: C.muted, textDecoration: "none" }}>
          <ArrowLeft size={17} />
        </Link>
        <div className="flex-1 text-center">
          <p className="text-white" style={{ fontWeight: 800, fontSize: "0.88rem", letterSpacing: "-0.01em" }}>Select Your Seats</p>
          <p style={{ fontSize: "0.6rem", color: C.dim }}>Your Name · IMAX · Thu Mar 5</p>
        </div>
        <button className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.04)", color: C.muted }}>
          <Info size={16} />
        </button>
      </header>

      {/* ── SCREEN INDICATOR ── */}
      <div className="px-4 pt-5 pb-4 flex flex-col items-center">
        <div className="relative w-full max-w-xs overflow-hidden" style={{ height: 28 }}>
          {/* Screen curve */}
          <div className="absolute inset-x-0 top-0 h-6 rounded-t-full border-t-2 border-x-2"
            style={{ borderColor: "rgba(255,255,255,0.18)", background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)", boxShadow: "0 -4px 24px rgba(255,255,255,0.06)" }} />
          <div className="absolute inset-x-8 bottom-0 flex items-center justify-center">
            <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>SCREEN</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          {[
            { label: "Available", bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.18)" },
            { label: "Selected", bg: C.red, border: C.red },
            { label: "Premium", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
            { label: "VIP", bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.35)" },
            { label: "Taken", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.06)" },
          ].map(({ label, bg, border }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-[4px] flex-shrink-0" style={{ backgroundColor: bg, border: `1px solid ${border}` }} />
              <span style={{ fontSize: "0.55rem", fontWeight: 600, color: C.dim, whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SEAT GRID (horizontal scroll) ── */}
      <div className="flex-1 overflow-x-auto pb-4" ref={gridRef}
        style={{ scrollbarWidth: "none" }}>
        <div className="inline-flex flex-col gap-1.5 px-4" style={{ minWidth: "max-content" }}>
          {ROW_LABELS.map(row => (
            <div key={row} className="flex items-center gap-1.5">
              {/* Row label */}
              <span className="w-5 flex-shrink-0 text-center" style={{ fontSize: "0.65rem", fontWeight: 700, color: C.dim }}>{row}</span>

              {/* Seats */}
              {Array.from({ length: COLS }, (_, c) => {
                const col = c + 1;
                const id = `${row}${col}`;
                const isTaken = TAKEN.has(id);
                const isSelected = selected.includes(id);
                const colors = getSeatColor(id, row);

                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    disabled={isTaken}
                    className="flex-shrink-0 rounded-[5px] transition-all duration-150 active:scale-90"
                    style={{
                      width: 24, height: 22,
                      backgroundColor: colors.bg,
                      border: `1.5px solid ${colors.border}`,
                      boxShadow: colors.glow,
                      cursor: isTaken ? "not-allowed" : "pointer",
                      opacity: isTaken ? 0.4 : 1,
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                );
              })}

              {/* Row label right */}
              <span className="w-5 flex-shrink-0 text-center" style={{ fontSize: "0.65rem", fontWeight: 700, color: C.dim }}>{row}</span>
            </div>
          ))}

          {/* Col numbers */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-5" />
            {Array.from({ length: COLS }, (_, c) => (
              <span key={c} className="flex-shrink-0 text-center" style={{ width: 24, fontSize: "0.5rem", color: C.dim, fontWeight: 600 }}>{c + 1}</span>
            ))}
            <span className="w-5" />
          </div>
        </div>
      </div>

      {/* ── SELECTED SEATS SUMMARY ── */}
      {selected.length > 0 && (
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {selected.map(id => (
              <button key={id} onClick={() => toggle(id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: C.red + "18", border: `1px solid ${C.red}35`, color: C.red, fontSize: "0.7rem", fontWeight: 700 }}>
                {id} <X_ICON size={10} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STICKY BOTTOM FOOTER ── */}
      <div className="sticky bottom-0 z-30" style={{ backgroundColor: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, padding: "14px 16px", paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))" }}>
        {/* Showtime info strip */}
        <div className="flex items-center gap-3 mb-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }}>
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="text-white" style={{ fontWeight: 700, fontSize: "0.78rem" }}>Your Name</p>
            <p style={{ fontSize: "0.62rem", color: C.dim }}>IMAX · Thu, Mar 5 · 19:30</p>
          </div>
          <div className="h-8 w-px" style={{ backgroundColor: C.border }} />
          <div className="flex flex-col items-end gap-0.5">
            <p style={{ fontSize: "0.6rem", color: C.dim }}>Seats</p>
            <p className="text-white" style={{ fontWeight: 800, fontSize: "0.85rem" }}>
              {selected.length > 0 ? selected.join(", ") : "None"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Price */}
          <div className="flex-1">
            <p style={{ fontSize: "0.62rem", color: C.dim, marginBottom: "2px" }}>
              {selected.length > 0 ? `${selected.length} seat${selected.length > 1 ? "s" : ""}` : "No seats selected"}
            </p>
            <p className="text-white" style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "-0.03em" }}>
              {selected.length > 0 ? formatVND(total) : "—"}
            </p>
          </div>

          {/* Proceed button */}
          <Link
            to={selected.length > 0 ? "/cine/mobile/checkout" : "#"}
            onClick={e => { if (selected.length === 0) e.preventDefault(); }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white no-underline transition-all"
            style={{
              background: selected.length > 0 ? `linear-gradient(135deg, ${C.red}, #c8111f)` : "rgba(255,255,255,0.06)",
              boxShadow: selected.length > 0 ? `0 6px 24px ${C.redGlow}` : "none",
              fontWeight: 800, fontSize: "0.9rem", textDecoration: "none",
              opacity: selected.length > 0 ? 1 : 0.4, pointerEvents: selected.length > 0 ? "auto" : "none",
            }}>
            Proceed <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* tiny X icon component to avoid lucide naming collision */
function X_ICON({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
