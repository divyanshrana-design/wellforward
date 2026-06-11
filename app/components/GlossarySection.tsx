"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/lib/data";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const CAT = {
  official:     { emoji: "🏛️", label: "Official",      color: "#7c5cff" },
  "irish-slang":{ emoji: "🍀", label: "Irish slang",   color: "#10b981" },
  transport:    { emoji: "🚌", label: "Transport",     color: "#0ea5e9" },
  healthcare:   { emoji: "🩺", label: "Healthcare",    color: "#ec4899" },
} as const;

function TermCard({ term, index }: { term: GlossaryTerm; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useReveal();
  const cat = CAT[term.category as keyof typeof CAT];

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${(index % 6) * 45}ms` }}>
      <button
        onClick={() => setRevealed(!revealed)}
        className="card glow-on-hover text-left w-full"
        style={{ padding: "16px 18px", minHeight: 90 }}
        aria-expanded={revealed}
        aria-label={`${term.term}${revealed ? " — hide definition" : " — tap to reveal"}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="serif" style={{ fontSize: "1.2rem", color: "#1c1430", lineHeight: 1.1 }}>
              {term.term}
            </h3>
            {term.pronunciation && (
              <p style={{ fontSize: "0.7rem", color: "#b0a0cc", fontStyle: "italic", marginTop: 1 }}>
                /{term.pronunciation}/
              </p>
            )}
          </div>
          <span
            style={{
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
              textTransform: "uppercase", flexShrink: 0, marginTop: 2,
              color: cat.color,
              background: `${cat.color}18`,
              padding: "2px 8px", borderRadius: 4,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
        </div>
        {revealed ? (
          <p style={{ fontSize: "0.82rem", color: "#2a1d50", lineHeight: 1.65 }}>
            {term.definition}
          </p>
        ) : (
          <p style={{ fontSize: "0.75rem", color: "#b0a0cc", fontStyle: "italic" }}>
            tap to find out →
          </p>
        )}
      </button>
    </div>
  );
}

export default function GlossarySection() {
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("all");
  const headerRef = useReveal();

  const filtered = useMemo(() => GLOSSARY_TERMS.filter(t => {
    if (cat !== "all" && t.category !== cat) return false;
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [search, cat]);

  return (
    <section
      id="glossary"
      className="relative z-10 section-padding"
      aria-labelledby="glossary-title"
      style={{ background: "linear-gradient(180deg,transparent,rgba(200,184,255,0.08) 40%,rgba(200,184,255,0.08) 60%,transparent)" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-10">
          <span className="section-label"><BookOpen size={12} /> essential vocabulary</span>
          <h2 id="glossary-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
            What is a <em className="grad-text" style={{ fontStyle: "italic" }}>&quot;GP&quot;</em>?
          </h2>
          <p style={{ maxWidth: 460, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            Ireland has its own language — official acronyms, transport jargon, and slang nobody explains. Tap any card.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: 8,
              background: "rgba(233,226,255,0.55)", border: "1px solid rgba(124,92,255,0.16)",
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <Search size={15} style={{ color: "#9b8ec8", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search terms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search glossary"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.85rem", color: "#1c1430", fontFamily: "var(--font-sans)" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCat("all")} className={`chip ${cat==="all"?"active":""}`} style={{ padding: "6px 12px" }} aria-pressed={cat==="all"}>All</button>
            {Object.entries(CAT).map(([key,v]) => (
              <button key={key} onClick={() => setCat(key)} className={`chip ${cat===key?"active":""}`} style={{ padding: "6px 12px" }} aria-pressed={cat===key}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((t, i) => <TermCard key={t.id} term={t} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>🤔</p>
            <p style={{ fontSize: "0.85rem", color: "#9b8ec8" }}>Nothing for &quot;{search}&quot; — try something shorter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
