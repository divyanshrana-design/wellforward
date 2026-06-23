"use client";

import { useEffect, useRef } from "react";

/**
 * BubbleField — a per-card canvas overlay that renders:
 *  1. Soft frosted-glass bubbles that rise from the bottom and gently wobble.
 *  2. A large cursor-following "liquid" glow blob that eases toward the pointer.
 *
 * Designed to be premium but cheap:
 *  - Only animates while the parent card is hovered (rAF starts on enter,
 *    stops on leave once everything settles).
 *  - Disabled on touch devices and when prefers-reduced-motion is set.
 *  - One canvas + one rAF loop per card; bubbles are recycled, not GC-churned.
 *
 * The parent must be position:relative. This canvas fills it absolutely.
 */

type RGB = [number, number, number];

interface Bubble {
  x: number;       // 0..1 of width
  y: number;       // px from top (we animate upward)
  r: number;       // radius px
  vy: number;      // rise speed px/frame
  drift: number;   // horizontal wobble amplitude
  phase: number;   // wobble phase
  wobble: number;  // wobble speed
  life: number;    // 0..1 fade-in/out driver
  alpha: number;   // current opacity
}

function parseAccent(gradient: string): { from: RGB; to: RGB } {
  // Extract hex colours from a CSS gradient string; fall back to violet.
  const hexes = gradient.match(/#([0-9a-fA-F]{6})/g) ?? ["#7c5cff", "#c8b8ff"];
  const toRgb = (h: string): RGB => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  return { from: toRgb(hexes[0]), to: toRgb(hexes[hexes.length - 1]) };
}

export default function BubbleField({ accentGradient }: { accentGradient: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (reduceMotion || isTouch) return; // keep mobile / accessibility clean

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { from, to } = parseAccent(accentGradient);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const bubbles: Bubble[] = [];
    const MAX = 18;

    const spawn = (): Bubble => ({
      x: 0.08 + Math.random() * 0.84,
      y: H + Math.random() * 40,
      r: 4 + Math.random() * 16,
      vy: 0.25 + Math.random() * 0.7,
      drift: 6 + Math.random() * 16,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.01 + Math.random() * 0.025,
      life: 0,
      alpha: 0,
    });

    // Cursor-following glow state (eased)
    let active = false;
    let raf = 0;
    const target = { x: W / 2, y: H / 2 };
    const glow = { x: W / 2, y: H / 2 };
    let glowStrength = 0;          // 0..1 eases in/out
    let lastSpawn = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);

      // Ease glow toward cursor + strength toward target
      glow.x = lerp(glow.x, target.x, 0.12);
      glow.y = lerp(glow.y, target.y, 0.12);
      glowStrength = lerp(glowStrength, active ? 1 : 0, 0.08);

      // 1) Liquid cursor glow (large soft radial blob, accent-tinted)
      if (glowStrength > 0.01) {
        const gr = Math.max(W, H) * 0.55;
        const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, gr);
        const a = 0.20 * glowStrength;
        g.addColorStop(0, `rgba(${from[0]},${from[1]},${from[2]},${a})`);
        g.addColorStop(0.4, `rgba(${to[0]},${to[1]},${to[2]},${a * 0.5})`);
        g.addColorStop(1, `rgba(${to[0]},${to[1]},${to[2]},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      // Spawn bubbles only while active
      if (active && bubbles.length < MAX && now - lastSpawn > 110) {
        bubbles.push(spawn());
        lastSpawn = now;
      }

      // 2) Frosted-glass bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.vy;
        b.phase += b.wobble;
        // fade in, then fade as it nears the top
        b.life = Math.min(1, b.life + 0.02);
        const topFade = Math.min(1, b.y / (H * 0.35));
        b.alpha = b.life * topFade * (active ? 1 : Math.max(0, glowStrength));

        const px = b.x * W + Math.sin(b.phase) * b.drift;
        const py = b.y;

        if (py + b.r < -10 || b.alpha <= 0.01) {
          bubbles.splice(i, 1);
          continue;
        }

        // glassy body — soft radial fill with light top-left highlight
        const bg = ctx.createRadialGradient(
          px - b.r * 0.35, py - b.r * 0.35, b.r * 0.1,
          px, py, b.r
        );
        bg.addColorStop(0, `rgba(255,255,255,${0.55 * b.alpha})`);
        bg.addColorStop(0.35, `rgba(${to[0]},${to[1]},${to[2]},${0.18 * b.alpha})`);
        bg.addColorStop(1, `rgba(${from[0]},${from[1]},${from[2]},${0.10 * b.alpha})`);
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        ctx.fillStyle = bg;
        ctx.fill();

        // thin rim
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.35 * b.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // specular highlight dot
        ctx.beginPath();
        ctx.arc(px - b.r * 0.34, py - b.r * 0.34, Math.max(1, b.r * 0.18), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.7 * b.alpha})`;
        ctx.fill();
      }

      // Keep looping while active OR while there's anything left to settle
      if (active || glowStrength > 0.02 || bubbles.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, W, H);
      }
    };

    const ensureLoop = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onEnter = () => { active = true; ensureLoop(); };
    const onLeave = () => { active = false; ensureLoop(); };
    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!active) { active = true; }
      ensureLoop();
    };

    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);
    parent.addEventListener("pointermove", onMove);

    return () => {
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
      parent.removeEventListener("pointermove", onMove);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [accentGradient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        borderRadius: "inherit",
      }}
    />
  );
}
