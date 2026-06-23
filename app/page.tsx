"use client";

import { useEffect, useRef } from "react";
import MeshBackground from "./components/MeshBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SurvivalSection from "./components/SurvivalSection";
import DublinGame from "./components/DublinGame";
import StatsSection from "./components/StatsSection";
import Footer from "./components/Footer";

/* Scroll-reveal hook - reusable */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* Quiz left-copy with staggered reveal */
function QuizCopy() {
  const ref = useReveal(0.1);
  const items = ["Takes 90 seconds", "Each answer comes with a real tip", "No sign-in required"];
  return (
    <div ref={ref} className="reveal">
      <span className="eyebrow" style={{ animationDelay: "0ms" }}>Know before you go</span>
      <h2
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "clamp(1.8rem,4vw,2.8rem)",
          fontWeight: 700,
          color: "#1a0f2e",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: 14,
          marginTop: 10,
        }}
      >
        How well do you{" "}
        <em className="grad-text" style={{ fontStyle: "italic" }}>know Dublin?</em>
      </h2>
      <p style={{ fontSize: "0.95rem", color: "#38285c", lineHeight: 1.7, maxWidth: 400 }}>
        Six questions on the things that actually matter when you arrive. IRP, transport, Irish slang, and more. Finish the quiz and we will tell you exactly what to do next.
      </p>
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <div
            key={item}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              fontSize: "0.85rem", color: "#6b5a8e",
              opacity: 0, transform: "translateX(-16px)",
              animation: "slideInLeft 0.5s cubic-bezier(.22,.68,0,1) forwards",
              animationDelay: `${0.2 + i * 0.12}s`,
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              flexShrink: 0,
            }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    // Cursor glow
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = false;
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (!isTouchDevice) {
      document.addEventListener("pointermove", e => {
        tx = e.clientX; ty = e.clientY;
        glow.classList.add("active");
        if (!raf) { raf = true; requestAnimationFrame(animGlow); }
      });
      document.addEventListener("pointerleave", () => glow.classList.remove("active"));
    }

    function animGlow() {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        requestAnimationFrame(animGlow);
      } else {
        raf = false;
      }
    }

    // Scroll progress bar
    function updateProgress() {
      const bar = document.getElementById("scroll-progress-bar");
      if (!bar) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });

    // Button ripple
    function addRipple(e: PointerEvent) {
      const btn = (e.target as HTMLElement).closest(".btn-primary, .btn-ghost, .btn-secondary") as HTMLElement | null;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top  = (e.clientY - rect.top)  + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    document.addEventListener("pointerdown", addRipple);

    // 3D card tilt
    const tiltTargets = ".survival-card, .card";
    function bindTilt() {
      document.querySelectorAll<HTMLElement>(tiltTargets).forEach(card => {
        card.addEventListener("pointermove", e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top)  / rect.height;
          const rx = (0.5 - y) * 6;
          const ry = (x - 0.5) * 6;
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
        card.addEventListener("pointerleave", () => {
          card.style.transform = "";
        });
      });
    }
    setTimeout(bindTilt, 800);

    return () => {
      document.body.removeChild(glow);
      window.removeEventListener("scroll", updateProgress);
      document.removeEventListener("pointerdown", addRipple);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />
      <HeroSection
        onMakeFriend={() => scrollTo("#survival")}
        onBrowseGuide={() => scrollTo("#survival")}
      />

      {/* Dublin Quiz - interactive game between hero and survival guide */}
      <section
        id="quiz"
        style={{
          padding: "72px 0",
          background: "linear-gradient(180deg, transparent 0%, rgba(200,184,255,0.08) 50%, transparent 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-10">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(32px,5vw,64px)",
              alignItems: "center",
            }}
            className="gap-12"
          >
            {/* Left copy - staggered reveal */}
            <QuizCopy />

            {/* Right - game card */}
            <div className="flex justify-center lg:justify-end">
              <DublinGame />
            </div>
          </div>
        </div>
      </section>

      <SurvivalSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
