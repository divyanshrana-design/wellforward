"use client";

import { useEffect, useRef, useState } from "react";

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ── Animated bar ── */
function Bar({ label, value, max, color, delay, suffix = "%" }: {
  label: string; value: number; max: number; color: string; delay: number; suffix?: string;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setWidth((value / max) * 100), delay);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max, delay]);

  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.82rem", color: "#38285c", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.82rem", color: "#7c5cff", fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "rgba(200,184,255,0.25)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: color,
          width: `${width}%`,
          transition: "width 1.2s cubic-bezier(.22,.68,0,1.2)",
        }} />
      </div>
    </div>
  );
}

/* ── Donut chart (pure CSS / SVG) ── */
function DonutChart({ segments, size = 160 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setAnimated(true), 100); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 56, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = segments.map(seg => {
    const pct = seg.value / total;
    const dash = animated ? circumference * pct : 0;
    const gap = circumference - dash;
    const rotation = offset * 360;
    offset += pct;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg ref={ref} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={22}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={0}
            style={{
              transform: `rotate(${s.rotation}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: `stroke-dasharray 1s cubic-bezier(.22,.68,0,1) ${i * 0.15}s`,
            }}
          />
        ))}
        {/* Inner ring */}
        <circle cx={cx} cy={cy} r={42} fill="white" />
      </svg>
      {/* Centre label */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.4rem", fontWeight: 900, color: "#1a0f2e", lineHeight: 1 }}>
          {total}
        </span>
        <span style={{ fontSize: "0.62rem", color: "#9b8ec8", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>students</span>
      </div>
    </div>
  );
}

/* ── Radar / spider chart (SVG) ── */
function RadarChart({ axes, data, size = 200 }: {
  axes: string[];
  data: number[];
  size?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setAnimated(true), 200); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const n = axes.length;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.35;
  const levels = 4;

  function polar(angle: number, radius: number) {
    return {
      x: cx + radius * Math.cos(angle - Math.PI / 2),
      y: cy + radius * Math.sin(angle - Math.PI / 2),
    };
  }

  const angleStep = (Math.PI * 2) / n;

  const gridPolys = Array.from({ length: levels }, (_, lvl) => {
    const rr = (r * (lvl + 1)) / levels;
    return Array.from({ length: n }, (_, i) => polar(i * angleStep, rr));
  });

  const dataPoints = data.map((val, i) => {
    const rr = animated ? (r * val) / 100 : 0;
    return polar(i * angleStep, rr);
  });

  const polyPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg ref={ref} width={size} height={size}>
      {/* Grid */}
      {gridPolys.map((pts, lvl) => (
        <polygon
          key={lvl}
          points={pts.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(200,184,255,0.35)"
          strokeWidth={1}
        />
      ))}
      {/* Spokes */}
      {Array.from({ length: n }, (_, i) => {
        const tip = polar(i * angleStep, r);
        return <line key={i} x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="rgba(200,184,255,0.3)" strokeWidth={1} />;
      })}
      {/* Data polygon */}
      <path
        d={polyPath(dataPoints)}
        fill="rgba(124,92,255,0.18)"
        stroke="#7c5cff"
        strokeWidth={2}
        style={{ transition: "d 1s cubic-bezier(.22,.68,0,1.2) 0.3s" }}
      />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#7c5cff"
          style={{ transition: `all 0.8s ease ${0.3 + i * 0.07}s` }} />
      ))}
      {/* Labels */}
      {Array.from({ length: n }, (_, i) => {
        const tip = polar(i * angleStep, r + 20);
        return (
          <text key={i} x={tip.x} y={tip.y}
            textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 9, fill: "#6b5a8e", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
            {axes[i]}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Main export ── */
export default function StatsSection() {
  const headerRef = useReveal();

  return (
    <section
      id="data"
      className="relative z-10 section-padding"
      style={{ background: "linear-gradient(180deg, transparent, rgba(200,184,255,0.08) 40%, rgba(200,184,255,0.08) 60%, transparent)" }}
      aria-labelledby="stats-title"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-12">
          <span className="section-label">✦ by the numbers</span>
          <h2 id="stats-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
            The <em className="grad-text" style={{ fontStyle: "italic" }}>reality</em> of arriving
          </h2>
          <p style={{ maxWidth: 480, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            Data drawn from UCD student union reports, the OECD International Student Experience study (2024), and Wellforward&apos;s own onboarding interviews. These numbers are why Wellforward exists.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

          {/* Bar chart — biggest week-one challenges */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 18 }}>
              Biggest week-one challenges
            </h3>
            <Bar label="Finding accommodation" value={68} max={100} color="linear-gradient(90deg,#7c5cff,#a78bfa)" delay={0} />
            <Bar label="Understanding IRP / immigration" value={61} max={100} color="linear-gradient(90deg,#7c5cff,#a78bfa)" delay={100} />
            <Bar label="Opening a bank account" value={54} max={100} color="linear-gradient(90deg,#7c5cff,#a78bfa)" delay={200} />
            <Bar label="Feeling socially isolated" value={49} max={100} color="linear-gradient(90deg,#ec4899,#f472b6)" delay={300} />
            <Bar label="Navigating public transport" value={38} max={100} color="linear-gradient(90deg,#7c5cff,#a78bfa)" delay={400} />
            <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 10 }}>
              Sources: OECD International Student Report 2024; UCD SU housing report 2025
            </p>
          </div>

          {/* Donut — nationalities */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 18 }}>
              Smurfit intake by region
            </h3>
            <DonutChart
              size={170}
              segments={[
                { label: "Asia Pacific", value: 38, color: "#7c5cff" },
                { label: "South Asia", value: 22, color: "#a78bfa" },
                { label: "Americas",   value: 17, color: "#ec4899" },
                { label: "Europe",     value: 13, color: "#38bdf8" },
                { label: "Africa/ME",  value: 10, color: "#34d399" },
              ]}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 18, justifyContent: "center" }}>
              {[
                { label: "Asia Pacific", color: "#7c5cff" },
                { label: "South Asia",   color: "#a78bfa" },
                { label: "Americas",     color: "#ec4899" },
                { label: "Europe",       color: "#38bdf8" },
                { label: "Africa/ME",    color: "#34d399" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "#6b5a8e" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
                  {l.label}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 12, textAlign: "center" }}>
              UCD Smurfit 2024/25 cohort (approx.)
            </p>
          </div>

          {/* Radar — what students wish they knew */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 12 }}>
              &ldquo;I wish I&apos;d known more about…&rdquo;
            </h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RadarChart
                size={200}
                axes={["IRP", "Banking", "Housing", "Social life", "Transport", "Working"]}
                data={[85, 72, 90, 65, 50, 68]}
              />
            </div>
            <p style={{ fontSize: "0.78rem", color: "#6b5a8e", textAlign: "center", lineHeight: 1.5, marginTop: 8 }}>
              % of students who felt underprepared in each area on arrival
            </p>
            <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 8, textAlign: "center" }}>
              Based on Wellforward onboarding interviews &amp; UCD SU research 2024/25
            </p>
          </div>

        </div>

        {/* Bottom stat callout */}
        <div style={{
          marginTop: 32,
          background: "linear-gradient(135deg, rgba(124,92,255,0.08), rgba(200,184,255,0.12))",
          border: "1px solid rgba(124,92,255,0.15)",
          borderRadius: 16,
          padding: "24px 32px",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-around", alignItems: "center", marginBottom: 16 }}>
            {[
              { stat: "~65%", label: "of college students report feeling lonely (Active Minds, 2024)", href: "https://activeminds.org/press-release/new-data-emphasizes-the-correlation-between-loneliness-and-student-mental-health/" },
              { stat: "1 in 3", label: "international students cite accommodation as their #1 arrival challenge (OECD, 2024)", href: "https://www.oecd.org/en/publications/international-students-in-higher-education_005ff28d-en.html" },
              { stat: "9.5%", label: "of international students present with social isolation vs 6.7% of domestic students (CCMH, 2023)", href: "https://ccmh.psu.edu/index.php?option=com_dailyplanetblog&view=entry&year=2023&month=09&day=07&id=44" },
            ].map(s => (
              <div key={s.stat} style={{ textAlign: "center", maxWidth: 200 }}>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: "2rem", fontWeight: 900,
                  background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                }}>
                  {s.stat}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b5a8e", marginTop: 6, lineHeight: 1.5 }}>
                  {s.label}{" "}
                  <a href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#9b8ec8", fontSize: "0.68rem", textDecoration: "underline", textUnderlineOffset: 2 }}>
                    ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.65rem", color: "#b0a0cc", textAlign: "center", lineHeight: 1.6, borderTop: "1px solid rgba(200,184,255,0.25)", paddingTop: 12, margin: 0 }}>
            The bar chart and radar data are directional estimates based on Wellforward founder interviews and UCD SU research — not from a formal survey.
            The three statistics above are from published third-party sources linked above.
          </p>
        </div>

      </div>
    </section>
  );
}
