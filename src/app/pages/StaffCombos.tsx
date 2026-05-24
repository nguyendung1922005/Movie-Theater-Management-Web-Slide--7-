/**
 * Screen 3 — Combo Snack Management
 * Simple, clean view of popcorn/drink combo offerings.
 * Inline price editing, quick availability toggle,
 * and "Add New Combo" modal form.
 */

import { useState, useMemo, useEffect } from "react";
import {
  Plus, X, Check, Edit2, Trash2, Search,
  ChevronDown, Loader2, Package, DollarSign,
  TrendingUp, ShoppingBag, Tag, AlertTriangle,
  ToggleLeft, ToggleRight, Coffee,
} from "lucide-react";
import { StaffPage, SC } from "../components/StaffLayout";
import { StaffRouteGuard } from "../components/StaffRouteGuard";

/* ══════════════════════════════════
   TYPES
══════════════════════════════════ */
type Category = "Popcorn" | "Drink" | "Bundle" | "Snack";

interface Combo {
  id:          string;
  name:        string;
  description: string;
  category:    Category;
  emoji:       string;
  price:       number;
  available:   boolean;
  popular:     boolean;
  soldToday:   number;
  color:       string;
}

/* ══════════════════════════════════
   SEED DATA
══════════════════════════════════ */
const SEED: Combo[] = [
  {
    id: "c01",
    name: "Classic Combo",
    description: "Medium popcorn + 1 large soft drink of your choice",
    category: "Bundle", emoji: "🍿",
    price: 89000, available: true, popular: true,
    soldToday: 148, color: "#e8192c",
  },
  {
    id: "c02",
    name: "XL Popcorn Bucket",
    description: "Extra-large salted or caramel popcorn, serves 2",
    category: "Popcorn", emoji: "🪣",
    price: 65000, available: true, popular: true,
    soldToday: 112, color: "#f97316",
  },
  {
    id: "c03",
    name: "Sweet & Salty Mix",
    description: "Half caramel / half salted popcorn, medium bucket",
    category: "Popcorn", emoji: "🎭",
    price: 55000, available: true, popular: false,
    soldToday: 74, color: "#f59e0b",
  },
  {
    id: "c04",
    name: "Premium Bundle",
    description: "Large popcorn + 2 large drinks + 1 nachos with cheese",
    category: "Bundle", emoji: "👑",
    price: 145000, available: true, popular: true,
    soldToday: 62, color: "#8b5cf6",
  },
  {
    id: "c05",
    name: "Iced Coffee Duo",
    description: "2× signature iced lattes — perfect for couples",
    category: "Drink", emoji: "☕",
    price: 78000, available: true, popular: false,
    soldToday: 43, color: "#06b6d4",
  },
  {
    id: "c06",
    name: "Nachos Fiesta",
    description: "Loaded nachos with cheese, salsa, and jalapeños",
    category: "Snack", emoji: "🌮",
    price: 49000, available: true, popular: false,
    soldToday: 58, color: "#10b981",
  },
  {
    id: "c07",
    name: "Kids Fun Pack",
    description: "Small popcorn + juice box + gummy bears",
    category: "Bundle", emoji: "🧒",
    price: 69000, available: true, popular: false,
    soldToday: 35, color: "#ec4899",
  },
  {
    id: "c08",
    name: "Craft Soda Flight",
    description: "3 mini craft sodas — try all our signature flavors",
    category: "Drink", emoji: "🥤",
    price: 59000, available: false, popular: false,
    soldToday: 0, color: "#3b82f6",
  },
  {
    id: "c09",
    name: "Popcorn Shrimp Box",
    description: "Crispy shrimp bites with dipping sauce",
    category: "Snack", emoji: "🦐",
    price: 72000, available: false, popular: false,
    soldToday: 0, color: "#6366f1",
  },
];

const CATEGORIES: Array<Category | "All"> = ["All","Bundle","Popcorn","Drink","Snack"];

const CAT_COLOR: Record<Category, string> = {
  Bundle:  "#e8192c",
  Popcorn: "#f97316",
  Drink:   "#3b82f6",
  Snack:   "#10b981",
};

function fmtPrice(p: number) {
  return new Intl.NumberFormat("vi-VN").format(p) + "₫";
}

/* ══════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════ */
function ToggleSwitch({ value, onChange, loading }: { value: boolean; onChange: () => void; loading?: boolean }) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 rounded-full transition-all duration-200"
      style={{
        width: 38, height: 21,
        backgroundColor: value ? "rgba(16,185,129,0.22)" : "rgba(255,255,255,0.07)",
        border: `1.5px solid ${value ? "rgba(16,185,129,0.45)" : "rgba(255,255,255,0.12)"}`,
      }}
    >
      {loading ? (
        <Loader2 size={10} className="absolute inset-0 m-auto animate-spin" style={{ color: SC.dim }} />
      ) : (
        <span
          className="absolute rounded-full transition-all duration-200"
          style={{
            width: 14, height: 14,
            top: "50%", transform: "translateY(-50%)",
            left: value ? "calc(100% - 16px)" : "2px",
            backgroundColor: value ? SC.green : "rgba(255,255,255,0.3)",
            boxShadow: value ? `0 0 5px ${SC.green}80` : "none",
          }}
        />
      )}
    </button>
  );
}

/* ══════════════════════════════════
   INLINE PRICE EDITOR
══════════════════════════════════ */
function PriceEditor({
  combo, onSave,
}: {
  combo:  Combo;
  onSave: (id: string, price: number) => void;
}) {
  const [editing, setEditing]  = useState(false);
  const [value,   setValue]    = useState(String(combo.price));
  const [saving,  setSaving]   = useState(false);

  const handleSave = async () => {
    const num = parseInt(value.replace(/\D/g,""));
    if (!num || num === combo.price) { setEditing(false); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    onSave(combo.id, num);
    setSaving(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
          className="w-28 px-2.5 py-1.5 rounded-xl text-white outline-none"
          style={{
            fontSize: "0.82rem", fontWeight: 700,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: `1.5px solid rgba(232,25,44,0.5)`,
            caretColor: SC.red,
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all"
          style={{ backgroundColor: SC.red, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
        </button>
        <button
          onClick={() => { setEditing(false); setValue(String(combo.price)); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <X size={11} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setEditing(true); setValue(String(combo.price)); }}
      className="flex items-center gap-1.5 group/price"
      title="Click to edit price"
    >
      <span className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>
        {fmtPrice(combo.price)}
      </span>
      <Edit2
        size={12}
        className="opacity-0 group-hover/price:opacity-60 transition-opacity"
        style={{ color: SC.muted }}
      />
    </button>
  );
}

/* ══════════════════════════════════
   ADD COMBO MODAL
══════════════════════════════════ */
function AddComboModal({
  onClose, onSave,
}: {
  onClose: () => void;
  onSave:  (combo: Combo) => void;
}) {
  const [name,   setName]   = useState("");
  const [desc,   setDesc]   = useState("");
  const [cat,    setCat]    = useState<Category>("Bundle");
  const [emoji,  setEmoji]  = useState("🍿");
  const [price,  setPrice]  = useState("89000");
  const [saving, setSaving] = useState(false);

  const EMOJI_OPTIONS = ["🍿","🪣","☕","🥤","🌮","🦐","🧁","🍔","🍕","🥨","🍫","🧃","👑","🎭","🧒"];

  const valid = name.trim() && parseInt(price) > 0;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 650));
    onSave({
      id:          "c" + Date.now(),
      name:        name.trim(),
      description: desc.trim(),
      category:    cat,
      emoji,
      price:       parseInt(price),
      available:   true,
      popular:     false,
      soldToday:   0,
      color:       CAT_COLOR[cat],
    });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full rounded-3xl border overflow-hidden"
        style={{
          maxWidth: 500,
          backgroundColor: "#0d0d18",
          borderColor: SC.borderHi,
          boxShadow: "0 0 0 1px rgba(232,25,44,0.1), 0 40px 100px rgba(0,0,0,0.85)",
          animation: "sfModalIn .3s cubic-bezier(.34,1.4,.64,1) forwards",
        }}
      >
        <div className="h-0.5" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.25)` }}>
              <Plus size={16} style={{ color: SC.red }} />
            </div>
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>Add New Combo</h2>
              <p style={{ fontSize: "0.7rem", color: SC.dim }}>Create a new snack offering</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border flex items-center justify-center text-white/30 hover:text-white/70 transition-all" style={{ borderColor: SC.border }}>
            <X size={14} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Emoji picker */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all"
                  style={{
                    backgroundColor: emoji === e ? SC.redSoft : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${emoji === e ? "rgba(232,25,44,0.4)" : SC.border}`,
                  }}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Combo Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Premium Bundle"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.88rem", caretColor: SC.red }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(232,25,44,0.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What's included in this combo?"
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none resize-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.85rem", caretColor: SC.red }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(232,25,44,0.5)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          {/* Category + Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Category</label>
              <div className="flex flex-col gap-1.5">
                {(["Bundle","Popcorn","Drink","Snack"] as Category[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all"
                    style={{
                      backgroundColor: cat === c ? `${CAT_COLOR[c]}15` : "rgba(255,255,255,0.02)",
                      borderColor:     cat === c ? `${CAT_COLOR[c]}45` : SC.border,
                      color:           cat === c ? CAT_COLOR[c] : SC.muted,
                      fontSize: "0.78rem", fontWeight: cat === c ? 700 : 500,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: CAT_COLOR[c] }} />
                    {c}
                    {cat === c && <Check size={11} className="ml-auto" style={{ color: CAT_COLOR[c] }} />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.16em", color: SC.dim }}>Price (VND) *</label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="89000"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white outline-none"
                  style={{ border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.9rem", caretColor: SC.red }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(232,25,44,0.5)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                {parseInt(price) > 0 && (
                  <div className="mt-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: SC.redSoft, border: `1px solid rgba(232,25,44,0.2)` }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: SC.red }}>
                      {fmtPrice(parseInt(price))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.01)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border text-white/35 hover:text-white/70 transition-all" style={{ fontSize: "0.82rem", fontWeight: 600, borderColor: SC.border }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!valid || saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-40 transition-all"
            style={{
              background: "linear-gradient(135deg,#e8192c,#c8111f)",
              fontSize: "0.82rem", fontWeight: 800,
              boxShadow: valid ? "0 6px 20px rgba(232,25,44,0.38)" : "none",
            }}
          >
            {saving ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : <><Check size={13} /> Create Combo</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   COMBO CARD
══════════════════════════════════ */
function ComboCard({
  combo, onToggle, onPriceSave, onDelete, loadingToggle,
}: {
  combo:        Combo;
  onToggle:     (id: string) => void;
  onPriceSave:  (id: string, price: number) => void;
  onDelete:     (id: string) => void;
  loadingToggle: string | null;
}) {
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div
      className="relative rounded-2xl border overflow-hidden group transition-all"
      style={{
        backgroundColor: SC.card,
        borderColor: combo.available ? SC.border : "rgba(255,255,255,0.04)",
        opacity: combo.available ? 1 : 0.65,
        animation: "sfSlideUp .28s both",
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5" style={{ background: combo.available ? `linear-gradient(90deg,transparent,${combo.color}80,transparent)` : "transparent" }} />

      {/* Popular badge */}
      {combo.popular && combo.available && (
        <div
          className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${combo.color}18`, border: `1px solid ${combo.color}35`, fontSize: "0.5rem", fontWeight: 800, letterSpacing: "0.1em", color: combo.color }}
        >POPULAR</div>
      )}

      <div className="p-5">
        {/* Top row: emoji + info */}
        <div className="flex items-start gap-4">
          {/* Emoji container */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              backgroundColor: `${combo.color}12`,
              border: `1.5px solid ${combo.color}28`,
            }}
          >
            {combo.emoji}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="text-white" style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
                {combo.name}
              </h3>
            </div>
            <p style={{ fontSize: "0.72rem", color: SC.muted, marginTop: 3, lineHeight: 1.5 }}>
              {combo.description}
            </p>
            {/* Category tag */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded mt-2"
              style={{
                fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em",
                backgroundColor: `${CAT_COLOR[combo.category]}14`,
                color: CAT_COLOR[combo.category],
                border: `1px solid ${CAT_COLOR[combo.category]}28`,
              }}
            >
              <Tag size={8} />{combo.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }} />

        {/* Price + stats row */}
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: SC.dim, marginBottom: 4 }}>Price</p>
            <PriceEditor combo={combo} onSave={onPriceSave} />
          </div>

          {combo.available && combo.soldToday > 0 && (
            <div className="text-right">
              <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: SC.dim, marginBottom: 4 }}>Sold today</p>
              <p className="text-white" style={{ fontWeight: 800, fontSize: "1.05rem" }}>{combo.soldToday}</p>
            </div>
          )}
        </div>

        {/* Bottom row: toggle + actions */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2.5">
            <ToggleSwitch
              value={combo.available}
              onChange={() => onToggle(combo.id)}
              loading={loadingToggle === combo.id}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: combo.available ? SC.green : SC.dim }}>
              {loadingToggle === combo.id ? "…" : combo.available ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Delete */}
          {confirmDel ? (
            <div className="flex items-center gap-1.5" style={{ animation: "sfFadeIn .15s both" }}>
              <span style={{ fontSize: "0.68rem", color: SC.amber }}>Delete?</span>
              <button onClick={() => onDelete(combo.id)} className="px-2.5 py-1 rounded-lg text-white transition-all" style={{ backgroundColor: SC.red, fontSize: "0.68rem", fontWeight: 700 }}>Yes</button>
              <button onClick={() => setConfirmDel(false)} className="px-2.5 py-1 rounded-lg transition-all" style={{ backgroundColor: "rgba(255,255,255,0.06)", fontSize: "0.68rem", color: SC.muted }}>No</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDel(true)}
              className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
              style={{ borderColor: SC.border, color: SC.dim }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export function StaffCombos() {
  const [combos,       setCombos]       = useState<Combo[]>(SEED);
  const [addOpen,      setAddOpen]      = useState(false);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState<Category | "All">("All");
  const [loadingToggle,setLoadingToggle]= useState<string | null>(null);
  const [showUnavail,  setShowUnavail]  = useState(true);

  const filtered = useMemo(() =>
    combos.filter(c => {
      if (!showUnavail && !c.available) return false;
      if (catFilter !== "All" && c.category !== catFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [combos, search, catFilter, showUnavail]
  );

  const totalSoldToday    = combos.reduce((s, c) => s + c.soldToday, 0);
  const availableCount    = combos.filter(c => c.available).length;
  const topCombo          = [...combos].sort((a,b) => b.soldToday - a.soldToday)[0];
  const avgPrice          = Math.round(combos.reduce((s,c) => s + c.price, 0) / combos.length);

  const handleToggle = async (id: string) => {
    setLoadingToggle(id);
    await new Promise(r => setTimeout(r, 450));
    setCombos(prev => prev.map(c => c.id === id ? { ...c, available: !c.available } : c));
    setLoadingToggle(null);
  };

  const handlePriceSave = (id: string, price: number) => {
    setCombos(prev => prev.map(c => c.id === id ? { ...c, price } : c));
  };

  const handleDelete = (id: string) => {
    setCombos(prev => prev.filter(c => c.id !== id));
  };

  const handleAdd = (combo: Combo) => {
    setCombos(prev => [combo, ...prev]);
  };

  return (
    <StaffRouteGuard allow={["general_staff"]}>
    <StaffPage
      title="Snack Combos"
      subtitle="Manage combo offerings, prices, and availability"
      actions={
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 h-9 rounded-xl text-white transition-all"
          style={{
            background: "linear-gradient(135deg,#e8192c,#c8111f)",
            fontSize: "0.82rem", fontWeight: 800,
            boxShadow: "0 4px 16px rgba(232,25,44,0.38)",
          }}
        >
          <Plus size={15} /> Add New Combo
        </button>
      }
    >
      <>

        {/* ── STATS STRIP ── */}
        <div className="flex items-stretch gap-4 pt-6 pb-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            {
              label: "Total Combos",
              value: combos.length,
              sub: `${availableCount} available`,
              color: SC.blue,
              icon: <Package size={16} />,
            },
            {
              label: "Sold Today",
              value: totalSoldToday.toLocaleString(),
              sub: "across all combos",
              color: SC.green,
              icon: <ShoppingBag size={16} />,
            },
            {
              label: "Best Seller",
              value: topCombo?.name ?? "—",
              sub: `${topCombo?.soldToday ?? 0} units today`,
              color: SC.red,
              icon: <TrendingUp size={16} />,
            },
            {
              label: "Avg Price",
              value: fmtPrice(avgPrice),
              sub: "across all offerings",
              color: SC.amber,
              icon: <DollarSign size={16} />,
            },
          ].map(({ label, value, sub, color, icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl flex-shrink-0 min-w-0"
              style={{ backgroundColor: SC.card, border: `1px solid ${SC.border}`, minWidth: 200 }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}16`, color }}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-white truncate" style={{ fontWeight: 800, fontSize: "1rem" }}>{value}</p>
                <p style={{ fontSize: "0.62rem", color: SC.dim, marginTop: 1 }}>{label}</p>
                <p style={{ fontSize: "0.6rem", color: SC.dim, marginTop: 1 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div
            className="flex items-center gap-2.5 px-4 h-10 rounded-2xl border flex-1"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: search ? "rgba(255,255,255,0.15)" : SC.border, maxWidth: 340 }}
          >
            <Search size={14} style={{ color: SC.dim, flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search combos…"
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: "0.85rem", caretColor: SC.red }}
            />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: SC.dim }} /></button>}
          </div>

          {/* Category chips */}
          <div className="flex gap-2">
            {CATEGORIES.map(c => {
              const color = c === "All" ? SC.red : CAT_COLOR[c as Category];
              const active = catFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className="px-3.5 py-2 rounded-xl border transition-all"
                  style={{
                    fontSize: "0.72rem", fontWeight: active ? 800 : 500,
                    backgroundColor: active ? `${color}15` : "rgba(255,255,255,0.02)",
                    borderColor: active ? `${color}45` : SC.border,
                    color: active ? color : SC.dim,
                  }}
                >{c}</button>
              );
            })}
          </div>

          {/* Show unavailable toggle */}
          <div className="flex items-center gap-2 ml-auto px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${SC.border}` }}>
            <span style={{ fontSize: "0.72rem", color: SC.muted }}>Show unavailable</span>
            <ToggleSwitch value={showUnavail} onChange={() => setShowUnavail(v => !v)} />
          </div>
        </div>

        {/* ── COMBO GRID ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${SC.border}` }}
            >🍿</div>
            <p className="text-white" style={{ fontWeight: 700, fontSize: "0.95rem" }}>No combos found</p>
            <p style={{ fontSize: "0.72rem", color: SC.dim, marginTop: 4 }}>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
          >
            {filtered.map(combo => (
              <ComboCard
                key={combo.id}
                combo={combo}
                onToggle={handleToggle}
                onPriceSave={handlePriceSave}
                onDelete={handleDelete}
                loadingToggle={loadingToggle}
              />
            ))}
          </div>
        )}

        {/* Count */}
        <div className="mt-6 flex items-center justify-between">
          <span style={{ fontSize: "0.72rem", color: SC.dim }}>
            Showing <strong className="text-white">{filtered.length}</strong> of <strong className="text-white">{combos.length}</strong> combos
          </span>
          {(search || catFilter !== "All") && (
            <button
              onClick={() => { setSearch(""); setCatFilter("All"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ fontSize: "0.68rem", fontWeight: 600, backgroundColor: "rgba(255,255,255,0.05)", color: SC.muted, border: `1px solid ${SC.border}` }}
            >
              <X size={10} /> Clear Filters
            </button>
          )}
        </div>
      </>

      {/* Add Modal */}
      {addOpen && (
        <AddComboModal
          onClose={() => setAddOpen(false)}
          onSave={handleAdd}
        />
      )}
    </StaffPage>
    </StaffRouteGuard>
  );
}
