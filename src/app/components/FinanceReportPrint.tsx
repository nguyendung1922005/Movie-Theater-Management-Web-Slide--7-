/**
 * A4-oriented print shell for finance export (window.print).
 */

import { Printer } from "lucide-react";

export function FinanceReportPrint({
  label = "Export Report",
  title,
  subtitle,
  children,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 10,
          border: `1px solid rgba(6,182,212,0.35)`,
          background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08))",
          color: "#e0f2fe",
          fontSize: "0.78rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <Printer size={14} style={{ color: "#22d3ee" }} />
        {label}
      </button>

      <div
        className="finance-a4-report"
        style={{
          position: "fixed",
          left: -12000,
          top: 0,
          width: "210mm",
          boxSizing: "border-box",
          padding: "12mm 14mm",
          backgroundColor: "#fff",
          color: "#0a0a0f",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          lineHeight: 1.45,
          zIndex: 0,
        }}
      >
        <div style={{ borderBottom: "2px solid #0a0a0f", paddingBottom: 10, marginBottom: 14 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", fontWeight: 800, color: "#0369a1", margin: 0 }}>CINEMA FINANCE</p>
          <h2 style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 900 }}>{title}</h2>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: 10, color: "#334155" }}>{subtitle}</p>}
          <p style={{ margin: "8px 0 0", fontSize: 9, color: "#64748b" }}>
            Generated {new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        {children}
        <p style={{ marginTop: 16, fontSize: 8, color: "#94a3b8" }}>
          Confidential — internal accounting use only. Figures merge live POS localStorage with catalog seed data.
        </p>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden !important; }
          .finance-a4-report, .finance-a4-report * { visibility: visible !important; }
          .finance-a4-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
