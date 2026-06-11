"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

interface HeroSectionProps {
  onMakeFriend: () => void;
  onBrowseGuide: () => void;
}

export default function HeroSection({ onMakeFriend, onBrowseGuide }: HeroSectionProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [headlineRef.current, subRef.current, ctaRef.current];
    elements.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 150);
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Canvas layer — behind text */}
      <div className="absolute inset-0 z-10">
        <HeroCanvas />
      </div>

      {/* Content */}
      <div
        className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        style={{ paddingTop: "40px", paddingBottom: "80px" }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: "rgba(200, 184, 255, 0.4)",
            border: "1px solid rgba(124, 92, 255, 0.2)",
            color: "#5A3EE8",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7C5CFF",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          Built by students at UCD Smurfit — for every international student in Dublin
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-serif mb-6"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 1.05,
            color: "#1a1033",
            letterSpacing: "-0.03em",
          }}
        >
          You&apos;re not the only one{" "}
          <span className="gradient-text italic">figuring it out.</span>
        </h1>

        {/* Subtext */}
        <p
          ref={subRef}
          className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto"
          style={{
            color: "#4a3878",
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          A home for UCD&apos;s international students — find friends, ask seniors, and
          survive your first month in Dublin. Built by students who&apos;ve been there.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5"
        >
          <button
            onClick={onMakeFriend}
            className="btn-primary px-7 py-3.5 text-base w-full sm:w-auto"
            aria-label="Go to Make a Friend section"
          >
            Make a Friend ✦
          </button>
          <button
            onClick={onBrowseGuide}
            className="btn-secondary px-7 py-3.5 text-base w-full sm:w-auto"
            aria-label="Browse the practical guide"
          >
            Browse the guide
          </button>
        </div>

        {/* Footnote */}
        <p
          className="text-sm"
          style={{ color: "#7C5CFF", opacity: 0.7 }}
        >
          For anyone with a{" "}
          <span className="font-medium" style={{ opacity: 1 }}>
            @ucdconnect.ie
          </span>{" "}
          email. Free, always.
        </p>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2"
          style={{ transform: "translateX(-50%)" }}
        >
          <div
            className="flex flex-col items-center gap-1"
            style={{ color: "#8B6EFF", opacity: 0.5 }}
          >
            <span className="text-xs tracking-widest uppercase">scroll</span>
            <div
              style={{
                width: 1,
                height: 32,
                background: "linear-gradient(180deg, #7C5CFF, transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div
        className="relative z-20 w-full border-t"
        style={{
          borderColor: "rgba(200, 184, 255, 0.35)",
          background: "rgba(245, 241, 255, 0.6)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "8,000+", label: "International students at UCD" },
            { value: "120+", label: "Countries represented" },
            { value: "4", label: "Core tools on this site" },
            { value: "0", label: "Euros this costs you" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-serif gradient-text"
                style={{ fontSize: "1.75rem", lineHeight: 1.1 }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "#6b5299", lineHeight: 1.4 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
