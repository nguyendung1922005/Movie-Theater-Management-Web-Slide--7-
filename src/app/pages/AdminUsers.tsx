import { useState, useMemo, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Search, X, Download, Edit2, Ban, ChevronDown, Check,
  AlertTriangle, Loader2, ChevronLeft, ChevronRight,
  Star, Mail, Phone, Calendar, ShieldCheck, UserCheck,
  UserX, Users, Filter, MoreHorizontal, CheckSquare,
  Square, ArrowUpDown, ChevronUp, Eye, Trash2,
  UserPlus, Clock, TrendingUp,
} from "lucide-react";

/* ═══════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════ */
type Role   = "Admin" | "Staff" | "Customer";
type Status = "active" | "blocked" | "pending";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  points: number;
  totalBookings: number;
  totalSpend: number;
  joinedDate: string;
  lastActive: string;
  initials: string;
  avatarHue: number;
}

const ROLE_CONFIG: Record<Role, { label: string; bg: string; border: string; text: string; dot: string }> = {
  Admin:    { label: "Admin",    bg: "rgba(232,25,44,0.12)",  border: "rgba(232,25,44,0.3)",  text: "#ff4d5e", dot: "#e8192c" },
  Staff:    { label: "Staff",    bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", text: "#60a5fa", dot: "#3b82f6" },
  Customer: { label: "Customer", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)",text: "#94a3b8", dot: "#64748b" },
};

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  active:  { label: "Active",  bg: "rgba(16,185,129,0.1)",  text: "#10b981", dot: "#10b981" },
  blocked: { label: "Blocked", bg: "rgba(232,25,44,0.1)",   text: "#e8192c", dot: "#e8192c" },
  pending: { label: "Pending", bg: "rgba(245,158,11,0.1)",  text: "#f59e0b", dot: "#f59e0b" },
};

const AVATAR_PALETTES = [
  ["#e8192c","#a00e1f"], ["#3b82f6","#1d4ed8"], ["#8b5cf6","#6d28d9"],
  ["#f97316","#c2410c"], ["#10b981","#047857"], ["#06b6d4","#0e7490"],
  ["#f59e0b","#b45309"], ["#ec4899","#9d174d"], ["#14b8a6","#0f766e"],
];

function getAvatarGrad(name: string): string {
  const idx = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % AVATAR_PALETTES.length;
  return `linear-gradient(135deg,${AVATAR_PALETTES[idx][0]},${AVATAR_PALETTES[idx][1]})`;
}

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date(2026, 2, 5);
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  if (diff < 365)return `${Math.floor(diff / 30)}mo ago`;
  return `${Math.floor(diff / 365)}y ago`;
}

function uid() { return Math.random().toString(36).slice(2, 8); }
const PAGE_SIZE = 10;

/* ═══════════════════════════════════
   SEED DATA
═══════════════════════════════════ */
const SEED_USERS: User[] = [
  { id:"u1",  name:"Nguyen Van An",    email:"admin@cinema.vn",        phone:"0901 234 567", role:"Admin",    status:"active",  points:0,     totalBookings:0,  totalSpend:0,   joinedDate:"2024-01-10", lastActive:"2026-03-05", initials:"NA", avatarHue:0  },
  { id:"u2",  name:"Tran Thi Bich",   email:"bich.tran@cinema.vn",    phone:"0912 345 678", role:"Staff",    status:"active",  points:320,   totalBookings:12, totalSpend:18,  joinedDate:"2024-03-20", lastActive:"2026-03-05", initials:"TB", avatarHue:1  },
  { id:"u3",  name:"Le Minh Duc",     email:"duc.le@cinema.vn",       phone:"0923 456 789", role:"Staff",    status:"active",  points:180,   totalBookings:8,  totalSpend:12,  joinedDate:"2024-06-15", lastActive:"2026-03-04", initials:"LD", avatarHue:2  },
  { id:"u4",  name:"Pham Thu Ha",     email:"ha.pham@gmail.com",      phone:"0934 567 890", role:"Customer", status:"active",  points:4820,  totalBookings:48, totalSpend:164, joinedDate:"2024-02-01", lastActive:"2026-03-05", initials:"PH", avatarHue:3  },
  { id:"u5",  name:"Vo Quoc Hung",    email:"hung.vo@gmail.com",      phone:"0945 678 901", role:"Customer", status:"active",  points:2140,  totalBookings:24, totalSpend:88,  joinedDate:"2024-04-12", lastActive:"2026-03-03", initials:"VH", avatarHue:4  },
  { id:"u6",  name:"Dang Thi Lan",    email:"lan.dang@gmail.com",     phone:"0956 789 012", role:"Customer", status:"blocked", points:320,   totalBookings:6,  totalSpend:24,  joinedDate:"2024-08-20", lastActive:"2026-01-15", initials:"DL", avatarHue:5  },
  { id:"u7",  name:"Nguyen Hoang Nam",email:"nam.nguyen@gmail.com",   phone:"0967 890 123", role:"Customer", status:"active",  points:9560,  totalBookings:102,totalSpend:420, joinedDate:"2023-11-05", lastActive:"2026-03-05", initials:"NN", avatarHue:6  },
  { id:"u8",  name:"Tran Van Phuc",   email:"phuc.tran@gmail.com",    phone:"0978 901 234", role:"Customer", status:"pending", points:0,     totalBookings:1,  totalSpend:4,   joinedDate:"2026-03-01", lastActive:"2026-03-01", initials:"TP", avatarHue:7  },
  { id:"u9",  name:"Le Thi Quynh",    email:"quynh.le@cinema.vn",     phone:"0989 012 345", role:"Staff",    status:"active",  points:560,   totalBookings:22, totalSpend:36,  joinedDate:"2024-09-10", lastActive:"2026-03-04", initials:"LQ", avatarHue:8  },
  { id:"u10", name:"Phan Thi Rong",   email:"rong.phan@gmail.com",    phone:"0990 123 456", role:"Customer", status:"active",  points:1280,  totalBookings:15, totalSpend:52,  joinedDate:"2024-11-22", lastActive:"2026-02-28", initials:"PR", avatarHue:3  },
  { id:"u11", name:"Cao Van Son",      email:"son.cao@gmail.com",      phone:"0901 234 568", role:"Customer", status:"active",  points:3640,  totalBookings:38, totalSpend:136, joinedDate:"2024-05-17", lastActive:"2026-03-02", initials:"CS", avatarHue:1  },
  { id:"u12", name:"Bui Thi Tuyen",   email:"tuyen.bui@gmail.com",    phone:"0912 345 679", role:"Customer", status:"blocked", points:140,   totalBookings:3,  totalSpend:10,  joinedDate:"2025-01-08", lastActive:"2025-11-20", initials:"BT", avatarHue:5  },
  { id:"u13", name:"Hoang Van Uyen",  email:"uyen.hoang@gmail.com",   phone:"0923 456 780", role:"Customer", status:"active",  points:780,   totalBookings:10, totalSpend:40,  joinedDate:"2025-03-14", lastActive:"2026-03-01", initials:"HU", avatarHue:4  },
  { id:"u14", name:"Dinh Thi Viet",   email:"viet.dinh@cinema.vn",    phone:"0934 567 891", role:"Staff",    status:"active",  points:420,   totalBookings:18, totalSpend:28,  joinedDate:"2025-02-20", lastActive:"2026-03-05", initials:"DV", avatarHue:2  },
  { id:"u15", name:"Mai Van Xuan",    email:"xuan.mai@gmail.com",     phone:"0945 678 902", role:"Customer", status:"active",  points:5920,  totalBookings:64, totalSpend:248, joinedDate:"2024-01-25", lastActive:"2026-03-04", initials:"MX", avatarHue:6  },
  { id:"u16", name:"Luu Thi Yen",     email:"yen.luu@gmail.com",      phone:"0956 789 013", role:"Customer", status:"pending", points:0,     totalBookings:0,  totalSpend:0,   joinedDate:"2026-03-04", lastActive:"2026-03-04", initials:"LY", avatarHue:7  },
  { id:"u17", name:"Trinh Van Zung",  email:"zung.trinh@gmail.com",   phone:"0967 890 124", role:"Customer", status:"active",  points:2380,  totalBookings:28, totalSpend:96,  joinedDate:"2024-10-30", lastActive:"2026-03-03", initials:"TZ", avatarHue:0  },
];

/* ═══════════════════════════════════
   USER AVATAR
═══════════════════════════════════ */
function UserAvatar({ user, size = 36 }: { user: User; size?: number }) {
  const grad = getAvatarGrad(user.name);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ background: grad, fontSize: size * 0.3, fontWeight: 900 }}
      >
        {user.initials}
      </div>
      {user.status === "blocked" && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-[#e8192c] border-2 border-[#0a0a0f]">
          <Ban size={8} className="text-white" />
        </div>
      )}
      {user.status === "pending" && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-[#f59e0b] border-2 border-[#0a0a0f]">
          <Clock size={8} className="text-white" />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   ROLE BADGE
═══════════════════════════════════ */
function RoleBadge({ role }: { role: Role }) {
  const rc = ROLE_CONFIG[role];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", backgroundColor: rc.bg, borderColor: rc.border, color: rc.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rc.dot }} />
      {rc.label.toUpperCase()}
    </span>
  );
}

/* ═══════════════════════════════════
   EDIT USER MODAL
═══════════════════════════════════ */
function EditUserModal({ user, onSave, onClose }: { user: User; onSave: (data: Partial<User>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, role: user.role as Role, status: user.status as Status });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onSave(form);
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none transition-all";
  const inputStyle: React.CSSProperties = { border: "1.5px solid rgba(255,255,255,0.1)", fontSize: "0.88rem" };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(232,25,44,0.5)"; };
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden flex flex-col"
        style={{ backgroundColor: "#0f0f18", maxHeight: "90vh", boxShadow: "0 0 0 1px rgba(232,25,44,0.12), 0 40px 100px rgba(0,0,0,0.8)", animation: "modalIn .32s cubic-bezier(.34,1.4,.64,1) forwards" }}>
        <div className="h-0.5 flex-shrink-0" style={{ background: "linear-gradient(90deg,transparent,#e8192c 40%,transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size={40} />
            <div>
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: "1rem" }}>Edit User</h2>
              <p className="text-white/30" style={{ fontSize: "0.7rem" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"><X size={14} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Email Address</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Role</label>
              <div className="relative">
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
                  className={inputCls + " appearance-none cursor-pointer pr-8"} style={inputStyle} onFocus={focus} onBlur={blur}>
                  {(["Admin","Staff","Customer"] as Role[]).map(r => <option key={r} value={r} style={{ backgroundColor: "#0f0f18" }}>{r}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                  className={inputCls + " appearance-none cursor-pointer pr-8"} style={inputStyle} onFocus={focus} onBlur={blur}>
                  {(["active","blocked","pending"] as Status[]).map(s => <option key={s} value={s} style={{ backgroundColor: "#0f0f18" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Role quick-select */}
          <div className="flex flex-col gap-2">
            <label className="text-white/35 uppercase" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em" }}>Role Quick-Select</label>
            <div className="flex gap-2">
              {(["Admin","Staff","Customer"] as Role[]).map(r => {
                const rc = ROLE_CONFIG[r]; const sel = form.role === r;
                return (
                  <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
                    className="flex-1 py-2 rounded-xl border transition-all"
                    style={{ fontSize: "0.74rem", fontWeight: 700, backgroundColor: sel ? rc.bg : "rgba(255,255,255,0.02)", borderColor: sel ? rc.border : "rgba(255,255,255,0.07)", color: sel ? rc.text : "rgba(255,255,255,0.35)" }}>
                    {sel && <Check size={10} className="inline mr-1" />}{r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/6 flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: "0 6px 20px rgba(232,25,44,0.38)" }}>
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Save Changes</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════
   BLOCK CONFIRM
═══════════════════════════════════ */
function BlockModal({ user, onConfirm, onClose }: { user: User; onConfirm: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const isBlocked = user.status === "blocked";
  const handle = async () => { setLoading(true); await new Promise(r => setTimeout(r, 700)); onConfirm(); };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden"
        style={{ backgroundColor: "#0f0f18", boxShadow: `0 0 0 1px ${isBlocked ? "rgba(16,185,129,0.2)" : "rgba(232,25,44,0.15)"}, 0 32px 80px rgba(0,0,0,0.8)`, animation: "modalIn .3s cubic-bezier(.34,1.4,.64,1) forwards" }}>
        <div className="h-0.5" style={{ background: `linear-gradient(90deg,transparent,${isBlocked ? "#10b981" : "#e8192c"} 40%,transparent)` }} />
        <div className="p-7 flex flex-col items-center text-center">
          <div className="mb-5"><UserAvatar user={user} size={52} /></div>
          <h3 className="text-white mb-2" style={{ fontWeight: 800, fontSize: "1.05rem" }}>{isBlocked ? "Unblock User?" : "Block User?"}</h3>
          <p className="text-white font-semibold mb-1" style={{ fontSize: "0.9rem" }}>{user.name}</p>
          <p className="text-white/35 mb-5" style={{ fontSize: "0.78rem" }}>
            {isBlocked ? "This user will regain access to the platform." : "This user will be prevented from making bookings."}
          </p>
          {!isBlocked && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 w-full justify-center" style={{ backgroundColor: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)" }}>
              <AlertTriangle size={13} className="text-[#e8192c]" />
              <p className="text-[#e8192c]/80" style={{ fontSize: "0.74rem" }}>Existing bookings will not be cancelled.</p>
            </div>
          )}
          <div className="flex gap-3 w-full">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/45 hover:text-white transition-all" style={{ fontSize: "0.82rem", fontWeight: 600 }}>Cancel</button>
            <button onClick={handle} disabled={loading} className="flex-1 py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: isBlocked ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, boxShadow: isBlocked ? "0 6px 20px rgba(16,185,129,0.35)" : "0 6px 20px rgba(232,25,44,0.35)" }}>
              {loading ? <><Loader2 size={14} className="animate-spin" /> {isBlocked ? "Unblocking…" : "Blocking…"}</> : isBlocked ? <><UserCheck size={14} /> Unblock</> : <><Ban size={14} /> Block</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
export function AdminUsers() {
  const [users,        setUsers]        = useState<User[]>(SEED_USERS);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField,    setSortField]    = useState<keyof User | null>(null);
  const [sortDir,      setSortDir]      = useState<"asc" | "desc">("asc");
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [page,         setPage]         = useState(1);
  const [editTarget,   setEditTarget]   = useState<User | null>(null);
  const [blockTarget,  setBlockTarget]  = useState<User | null>(null);
  const [toast,        setToast]        = useState("");
  const [toastOn,      setToastOn]      = useState(false);

  const showToast = (msg: string) => { setToast(msg); setToastOn(true); setTimeout(() => setToastOn(false), 2400); };

  /* Filter + sort */
  const filtered = useMemo(() => {
    let list = users.filter(u => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
          !u.email.toLowerCase().includes(search.toLowerCase()) &&
          !u.phone.includes(search)) return false;
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (statusFilter !== "All" && u.status !== statusFilter) return false;
      return true;
    });
    if (sortField) {
      list = [...list].sort((a, b) => {
        const av = a[sortField] as any;
        const bv = b[sortField] as any;
        return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }
    return list;
  }, [users, search, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Sort handler */
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortField(null); }
    } else {
      setSortField(field); setSortDir("asc");
    }
    setPage(1);
  };

  /* Selection */
  const allSelected = paged.length > 0 && paged.every(u => selected.has(u.id));
  const toggleAll = () => {
    if (allSelected) setSelected(s => { const n = new Set(s); paged.forEach(u => n.delete(u.id)); return n; });
    else setSelected(s => { const n = new Set(s); paged.forEach(u => n.add(u.id)); return n; });
  };
  const toggleRow = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  /* Edit */
  const handleEdit = (data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === editTarget?.id ? { ...u, ...data } : u));
    showToast(`${data.name ?? editTarget?.name} updated`);
    setEditTarget(null);
  };

  /* Block/Unblock */
  const handleBlock = () => {
    if (!blockTarget) return;
    const isBlocked = blockTarget.status === "blocked";
    setUsers(prev => prev.map(u => u.id === blockTarget.id ? { ...u, status: isBlocked ? "active" : "blocked" } : u));
    showToast(`${blockTarget.name} ${isBlocked ? "unblocked" : "blocked"}`);
    setBlockTarget(null);
  };

  /* Export CSV */
  const handleExport = () => {
    const header = ["Name","Email","Phone","Role","Status","Points","Total Bookings","Spend","Joined"];
    const rows = filtered.map(u => [u.name, u.email, u.phone, u.role, u.status, u.points, u.totalBookings, `₫${u.totalSpend}M`, u.joinedDate]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cinema_users.csv"; a.click();
    showToast("CSV exported successfully");
  };

  const stats = {
    total:    users.length,
    admins:   users.filter(u => u.role === "Admin").length,
    staff:    users.filter(u => u.role === "Staff").length,
    customers:users.filter(u => u.role === "Customer").length,
    blocked:  users.filter(u => u.status === "blocked").length,
    newThisMonth: users.filter(u => u.joinedDate.startsWith("2026-03")).length,
  };

  const SortTh = ({ label, field, className = "" }: { label: string; field: keyof User; className?: string }) => {
    const active = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`py-3 text-left cursor-pointer select-none ${className}`}
        style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: active ? "#e8192c" : "rgba(255,255,255,0.28)", textTransform: "uppercase", userSelect: "none" }}
      >
        <div className="flex items-center gap-1.5">
          {label}
          <span style={{ opacity: active ? 1 : 0.35 }}>
            {active && sortDir === "asc" ? <ChevronUp size={10} /> : active && sortDir === "desc" ? <ChevronDown size={10} /> : <ArrowUpDown size={9} />}
          </span>
        </div>
      </th>
    );
  };

  return (
    <AdminLayout
      title="User Management"
      subtitle={`${stats.total} total users · ${stats.blocked} blocked · ${stats.newThisMonth} new this month`}
      actions={
        <button
          onClick={() => showToast("Invite user flow coming soon")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
          style={{ background: "linear-gradient(135deg,#e8192c,#c8111f)", fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.06em", boxShadow: "0 6px 20px rgba(232,25,44,0.4)" }}
        >
          <UserPlus size={15} /> Invite User
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Users",    value: stats.total,     color: "#e8192c" },
          { label: "Admins",         value: stats.admins,    color: "#ff6b7a" },
          { label: "Staff",          value: stats.staff,     color: "#3b82f6" },
          { label: "Customers",      value: stats.customers, color: "#94a3b8" },
          { label: "Blocked",        value: stats.blocked,   color: "#f59e0b" },
          { label: "New This Month", value: stats.newThisMonth, color: "#10b981" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
            <span style={{ fontWeight: 900, fontSize: "1.05rem", color }}>{value}</span>
            <p className="text-white/35" style={{ fontSize: "0.66rem", fontWeight: 600, lineHeight: 1.3 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-2xl border" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
        {/* Search */}
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 text-white/25 pointer-events-none" />
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder-white/20 outline-none"
            style={{ border: "1.5px solid rgba(255,255,255,0.08)", fontSize: "0.85rem" }}
            onFocus={e => { e.target.style.borderColor = "rgba(232,25,44,0.45)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 text-white/25 hover:text-white/60"><X size={13} /></button>}
        </div>

        {/* Role filter */}
        <div className="relative">
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer"
            style={{ backgroundColor: roleFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: roleFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: roleFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}>
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Roles</option>
            {(["Admin","Staff","Customer"] as Role[]).map(r => <option key={r} value={r} style={{ backgroundColor: "#0f0f18" }}>{r}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-white outline-none cursor-pointer"
            style={{ backgroundColor: statusFilter !== "All" ? "rgba(232,25,44,0.08)" : "rgba(255,255,255,0.04)", borderColor: statusFilter !== "All" ? "rgba(232,25,44,0.3)" : "rgba(255,255,255,0.1)", fontSize: "0.82rem", fontWeight: 600, color: statusFilter !== "All" ? "#e8192c" : "rgba(255,255,255,0.55)" }}>
            <option value="All" style={{ backgroundColor: "#0f0f18" }}>All Statuses</option>
            {(["active","blocked","pending"] as Status[]).map(s => <option key={s} value={s} style={{ backgroundColor: "#0f0f18" }}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {(search || roleFilter !== "All" || statusFilter !== "All") && (
          <button onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.78rem" }}>
            <X size={12} /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-white/25" style={{ fontSize: "0.75rem" }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            style={{ fontSize: "0.78rem", fontWeight: 600 }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-4 border border-[#e8192c]/25" style={{ backgroundColor: "rgba(232,25,44,0.07)" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e8192c" }}>{selected.size} selected</span>
          <div className="flex gap-2">
            <button onClick={() => setSelected(new Set())} className="px-3 py-1.5 rounded-lg border border-white/10 text-white/35 hover:text-white transition-all" style={{ fontSize: "0.75rem" }}>Deselect</button>
            <button onClick={() => {
              setUsers(prev => prev.filter(u => !selected.has(u.id)));
              showToast(`${selected.size} users removed`);
              setSelected(new Set());
            }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: "#e8192c", fontSize: "0.75rem", fontWeight: 700 }}>
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#13131e", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <th className="py-3 pl-5 pr-3 w-10">
                  <button onClick={toggleAll} className="text-white/25 hover:text-white/60 transition-colors">
                    {allSelected ? <CheckSquare size={15} className="text-[#e8192c]" /> : <Square size={15} />}
                  </button>
                </th>
                <SortTh label="User" field="name" className="pr-4" />
                <SortTh label="Email" field="email" className="pr-4" />
                <th className="py-3 pr-4" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Phone</th>
                <SortTh label="Role" field="role" className="pr-4" />
                <th className="py-3 pr-4" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Status</th>
                <SortTh label="Points" field="points" className="pr-4 text-right" />
                <SortTh label="Bookings" field="totalBookings" className="pr-4 text-right" />
                <SortTh label="Last Active" field="lastActive" className="pr-4" />
                <th className="py-3 pr-5 text-right" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.13em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="flex flex-col items-center justify-center py-20 text-white/20">
                      <Users size={40} className="mb-3 opacity-20" />
                      <p style={{ fontSize: "0.9rem" }}>No users found</p>
                      <button onClick={() => { setSearch(""); setRoleFilter("All"); setStatusFilter("All"); }} className="mt-2 text-[#e8192c]/60 hover:text-[#e8192c] transition-colors" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Clear filters</button>
                    </div>
                  </td>
                </tr>
              ) : paged.map((user, i) => {
                const isSelected = selected.has(user.id);
                const isBlocked  = user.status === "blocked";
                const rc = ROLE_CONFIG[user.role];
                const sc = STATUS_CONFIG[user.status];
                const isEven = i % 2 === 0;

                return (
                  <tr
                    key={user.id}
                    className="border-b group transition-colors"
                    style={{
                      borderColor: "rgba(255,255,255,0.04)",
                      backgroundColor: isSelected ? "rgba(232,25,44,0.04)" : isEven ? "transparent" : "rgba(255,255,255,0.012)",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "rgba(255,255,255,0.025)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.backgroundColor = isSelected ? "rgba(232,25,44,0.04)" : isEven ? "transparent" : "rgba(255,255,255,0.012)"; }}
                  >
                    {/* Checkbox */}
                    <td className="py-3 pl-5 pr-3">
                      <button onClick={() => toggleRow(user.id)} className="text-white/20 hover:text-white/50 transition-colors">
                        {isSelected ? <CheckSquare size={14} className="text-[#e8192c]" /> : <Square size={14} />}
                      </button>
                    </td>

                    {/* Avatar + Name */}
                    <td className="py-3 pr-4" style={{ minWidth: "180px" }}>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} size={36} />
                        <div className="min-w-0">
                          <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.86rem" }}>{user.name}</p>
                          <p className="text-white/30 truncate" style={{ fontSize: "0.68rem" }}>
                            Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 pr-4" style={{ minWidth: "200px" }}>
                      <div className="flex items-center gap-2">
                        <Mail size={11} className="text-white/20 flex-shrink-0" />
                        <span className="text-white/55 truncate" style={{ fontSize: "0.8rem" }}>{user.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Phone size={11} className="text-white/20 flex-shrink-0" />
                        <span className="text-white/55" style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>{user.phone}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 pr-4"><RoleBadge role={user.role} /></td>

                    {/* Status */}
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ fontSize: "0.62rem", fontWeight: 700, backgroundColor: sc.bg, color: sc.text }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
                        {sc.label.toUpperCase()}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Star size={11} className="text-amber-400 flex-shrink-0" />
                        <span className="text-white/70" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Bookings */}
                    <td className="py-3 pr-4 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-white/65" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{user.totalBookings}</span>
                        {user.totalSpend > 0 && <span className="text-[#e8192c]/70" style={{ fontSize: "0.62rem", fontWeight: 600 }}>₫{user.totalSpend}M</span>}
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} className="text-white/20 flex-shrink-0" />
                        <span className="text-white/40" style={{ fontSize: "0.75rem" }}>{relativeTime(user.lastActive)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditTarget(user)}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center text-white/25 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 transition-all"
                          style={{ borderColor: "rgba(255,255,255,0.08)" }}
                          title="Edit user"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => setBlockTarget(user)}
                          className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all"
                          style={{
                            borderColor: isBlocked ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)",
                            color: isBlocked ? "#10b981" : "rgba(255,255,255,0.25)",
                          }}
                          title={isBlocked ? "Unblock user" : "Block user"}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = isBlocked ? "#34d399" : "#f59e0b"; (e.currentTarget as HTMLElement).style.borderColor = isBlocked ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.3)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isBlocked ? "#10b981" : "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.borderColor = isBlocked ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"; }}
                        >
                          {isBlocked ? <UserCheck size={12} /> : <Ban size={12} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="text-white/30" style={{ fontSize: "0.75rem" }}>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                  style={{ fontSize: "0.78rem", fontWeight: p === page ? 800 : 500, backgroundColor: p === page ? "#e8192c" : "transparent", borderColor: p === page ? "#e8192c" : "rgba(255,255,255,0.08)", color: p === page ? "white" : "rgba(255,255,255,0.35)" }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editTarget  && <EditUserModal user={editTarget}  onSave={handleEdit}  onClose={() => setEditTarget(null)}  />}
      {blockTarget && <BlockModal    user={blockTarget} onConfirm={handleBlock} onClose={() => setBlockTarget(null)} />}

      {/* Toast */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/10 z-[400] transition-all duration-300 pointer-events-none"
        style={{ backgroundColor: "rgba(15,15,24,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", opacity: toastOn ? 1 : 0, transform: toastOn ? "translate(-50%,0)" : "translate(-50%,14px)" }}>
        <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" /></div>
        <span className="text-white" style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}>{toast}</span>
      </div>
    </AdminLayout>
  );
}
