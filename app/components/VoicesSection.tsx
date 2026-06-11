"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VOICE_QUOTES } from "@/lib/data";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// Each card has a slightly different rotation and card feel
const CARD_ROTATIONS = ["-1deg","0.5deg","-0.5deg","1.2deg","0deg","-0.8deg","0.7deg","-0.4deg"];
const CARD_BG = [
  "rgba(200,184,255,0.22)",
  "rgba(255,214,238,0.22)",
  "rgba(184,200,255,0.22)",
  "rgba(196,224,255,0.22)",
  "rgba(200,184,255,0.22)",
  "rgba(255,220,180,0.2)",
  "rgba(180,240,210,0.18)",
  "rgba(255,184,230,0.2)",
];

export default function VoicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);
  const headerRef = useReveal();

  const scroll = (dir: "l" | "r") => {
    scrollRef.current?.scrollBy({ left: dir === "r" ? 380 : -380, behavior: "smooth" });
  };
  const onScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 10);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section
      id="voices"
      className="relative z-10 section-padding"
      aria-labelledby="voices-title"
      style={{
        background: "linear-gradient(180deg, transparent, rgba(59,46,140,0.04) 30%, rgba(59,46,140,0.06) 70%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        {/* Header */}
        <div ref={headerRef} className="reveal mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="section-label">♥ real words, real students</span>
            <h2
              id="voices-title"
              className="serif"
              style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}
            >
              You&apos;re{" "}
              <em className="grad-text" style={{ fontStyle: "italic" }}>not alone</em>.
            </h2>
            <div className="squiggle-divider mt-3" aria-hidden="true" />
            <p style={{ maxWidth: 440, fontSize: "0.9rem", color: "#3d2f60", lineHeight: 1.65, marginTop: 10 }}>
              These words came from real interviews with UCD international students. Names anonymised. Feelings very real.
            </p>
          </div>

          {/* Scroll controls */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll("l")}
              disabled={!canLeft}
              aria-label="Scroll left"
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: canLeft ? "rgba(200,184,255,0.5)" : "rgba(200,184,255,0.2)",
                border: "1px solid rgba(124,92,255,0.18)",
                color: canLeft ? "#6b4eff" : "#d0c4f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: canLeft ? "pointer" : "default",
                transition: "all 0.18s ease",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("r")}
              disabled={!canRight}
              aria-label="Scroll right"
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: canRight ? "rgba(200,184,255,0.5)" : "rgba(200,184,255,0.2)",
                border: "1px solid rgba(124,92,255,0.18)",
                color: canRight ? "#6b4eff" : "#d0c4f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: canRight ? "pointer" : "default",
                transition: "all 0.18s ease",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards — horizontal scroll */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="no-scrollbar flex gap-5 overflow-x-auto pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="list"
          aria-label="Student voices"
        >
          {VOICE_QUOTES.map((q, i) => (
            <article
              key={q.id}
              role="listitem"
              className="quote-card card flex-shrink-0 flex flex-col"
              style={{
                width: "clamp(260px,75vw,340px)",
                minHeight: 200,
                padding: "28px 24px 22px",
                background: CARD_BG[i % CARD_BG.length],
                backdropFilter: "blur(16px)",
                transform: `rotate(${CARD_ROTATIONS[i % CARD_ROTATIONS.length]})`,
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) translateY(-4px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${CARD_ROTATIONS[i % CARD_ROTATIONS.length]})`)}
            >
              {/* Big opening quote — decorative, CSS handled */}
              <blockquote
                className="serif flex-1"
                style={{
                  fontSize: "clamp(0.95rem,2.2vw,1.12rem)",
                  lineHeight: 1.6,
                  color: "#1c1430",
                  fontStyle: "italic",
                  marginBottom: 16,
                  paddingTop: 8,
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </blockquote>

              <footer style={{ fontSize: "0.72rem", color: "#9b8ec8", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                — {q.profile}
              </footer>
            </article>
          ))}
        </div>

        {/* Support note — tucked at the bottom, understated */}
        <div
          style={{
            marginTop: 40,
            padding: "16px 20px",
            background: "rgba(200,184,255,0.18)",
            border: "1px solid rgba(124,92,255,0.12)",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "#3d2f60", lineHeight: 1.7 }}>
            If you&apos;re struggling, you don&apos;t have to wait until it gets serious.{" "}
            <a href="https://www.ucd.ie/studentcounselling/" target="_blank" rel="noopener noreferrer"
               style={{ color: "#6b4eff", fontWeight: 600, textDecoration: "none" }}>
              UCD Student Counselling
            </a>{" "}
            is free and confidential.{" "}
            <a href="tel:1800793793" style={{ color: "#6b4eff", fontWeight: 600, textDecoration: "none" }}>
              Niteline 1800 793 793
            </a>{" "}
            is there at night.
          </p>
        </div>
      </div>
    </section>
  );
}
