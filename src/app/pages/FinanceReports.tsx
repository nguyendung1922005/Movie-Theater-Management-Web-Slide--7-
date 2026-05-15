/**
 * Screen 2 — Detailed Revenue Reports
 * Filterable, sortable data table with date-range picker,
 * movie/room/promo filters, and Export CSV / Generate PDF.
 */

import { useState, useMemo } from "react";
import {
  Search, X, Filter, Download, FileText,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Check, SlidersHorizontal, Loader2,
} from "lucide-react";
import { FinanceLayout, FC } from "../components/FinanceLayout";
import { FinanceReportPrint } from "../components/FinanceReportPrint";

/* ══════════════════════════════════
   TYPES
══════════════════════════════════ */
type SortDir = "asc" | "desc" | null;

interface ReportRow {
  id:           string;
  date:         string;   // YYYY-MM-DD
  displayDate:  string;   // readable
  movie:        string;
  hall:         string;
  showtime:     string;
  ticketsSold:  number;
  combosSold:   number;
  ticketPrice:  number;
  comboRevenue: number;
  gross:        number;
  promoCode:    string;
}

/* ══════════════════════════════════
   SEED DATA  (25 rows, May 1–8 2026)
══════════════════════════════════ */
const MOVIES = ["Your Name","Neon Horizon","Iron Legacy","Code Black","Void Runner","Dark Hollow"];
const HALLS  = ["Hall 1","Hall 2","Hall 3","IMAX","Dolby Atmos"];
const TIMES  = ["10:00","13:30","16:00","19:00","21:30"];
const PROMOS = ["","","","","SUMMER10","","MEMBER20","","VIP15",""];

const HALL_PRICE: Record<string,number> = {
  "Hall 1": 90_000, "Hall 2": 90_000, "Hall 3": 110_000,
  IMAX: 180_000, "Dolby Atmos": 150_000,
};

const rng = (n: number) => {
  const x = Math.sin(n * 7919 + 31337) * 98765;
  return x - Math.floor(x);
};

const REPORT_DATA: ReportRow[] = Array.from({ length: 40 }, (_, i) => {
  const dayOffset = Math.floor(rng(i * 3) * 8);            // May 1–8
  const d = new Date(2026, 4, 1 + dayOffset);
  const movie    = MOVIES[Math.floor(rng(i *  7) * MOVIES.length)];
  const hall     = HALLS [Math.floor(rng(i * 11) * HALLS.length)];
  const showtime = TIMES [Math.floor(rng(i * 13) * TIMES.length)];
  const tickets  = 20 + Math.floor(rng(i * 17) * (HALL_PRICE[hall] === 180_000 ? 58 : 100));
  const combos   = Math.floor(tickets * (0.6 + rng(i * 19) * 0.8));
  const tPrice   = HALL_PRICE[hall];
  const tRev     = tickets * tPrice;
  const cRev     = combos  * 89_000;
  const promo    = PROMOS[i % PROMOS.length];
  const gross    = promo ? Math.round((tRev + cRev) * (promo.includes("20") ? 0.8 : promo.includes("15") ? 0.85 : 0.9)) : tRev + cRev;
  return {
    id:           `RPT-${String(i + 1).padStart(4, "0")}`,
    date:         d.toISOString().slice(0, 10),
    displayDate:  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    movie, hall, showtime,
    ticketsSold:  tickets,
    combosSold:   combos,
    ticketPrice:  tPrice,
    comboRevenue: cRev,
    gross,
    promoCode:    promo,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function vnd(n: number): string {
  if (n >= 1_000_000) return `₫${(n / 1_000_000).toFixed(1)}M`;
  return `₫${n.toLocaleString()}`;
}

/* ══════════════════════════════════
   EXPORT CSV
══════════════════════════════════ */
function exportCSV(rows: ReportRow[]) {
  const headers = ["ID","Date","Movie","Hall","Showtime","Tickets Sold","Combos Sold","Ticket Revenue (₫)","Combo Revenue (₫)","Gross Revenue (₫)","Promo Code"];
  const lines = [headers.join(","), ...rows.map(r => [
    r.id, r.date, `"${r.movie}"`, r.hall, r.showtime,
    r.ticketsSold, r.combosSold,
    r.ticketsSold * r.ticketPrice, r.comboRevenue, r.gross, r.promoCode,
  ].join(","))];
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "cinema_revenue_report.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════
   COLUMN HEADER WITH SORT
══════════════════════════════════ */
function ColHeader({
  label, field, sortField, sortDir, onSort,
}: {
  label: string; field: string;
  sortField: string | null; sortDir: SortDir;
  onSort: (f: string) => void;
}) {
  const active = sortField === field;
  return (
    <button
      onClick={() => onSort(field)}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        padding: 0, color: active ? FC.red : FC.dim,
        fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <ChevronUp   size={8} color={active && sortDir === "asc"  ? FC.red : "rgba(255,255,255,0.15)"} />
        <ChevronDown size={8} color={active && sortDir === "desc" ? FC.red : "rgba(255,255,255,0.15)"} style={{ marginTop: -3 }} />
      </span>
    </button>
  );
}

/* ══════════════════════════════════
   PAGE
══════════════════════════════════ */
const PAGE_SIZE = 10;

export function FinanceReports() {
  // Filters
  const [dateFrom,    setDateFrom]    = useState("2026-05-01");
  const [dateTo,      setDateTo]      = useState("2026-05-08");
  const [movieFilter, setMovieFilter] = useState("All");
  const [hallFilter,  setHallFilter]  = useState("All");
  const [promoFilter, setPromoFilter] = useState("");
  const [filterOpen,  setFilterOpen]  = useState(false);

  // Sort
  const [sortField, setSortField] = useState<string | null>("date");
  const [sortDir,   setSortDir]   = useState<SortDir>("desc");

  // Pagination
  const [page, setPage] = useState(1);

  // Export state
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
      if (sortDir === null) { setSortField(null); }
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let rows = REPORT_DATA.filter(r => {
      if (r.date < dateFrom || r.date > dateTo) return false;
      if (movieFilter !== "All" && r.movie !== movieFilter) return false;
      if (hallFilter  !== "All" && r.hall  !== hallFilter)  return false;
      if (promoFilter && !r.promoCode.toLowerCase().includes(promoFilter.toLowerCase())) return false;
      return true;
    });

    if (sortField && sortDir) {
      rows = [...rows].sort((a, b) => {
        const av = (a as any)[sortField];
        const bv = (b as any)[sortField];
        const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [dateFrom, dateTo, movieFilter, hallFilter, promoFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Totals for visible filtered data
  const totals = useMemo(() => ({
    tickets: filtered.reduce((s, r) => s + r.ticketsSold,  0),
    combos:  filtered.reduce((s, r) => s + r.combosSold,   0),
    gross:   filtered.reduce((s, r) => s + r.gross,         0),
  }), [filtered]);

  const handlePdf = async () => {
    setPdfLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setPdfLoading(false);
    alert("PDF report generation requires a server-side rendering service. In production this would trigger a PDF download.");
  };

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${FC.border}`,
    borderRadius: 10, padding: "8px 12px",
    color: "#fff", fontSize: "0.82rem",
    outline: "none",
    colorScheme: "dark" as const,
  };

  return (
    <FinanceLayout
      activeNav="reports"
      title="Revenue Reports"
      subtitle={`${filtered.length} records · ${dateFrom} – ${dateTo}`}
      actions={
        <>
          <FinanceReportPrint title="Revenue report (print)" subtitle={`${filtered.length} rows · ${dateFrom} – ${dateTo}`}>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", marginTop: 10 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #cbd5e1" }}>
                  {["ID", "Date", "Movie", "Hall", "Gross (₫)"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "4px 2px", color: "#475569", fontWeight: 800 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 40).map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "4px 2px" }}>{r.id}</td>
                    <td style={{ padding: "4px 2px" }}>{r.displayDate}</td>
                    <td style={{ padding: "4px 2px" }}>{r.movie}</td>
                    <td style={{ padding: "4px 2px" }}>{r.hall}</td>
                    <td style={{ padding: "4px 2px", fontWeight: 700 }}>₫{r.gross.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 10, fontSize: 10, fontWeight: 800 }}>
              Total gross (filtered): ₫{filtered.reduce((s, r) => s + r.gross, 0).toLocaleString()}
            </p>
          </FinanceReportPrint>
          <button
            onClick={() => exportCSV(filtered)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              backgroundColor: "rgba(16,185,129,0.1)",
              border: `1px solid rgba(16,185,129,0.28)`,
              color: FC.green, fontSize: "0.78rem", fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handlePdf}
            disabled={pdfLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10,
              background: "linear-gradient(135deg,#e8192c,#c8111f)",
              border: "none",
              color: "#fff", fontSize: "0.78rem", fontWeight: 700,
              cursor: "pointer", opacity: pdfLoading ? 0.6 : 1,
              boxShadow: "0 4px 14px rgba(232,25,44,0.35)",
            }}
          >
            {pdfLoading
              ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Generating…</>
              : <><FileText size={14} /> Generate PDF</>
            }
          </button>
        </>
      }
    >
      <div style={{ padding: "20px 28px 36px" }}>

        {/* ── FILTER PANEL ── */}
        <div style={{
          backgroundColor: FC.card,
          border: `1px solid ${FC.border}`,
          borderRadius: 16, padding: "18px 20px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

            {/* Date range */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div>
                <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 4 }}>From</p>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                  style={inputStyle}
                />
              </div>
              <span style={{ color: FC.dim, fontSize: "0.8rem", alignSelf: "flex-end", paddingBottom: 8 }}>→</span>
              <div>
                <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 4 }}>To</p>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1); }}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 40, backgroundColor: FC.border }} />

            {/* Movie select */}
            <div>
              <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 4 }}>Movie Title</p>
              <select
                value={movieFilter}
                onChange={e => { setMovieFilter(e.target.value); setPage(1); }}
                style={{ ...inputStyle, paddingRight: 28, appearance: "none", cursor: "pointer", minWidth: 150 }}
              >
                <option value="All">All Movies</option>
                {MOVIES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Hall select */}
            <div>
              <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 4 }}>Theater Room</p>
              <select
                value={hallFilter}
                onChange={e => { setHallFilter(e.target.value); setPage(1); }}
                style={{ ...inputStyle, paddingRight: 28, appearance: "none", cursor: "pointer", minWidth: 140 }}
              >
                <option value="All">All Rooms</option>
                {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Promo code */}
            <div>
              <p style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: FC.dim, marginBottom: 4 }}>Promo Code</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, ...inputStyle, padding: "0 10px", height: 36, width: 150 }}>
                <Search size={12} color={FC.dim} />
                <input
                  value={promoFilter}
                  onChange={e => { setPromoFilter(e.target.value); setPage(1); }}
                  placeholder="e.g. SUMMER10"
                  style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: "0.78rem", width: "100%", caretColor: FC.red }}
                />
                {promoFilter && <button onClick={() => setPromoFilter("")} style={{ background: "none", border: "none", cursor: "pointer", color: FC.dim, padding: 0 }}><X size={11} /></button>}
              </div>
            </div>

            {/* Reset */}
            {(movieFilter !== "All" || hallFilter !== "All" || promoFilter || dateFrom !== "2026-05-01" || dateTo !== "2026-05-08") && (
              <button
                onClick={() => { setMovieFilter("All"); setHallFilter("All"); setPromoFilter(""); setDateFrom("2026-05-01"); setDateTo("2026-05-08"); setPage(1); }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "7px 12px", borderRadius: 10, marginTop: 18,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: `1px solid ${FC.border}`,
                  color: FC.muted, fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                }}
              >
                <X size={11} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* ── SUMMARY TOTALS BAR ── */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 16,
        }}>
          {[
            { label: "Records Found",    value: filtered.length.toLocaleString(), color: FC.blue  },
            { label: "Total Tickets",    value: totals.tickets.toLocaleString(),  color: FC.green },
            { label: "Total Combos",     value: totals.combos.toLocaleString(),   color: FC.orange },
            { label: "Total Gross Rev.", value: vnd(totals.gross),                color: FC.red   },
          ].map(s => (
            <div
              key={s.label}
              style={{
                flex: "1 1 0",
                backgroundColor: FC.card,
                border: `1px solid ${FC.border}`,
                borderRadius: 12, padding: "12px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.65rem", color: FC.dim }}>{s.label}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* ── TABLE ── */}
        <div style={{ backgroundColor: FC.card, border: `1px solid ${FC.border}`, borderRadius: 16, overflow: "hidden" }}>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "90px 100px 150px 120px 90px 80px 75px 110px 120px 90px",
            padding: "10px 20px",
            borderBottom: `1px solid ${FC.border}`,
            backgroundColor: "rgba(255,255,255,0.02)",
            gap: 8,
          }}>
            {[
              { label: "Ref",            field: "id"           },
              { label: "Date",           field: "date"         },
              { label: "Movie",          field: "movie"        },
              { label: "Hall",           field: "hall"         },
              { label: "Time",           field: "showtime"     },
              { label: "Tickets",        field: "ticketsSold"  },
              { label: "Combos",         field: "combosSold"   },
              { label: "Ticket Rev.",    field: "ticketPrice"  },
              { label: "Gross Revenue",  field: "gross"        },
              { label: "Promo",          field: "promoCode"    },
            ].map(col => (
              <ColHeader
                key={col.field}
                label={col.label}
                field={col.field}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
              />
            ))}
          </div>

          {/* Data rows */}
          {pageRows.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <p style={{ color: FC.dim, fontSize: "0.9rem" }}>No records match your filters.</p>
            </div>
          ) : (
            pageRows.map((row, i) => (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 100px 150px 120px 90px 80px 75px 110px 120px 90px",
                  padding: "10px 20px",
                  borderBottom: i < pageRows.length - 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: i % 2 === 1 ? "rgba(255,255,255,0.008)" : "transparent",
                  transition: "background .1s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(232,25,44,0.04)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 1 ? "rgba(255,255,255,0.008)" : "transparent"; }}
              >
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: FC.blue, fontFamily: "monospace" }}>{row.id}</span>
                <span style={{ fontSize: "0.72rem", color: FC.muted, fontVariantNumeric: "tabular-nums" }}>{row.displayDate}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.movie}</span>
                <span style={{ fontSize: "0.72rem", color: FC.muted }}>{row.hall}</span>
                <span style={{ fontSize: "0.72rem", color: FC.muted, fontVariantNumeric: "tabular-nums" }}>{row.showtime}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", textAlign: "right" as const }}>{row.ticketsSold}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums", textAlign: "right" as const }}>{row.combosSold}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: FC.green, fontVariantNumeric: "tabular-nums" }}>₫{(row.ticketsSold * row.ticketPrice).toLocaleString()}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>₫{row.gross.toLocaleString()}</span>
                {row.promoCode ? (
                  <span style={{
                    display: "inline-block", padding: "2px 7px", borderRadius: 5,
                    backgroundColor: FC.amberSoft, border: `1px solid rgba(245,158,11,0.28)`,
                    color: FC.amber, fontSize: "0.58rem", fontWeight: 800, fontFamily: "monospace",
                  }}>{row.promoCode}</span>
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.65rem" }}>—</span>
                )}
              </div>
            ))
          )}

          {/* Totals row */}
          {pageRows.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "90px 100px 150px 120px 90px 80px 75px 110px 120px 90px",
              padding: "10px 20px",
              borderTop: `1px solid ${FC.border}`,
              backgroundColor: "rgba(232,25,44,0.05)",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: FC.red, gridColumn: "1 / 6" }}>Page Subtotal</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", textAlign: "right" as const }}>
                {pageRows.reduce((s, r) => s + r.ticketsSold, 0)}
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", textAlign: "right" as const }}>
                {pageRows.reduce((s, r) => s + r.combosSold, 0)}
              </span>
              <span />
              <span style={{ fontSize: "0.82rem", fontWeight: 900, color: FC.red, fontVariantNumeric: "tabular-nums" }}>
                ₫{pageRows.reduce((s, r) => s + r.gross, 0).toLocaleString()}
              </span>
              <span />
            </div>
          )}
        </div>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ fontSize: "0.72rem", color: FC.dim }}>
              Page <strong style={{ color: "#fff" }}>{page}</strong> of <strong style={{ color: "#fff" }}>{totalPages}</strong>
              {" · "}{filtered.length} total records
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 12px", borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${FC.border}`,
                  color: page === 1 ? FC.dimmer : FC.muted,
                  fontSize: "0.75rem", fontWeight: 600, cursor: page === 1 ? "default" : "pointer",
                }}
              >
                <ChevronLeft size={13} /> Prev
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      backgroundColor: page === p ? FC.red : "rgba(255,255,255,0.04)",
                      border: `1px solid ${page === p ? FC.red : FC.border}`,
                      color: page === p ? "#fff" : FC.muted,
                      fontSize: "0.78rem", fontWeight: page === p ? 800 : 500,
                      cursor: "pointer",
                      boxShadow: page === p ? "0 4px 12px rgba(232,25,44,0.35)" : "none",
                    }}
                  >{p}</button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "6px 12px", borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${FC.border}`,
                  color: page === totalPages ? FC.dimmer : FC.muted,
                  fontSize: "0.75rem", fontWeight: 600, cursor: page === totalPages ? "default" : "pointer",
                }}
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </FinanceLayout>
  );
}
