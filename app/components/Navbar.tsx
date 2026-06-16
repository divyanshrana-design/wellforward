"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Meet people",   href: "#make-a-friend" },
  { label: "Ask a senior",  href: "#ask-a-senior"  },
  { label: "First 30 days", href: "#checklist"     },
  { label: "Voices",        href: "#voices"        },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: "smooth",
    });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        transition: "background 0.3s ease, border-color 0.3s ease",
        background: scrolled ? "rgba(253,252,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,184,255,0.3)" : "1px solid transparent",
      }}
    >
      {/* Scroll progress bar */}
      {scrolled && (
        <div
          id="scroll-progress-bar"
          style={{
            position: "absolute",
            bottom: 0, left: 0,
            height: 2,
            background: "linear-gradient(90deg, #7c5cff, #c8b8ff)",
            width: "0%",
            transition: "width 0.1s linear",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}

      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between">

        {/* Wordmark — Fraunces italic serif + normal, like PM Éire */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Wellforward — scroll to top"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1a0f2e",
              display: "flex",
              alignItems: "baseline",
              gap: 0,
            }}
          >
            <em style={{ fontStyle: "italic", color: "#1a0f2e" }}>Well</em>
            <span style={{ color: "#7c5cff", fontStyle: "normal" }}>forward</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="nav-link"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "8px 14px",
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#38285c",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,92,255,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              {l.label}
            </button>
          ))}

          {/* CTA — Join */}
          <button
            onClick={() => go("#make-a-friend")}
            className="btn-primary"
            style={{ marginLeft: 12, padding: "9px 20px", fontSize: "0.875rem", borderRadius: 10 }}
          >
            Join free
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#38285c",
            padding: 6,
            borderRadius: 8,
          }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: "rgba(253,252,255,0.97)",
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
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#38285c",
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go("#make-a-friend")}
              className="btn-primary"
              style={{ marginTop: 8, padding: "12px 16px", fontSize: "0.9rem", textAlign: "center" }}
            >
              Join the community
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
