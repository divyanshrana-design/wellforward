"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

interface Props {
  onMakeFriend: () => void;
  onBrowseGuide: () => void;
}

// Sparkle particle — CSS-animated dot
function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="sparkle"
      style={style}
    />
  );
}

// Animated number counter triggered by IntersectionObserver
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const duration = 1400;
      const start = performance.now();
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

// Mini checklist card — "show don't tell"
function ChecklistPreview() {
  const items = [
    { done: true,  text: "Book IRP appointment",   note: "do this before you land" },
    { done: true,  text: "Get a Leap card",          note: "airport or newsagent" },
    { done: false, text: "Apply for PPSN",           note: "needed for work & tax" },
    { done: false, text: "Open AIB account",         note: "fully online, ~1 week" },
    { done: false, text: "Get a SIM (try 48)",       note: "€12/mo unlimited 5G" },
  ];

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ede8ff",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 20px 60px -20px rgba(92,60,220,0.18), 0 4px 12px -4px rgba(92,60,220,0.08)",
        width: "100%",
        maxWidth: 224,
        transform: "rotate(1.5deg)",
        position: "relative",
      }}
    >
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 700,
          fontSize: "0.82rem",
          color: "#1a0f2e",
          letterSpacing: "-0.01em",
        }}>
          Your first week
        </span>
        <span style={{
          marginLeft: "auto",
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#7c5cff",
          background: "rgba(124,92,255,0.1)",
          padding: "2px 7px",
          borderRadius: 999,
        }}>
          Dublin
        </span>
      </div>

      {/* Checklist items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {/* Checkbox */}
            <div style={{
              width: 15, height: 15,
              borderRadius: 4,
              border: item.done ? "none" : "1.5px solid rgba(124,92,255,0.35)",
              background: item.done ? "#7c5cff" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
              transition: "all 0.2s ease",
            }}>
              {item.done && (
                <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            {/* Text */}
            <div>
              <div style={{
                fontSize: "0.71rem",
                fontWeight: 600,
                color: item.done ? "#9b8ec8" : "#1a0f2e",
                textDecoration: item.done ? "line-through" : "none",
                lineHeight: 1.3,
              }}>
                {item.text}
              </div>
              <div style={{ fontSize: "0.6rem", color: "#9b8ec8", marginTop: 1 }}>
                {item.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 12, height: 3, background: "#ede8ff", borderRadius: 2 }}>
        <div style={{
          height: "100%",
          width: "40%",
          background: "linear-gradient(90deg, #7c5cff, #c8b8ff)",
          borderRadius: 2,
        }} />
      </div>
      <div style={{ marginTop: 4, fontSize: "0.58rem", color: "#9b8ec8" }}>
        2 of 5 done — keep going ✦
      </div>
    </div>
  );
}

export default function HeroSection({ onMakeFriend, onBrowseGuide }: Props) {
  const copyRef  = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);

  // Entrance animation — stagger the left copy
  useEffect(() => {
    const els = copyRef.current?.querySelectorAll<HTMLElement>("[data-enter]");
    els?.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.8s cubic-bezier(.22,.68,0,1), transform 0.8s cubic-bezier(.22,.68,0,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 120 + i * 160);
    });

    // Card comes in from right
    const card = cardRef.current;
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "translateX(30px) rotate(1.5deg)";
      setTimeout(() => {
        card.style.transition = "opacity 0.9s cubic-bezier(.22,.68,0,1), transform 0.9s cubic-bezier(.22,.68,0,1)";
        card.style.opacity = "1";
        card.style.transform = "translateX(0) rotate(1.5deg)";
      }, 600);
    }
  }, []);

  // Sparkle positions — deliberately irregular, hand-placed feel
  const sparkles: React.CSSProperties[] = [
    { top: "12%",  left: "8%",   width: 4, height: 4, "--dur": "3.2s", "--delay": "0s",    "--max-opacity": "0.4" } as React.CSSProperties,
    { top: "8%",   left: "42%",  width: 3, height: 3, "--dur": "4.5s", "--delay": "0.8s",  "--max-opacity": "0.3" } as React.CSSProperties,
    { top: "22%",  right: "12%", width: 5, height: 5, "--dur": "3.8s", "--delay": "1.2s",  "--max-opacity": "0.25" } as React.CSSProperties,
    { top: "35%",  left: "3%",   width: 3, height: 3, "--dur": "5s",   "--delay": "0.4s",  "--max-opacity": "0.35" } as React.CSSProperties,
    { top: "55%",  right: "6%",  width: 4, height: 4, "--dur": "4s",   "--delay": "2s",    "--max-opacity": "0.3" } as React.CSSProperties,
    { top: "65%",  left: "18%",  width: 3, height: 3, "--dur": "6s",   "--delay": "0.6s",  "--max-opacity": "0.28" } as React.CSSProperties,
    { top: "78%",  right: "22%", width: 4, height: 4, "--dur": "3.5s", "--delay": "1.8s",  "--max-opacity": "0.32" } as React.CSSProperties,
    { top: "18%",  left: "58%",  width: 3, height: 3, "--dur": "4.8s", "--delay": "2.4s",  "--max-opacity": "0.22" } as React.CSSProperties,
    { top: "42%",  right: "30%", width: 5, height: 5, "--dur": "5.5s", "--delay": "1s",    "--max-opacity": "0.2"  } as React.CSSProperties,
    { top: "88%",  left: "6%",   width: 3, height: 3, "--dur": "4.2s", "--delay": "3s",    "--max-opacity": "0.3"  } as React.CSSProperties,
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", paddingTop: 62, display: "flex", flexDirection: "column" }}
    >
      {/* Canvas cursor-burst layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Sparkle particles — scattered over full hero */}
      <div className="sparkles absolute inset-0 z-10 pointer-events-none">
        {sparkles.map((s, i) => <Sparkle key={i} style={s} />)}
      </div>

      {/* Main grid — left copy + right card */}
      <div
        className="relative z-20 flex-1 flex items-center"
        style={{ padding: "6vh 0 4vh" }}
      >
        <div
          className="max-w-6xl mx-auto w-full px-5 sm:px-10"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(32px, 5vw, 64px)",
            alignItems: "center",
          }}
        >
          {/* ─── LEFT: Copy ─── */}
          <div ref={copyRef}>
            {/* Eyebrow */}
            <div data-enter style={{ marginBottom: 16 }}>
              <span className="eyebrow">
                For UCD international students
              </span>
            </div>

            {/* Headline — Fraunces, heavy weight, italic accent */}
            <h1
              data-enter
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)",
                lineHeight: 1.02,
                color: "#1a0f2e",
                letterSpacing: "-0.035em",
                fontWeight: 900,
                marginBottom: 20,
                maxWidth: 640,
              }}
            >
              Made it to Dublin.{" "}
              <em
                className="grad-text"
                style={{ fontStyle: "italic", fontWeight: 900 }}
              >
                Now what?
              </em>
            </h1>

            {/* Squiggle */}
            <div className="squiggle-divider" aria-hidden="true" />

            {/* Sub — conversational, specific */}
            <p
              data-enter
              style={{
                maxWidth: 480,
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "#38285c",
                marginBottom: "2rem",
                marginTop: 4,
              }}
            >
              A guide built by a UCD student who figured it out the hard way —
              IRP appointments, PPSN, bank accounts, Leap cards, and finding
              people who actually get it.{" "}
              <span style={{ color: "#7c5cff", fontWeight: 600 }}>
                So you don&apos;t have to.
              </span>
            </p>

            {/* CTAs */}
            <div
              data-enter
              style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 12 }}
            >
              <Link
                href="/meet-people"
                className="btn-primary"
                style={{ padding: "13px 26px", fontSize: "0.95rem", borderRadius: 12, textDecoration: "none", display: "inline-block" }}
              >
                Find your people ✦
              </Link>
              <button
                onClick={onBrowseGuide}
                className="btn-ghost"
                style={{ padding: "12px 22px", fontSize: "0.95rem", borderRadius: 12 }}
              >
                Survival guide →
              </button>
            </div>

            {/* Tiny footnote */}
            <p data-enter style={{ fontSize: "0.75rem", color: "#9b8ec8", marginTop: 4 }}>
              @ucdconnect.ie · completely free · no sign-up spam
            </p>
          </div>

          {/* ─── RIGHT: Checklist preview card ─── */}
          <div
            ref={cardRef}
            className="hidden md:flex justify-end items-center"
            style={{ alignSelf: "center" }}
          >
            <ChecklistPreview />
          </div>
        </div>
      </div>

      {/* ─── Stat strip — bottom of viewport ─── */}
      <div
        className="relative z-20 w-full"
        style={{
          background: "rgba(255,255,255,0.78)",
          borderTop: "1px solid rgba(200,184,255,0.3)",
        }}
      >
        <div
          className="max-w-6xl mx-auto px-5 sm:px-10 py-5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            { n: 8000,  suffix: "+",  label: "international students at UCD" },
            { n: 120,   suffix: "+",  label: "countries represented on campus" },
            { n: 4,     suffix: " things", label: "nobody tells you when you arrive" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                className="grad-text"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                <Counter target={s.n} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#6b5a8e", marginTop: 4, lineHeight: 1.4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
