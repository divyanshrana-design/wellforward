"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: [number, number, number]; // rgb
  alpha: number;
  alphaTarget: number;
  alphaSpeed: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

const PALETTE: [number, number, number][] = [
  [124, 92, 255],   // violet
  [200, 184, 255],  // lilac
  [255, 214, 238],  // blush pink
  [180, 200, 255],  // periwinkle
  [196, 224, 255],  // sky blue
  [162, 130, 255],  // mid-violet
  [233, 226, 255],  // pale lavender
  [255, 190, 220],  // soft pink
];

function randomBubble(W: number, H: number, offscreen = false): Bubble {
  const r = 40 + Math.random() * 180;
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const speed = 0.18 + Math.random() * 0.38;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: offscreen ? -r - Math.random() * 300 : Math.random() * W,
    y: offscreen ? Math.random() * H : Math.random() * H,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed * 0.6,
    r,
    baseR: r,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.008 + Math.random() * 0.012,
    color,
    alpha: 0,
    alphaTarget: 0.13 + Math.random() * 0.22,
    alphaSpeed: 0.003 + Math.random() * 0.004,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.006 + Math.random() * 0.01,
    wobbleAmp: 18 + Math.random() * 38,
  };
}

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let bubbles: Bubble[] = [];
    let rafId = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn 18 bubbles spread across the screen
    for (let i = 0; i < 18; i++) {
      bubbles.push(randomBubble(W, H, false));
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const b of bubbles) {
        // Ease alpha in
        if (b.alpha < b.alphaTarget) b.alpha = Math.min(b.alpha + b.alphaSpeed, b.alphaTarget);

        // Pulse radius
        b.pulsePhase += b.pulseSpeed;
        b.r = b.baseR + Math.sin(b.pulsePhase) * (b.baseR * 0.07);

        // Wobble vertical
        b.wobblePhase += b.wobbleSpeed;
        const wobbleY = Math.sin(b.wobblePhase) * b.wobbleAmp;

        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Wrap-around — bubble exits right → re-enter from left
        if (b.x - b.r > W + 20)  { b.x = -b.r - 20; b.y = Math.random() * H; }
        if (b.x + b.r < -20)     { b.x = W + b.r + 20; b.y = Math.random() * H; }
        if (b.y - b.r > H + 20)  { b.y = -b.r - 20; }
        if (b.y + b.r < -20)     { b.y = H + b.r + 20; }

        const drawY = b.y + wobbleY;

        // Radial gradient — soft glowing circle
        const grad = ctx.createRadialGradient(b.x, drawY, 0, b.x, drawY, b.r);
        const [r, g, bCh] = b.color;
        grad.addColorStop(0,   `rgba(${r},${g},${bCh},${(b.alpha * 0.85).toFixed(3)})`);
        grad.addColorStop(0.45,`rgba(${r},${g},${bCh},${(b.alpha * 0.5).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${r},${g},${bCh},0)`);

        ctx.beginPath();
        ctx.arc(b.x, drawY, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Optional: very faint ring on bigger bubbles for depth
        if (b.baseR > 100) {
          ctx.beginPath();
          ctx.arc(b.x, drawY, b.r * 0.72, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${bCh},${(b.alpha * 0.12).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
