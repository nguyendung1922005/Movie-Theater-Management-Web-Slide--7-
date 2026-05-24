import { useMemo, useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Copy, Plus, Search, Tag, Trash2, Zap } from "lucide-react";

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
  green: "#10b981",
  amber: "#f59e0b",
};

function fmtValue(v: any) {
  return v.discountType === "PERCENT" ? `${v.discountValue}%` : `${v.discountValue.toLocaleString("vi-VN")} ₫`;
}

export function AdminPromotions() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/promotions")
      .then(res => res.json())
      .then(data => { if (data.success) setRows(data.data); });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return rows;
    return rows.filter((r) => r.code.includes(s));
  }, [q, rows]);

  const updateRow = async (id: string, next: any) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...next } : r)));
    await fetch(`http://localhost:3000/api/admin/promotions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
  };

  const addVoucher = async () => {
    const newCode = "NEW" + Math.floor(Math.random() * 10000);
    const base = {
      title: "Mã Mới", desc: "Mô tả", cta: "Nhận", icon: "Ticket", color: "#e8192c", isActive: true,
      code: newCode,
      discountType: "PERCENT",
      discountValue: 10,
      minOrderValue: 0
    };
    const res = await fetch("http://localhost:3000/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(base)
    });
    const json = await res.json();
    if (json.success) {
      setRows([json.data, ...rows]);
    }
  };

  const removeVoucher = async (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    await fetch(`http://localhost:3000/api/admin/promotions/${id}`, { method: "DELETE" });
  };

  return (
    <AdminLayout
      title="Promotions"
      subtitle="Manage voucher codes used at Checkout (linked to PromoCode validation)."
      actions={
        <button
          onClick={addVoucher}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all active:scale-[0.99]"
          style={{
            backgroundColor: C.red,
            color: "white",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            boxShadow: "0 10px 30px rgba(232,25,44,0.30)",
          }}
        >
          <Plus size={14} /> Add Voucher
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Search + hint */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: C.surface, borderColor: C.border }}
          >
            <Search size={14} style={{ color: C.muted }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by code… (e.g. CINEMA20)"
              className="bg-transparent text-white placeholder-white/25 outline-none"
              style={{ fontSize: "0.82rem", width: "240px" }}
            />
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              borderColor: C.border,
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.78rem",
            }}
          >
            <Zap size={14} style={{ color: C.red }} />
            Checkout PromoCode accepts active vouchers by code.
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: C.card,
            borderColor: C.border,
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between gap-3" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <Tag size={14} style={{ color: C.red }} />
              <p className="text-white/55 uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em" }}>
                Vouchers
              </p>
            </div>
            <button
              onClick={addVoucher}
              className="sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: C.red, color: "white", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.08em" }}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Code", "Type", "Value", "Expiry", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="py-2.5 text-left px-5"
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.28)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.code} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    {/* Code */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          value={r.code}
                          onChange={(e) => {
                            updateRow(r.id, { code: e.target.value.toUpperCase() });
                          }}
                          className="px-3 py-2 rounded-xl border bg-transparent text-white outline-none"
                          style={{
                            borderColor: "rgba(255,255,255,0.10)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            fontSize: "0.82rem",
                            fontFamily: "monospace",
                            letterSpacing: "0.08em",
                            width: "170px",
                          }}
                        />
                        <button
                          onClick={() => navigator.clipboard?.writeText(r.code)}
                          className="w-9 h-9 rounded-xl border flex items-center justify-center text-white/40 hover:text-white transition-all"
                          style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.02)" }}
                          title="Copy code"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-3">
                      <select
                        value={r.discountType}
                        onChange={(e) => updateRow(r.id, { discountType: e.target.value })}
                        className="px-3 py-2 rounded-xl border bg-transparent text-white outline-none"
                        style={{
                          borderColor: "rgba(255,255,255,0.10)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          fontSize: "0.82rem",
                        }}
                      >
                        <option value="PERCENT">Percent</option>
                        <option value="FIXED">Flat</option>
                      </select>
                    </td>

                    {/* Value */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          value={String(r.discountValue)}
                          onChange={(e) => updateRow(r.id, { discountValue: Math.max(0, Number(e.target.value || 0)) })}
                          className="px-3 py-2 rounded-xl border bg-transparent text-white outline-none"
                          style={{
                            borderColor: "rgba(255,255,255,0.10)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            fontSize: "0.82rem",
                            width: "120px",
                            fontFamily: "monospace",
                          }}
                        />
                        <span style={{ color: C.muted, fontSize: "0.78rem", fontWeight: 700 }}>
                          {r.discountType === "PERCENT" ? "%" : "₫"}
                        </span>
                      </div>
                      <p className="mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem" }}>
                        Preview: <span style={{ color: C.red, fontWeight: 800 }}>{fmtValue(r)}</span>
                      </p>
                    </td>

                    {/* Min Order Value */}
                    <td className="px-5 py-3">
                      <input
                        value={r.minOrderValue}
                        onChange={(e) => updateRow(r.id, { minOrderValue: Math.max(0, Number(e.target.value || 0)) })}
                        className="px-3 py-2 rounded-xl border bg-transparent text-white outline-none"
                        style={{
                          borderColor: "rgba(255,255,255,0.10)",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          fontSize: "0.82rem",
                          width: "140px",
                          fontFamily: "monospace",
                        }}
                      />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <button
                        onClick={() => updateRow(r.id, { isActive: !r.isActive })}
                        className="px-3 py-1.5 rounded-full border transition-all"
                        style={{
                          backgroundColor: r.isActive ? "rgba(16,185,129,0.10)" : "rgba(232,25,44,0.10)",
                          borderColor: r.isActive ? "rgba(16,185,129,0.25)" : "rgba(232,25,44,0.25)",
                          color: r.isActive ? C.green : C.red,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        {r.isActive ? "Active" : "Off"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeVoucher(r.id)}
                        className="w-9 h-9 rounded-xl border flex items-center justify-center text-white/35 hover:text-white transition-all"
                        style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.02)" }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center" style={{ color: C.muted }}>
                      No vouchers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            <p style={{ fontSize: "0.78rem" }}>
              Showing <span style={{ color: "white", fontWeight: 800 }}>{filtered.length}</span> voucher{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-2 rounded-xl border"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: C.border, fontSize: "0.76rem" }}
              >
                Checkout demo code:{" "}
                <span style={{ color: C.red, fontFamily: "monospace", fontWeight: 800, letterSpacing: "0.08em" }}>
                  CINEMA20
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick explanation card */}
        <div
          className="rounded-2xl border p-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            borderColor: C.border,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <p className="text-white" style={{ fontWeight: 800, fontSize: "0.9rem" }}>
            How it links to Checkout
          </p>
          <p className="mt-1" style={{ color: C.muted, fontSize: "0.8rem", lineHeight: 1.7 }}>
            The Checkout <span style={{ color: "white", fontWeight: 700 }}>PromoCode</span> panel validates against the{" "}
            <span style={{ color: C.red, fontWeight: 900 }}>active voucher codes</span> defined in the same shared data source.
            (This is demo-ready and can be replaced with API persistence later.)
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
