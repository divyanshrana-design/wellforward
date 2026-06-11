"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import { GLOSSARY_TERMS, GlossaryTerm } from "@/lib/data";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  official: { label: "Official", emoji: "🏛️", color: "#6B4EFF" },
  "irish-slang": { label: "Irish slang", emoji: "🍀", color: "#10B981" },
  transport: { label: "Transport", emoji: "🚌", color: "#0EA5E9" },
  healthcare: { label: "Healthcare", emoji: "🩺", color: "#EC4899" },
};

function TermCard({ term }: { term: GlossaryTerm }) {
  const [revealed, setRevealed] = useState(false);
  const cat = CATEGORY_LABELS[term.category];

  return (
    <button
      onClick={() => setRevealed(!revealed)}
      className="card text-left w-full relative overflow-hidden group"
      style={{ padding: "18px 20px", minHeight: 100 }}
      aria-expanded={revealed}
      aria-label={`${term.term}: tap to ${revealed ? "hide" : "show"} definition`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(124,92,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3
            className="font-serif font-bold"
            style={{
              fontSize: "1.35rem",
              color: "#1a1033",
              lineHeight: 1.1,
            }}
          >
            {term.term}
          </h3>
          {term.pronunciation && (
            <p className="text-xs italic mt-0.5" style={{ color: "#9B8EC8" }}>
              /{term.pronunciation}/
            </p>
          )}
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1 mt-0.5"
          style={{
            background: `${cat.color}18`,
            color: cat.color,
          }}
        >
          {cat.emoji} {cat.label}
        </span>
      </div>

      {revealed ? (
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#3a2860" }}
        >
          {term.definition}
        </p>
      ) : (
        <p
          className="text-xs"
          style={{ color: "#9B8EC8", fontStyle: "italic" }}
        >
          Tap to reveal →
        </p>
      )}
    </button>
  );
}

export default function GlossarySection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (
        search &&
        !t.term.toLowerCase().includes(search.toLowerCase()) &&
        !t.definition.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [search, activeCategory]);

  return (
    <section
      id="glossary"
      className="relative z-10 section-padding"
      aria-labelledby="glossary-title"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(200, 184, 255, 0.1) 50%, transparent 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm"
            style={{
              background: "rgba(200, 184, 255, 0.4)",
              color: "#6B4EFF",
              border: "1px solid rgba(124, 92, 255, 0.2)",
            }}
          >
            <BookOpen size={14} />
            Essential vocabulary
          </div>
          <h2
            id="glossary-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            What is a{" "}
            <span className="gradient-text italic">&quot;GP&quot;?</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            Ireland has its own language — official acronyms, transport jargon,
            and slang that nobody explains. Tap any card to find out.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-4 py-3"
            style={{
              background: "rgba(233, 226, 255, 0.6)",
              border: "1px solid rgba(124, 92, 255, 0.18)",
            }}
          >
            <Search size={16} style={{ color: "#7C5CFF", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search terms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#1a1033" }}
              aria-label="Search glossary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`chip text-sm py-2 px-3 ${activeCategory === "all" ? "active" : ""}`}
              aria-pressed={activeCategory === "all"}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`chip text-sm py-2 px-3 ${activeCategory === key ? "active" : ""}`}
                aria-pressed={activeCategory === key}
              >
                {val.emoji} {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🤔</p>
            <p className="text-sm" style={{ color: "#7B6EA8" }}>
              No terms match &quot;{search}&quot;. Try a shorter search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
