"use client";

import { useEffect } from "react";
import MeshBackground from "./components/MeshBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import SurvivalSection from "./components/SurvivalSection";
import MakeFriendSection from "./components/MakeFriendSection";
import AskSeniorSection from "./components/AskSeniorSection";
import ChecklistSection from "./components/ChecklistSection";
import GlossarySection from "./components/GlossarySection";
import CampusSection from "./components/CampusSection";
import VoicesSection from "./components/VoicesSection";
import Footer from "./components/Footer";

export default function Home() {
  // ── Cursor glow + scroll progress bar ──────────────────────
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
    // Bind after a short delay to ensure DOM is ready
    setTimeout(bindTilt, 800);

    return () => {
      document.body.removeChild(glow);
      window.removeEventListener("scroll", updateProgress);
      document.removeEventListener("pointerdown", addRipple);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Ambient background orbs */}
      <MeshBackground />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <HeroSection
        onMakeFriend={() => scrollToSection("#make-a-friend")}
        onBrowseGuide={() => scrollToSection("#survival")}
      />

      {/* ── NEW: The stuff nobody tells you ── */}
      <SurvivalSection />

      {/* Make a Friend */}
      <MakeFriendSection />

      {/* Ask a Senior */}
      <AskSeniorSection />

      {/* First 30 Days Checklist */}
      <ChecklistSection />

      {/* What is a…? Glossary */}
      <GlossarySection />

      {/* Campus Survival */}
      <CampusSection />

      {/* Voices */}
      <VoicesSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
