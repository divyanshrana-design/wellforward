"use client";

import { useEffect } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import VoicesSection from "../components/VoicesSection";
import Footer from "../components/Footer";

export default function VoicesPage() {
  useEffect(() => {
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
      } else { raf = false; }
    }

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

    return () => {
      document.body.removeChild(glow);
      document.removeEventListener("pointerdown", addRipple);
    };
  }, []);

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        <VoicesSection />
      </div>
      <Footer />
    </main>
  );
}
