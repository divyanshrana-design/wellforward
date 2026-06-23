"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Mail, Link2, GraduationCap, Lock, ArrowRight } from "lucide-react";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
import Link from "next/link";
import { SeniorProfile } from "@/lib/data";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

// Ensure URL always has a protocol — prevents relative-path redirects
function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "https://" + url;
}

/* ─── Login Gate Overlay ────────────────────────────────────── */
function LoginGate() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        background: "linear-gradient(180deg, rgba(253,252,255,0.4) 0%, rgba(233,226,255,0.7) 100%)",
        borderRadius: 16,
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          boxShadow: "0 8px 24px -8px rgba(124,92,255,0.5)",
        }}
      >
        <Lock size={22} color="white" />
      </div>
      <h3
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#1a0f2e",
          letterSpacing: "-0.025em",
          marginBottom: 10,
        }}
      >
        Sign in to contact seniors
      </h3>
      <p
        style={{
          fontSize: "0.88rem",
          color: "#3d2f60",
          lineHeight: 1.65,
          maxWidth: 360,
          marginBottom: 24,
        }}
      >
        Seniors have shared their contact details with the Wellforward community. Create a free account with your @ucdconnect.ie address to reach out.
      </p>
      <Link
        href="/join"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "linear-gradient(135deg, #7c5cff, #5a3ee8)",
          color: "white",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 600,
          padding: "12px 28px",
          borderRadius: 12,
          textDecoration: "none",
          boxShadow: "0 8px 24px -8px rgba(92,60,220,0.45)",
        }}
      >
        Create a free account <ArrowRight size={15} />
      </Link>
      <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 14 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#7c5cff", textDecoration: "underline" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

function SeniorCard({ senior, onClick, index, gated }: { senior: SeniorProfile; onClick: () => void; index: number; gated: boolean }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
      <button
        onClick={onClick}
        className="card glow-on-hover text-left w-full group cursor-pointer relative overflow-hidden"
        style={{ padding: "18px 20px" }}
        aria-label={gated ? "Sign in to contact senior" : `Contact senior ${senior.name}`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(124,92,255,0.08) 0%, transparent 60%)" }}
        />

        <div className="flex items-start gap-3 mb-3">
          {senior.photoUrl ? (
            <div
              className="flex-shrink-0 w-11 h-11 rounded-[10px] overflow-hidden"
              style={{ boxShadow: "0 4px 12px -4px rgba(0,0,0,0.18)" }}
              aria-hidden="true"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={senior.photoUrl} alt={senior.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-[10px] bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-sm`}
              style={{ boxShadow: "0 4px 12px -4px rgba(0,0,0,0.18)" }}
              aria-hidden="true"
            >
              {getInitials(senior.name)}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="serif font-bold leading-tight truncate" style={{ fontSize: "0.98rem", color: "#1c1430" }}>
              {senior.name} {senior.countryFlag}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 1 }}>{senior.programme}</div>
            <div style={{ fontSize: "0.68rem", color: "#b0a0cc" }}>Class of {senior.graduationYear}</div>
          </div>
        </div>

        <div style={{ background: "rgba(200,184,255,0.22)", borderRadius: 9, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 5 }}>
            Ask me about
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {senior.askMeAbout.split(",").map(item => item.trim()).filter(Boolean).map(item => (
              <span key={item} style={{
                display: "inline-block", padding: "2px 8px", borderRadius: 999,
                fontSize: "0.72rem", fontWeight: 500,
                background: "rgba(124,92,255,0.1)", border: "1px solid rgba(124,92,255,0.18)",
                color: "#4a2fa0",
              }}>{item}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(200,184,255,0.22)" }}>
          {senior.email    && <Mail  size={13} style={{ color: "#9b8ec8" }} />}
          {senior.linkedin && <Link2 size={13} style={{ color: "#9b8ec8" }} />}
          <span className="ml-auto text-xs font-medium" style={{ color: gated ? "#c8b8ff" : "#7c5cff", opacity: gated ? 0.6 : 0.85 }}>
            {gated ? "sign in to reach out" : "reach out →"}
          </span>
        </div>
      </button>
    </div>
  );
}

function SeniorModal({ senior, onClose }: { senior: SeniorProfile; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass relative w-full max-w-sm rounded-2xl overflow-y-auto"
        style={{ padding: "26px", maxHeight: "90vh", animation: "scaleIn 0.2s ease" }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="senior-name"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(200,184,255,0.3)", border: "none",
            width: 30, height: 30, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6b5a8e",
          }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-4 mb-5">
          {senior.photoUrl ? (
            <div
              style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flexShrink: 0, boxShadow: "0 6px 18px -6px rgba(0,0,0,0.2)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={senior.photoUrl} alt={senior.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : (
            <div
              className={`w-14 h-14 rounded-[12px] bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-lg`}
              style={{ flexShrink: 0, boxShadow: "0 6px 18px -6px rgba(0,0,0,0.2)" }}
            >
              {getInitials(senior.name)}
            </div>
          )}
          <div>
            <h2 id="senior-name" className="serif" style={{ fontSize: "1.3rem", color: "#1c1430" }}>
              {senior.name} {senior.countryFlag}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#9b8ec8" }}>{senior.programme}</p>
            <p style={{ fontSize: "0.72rem", color: "#b0a0cc" }}>Class of {senior.graduationYear} · {senior.country}</p>
          </div>
        </div>

        <div style={{ background: "rgba(200,184,255,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 8 }}>
            Ask me about
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {senior.askMeAbout.split(",").map(item => item.trim()).filter(Boolean).map(item => (
              <span key={item} style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: "0.78rem",
                fontWeight: 500,
                background: "rgba(124,92,255,0.1)",
                border: "1px solid rgba(124,92,255,0.2)",
                color: "#4a2fa0",
              }}>{item}</span>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(233,226,255,0.4)", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
          <p style={{ fontSize: "0.85rem", color: "#2a1d50", lineHeight: 1.68 }}>{senior.bio}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {senior.email && (
            <a
              href={senior.email}
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              style={{ textDecoration: "none", borderRadius: 10 }}
            >
              <Mail size={15} />Send an email
            </a>
          )}
          {senior.linkedin && (
            <a
              href={ensureHttps(senior.linkedin)} target="_blank" rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm"
              style={{ textDecoration: "none", borderRadius: 10 }}
            >
              <Link2 size={15} />LinkedIn profile
            </a>
          )}
          {senior.instagram && (
            <a
              href={`https://instagram.com/${senior.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
              style={{
                textDecoration: "none", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px", fontSize: "0.875rem", fontWeight: 600,
                background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                color: "white",
              }}
            >
              <InstagramIcon size={15} />Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate a consistent avatar gradient from a string (name)
const AVATAR_COLORS = [
  "from-violet-500 to-purple-700",
  "from-indigo-500 to-blue-700",
  "from-fuchsia-500 to-pink-700",
  "from-sky-500 to-cyan-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
];
function avatarColorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export default function AskSeniorSection() {
  const [selected, setSelected] = useState<SeniorProfile | null>(null);
  const [programme, setProgramme] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profiles, setProfiles] = useState<SeniorProfile[]>([]);
  const headerRef = useReveal();

  useEffect(() => {
    // Check session
    fetch('/api/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.loggedIn) setIsLoggedIn(true); })
      .catch(() => {});

    // Load live senior profiles
    fetch('/api/seniors', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d.profiles) {
          // Attach a derived avatarColor since API doesn't store it
          setProfiles(d.profiles.map((s: SeniorProfile) => ({
            ...s,
            avatarColor: avatarColorFor(s.name),
          })));
        }
      })
      .catch(() => {});
  }, []);

  // Build programme filter list from live data
  const programmes = ["All", ...Array.from(new Set(profiles.map(s => s.programme))).sort()];

  const filtered = useMemo(() =>
    programme === "All" ? profiles : profiles.filter(s => s.programme === programme),
    [profiles, programme]
  );

  const handleCardClick = (senior: SeniorProfile) => {
    if (!isLoggedIn) return; // gate handled by overlay
    setSelected(senior);
  };

  return (
    <section
      id="ask-a-senior"
      className="relative z-10 section-padding"
      aria-labelledby="seniors-title"
      style={{ background: "linear-gradient(180deg,transparent,rgba(200,184,255,0.1) 40%,rgba(200,184,255,0.1) 60%,transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-10">
          <span className="section-label">
            <GraduationCap size={12} /> seniors who remember
          </span>
          <h2 id="seniors-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
            Ask a <em className="grad-text" style={{ fontStyle: "italic" }}>Senior</em>
          </h2>
          <p style={{ maxWidth: 480, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            Real seniors. Real answers. They signed up specifically to help. All of them remember what week one felt like.
          </p>
        </div>

        {/* Programme filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {programmes.map(p => (
            <button
              key={p}
              onClick={() => setProgramme(p)}
              className={`chip ${programme === p ? "active" : ""}`}
              style={{ fontSize: "0.78rem", padding: "6px 14px" }}
              aria-pressed={programme === p}
            >
              {p === "All" ? "All programmes" : p.replace("MSc ", "").replace("Management ", "")}
            </button>
          ))}
        </div>

        {/* Senior grid — gated */}
        <div style={{ position: "relative", minHeight: 380 }}>
          <div style={{ filter: isLoggedIn ? "none" : "blur(5px)", pointerEvents: isLoggedIn ? "auto" : "none", userSelect: "none", transition: "filter 0.4s ease" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s, i) => (
                <SeniorCard key={s.id} senior={s} onClick={() => handleCardClick(s)} index={i} gated={!isLoggedIn} />
              ))}
            </div>
          </div>

          {!isLoggedIn && <LoginGate />}
        </div>

        {/* Opt-in for seniors */}
        <div
          style={{
            border: "1.5px dashed rgba(124,92,255,0.25)",
            borderRadius: 14,
            padding: "24px",
            marginTop: 36,
            maxWidth: 460,
            margin: "36px auto 0",
            textAlign: "center",
          }}
        >
          <p className="serif" style={{ fontSize: "1.05rem", color: "#1c1430", marginBottom: 6 }}>
            Were you here last year?
          </p>
          <p style={{ fontSize: "0.82rem", color: "#6b5a8e", lineHeight: 1.6, marginBottom: 14 }}>
            If you are a returning or graduated Smurfit student and want to help incoming internationals, we would love to add you.
          </p>
          <a
            href="mailto:divyansh.rana@ucdconnect.ie?subject=I want to be a senior on Wellforward"
            className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
            style={{ textDecoration: "none", borderRadius: 9 }}
          >
            <Mail size={14} /> Get in touch
          </a>
        </div>
      </div>

      {selected && <SeniorModal senior={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
