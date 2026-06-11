"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Make a Friend", href: "#make-a-friend" },
  { label: "Ask a Senior",  href: "#ask-a-senior" },
  { label: "First 30 Days", href: "#checklist" },
  { label: "Voices",        href: "#voices" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background:    scrolled ? "rgba(247,243,255,0.88)" : "transparent",
        backdropFilter:scrolled ? "blur(22px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(22px) saturate(160%)" : "none",
        borderBottom:  scrolled ? "1px solid rgba(200,184,255,0.28)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-[62px] flex items-center justify-between">

        {/* Wordmark — deliberately plain, not logomark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Wellforward — back to top"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span
            className="serif"
            style={{
              fontSize: "1.2rem",
              letterSpacing: "-0.03em",
              color: "#2a1d50",
              fontStyle: "italic",
            }}
          >
            Well<span style={{ color: "#7c5cff", fontStyle: "normal" }}>forward</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="nav-link px-3.5 py-2 rounded-lg hover:bg-violet-50 transition-colors text-sm"
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("#make-a-friend")}
            className="btn-primary ml-4 px-5 py-2 text-sm"
            style={{ borderRadius: 8 }}
          >
            Join
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#3d2f60" }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close" : "Menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: "rgba(247,243,255,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(200,184,255,0.3)",
            animation: "scaleIn 0.18s ease",
          }}
        >
          <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="text-left nav-link px-4 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go("#make-a-friend")}
              className="btn-primary mt-2 px-4 py-3 text-sm text-center"
            >
              Join the community
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
