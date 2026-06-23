"use client";

import { useEffect, useRef } from "react";

// Small floating gradient balls - soft, ambient, non-intrusive
// Nothing cursor-reactive, nothing burst-like
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: [number, number, number];
  alpha: number;
  alphaDir: number;
  alphaSpeed: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    // Colour palette: lavender / periwinkle / blush
    const COLORS: [number, number, number][] = [
      [124, 92, 255],   // violet
      [184, 200, 255],  // periwinkle
      [200, 184, 255],  // lilac
      [255, 214, 238],  // blush
      [164, 212, 255],  // sky
    ];

    let W = 0, H = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      init();
    };

    const init = () => {
      const count = Math.min(38, Math.floor((W * H) / 22000));
      particles = Array.from({ length: count }, () => {
        const col = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
          x:          Math.random() * W,
          y:          Math.random() * H,
          vx:         (Math.random() - 0.5) * 0.35,
          vy:         (Math.random() - 0.5) * 0.28,
          radius:     4 + Math.random() * 9,
          color:      col,
          alpha:      0.12 + Math.random() * 0.22,
          alphaDir:   Math.random() > 0.5 ? 1 : -1,
          alphaSpeed: 0.0008 + Math.random() * 0.0012,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges softly
        if (p.x < -p.radius)      p.x = W + p.radius;
        if (p.x > W + p.radius)   p.x = -p.radius;
        if (p.y < -p.radius)      p.y = H + p.radius;
        if (p.y > H + p.radius)   p.y = -p.radius;

        // Breathe alpha
        p.alpha += p.alphaDir * p.alphaSpeed;
        if (p.alpha > 0.34 || p.alpha < 0.08) p.alphaDir *= -1;

        // Draw radial gradient ball
        const [r, g, b] = p.color;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${p.alpha})`);
        grd.addColorStop(0.6, `rgba(${r},${g},${b},${p.alpha * 0.4})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
