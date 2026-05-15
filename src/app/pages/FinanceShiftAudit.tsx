/**
 * Shift Audit — ended shifts from staff clock-out + accountant approval.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CheckCircle2, Clock, Banknote, Shield } from "lucide-react";
import { FinanceLayout, FC } from "../components/FinanceLayout";
import { FinanceReportPrint } from "../components/FinanceReportPrint";
import { approveShiftAudit, loadShiftAudits, type ShiftAuditRecord } from "../lib/shiftAuditData";
import { formatVndFull } from "../lib/financeAccounting";

function fmtDur(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

function roleLabel(r: ShiftAuditRecord["role"]) {
  if (r === "counter_staff") return "Counter Staff";
  if (r === "ticket_checker") return "Ticket Checker";
  return "General Staff";
}

export function FinanceShiftAudit() {
  const [v, setV] = useState(0);
  const rows = useMemo(() => {
    void v;
    return loadShiftAudits();
  }, [v]);

  function onApprove(id: string) {
    approveShiftAudit(id);
    setV((x) => x + 1);
  }

  const pending = rows.filter((r) => !r.approved).length;

  return (
    <FinanceLayout
      activeNav="shift-audit"
      title="Shift Audit"
      subtitle="Clock-out declarations · Cash reconciliation · Period close"
      actions={
        <FinanceReportPrint title="Shift Audit Report" subtitle={`${rows.length} shift record(s) · ${pending} pending`}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #cbd5e1" }}>
                {["Ended (UTC)", "Role", "Duration", "Cash declared", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 4px", color: "#475569", fontWeight: 800 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "6px 4px" }}>{new Date(r.clockOutIso).toLocaleString("en-GB")}</td>
                  <td style={{ padding: "6px 4px" }}>{roleLabel(r.role)}</td>
                  <td style={{ padding: "6px 4px" }}>{fmtDur(r.durationSec)}</td>
                  <td style={{ padding: "6px 4px", fontWeight: 700 }}>{formatVndFull(r.reportedCashVnd)}</td>
                  <td style={{ padding: "6px 4px" }}>{r.approved ? "Approved" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FinanceReportPrint>
      }
    >
      <div style={{ padding: "24px 28px 40px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
            padding: "14px 18px",
            borderRadius: 14,
            border: `1px solid rgba(6,182,212,0.25)`,
            background: "linear-gradient(90deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))",
          }}
        >
          <Shield size={18} style={{ color: "#22d3ee", flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem", margin: 0 }}>Linked to staff clock-out</p>
            <p style={{ fontSize: "0.75rem", color: FC.muted, marginTop: 4, lineHeight: 1.55 }}>
              When counter staff <strong style={{ color: "#e0f2fe" }}>Clock Out</strong> in the Staff Portal, a row is created here with
              their declared cash. Approve to mark the accounting period reconciled for that shift.
            </p>
            <Link
              to="/staff/shift"
              style={{ fontSize: "0.72rem", color: "#22d3ee", fontWeight: 700, marginTop: 8, display: "inline-block" }}
            >
              Open Staff Portal → Shift
            </Link>
          </div>
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              borderRadius: 16,
              border: `1px dashed ${FC.borderHi}`,
              backgroundColor: FC.card,
              color: FC.dim,
            }}
          >
            <Clock size={32} style={{ margin: "0 auto 12px", opacity: 0.35 }} />
            <p style={{ fontWeight: 700, color: "#fff" }}>No ended shifts yet</p>
            <p style={{ fontSize: "0.8rem", marginTop: 6 }}>Clock out from the staff bar to create the first audit record.</p>
          </div>
        ) : (
          <div style={{ borderRadius: 16, border: `1px solid ${FC.border}`, overflow: "hidden", backgroundColor: FC.card }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 140px 120px 160px",
                padding: "10px 18px",
                borderBottom: `1px solid ${FC.border}`,
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              {["Clock out", "Role", "Duration", "Cash reported", "Status", "Actions"].map((h) => (
                <span key={h} style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.1em", color: FC.dim, textTransform: "uppercase" }}>
                  {h}
                </span>
              ))}
            </div>
            {rows.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 100px 140px 120px 160px",
                  padding: "14px 18px",
                  alignItems: "center",
                  borderBottom: i < rows.length - 1 ? `1px solid rgba(255,255,255,0.05)` : "none",
                  backgroundColor: i % 2 ? "rgba(255,255,255,0.02)" : "transparent",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>
                    {new Date(r.clockOutIso).toLocaleString()}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.62rem", color: FC.dim, fontFamily: "monospace" }}>
                    In {new Date(r.clockInIso).toLocaleTimeString()} · {r.id}
                  </p>
                </div>
                <span style={{ fontSize: "0.78rem", color: FC.muted }}>{roleLabel(r.role)}</span>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontVariantNumeric: "tabular-nums" }}>{fmtDur(r.durationSec)}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#e0f2fe", fontVariantNumeric: "tabular-nums" }}>
                  <Banknote size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, opacity: 0.7 }} />
                  {formatVndFull(r.reportedCashVnd)}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 999,
                    width: "fit-content",
                    backgroundColor: r.approved ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                    color: r.approved ? FC.green : FC.amber,
                    border: `1px solid ${r.approved ? "rgba(16,185,129,0.35)" : "rgba(245,158,11,0.35)"}`,
                  }}
                >
                  {r.approved ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {r.approved ? "Approved" : "Pending"}
                </span>
                <div>
                  {!r.approved ? (
                    <button
                      type="button"
                      onClick={() => onApprove(r.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        color: "#fff",
                        background: "linear-gradient(135deg,#0891b2,#2563eb)",
                        boxShadow: "0 4px 16px rgba(8,145,178,0.35)",
                      }}
                    >
                      Approve &amp; Reconcile
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.68rem", color: FC.dim }}>
                      {r.approvedAtIso ? new Date(r.approvedAtIso).toLocaleString() : "—"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FinanceLayout>
  );
}
