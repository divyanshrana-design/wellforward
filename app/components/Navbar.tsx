"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Make a Friend", href: "#make-a-friend" },
  { label: "Ask a Senior", href: "#ask-a-senior" },
  { label: "First 30 Days", href: "#checklist" },
  { label: "Voices", href: "#voices" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(245, 241, 255, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(200, 184, 255, 0.3)"
          : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 rounded-lg"
          aria-label="Go to top — Wellforward"
        >
          <span
            className="text-lg font-serif"
            style={{ color: "#3B2E8C", letterSpacing: "-0.02em" }}
          >
            Well<span style={{ color: "#7C5CFF" }}>forward</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="nav-link px-3 py-2 rounded-lg hover:bg-lavender-100/60 transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#make-a-friend")}
            className="btn-primary ml-3 px-4 py-2 text-sm"
            aria-label="Create your profile"
          >
            Create Profile
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-lavender-900 hover:bg-lavender-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(245, 241, 255, 0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(200, 184, 255, 0.3)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left nav-link px-4 py-3 rounded-xl hover:bg-lavender-100 transition-all"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#make-a-friend")}
              className="btn-primary mt-2 px-4 py-3 text-sm text-center"
            >
              Create Your Profile
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
