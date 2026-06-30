"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, Shield } from "lucide-react";

const NAV_LINKS = [
  { label: "Meet people",   href: "/meet-people"   },
  { label: "Faculty",       href: "/faculty"       },
  { label: "Ask a senior",  href: "/ask-a-senior"  },
  { label: "First 30 days", href: "/first-30-days" },
  { label: "Visa guide",    href: "/visas"         },
  { label: "Voices",        href: "/voices"        },
];

// The Navbar is rendered per-page (not in the shared layout), so every
// navigation mounts a brand-new instance whose auth state starts unknown.
// To stop the auth buttons from briefly disappearing on every click, we
// remember the last-known login state in sessionStorage and seed the new
// instance with it immediately, then refresh it in the background.
const AUTH_CACHE_KEY = "wf_is_logged_in";

function readCachedAuth(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(AUTH_CACHE_KEY);
    if (v === "1") return true;
    if (v === "0") return false;
    return null;
  } catch {
    return null;
  }
}

function writeCachedAuth(value: boolean) {
  try {
    window.sessionStorage.setItem(AUTH_CACHE_KEY, value ? "1" : "0");
  } catch {
    /* ignore (private mode etc.) */
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  // Start as null so the server-rendered HTML and the client's first render
  // match (no hydration mismatch). We then immediately apply the cached value
  // in a layout effect - which runs *before* the browser paints - so the user
  // never actually sees the empty placeholder when navigating between pages.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  // Synchronously hydrate from the session cache before first paint.
  // useLayoutEffect runs after DOM mutations but before the browser repaints,
  // so swapping null -> cached value here is invisible (no flicker).
  useLayoutEffect(() => {
    const cached = readCachedAuth();
    if (cached !== null) setIsLoggedIn(cached);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Check session on mount AND whenever the route changes (so the navbar
  // reflects login/logout immediately after those actions). The cached value
  // already keeps the buttons visible, so this just keeps them accurate.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (cancelled) return;
        const loggedIn = !!d.loggedIn;
        setIsLoggedIn(loggedIn);
        writeCachedAuth(loggedIn);
        // Only the master account gets the Admin link. Checked server-side.
        if (loggedIn) {
          fetch('/api/admin/check', { cache: 'no-store' })
            .then(r => r.json())
            .then(a => { if (!cancelled) setIsAdmin(!!a.isAdmin); })
            .catch(() => { if (!cancelled) setIsAdmin(false); });
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoggedIn(prev => (prev === null ? false : prev));
      });
    return () => { cancelled = true; };
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/me', { method: 'DELETE' });
    } catch {
      /* ignore */
    }
    // Clear the cached auth state so the post-logout navbar doesn't briefly
    // show the logged-in buttons.
    writeCachedAuth(false);
    // Full reload to the home page so every component re-reads the cleared
    // session - this is what makes logout feel seamless everywhere.
    window.location.href = '/';
  };

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

        {/* Wordmark - links back to home */}
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

          {/* CTA - renders nothing until auth resolved to prevent flash */}
          {isLoggedIn === null ? (
            <div style={{ marginLeft: 12, width: 96, height: 36 }} aria-hidden="true" />
          ) : isLoggedIn ? (
            <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 8 }}>
              {isAdmin && (
                <Link
                  href="/admin"
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.875rem",
                    borderRadius: 10,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "linear-gradient(160deg, #7c5cff 0%, #5a3ee8 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "1.5px solid transparent",
                  }}
                >
                  <Shield size={14} /> Admin
                </Link>
              )}
              <Link
                href="/profile"
                style={{
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
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: "8px 14px",
                  fontSize: "0.875rem",
                  borderRadius: 10,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "transparent",
                  color: "#9b8ec8",
                  fontWeight: 500,
                  border: "1.5px solid #ede8ff",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ede8ff"; (e.currentTarget as HTMLButtonElement).style.color = "#9b8ec8"; }}
                aria-label="Log out"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          ) : (
            <div style={{ marginLeft: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                href="/login"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  display: "inline-block",
                  color: "#38285c",
                  fontWeight: 600,
                  border: "1.5px solid #ede8ff",
                  transition: "border-color 0.15s",
                }}
              >
                Log in
              </Link>
              <Link
                href="/join"
                className="btn-primary"
                style={{
                  padding: "9px 20px",
                  fontSize: "0.875rem",
                  borderRadius: 10,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Join free
              </Link>
            </div>
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
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
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
                      background: "linear-gradient(160deg, #7c5cff 0%, #5a3ee8 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      border: "1.5px solid transparent",
                      borderRadius: 10,
                    }}
                  >
                    <Shield size={15} /> Admin
                  </Link>
                )}
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
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    marginTop: 8,
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: "transparent",
                    color: "#9b8ec8",
                    fontWeight: 500,
                    border: "1.5px solid #ede8ff",
                    borderRadius: 10,
                  }}
                >
                  <LogOut size={15} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    marginTop: 8,
                    padding: "12px 16px",
                    fontSize: "0.9rem",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "block",
                    color: "#38285c",
                    fontWeight: 600,
                    border: "1.5px solid #ede8ff",
                    borderRadius: 10,
                  }}
                >
                  Log in
                </Link>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
