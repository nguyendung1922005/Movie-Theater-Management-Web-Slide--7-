import { useMemo, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { PackageOpen, PencilLine, Save, Search } from "lucide-react";
import { SNACK_ITEMS, type SnackItem } from "../lib/commerceData";

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

type InventoryRow = SnackItem & { stock: number };

export function AdminInventory() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<InventoryRow[]>(
    () => SNACK_ITEMS.map((s, idx) => ({ ...s, stock: idx % 2 === 0 ? 42 : 18 })),
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => (r.name + " " + r.size).toLowerCase().includes(s));
  }, [q, rows]);

  const setRow = (id: string, next: Partial<InventoryRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...next } : r)));
  };

  const totalSku = rows.length;
  const lowStock = rows.filter((r) => r.stock <= 10).length;

  return (
    <AdminLayout
      title="Snack Inventory"
      subtitle="Manage bắp nước using the same SNACK_ITEMS structure as Checkout."
    >
      <div className="flex flex-col gap-4">
        {/* Top bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: C.surface, borderColor: C.border }}
          >
            <Search size={14} style={{ color: C.muted }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search snacks…"
              className="bg-transparent text-white placeholder-white/25 outline-none"
              style={{ fontSize: "0.82rem", width: "240px" }}
            />
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: C.border, fontSize: "0.78rem", color: "rgba(255,255,255,0.55)" }}
          >
            <PackageOpen size={14} style={{ color: C.red }} />
            SKUs: <span style={{ color: "white", fontWeight: 800 }}>{totalSku}</span>
            <span className="mx-2" style={{ color: "rgba(255,255,255,0.18)" }}>•</span>
            Low stock: <span style={{ color: lowStock ? C.amber : C.green, fontWeight: 900 }}>{lowStock}</span>
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
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <p className="text-white/55 uppercase" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.14em" }}>
              Concessions Inventory
            </p>
            <div className="text-white/25" style={{ fontSize: "0.72rem" }}>
              Edits update local state (demo)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Item", "Size", "Price (VND)", "Stock", "Status", ""].map((h) => (
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
                {filtered.map((r) => {
                  const status = r.stock <= 0 ? "OUT" : r.stock <= 10 ? "LOW" : "OK";
                  const statusColor = status === "OK" ? C.green : status === "LOW" ? C.amber : C.red;
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.03)",
                              borderColor: "rgba(255,255,255,0.08)",
                              boxShadow: "0 0 35px rgba(232,25,44,0.10)",
                              fontSize: "1.15rem",
                            }}
                          >
                            {r.emoji}
                          </div>
                          <div>
                            <p className="text-white" style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                              {r.name}
                            </p>
                            <p className="text-white/35" style={{ fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.06em" }}>
                              {r.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.82rem", fontWeight: 600 }}>
                          {r.size}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          value={String(r.price)}
                          onChange={(e) => setRow(r.id, { price: Math.max(0, Number(e.target.value || 0)) })}
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
                      <td className="px-5 py-3">
                        <input
                          value={String(r.stock)}
                          onChange={(e) => setRow(r.id, { stock: Math.max(0, Number(e.target.value || 0)) })}
                          className="px-3 py-2 rounded-xl border bg-transparent text-white outline-none"
                          style={{
                            borderColor: "rgba(255,255,255,0.10)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            fontSize: "0.82rem",
                            width: "120px",
                            fontFamily: "monospace",
                          }}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="px-3 py-1.5 rounded-full border"
                          style={{
                            backgroundColor: `${statusColor}12`,
                            borderColor: `${statusColor}30`,
                            color: statusColor,
                            fontSize: "0.68rem",
                            fontWeight: 900,
                            letterSpacing: "0.12em",
                          }}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          className="w-9 h-9 rounded-xl border flex items-center justify-center text-white/35 hover:text-white transition-all"
                          style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.02)" }}
                          title="Edit"
                        >
                          <PencilLine size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center" style={{ color: C.muted }}>
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            <p style={{ fontSize: "0.78rem" }}>
              Showing <span style={{ color: "white", fontWeight: 800 }}>{filtered.length}</span> item{filtered.length === 1 ? "" : "s"}
            </p>
            <button
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all active:scale-[0.99]"
              style={{
                backgroundColor: C.redSoft,
                border: `1px solid ${C.redGlow}`,
                color: C.red,
                fontWeight: 900,
                fontSize: "0.76rem",
                letterSpacing: "0.12em",
              }}
              onClick={() => {}}
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

