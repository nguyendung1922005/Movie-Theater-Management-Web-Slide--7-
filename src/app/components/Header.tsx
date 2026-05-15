/**
 * Header.tsx — Public-facing site navigation
 *
 * Auth behaviour
 * ──────────────
 * • isLoggedIn = false  →  red "Login" button (existing behaviour)
 * • isLoggedIn = true   →  avatar button + animated profile dropdown
 *
 * DEV NOTE
 * ────────
 * A discreet toggle pill is rendered at the right edge of the CTA bar
 * (and again at the bottom of the mobile drawer) so you can flip
 * `isLoggedIn` without touching code.  Remove it before shipping.
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Menu, X, Film, LayoutDashboard, Search,
  User, Ticket, LogOut, Star, ChevronDown,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   MOCK USER  (replace with real auth context / hook in production)
───────────────────────────────────────────────────────────────── */
const MOCK_USER = {
  name:       "Nguyễn Văn Thịnh",
  email:      "thinh@galaxycinema.vn",
  initial:    "T",
  membership: "Gold Member",
  points:     2_450,
  tickets:    3,
};

/* ─────────────────────────────────────────────────────────────────
   NAV LINKS — single source of truth for desktop + mobile
───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/showtimes",  label: "Showtimes"   },
  { to: "/movies",     label: "Movies"      },
  { to: "/promotions", label: "Promotions"  },
  { to: "/coming-soon",label: "Coming Soon" },
];

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export function Header() {
  // ── state ────────────────────────────────────────────────────
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  /**
   * DEV: default `true` so the logged-in UI renders immediately.
   * Flip to `false` to see the guest state.
   */
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // ── refs ─────────────────────────────────────────────────────
  const dropWrapRef = useRef<HTMLDivElement>(null);

  // ── close dropdown on outside click ─────────────────────────
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

  // ── close everything (used by links inside dropdown / mobile) ─
  const closeAll = () => { setDropOpen(false); setMenuOpen(false); };

  // ── mock "log out" handler ────────────────────────────────────
  const handleLogOut = () => { setIsLoggedIn(false); closeAll(); };

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── keyframe animations ── */}
      <style>{`
        @keyframes hDropIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes hRingPulse {
          0%,100% { box-shadow: 0 0 0 2px rgba(232,25,44,0.65), 0 0 14px rgba(232,25,44,0.2); }
          50%     { box-shadow: 0 0 0 2px rgba(232,25,44,0.95), 0 0 24px rgba(232,25,44,0.45); }
        }
        @keyframes hMobileIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeAll}>
            <div className="w-8 h-8 bg-[#e8192c] rounded flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Film size={16} className="text-white" />
            </div>
            <span
              className="text-white tracking-[0.25em] uppercase"
              style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.25em" }}
            >
              CINEMA
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
                style={{ fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.04em" }}
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#e8192c] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA bar ── */}
          <div className="hidden md:flex items-center gap-2">

            {/* ── DEV TOGGLE (remove before shipping) ── */}
            <button
              onClick={() => { setIsLoggedIn(v => !v); setDropOpen(false); }}
              title="DEV: Toggle auth state"
              className="px-2 py-1 rounded border border-dashed border-white/15 text-white/25 hover:text-white/55 hover:border-white/35 transition-all duration-200"
              style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em", lineHeight: 1.3 }}
            >
              {isLoggedIn ? "● AUTHED" : "○ GUEST"}
            </button>

            {/* Search */}
            <Link
              to="/search"
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-all duration-200"
              title="Search"
            >
              <Search size={15} />
            </Link>

            {/* Dashboard shortcut */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-all duration-200"
              style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.04em" }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>

            {/* ════════════════════════════════════════
                AUTH ZONE
            ════════════════════════════════════════ */}
            {isLoggedIn ? (

              /* ── Avatar + Dropdown ── */
              <div ref={dropWrapRef} className="relative">

                {/* Avatar button */}
                <button
                  onClick={() => setDropOpen(v => !v)}
                  aria-label="Open user menu"
                  aria-expanded={dropOpen}
                  aria-haspopup="true"
                  className="relative flex items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#e8192c]/60 transition-transform duration-150 active:scale-95"
                >
                  {/* Circular avatar */}
                  <div
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-white select-none"
                    style={{
                      background: "linear-gradient(135deg, #e8192c 0%, #9b0e1d 100%)",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      letterSpacing: "0.01em",
                      animation: "hRingPulse 3.5s ease-in-out infinite",
                    }}
                  >
                    {MOCK_USER.initial}

                    {/* Online indicator */}
                    <span
                      className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f]"
                      style={{ bottom: "-1px", right: "-1px" }}
                    />
                  </div>

                  {/* Subtle chevron */}
                  <ChevronDown
                    size={12}
                    className="text-white/35 transition-transform duration-200"
                    style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                {/* ── Dropdown panel ── */}
                {dropOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-3 rounded-2xl border border-white/10 overflow-hidden"
                    style={{
                      width: "268px",
                      backgroundColor: "#0d0d1a",
                      boxShadow: "0 28px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)",
                      animation: "hDropIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}
                  >
                    {/* ── User info header ── */}
                    <div
                      className="px-4 pt-4 pb-3.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {/* Avatar (larger) */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg, #e8192c, #9b0e1d)",
                            fontWeight: 800,
                            fontSize: "0.92rem",
                            boxShadow: "0 0 0 2px rgba(232,25,44,0.45), 0 0 16px rgba(232,25,44,0.3)",
                          }}
                        >
                          {MOCK_USER.initial}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-white truncate"
                            style={{ fontWeight: 700, fontSize: "0.86rem", lineHeight: 1.35 }}
                          >
                            {MOCK_USER.name}
                          </p>
                          <p
                            className="text-white/40 truncate"
                            style={{ fontSize: "0.69rem", marginTop: "2px" }}
                          >
                            {MOCK_USER.email}
                          </p>
                        </div>
                      </div>

                      {/* Membership badge */}
                      <div
                        className="flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, rgba(232,25,44,0.10), rgba(160,14,31,0.06))",
                          border: "1px solid rgba(232,25,44,0.2)",
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Star
                            size={11}
                            style={{ color: "#e8192c", fill: "#e8192c" }}
                          />
                          <span style={{ fontSize: "0.71rem", fontWeight: 700, color: "#e8192c" }}>
                            {MOCK_USER.membership}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "rgba(255,255,255,0.38)" }}>
                          {MOCK_USER.points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>

                    {/* ── Navigation items ── */}
                    <div className="py-1.5" role="none">

                      {/* My Profile */}
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] group"
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover:bg-white/[0.06]"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          <User
                            size={14}
                            className="text-white/40 group-hover:text-white/70 transition-colors duration-150"
                          />
                        </span>
                        <span
                          className="text-white/65 group-hover:text-white transition-colors duration-150"
                          style={{ fontSize: "0.85rem", fontWeight: 500 }}
                        >
                          My Profile
                        </span>
                      </Link>

                      {/* My Tickets */}
                      <Link
                        to="/my-tickets"
                        role="menuitem"
                        onClick={closeAll}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-white/[0.04] group"
                        style={{ textDecoration: "none" }}
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover:bg-white/[0.06]"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          <Ticket
                            size={14}
                            className="text-white/40 group-hover:text-white/70 transition-colors duration-150"
                          />
                        </span>
                        <span
                          className="flex-1 text-white/65 group-hover:text-white transition-colors duration-150"
                          style={{ fontSize: "0.85rem", fontWeight: 500 }}
                        >
                          My Tickets
                        </span>
                        {/* Active ticket count badge */}
                        {MOCK_USER.tickets > 0 && (
                          <span
                            className="flex-shrink-0 flex items-center justify-center rounded-full text-white"
                            style={{
                              fontSize: "0.58rem",
                              fontWeight: 900,
                              backgroundColor: "#e8192c",
                              minWidth: "18px",
                              height: "18px",
                              padding: "0 5px",
                              boxShadow: "0 0 8px rgba(232,25,44,0.5)",
                            }}
                          >
                            {MOCK_USER.tickets}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* ── Divider ── */}
                    <div
                      className="mx-3"
                      style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }}
                    />

                    {/* ── Log Out ── */}
                    <div className="py-1.5" role="none">
                      <button
                        role="menuitem"
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 group"
                        style={{
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(232,25,44,0.07)")
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                        }
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(232,25,44,0.08)" }}
                        >
                          <LogOut size={14} style={{ color: "#e8192c" }} />
                        </span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e8192c" }}>
                          Log Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (

              /* ── Guest: Login button ── */
              <Link
                to="/login"
                className="px-5 py-2 rounded bg-[#e8192c] text-white hover:bg-[#c8111f] transition-all duration-200 active:scale-95"
                style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            MOBILE DRAWER
        ══════════════════════════════════════════════ */}
        {menuOpen && (
          <div
            className="md:hidden bg-[#0a0a0f] border-t border-white/5 px-6 py-4 flex flex-col gap-1"
            style={{ animation: "hMobileIn 0.2s ease-out both" }}
          >
            {/* Nav links */}
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-300 hover:text-white py-2.5 border-b border-white/5 transition-colors"
                style={{ fontSize: "0.95rem" }}
                onClick={closeAll}
              >
                {label}
              </Link>
            ))}

            {/* Utilities */}
            <Link
              to="/search"
              className="flex items-center gap-2 text-gray-300 hover:text-white py-2.5 border-b border-white/5 transition-colors"
              style={{ fontSize: "0.95rem" }}
              onClick={closeAll}
            >
              <Search size={15} /> Search
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-gray-300 hover:text-white py-2.5 border-b border-white/5 transition-colors"
              style={{ fontSize: "0.95rem" }}
              onClick={closeAll}
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>

            {/* ── Mobile auth zone ── */}
            {isLoggedIn ? (
              <>
                {/* Profile card */}
                <div className="pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #e8192c, #9b0e1d)",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        boxShadow: "0 0 0 2px rgba(232,25,44,0.45), 0 0 14px rgba(232,25,44,0.25)",
                      }}
                    >
                      {MOCK_USER.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white truncate" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                        {MOCK_USER.name}
                      </p>
                      <p className="text-white/40 truncate" style={{ fontSize: "0.72rem" }}>
                        {MOCK_USER.email}
                      </p>
                    </div>
                  </div>

                  {/* Membership */}
                  <div
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(232,25,44,0.09), rgba(160,14,31,0.05))",
                      border: "1px solid rgba(232,25,44,0.18)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star size={11} style={{ color: "#e8192c", fill: "#e8192c" }} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e8192c" }}>
                        {MOCK_USER.membership}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.38)" }}>
                      {MOCK_USER.points.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Profile link */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 text-white/65 hover:text-white py-2.5 border-b border-white/5 transition-colors"
                  style={{ fontSize: "0.95rem" }}
                  onClick={closeAll}
                >
                  <User size={15} className="flex-shrink-0" />
                  My Profile
                </Link>

                {/* Tickets link */}
                <Link
                  to="/my-tickets"
                  className="flex items-center gap-2.5 text-white/65 hover:text-white py-2.5 border-b border-white/5 transition-colors"
                  style={{ fontSize: "0.95rem" }}
                  onClick={closeAll}
                >
                  <Ticket size={15} className="flex-shrink-0" />
                  <span className="flex-1">My Tickets</span>
                  {MOCK_USER.tickets > 0 && (
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full text-white"
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        backgroundColor: "#e8192c",
                        boxShadow: "0 0 8px rgba(232,25,44,0.5)",
                      }}
                    >
                      {MOCK_USER.tickets}
                    </span>
                  )}
                </Link>

                {/* Log Out */}
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2.5 py-2.5 transition-colors"
                  style={{ color: "#e8192c", fontSize: "0.95rem", fontWeight: 600 }}
                >
                  <LogOut size={15} className="flex-shrink-0" />
                  Log Out
                </button>
              </>
            ) : (
              /* Guest CTA buttons */
              <div className="flex gap-2 mt-3">
                <Link
                  to="/login"
                  className="flex-1 px-5 py-2.5 rounded bg-[#e8192c] text-white text-center transition-colors hover:bg-[#c8111f]"
                  style={{ fontWeight: 600, fontSize: "0.9rem" }}
                  onClick={closeAll}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 px-5 py-2.5 rounded border border-white/15 text-white/70 text-center transition-colors hover:text-white hover:border-white/30"
                  style={{ fontWeight: 600, fontSize: "0.9rem" }}
                  onClick={closeAll}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* ── DEV TOGGLE (mobile, remove before shipping) ── */}
            <button
              onClick={() => { setIsLoggedIn(v => !v); setDropOpen(false); }}
              className="mt-2 w-full py-1.5 rounded border border-dashed border-white/10 text-white/20 hover:text-white/40 transition-colors"
              style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.14em" }}
            >
              DEV · {isLoggedIn ? "LOGGED IN — click to switch to guest" : "GUEST — click to switch to logged in"}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
