"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  angle: number;
  length: number;
  baseLength: number;
  speed: number;
  opacity: number;
  dots: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Device tilt for mobile
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      mouse.current = {
        x: canvas.width / 2 + (e.gamma / 45) * (canvas.width / 4),
        y: canvas.height / 2 + (e.beta / 45) * (canvas.height / 4),
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // Setup
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate lines
    const NUM_LINES = window.innerWidth < 768 ? 36 : 60;
    const lines: Point[] = Array.from({ length: NUM_LINES }, (_, i) => {
      const baseLength = 60 + Math.random() * 140;
      return {
        x: 0,
        y: 0,
        angle: (i / NUM_LINES) * Math.PI * 2,
        length: baseLength,
        baseLength,
        speed: 0.003 + Math.random() * 0.004,
        opacity: 0.25 + Math.random() * 0.45,
        dots: Math.floor(4 + Math.random() * 8),
      };
    });

    let t = 0;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h * 0.48;

      ctx.clearRect(0, 0, w, h);

      // Mouse influence
      const dx = mouse.current.x - cx;
      const dy = mouse.current.y - cy;
      const mouseDist = Math.sqrt(dx * dx + dy * dy);
      const mouseInfluence = Math.min(1, mouseDist / (w * 0.5));
      const mouseAngle = Math.atan2(dy, dx);

      lines.forEach((line) => {
        // Gentle rotation
        line.angle += line.speed * 0.15;

        // Cursor attraction: lines near the cursor direction get extended
        let angleDiff = mouseAngle - line.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const attraction = Math.cos(angleDiff) * mouseInfluence;
        const targetLength =
          line.baseLength * (1 + attraction * 0.6) +
          Math.sin(t * 2 + line.angle * 3) * 20;
        line.length += (targetLength - line.length) * 0.05;

        // Draw dots along the line
        const endX = cx + Math.cos(line.angle) * line.length;
        const endY = cy + Math.sin(line.angle) * line.length;

        for (let d = 0; d < line.dots; d++) {
          const frac = (d + 1) / (line.dots + 1);
          const dotX = cx + (endX - cx) * frac;
          const dotY = cy + (endY - cy) * frac;
          const dotOpacity =
            line.opacity * (1 - frac * 0.7) * (0.6 + 0.4 * Math.sin(t * 3 + d));

          // Color: interpolate from deep indigo to light lavender
          const r = Math.round(107 + (200 - 107) * frac);
          const g = Math.round(78 + (184 - 78) * frac);
          const b = Math.round(255);

          ctx.beginPath();
          const radius = (1.8 - frac * 1.0) * (1 + attraction * 0.3);
          ctx.arc(dotX, dotY, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dotOpacity})`;
          ctx.fill();
        }

        // Optional thin connecting line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(124, 92, 255, ${line.opacity * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Central glow
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      grd.addColorStop(0, "rgba(124, 92, 255, 0.35)");
      grd.addColorStop(1, "rgba(124, 92, 255, 0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      t += 0.016;
      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ opacity: 0.85 }}
    />
  );
}
