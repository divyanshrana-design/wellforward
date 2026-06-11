"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

interface Props {
  onMakeFriend: () => void;
  onBrowseGuide: () => void;
}

// Small floating label that appears at different positions — hand-placed feel
function FloatingNote({
  text, style, delay = 0,
}: { text: string; style: React.CSSProperties; delay?: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        ...style,
        opacity:   vis ? 1 : 0,
        transform: vis ? "translateY(0) rotate(-1.5deg)" : "translateY(12px) rotate(-1.5deg)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderRadius: 10,
        padding: "6px 12px",
        fontSize: "0.72rem",
        fontWeight: 500,
        color: "#5a3ee8",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px -4px rgba(124,92,255,0.18)",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {text}
    </div>
  );
}

// Animated number counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const duration = 1400;
      const step = (ts: number, startTs?: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(t => step(t, startTs));
        else setVal(target);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function HeroSection({ onMakeFriend, onBrowseGuide }: Props) {
  const h1Ref   = useRef<HTMLHeadingElement>(null);
  const subRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pairs: [React.RefObject<HTMLElement>, number][] = [
      [badgeRef, 100],
      [h1Ref,   280],
      [subRef,  480],
      [ctaRef,  640],
    ];
    pairs.forEach(([ref, delay]) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.85s cubic-bezier(.22,.68,0,1), transform 0.85s cubic-bezier(.22,.68,0,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });
  }, []);

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100svh", paddingTop: 62 }}
    >
      {/* Interactive burst canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Main content — intentionally off-centre vertically */}
      <div
        className="relative z-20 flex flex-col justify-center flex-1 max-w-5xl mx-auto w-full px-5 sm:px-10"
        style={{ paddingBottom: "7vh" }}
      >
        {/* Floating sticky-note labels — gives "student made" feel */}
        <FloatingNote
          text="🇮🇪 dublin-based"
          style={{ top: "6vh", right: "8vw" }}
          delay={900}
        />
        <FloatingNote
          text="✦ free forever"
          style={{ top: "18vh", right: "3vw" }}
          delay={1100}
        />
        <FloatingNote
          text="🎓 ucdconnect.ie only"
          style={{ bottom: "18vh", right: "10vw" }}
          delay={1300}
        />

        {/* Label */}
        <div ref={badgeRef as React.RefObject<HTMLDivElement>} className="mb-5">
          <span className="section-label">
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#7c5cff",
                display: "inline-block",
                animation: "pulse 2.2s ease-in-out infinite",
              }}
            />
            Built by UCD Smurfit students, for everyone at UCD
          </span>
        </div>

        {/* Headline — big, editorial, broken into two lines deliberately */}
        <h1
          ref={h1Ref}
          className="serif mb-6"
          style={{
            fontSize: "clamp(2.8rem, 7.5vw, 6rem)",
            lineHeight: 1.03,
            color: "#1c1430",
            letterSpacing: "-0.03em",
            maxWidth: 720,
          }}
        >
          You&apos;re not the only{" "}
          <br className="hidden sm:block" />
          one{" "}
          <em
            className="grad-text"
            style={{ fontStyle: "italic", letterSpacing: "-0.02em" }}
          >
            figuring it out.
          </em>
        </h1>

        {/* Squiggle — human touch */}
        <div className="squiggle-divider mb-5" aria-hidden="true" />

        {/* Sub — conversational, not marketing copy */}
        <p
          ref={subRef}
          style={{
            maxWidth: 520,
            fontSize: "1.05rem",
            lineHeight: 1.68,
            color: "#3d2f60",
            marginBottom: "2rem",
          }}
        >
          A home for UCD&apos;s international students. Find friends, ask seniors
          who&apos;ve done it, and survive your first month in Dublin.{" "}
          <span style={{ color: "#7c5cff", fontWeight: 500 }}>Built by students who&apos;ve been there.</span>
        </p>

        {/* CTAs — different shapes, not a matched pair */}
        <div ref={ctaRef} className="flex flex-wrap gap-3 items-center">
          <button
            onClick={onMakeFriend}
            className="btn-primary px-7 py-3.5 text-base"
            style={{ borderRadius: 12 }}
          >
            Make a Friend ✦
          </button>
          <button
            onClick={onBrowseGuide}
            className="btn-secondary px-6 py-3.5 text-base"
            style={{ borderRadius: 12 }}
          >
            Browse the guide
          </button>
          {/* Footnote inline with CTAs — not below */}
          <span
            style={{
              fontSize: "0.78rem",
              color: "#9b8ec8",
              marginLeft: 4,
            }}
          >
            @ucdconnect.ie · free
          </span>
        </div>
      </div>

      {/* Stat strip — sits at the bottom of the viewport */}
      <div
        className="relative z-20 w-full"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(200,184,255,0.3)",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { n: 8000, suffix: "+", label: "international students at UCD" },
            { n: 120,  suffix: "+", label: "countries represented" },
            { n: 30,   suffix: " days", label: "covered in our guide" },
            { n: 0,    suffix: "€",  label: "it costs you" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div
                className="serif grad-text"
                style={{ fontSize: "1.9rem", lineHeight: 1.05 }}
              >
                <Counter target={s.n} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#6b5a8e", marginTop: 3, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll nudge */}
      <div
        className="absolute bottom-[72px] left-1/2 z-20"
        style={{
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: "#9b8ec8",
          opacity: 0.55,
          animation: "floatSlow 2.5s ease-in-out infinite",
        }}
        aria-hidden="true"
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5"/>
          <rect
            x="6.5" y="4" width="3" height="6" rx="1.5"
            fill="currentColor"
            style={{ animation: "floatSlow 1.8s ease-in-out infinite" }}
          />
        </svg>
      </div>
    </section>
  );
}
