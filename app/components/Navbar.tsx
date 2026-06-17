"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Meet people",   href: "/meet-people"   },
  { label: "Ask a senior",  href: "/ask-a-senior"  },
  { label: "First 30 days", href: "/first-30-days" },
  { label: "Voices",        href: "/voices"        },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Check session on mount
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => { if (d.loggedIn) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href;

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
      {/* scroll progress bar removed */}

      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-[64px] flex items-center justify-between">

        {/* Wordmark — links back to home */}
        <Link
          href="/"
          aria-label="Wellforward home"
          style={{ textDecoration: "none" }}
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
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              style={{
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: isActive(l.href) ? 600 : 500,
                color: isActive(l.href) ? "#7c5cff" : "#38285c",
                background: isActive(l.href) ? "rgba(124,92,255,0.08)" : "none",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => {
                if (!isActive(l.href))
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,92,255,0.06)";
              }}
              onMouseLeave={e => {
                if (!isActive(l.href))
                  (e.currentTarget as HTMLAnchorElement).style.background = "none";
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* CTA — Join / My Profile — renders nothing until auth resolved to prevent flash */}
          {isLoggedIn === null ? (
            <div style={{ marginLeft: 12, width: 96, height: 36 }} aria-hidden="true" />
          ) : isLoggedIn ? (
            <Link
              href="/profile"
              style={{
                marginLeft: 12,
                padding: "8px 18px",
                fontSize: "0.875rem",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(124,92,255,0.1)",
                color: "#7c5cff",
                fontWeight: 600,
                border: "1.5px solid rgba(124,92,255,0.25)",
                transition: "background 0.15s",
              }}
            >
              <User size={14} /> My profile
            </Link>
          ) : (
            <Link
              href="/join"
              className="btn-primary"
              style={{
                marginLeft: 12,
                padding: "9px 20px",
                fontSize: "0.875rem",
                borderRadius: 10,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Join free
            </Link>
          )}
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
              <Link
                key={l.href}
                href={l.href}
                style={{
                  textAlign: "left",
                  display: "block",
                  textDecoration: "none",
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: isActive(l.href) ? 600 : 500,
                  color: isActive(l.href) ? "#7c5cff" : "#38285c",
                  background: isActive(l.href) ? "rgba(124,92,255,0.08)" : "none",
                }}
              >
                {l.label}
              </Link>
            ))}
            {isLoggedIn === null ? null : isLoggedIn ? (
              <Link
                href="/profile"
                style={{
                  marginTop: 8,
                  padding: "12px 16px",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "rgba(124,92,255,0.1)",
                  color: "#7c5cff",
                  fontWeight: 600,
                  border: "1.5px solid rgba(124,92,255,0.25)",
                  borderRadius: 10,
                }}
              >
                <User size={15} /> My profile
              </Link>
            ) : (
              <Link
                href="/join"
                className="btn-primary"
                style={{
                  marginTop: 8,
                  padding: "12px 16px",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Join free ✦
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
