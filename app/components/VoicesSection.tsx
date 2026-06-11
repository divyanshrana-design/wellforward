"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";
import { VOICE_QUOTES } from "@/lib/data";

function QuoteCard({ quote }: { quote: (typeof VOICE_QUOTES)[0] }) {
  return (
    <div
      className="card flex-shrink-0 flex flex-col relative overflow-hidden"
      style={{
        width: "clamp(280px, 80vw, 380px)",
        minHeight: 220,
        padding: "28px",
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-60 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${quote.gradient.replace("from-", "").replace("to-", "").replace("via-", "").split(" ").map((c) => c.replace("/20", "")).join(", ")})`,
        }}
      />

      <Quote
        size={24}
        className="mb-4 flex-shrink-0"
        style={{ color: "#7C5CFF", opacity: 0.5 }}
        aria-hidden="true"
      />

      <blockquote
        className="font-serif flex-1"
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          lineHeight: 1.55,
          color: "#1a1033",
          fontStyle: "italic",
        }}
      >
        &ldquo;{quote.quote}&rdquo;
      </blockquote>

      <footer
        className="mt-4 text-xs font-medium uppercase tracking-wider"
        style={{ color: "#7B6EA8" }}
      >
        — {quote.profile}
      </footer>

      {/* Optional video slot (hidden until populated) */}
      <div
        className="hidden"
        aria-hidden="true"
        data-video-slot="true"
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(200, 184, 255, 0.4)",
          display: "none", // Toggle to 'flex' when video is available
        }}
      />
    </div>
  );
}

export default function VoicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section
      id="voices"
      className="relative z-10 section-padding overflow-hidden"
      aria-labelledby="voices-title"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(59, 46, 140, 0.05) 30%, rgba(59, 46, 140, 0.08) 70%, transparent 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
            <Heart size={14} />
            Real voices. Anonymised.
          </div>
          <h2
            id="voices-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            You&apos;re{" "}
            <span className="gradient-text italic">not alone</span>
            <span style={{ color: "#1a1033" }}>.</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            These are real words from real students at UCD, collected through interviews.
            Their names are anonymised. Their experiences are not.
          </p>
        </div>

        {/* Scroll controls */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: canScrollLeft
                ? "rgba(200, 184, 255, 0.6)"
                : "rgba(200, 184, 255, 0.2)",
              color: canScrollLeft ? "#6B4EFF" : "#C8B8FF",
              border: "1px solid rgba(124, 92, 255, 0.2)",
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              background: canScrollRight
                ? "rgba(200, 184, 255, 0.6)"
                : "rgba(200, 184, 255, 0.2)",
              color: canScrollRight ? "#6B4EFF" : "#C8B8FF",
              border: "1px solid rgba(124, 92, 255, 0.2)",
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          role="list"
          aria-label="Student voices"
        >

          {VOICE_QUOTES.map((quote) => (
            <div key={quote.id} role="listitem">
              <QuoteCard quote={quote} />
            </div>
          ))}
        </div>

        {/* Support footer */}
        <div
          className="mt-10 rounded-2xl p-5 text-center"
          style={{
            background: "rgba(200, 184, 255, 0.2)",
            border: "1px solid rgba(124, 92, 255, 0.15)",
          }}
        >
          <p className="text-sm" style={{ color: "#4a3878", lineHeight: 1.65 }}>
            If you&apos;re struggling, you&apos;re not alone and you don&apos;t have to wait until it gets serious.{" "}
            <a
              href="https://www.ucd.ie/studentcounselling/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: "#6B4EFF" }}
            >
              UCD Student Counselling
            </a>{" "}
            is free and confidential.{" "}
            <a
              href="tel:1800793793"
              className="font-semibold"
              style={{ color: "#6B4EFF" }}
            >
              Niteline (1800 793 793)
            </a>{" "}
            is there at night if you just need to talk.
          </p>
        </div>
      </div>
    </section>
  );
}
