import { Film, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-[#07070c] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 bg-[#e8192c] rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Film size={16} className="text-white" />
              </div>
              <span
                className="text-white tracking-widest uppercase"
                style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.25em" }}
              >
                CINEMA
              </span>
            </Link>
            <p className="text-white/40 mb-6" style={{ fontSize: "0.85rem", lineHeight: 1.7 }}>
              Your premier destination for world-class cinema. Immersive screens, premium sound, unforgettable experiences.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Twitter, link: "#" },
                { Icon: Instagram, link: "#" },
                { Icon: Youtube, link: "#" },
              ].map(({ Icon, link }, i) => (
                <a
                  key={i}
                  href={link}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 hover:bg-[#e8192c] transition-all duration-200 text-white/50 hover:text-white hover:scale-110"
                  aria-label={Icon.name}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-5 uppercase" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Showtimes", to: "/showtimes" },
                { label: "Now Showing", to: "/movies" },
                { label: "Coming Soon", to: "/movies" },
                { label: "Promotions", to: "/promotions" },
                { label: "Gift Cards", to: "#" },
                { label: "Membership", to: "#" },
              ].map((link) => (
                <li key={link.label}>
                  {link.to.startsWith("#") ? (
                    <a
                      href={link.to}
                      className="text-white/40 hover:text-[#e8192c] transition-colors duration-200 inline-block"
                      style={{ fontSize: "0.88rem" }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-white/40 hover:text-[#e8192c] transition-colors duration-200 inline-block"
                      style={{ fontSize: "0.88rem" }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-white mb-5 uppercase" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em" }}>
              Genres
            </h4>
            <ul className="flex flex-col gap-3">
              {["Action", "Sci-Fi", "Romance", "Horror", "Animation", "Documentary"].map((g) => (
                <li key={g}>
                  <a
                    href="#"
                    className="text-white/40 hover:text-[#e8192c] transition-colors duration-200 inline-block"
                    style={{ fontSize: "0.88rem" }}
                  >
                    {g}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-5 uppercase" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em" }}>
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-white/40 group" style={{ fontSize: "0.85rem" }}>
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#e8192c] group-hover:scale-110 transition-transform" />
                <a href="#" className="hover:text-white/60 transition-colors">
                  123 Cinema Blvd, Hollywood, CA 90028
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/40 group" style={{ fontSize: "0.85rem" }}>
                <Phone size={16} className="flex-shrink-0 text-[#e8192c] group-hover:scale-110 transition-transform" />
                <a href="tel:+18002463627" className="hover:text-white/60 transition-colors">
                  +1 (800) 246-3627
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/40 group" style={{ fontSize: "0.85rem" }}>
                <Mail size={16} className="flex-shrink-0 text-[#e8192c] group-hover:scale-110 transition-transform" />
                <a href="mailto:hello@cinema.com" className="hover:text-white/60 transition-colors">
                  hello@cinema.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-7" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25" style={{ fontSize: "0.8rem" }}>
            © 2026 CINEMA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/25 hover:text-[#e8192c] transition-colors duration-200"
                style={{ fontSize: "0.78rem" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}