import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router"; // Dùng react-router chuẩn v7 của mày
import {
  Menu, X, Film, LayoutDashboard, Search,
  User, Ticket, LogOut, Star, ChevronDown,
} from "lucide-react";
import { signOut } from "../../lib/auth"; // Import hàm đăng xuất thật

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  
  // 1. STATE CHỨA THÔNG TIN NGƯỜI DÙNG THẬT
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const dropWrapRef = useRef<HTMLDivElement>(null);

  // 2. KHI MỞ WEB LÊN, TỰ ĐỘNG MÓC TÚI QUẦN XEM CÓ CHÌA KHÓA KHÔNG
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Biến kiểm tra đăng nhập chuẩn 100%
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!dropOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (dropWrapRef.current && !dropWrapRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropOpen]);

  const closeAll = () => { setDropOpen(false); setMenuOpen(false); };

  // 3. HÀM ĐĂNG XUẤT THẬT
  const handleLogOut = async () => {
    await signOut(); // Gọi hàm xóa token
    setUser(null);
    closeAll();
  };

  const NAV_LINKS = [
    { to: "/showtimes",  label: "Showtimes"   },
    { to: "/movies",     label: "Movies"      },
    { to: "/promotions", label: "Promotions"  },
    { to: "/coming-soon",label: "Coming Soon" },
  ];

  return (
    <>
      <style>{`
        @keyframes hDropIn { from { opacity: 0; transform: translateY(-12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes hRingPulse { 0%,100% { box-shadow: 0 0 0 2px rgba(232,25,44,0.65), 0 0 14px rgba(232,25,44,0.2); } 50% { box-shadow: 0 0 0 2px rgba(232,25,44,0.95), 0 0 24px rgba(232,25,44,0.45); } }
        @keyframes hMobileIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2 group" onClick={closeAll}>
            <div className="w-8 h-8 bg-[#e8192c] rounded flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Film size={16} className="text-white" />
            </div>
            <span className="text-white tracking-[0.25em] uppercase" style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.25em" }}>CINEMA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="text-gray-300 hover:text-white transition-colors duration-200 relative group" style={{ fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.04em" }}>
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e8192c] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/search" className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all duration-200"><Search size={15} /></Link>
            
            {/* Chỉ hiện nút Admin Dashboard nếu role là ADMIN */}
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-all duration-200" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                <LayoutDashboard size={14} /> Admin
              </Link>
            )}

            {/* Hiện nút tính năng riêng cho STAFF */}
            {user?.role === 'STAFF' && (
              <Link to="/staff/pos" className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-all duration-200" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                <Ticket size={14} /> Quầy Vé (POS)
              </Link>
            )}

            {isLoggedIn ? (
              <div ref={dropWrapRef} className="relative">
                <button onClick={() => setDropOpen(v => !v)} className="relative flex items-center gap-1.5 rounded-full outline-none transition-transform duration-150 active:scale-95 ml-2">
                  <div className="relative w-9 h-9 rounded-full flex items-center justify-center text-white select-none" style={{ background: "linear-gradient(135deg, #e8192c 0%, #9b0e1d 100%)", fontWeight: 800, fontSize: "0.88rem", animation: "hRingPulse 3.5s ease-in-out infinite" }}>
                    {/* Lấy chữ cái đầu tiên của tên user thật */}
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f]" style={{ bottom: "-1px", right: "-1px" }} />
                  </div>
                  <ChevronDown size={12} className="text-white/35 transition-transform duration-200" style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-3 rounded-2xl border border-white/10 overflow-hidden" style={{ width: "268px", backgroundColor: "#0d0d1a", boxShadow: "0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)", animation: "hDropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                    <div className="px-4 pt-4 pb-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #e8192c, #9b0e1d)", fontWeight: 800, fontSize: "0.92rem", boxShadow: "0 0 0 2px rgba(232,25,44,0.45), 0 0 16px rgba(232,25,44,0.3)" }}>
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.86rem", lineHeight: 1.35 }}>{user.name}</p>
                          <p className="text-white/40 truncate" style={{ fontSize: "0.69rem", marginTop: "2px" }}>{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(232,25,44,0.10), rgba(160,14,31,0.06))", border: "1px solid rgba(232,25,44,0.2)" }}>
                        <div className="flex items-center gap-1.5">
                          <Star size={11} style={{ color: "#e8192c", fill: "#e8192c" }} />
                          <span style={{ fontSize: "0.71rem", fontWeight: 700, color: "#e8192c" }}>
                            {user.role === 'ADMIN' ? 'Quản Trị Viên' : user.role === 'STAFF' ? 'Nhân Viên' : 'Thành Viên'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <Link to="/dashboard" onClick={closeAll} className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] group">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5"><User size={14} className="text-white/40 group-hover:text-white/70" /></span>
                        <span className="flex-1 text-white/65 group-hover:text-white" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Tài Khoản & Voucher</span>
                      </Link>
                    </div>

                    <div className="mx-3" style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }} />
                    <div className="py-1.5">
                      <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-[#e8192c]/10">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#e8192c]/10"><LogOut size={14} style={{ color: "#e8192c" }} /></span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e8192c" }}>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all duration-200 active:scale-95" style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em" }}>Đăng Nhập</Link>
            )}
          </div>

          <button className="md:hidden text-gray-300 hover:text-white transition-colors" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* THÊM MENU MOBILE Ở ĐÂY */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0a0a0f]/98 backdrop-blur-xl border-b border-white/10 p-5 flex flex-col gap-4 shadow-2xl" style={{ animation: "hMobileIn 0.2s ease" }}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} onClick={closeAll} className="text-gray-300 hover:text-white text-lg font-bold px-2 py-1.5 transition-colors">
                {label}
              </Link>
            ))}
            
            <div className="h-px bg-white/10 my-2" />
            
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={closeAll} className="flex items-center gap-3 text-white/70 hover:text-white px-2 py-2">
                <LayoutDashboard size={18} /> <span className="font-semibold">Admin Dashboard</span>
              </Link>
            )}

            {user?.role === 'STAFF' && (
              <Link to="/staff/pos" onClick={closeAll} className="flex items-center gap-3 text-white/70 hover:text-white px-2 py-2">
                <Ticket size={18} /> <span className="font-semibold">Quầy Vé (POS)</span>
              </Link>
            )}
            
            {!isLoggedIn && (
              <Link to="/login" onClick={closeAll} className="mt-2 w-full py-3 rounded-xl bg-[#e8192c] text-white text-center font-bold text-sm tracking-widest uppercase shadow-lg shadow-[#e8192c]/30">
                Đăng Nhập
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}