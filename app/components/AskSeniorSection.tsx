"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Mail, Link2, GraduationCap } from "lucide-react";
import { SENIOR_PROFILES, SeniorProfile } from "@/lib/data";

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

function SeniorCard({ senior, onClick, index }: { senior: SeniorProfile; onClick: () => void; index: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${(index % 3) * 70}ms` }}>
      <button
        onClick={onClick}
        className="card glow-on-hover text-left w-full group cursor-pointer relative overflow-hidden"
        style={{ padding: "18px 20px" }}
        aria-label={`Contact senior ${senior.name}`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(124,92,255,0.08) 0%, transparent 60%)" }}
        />

        <div className="flex items-start gap-3 mb-3">
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-[10px] bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-sm`}
            style={{ boxShadow: "0 4px 12px -4px rgba(0,0,0,0.18)" }}
            aria-hidden="true"
          >
            {getInitials(senior.name)}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="serif font-bold leading-tight truncate" style={{ fontSize: "0.98rem", color: "#1c1430" }}>
              {senior.name} {senior.countryFlag}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 1 }}>
              {senior.programme}
            </div>
            <div style={{ fontSize: "0.68rem", color: "#b0a0cc" }}>
              Class of {senior.graduationYear}
            </div>
          </div>
        </div>

        {/* Ask me about — the main value prop, should be prominent */}
        <div
          style={{
            background: "rgba(200,184,255,0.22)",
            borderRadius: 9,
            padding: "10px 12px",
            marginBottom: 12,
          }}
        >
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 3 }}>
            Ask me about
          </p>
          <p style={{ fontSize: "0.8rem", color: "#2a1d50", lineHeight: 1.5 }}>
            {senior.askMeAbout}
          </p>
        </div>

        <div
          className="flex items-center gap-2 pt-2"
          style={{ borderTop: "1px solid rgba(200,184,255,0.22)" }}
        >
          {senior.email    && <Mail  size={13} style={{ color: "#9b8ec8" }} />}
          {senior.linkedin && <Link2 size={13} style={{ color: "#9b8ec8" }} />}
          <span className="ml-auto text-xs font-medium" style={{ color: "#7c5cff", opacity: 0.85 }}>
            reach out →
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
          <div
            className={`w-14 h-14 rounded-[12px] bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-lg`}
            style={{ flexShrink: 0, boxShadow: "0 6px 18px -6px rgba(0,0,0,0.2)" }}
          >
            {getInitials(senior.name)}
          </div>
          <div>
            <h2 id="senior-name" className="serif" style={{ fontSize: "1.3rem", color: "#1c1430" }}>
              {senior.name} {senior.countryFlag}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#9b8ec8" }}>{senior.programme}</p>
            <p style={{ fontSize: "0.72rem", color: "#b0a0cc" }}>Class of {senior.graduationYear} · {senior.country}</p>
          </div>
        </div>

        <div style={{ background: "rgba(200,184,255,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 4 }}>
            Ask me about
          </p>
          <p style={{ fontSize: "0.85rem", color: "#2a1d50" }}>{senior.askMeAbout}</p>
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
              href={senior.linkedin}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm"
              style={{ textDecoration: "none", borderRadius: 10 }}
            >
              <Link2 size={15} />LinkedIn profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AskSeniorSection() {
  const [selected, setSelected] = useState<SeniorProfile | null>(null);
  const [school, setSchool]     = useState("All");
  const headerRef = useReveal();

  const schools   = ["All", ...Array.from(new Set(SENIOR_PROFILES.map(s => s.school)))];
  const filtered  = useMemo(() =>
    school === "All" ? SENIOR_PROFILES : SENIOR_PROFILES.filter(s => s.school === school),
    [school]
  );

  return (
    <section
      id="ask-a-senior"
      className="relative z-10 section-padding"
      aria-labelledby="seniors-title"
      style={{
        background: "linear-gradient(180deg,transparent,rgba(200,184,255,0.1) 40%,rgba(200,184,255,0.1) 60%,transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-10">
          <span className="section-label">
            <GraduationCap size={12} /> seniors who remember
          </span>
          <h2
            id="seniors-title"
            className="serif mb-4"
            style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}
          >
            Ask a <em className="grad-text" style={{ fontStyle: "italic" }}>Senior</em>
          </h2>
          <p style={{ maxWidth: 480, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            Real seniors. Real answers. They signed up specifically to help — reach out. They all remember what week one felt like.
          </p>
        </div>

        {/* School filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {schools.map(s => (
            <button
              key={s}
              onClick={() => setSchool(s)}
              className={`chip ${school === s ? "active" : ""}`}
              style={{ fontSize: "0.78rem", padding: "6px 14px" }}
              aria-pressed={school === s}
            >
              {s === "Smurfit Business School" ? "Smurfit" : s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <SeniorCard key={s.id} senior={s} onClick={() => setSelected(s)} index={i} />
          ))}
        </div>

        {/* Opt-in */}
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
            If you&apos;re a returning or graduated UCD student and want to help incoming internationals — we&apos;d love to add you.
          </p>
          <a
            href="mailto:wellforward.ucd@gmail.com?subject=I want to be a senior on Wellforward"
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
