"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Calculator,
  ShieldCheck,
  Flag,
  Clock,
  CheckCircle2,
  ArrowRight,
  Info,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── Shared serif heading style (matches the rest of the site) ───── */
const SERIF = "'Fraunces', Georgia, serif";
const h1Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  lineHeight: 1.05,
  color: "#1a0f2e",
};
const h2Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 700,
  letterSpacing: "-0.025em",
  lineHeight: 1.1,
  color: "#1a0f2e",
};
const h3Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 700,
  letterSpacing: "-0.015em",
  lineHeight: 1.2,
  color: "#1a0f2e",
};

/* ── Scroll-reveal helper ────────────────────────────────────────── */
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, seen };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref } = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Count-up number (animates when scrolled into view) ──────────── */
function CountUp({
  to,
  suffix = "",
  duration = 1100,
  style,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const { ref, seen } = useReveal<HTMLSpanElement>(0.4);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return (
    <span ref={ref} className="visa-stat-num" style={style}>
      {val}
      {suffix}
    </span>
  );
}

/* ── Animated horizontal bar (fills when in view) ────────────────── */
function Bar({
  label,
  pct,
  value,
  color,
  delay = 0,
}: {
  label: string;
  pct: number;
  value: string;
  color: string;
  delay?: number;
}) {
  const { ref, seen } = useReveal<HTMLDivElement>(0.35);
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.82rem",
          color: "#38285c",
          fontWeight: 600,
          marginBottom: 5,
        }}
      >
        <span>{label}</span>
      </div>
      <div className="visa-bar-track">
        <div
          className="visa-bar-fill"
          style={{
            width: seen ? `${pct}%` : 0,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            transitionDelay: `${delay}ms`,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── The student stamp journey ───────────────────────────────────── */
const JOURNEY = [
  {
    key: "stamp2",
    stamp: "Stamp 2",
    title: "Student permission",
    icon: GraduationCap,
    color: "#7c5cff",
    tag: "You are here first",
    summary:
      "The permission you get when you arrive to study. You register it as your IRP card. You can study full-time and work part-time within strict limits.",
  },
  {
    key: "stamp1g",
    stamp: "Stamp 1G",
    title: "Graduate work permission",
    icon: Briefcase,
    color: "#0ea5e9",
    tag: "After you graduate",
    summary:
      "The Third Level Graduate Programme. After finishing an eligible Irish course you can stay and work full-time - with no employment permit needed - for up to 24 months (Master's / Level 9).",
  },
  {
    key: "stamp1",
    stamp: "Stamp 1",
    title: "Working on a permit",
    icon: Briefcase,
    color: "#10b981",
    tag: "When your job sponsors you",
    summary:
      "Once an employer sponsors you with an Employment Permit (General or Critical Skills), your permission becomes Stamp 1. This is the normal route from a graduate job toward long-term residence.",
  },
  {
    key: "stamp4",
    stamp: "Stamp 4",
    title: "Long-term residence",
    icon: ShieldCheck,
    color: "#ec4899",
    tag: "Settled status",
    summary:
      "After enough time on a permit (typically 5 years, or 2 years on a Critical Skills permit) you can move to Stamp 4 - work for any employer, no permit needed, and run a business.",
  },
  {
    key: "citizenship",
    stamp: "Citizenship",
    title: "Irish passport",
    icon: Flag,
    color: "#f59e0b",
    tag: "The final step",
    summary:
      "With 5 years of reckonable residence out of the last 9 (including the final 12 months continuously), you can apply for naturalisation - and become an Irish citizen with an Irish/EU passport.",
  },
] as const;

/* Stamp 2 vs Stamp 1G comparison rows */
const COMPARE = [
  {
    label: "When you have it",
    s2: "While you are a registered full-time student",
    s1g: "After you graduate from an eligible course",
  },
  {
    label: "What it's for",
    s2: "Studying - work is only a part-time extra",
    s1g: "Working full-time while you look for a long-term role",
  },
  {
    label: "Work allowed",
    s2: "20 hrs/week in term · 40 hrs/week in holiday periods",
    s1g: "Full-time (up to 40 hrs/week, any employer) - no permit",
  },
  {
    label: "Employment permit needed?",
    s2: "No (work is incidental to study)",
    s1g: "No - that's the whole point of the programme",
  },
  {
    label: "How long it lasts",
    s2: "For the duration of your course",
    s1g: "12 months (Level 8) or 24 months (Level 9 / Master's)",
  },
  {
    label: "Counts toward citizenship?",
    s2: "No - student time is not reckonable",
    s1g: "No - graduate-scheme time is not reckonable either",
  },
] as const;

/* 12-month work calendar for Stamp 2 */
const MONTHS: { m: string; full: boolean; note?: string }[] = [
  { m: "Jan", full: true, note: "1–15 Jan full-time" },
  { m: "Feb", full: false },
  { m: "Mar", full: false },
  { m: "Apr", full: false },
  { m: "May", full: false },
  { m: "Jun", full: true },
  { m: "Jul", full: true },
  { m: "Aug", full: true },
  { m: "Sep", full: true },
  { m: "Oct", full: false },
  { m: "Nov", full: false },
  { m: "Dec", full: true, note: "15–31 Dec full-time" },
];

export default function VisasPage() {
  const [active, setActive] = useState<string>("stamp2");
  const activeNode = JOURNEY.find((n) => n.key === active)!;

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <div style={{ paddingTop: 64 }}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "56px 24px 24px",
            textAlign: "center",
          }}
        >
          <Reveal>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7c5cff",
                background: "#ede8ff",
                padding: "5px 12px",
                borderRadius: 999,
                marginBottom: 18,
              }}
            >
              <Info size={13} /> Student immigration guide
            </span>
            <h1
              style={{
                ...h1Style,
                fontSize: "clamp(2rem, 5vw, 3.1rem)",
                marginBottom: 14,
              }}
            >
              Your stamp journey in Ireland
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#6b5a8e",
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              From the day you arrive as a student to the day you can hold an
              Irish passport - here's every immigration <strong>stamp</strong>{" "}
              that matters, and how you move from one to the next.
            </p>
          </Reveal>

          {/* Quick animated stats */}
          <Reveal delay={120}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                justifyContent: "center",
                marginTop: 34,
              }}
            >
              {[
                { to: 5, suffix: "", label: "key stamps", color: "#7c5cff" },
                { to: 40, suffix: "h", label: "max work/week", color: "#0ea5e9" },
                { to: 24, suffix: "mo", label: "graduate stay", color: "#10b981" },
                { to: 5, suffix: "yr", label: "to citizenship", color: "#f59e0b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="visa-lift"
                  style={{
                    minWidth: 120,
                    padding: "16px 18px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <CountUp
                    to={s.to}
                    suffix={s.suffix}
                    style={{ fontSize: "2rem", color: s.color }}
                  />
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#9b8ec8",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 4,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── The journey graph ──────────────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px 8px" }}
        >
          <Reveal>
            <div
              className="card"
              style={{ padding: "28px 22px", overflow: "hidden" }}
            >
              {/* Animated progress line */}
              <div className="visa-progress-track">
                <div className="visa-progress-fill" />
              </div>

              <div className="visa-flow">
                {JOURNEY.map((node, i) => {
                  const Icon = node.icon;
                  const isActive = active === node.key;
                  return (
                    <div key={node.key} className="visa-flow-item">
                      <button
                        onClick={() => setActive(node.key)}
                        className={`visa-node visa-node-anim${
                          isActive ? " visa-node-active-ring" : ""
                        }`}
                        aria-pressed={isActive}
                        style={
                          {
                            animationDelay: `${i * 120}ms`,
                            borderColor: isActive ? node.color : "var(--line)",
                            boxShadow: isActive
                              ? `0 12px 30px ${node.color}4d`
                              : "var(--shadow-sm)",
                            background: isActive
                              ? `linear-gradient(160deg, ${node.color} 0%, ${node.color}d9 100%)`
                              : "rgba(255,255,255,0.9)",
                            transform: isActive ? "translateY(-3px)" : undefined,
                            ["--ring" as string]: `${node.color}55`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className="visa-node-icon"
                          style={{
                            background: isActive
                              ? "rgba(255,255,255,0.92)"
                              : `${node.color}18`,
                            color: node.color,
                          }}
                        >
                          <Icon size={20} />
                        </span>
                        <span
                          style={{
                            ...h3Style,
                            fontSize: "1.02rem",
                            lineHeight: 1.1,
                            color: isActive ? "#ffffff" : "#1a0f2e",
                          }}
                        >
                          {node.stamp}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: isActive
                              ? "rgba(255,255,255,0.92)"
                              : "#9b8ec8",
                            marginTop: 2,
                          }}
                        >
                          {node.title}
                        </span>
                      </button>
                      {i < JOURNEY.length - 1 && (
                        <span className="visa-arrow" aria-hidden="true">
                          <ArrowRight size={18} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Active node detail */}
              <div
                key={active}
                className="visa-detail-anim"
                style={{
                  marginTop: 26,
                  padding: "18px 20px",
                  borderRadius: 14,
                  background: `${activeNode.color}0d`,
                  border: `1px solid ${activeNode.color}33`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: activeNode.color,
                      background: `${activeNode.color}1f`,
                      padding: "2px 9px",
                      borderRadius: 999,
                    }}
                  >
                    {activeNode.tag}
                  </span>
                  <h3 style={{ ...h3Style, fontSize: "1.25rem" }}>
                    {activeNode.stamp} - {activeNode.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#38285c",
                    lineHeight: 1.7,
                  }}
                >
                  {activeNode.summary}
                </p>
              </div>
              <p
                style={{
                  fontSize: "0.74rem",
                  color: "#b0a0cc",
                  textAlign: "center",
                  marginTop: 12,
                }}
              >
                Tap any stamp above to see what it means.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Work hours chart ───────────────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <BarChart3 size={26} style={{ color: "#7c5cff" }} />
              How many hours can you work?
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 22, lineHeight: 1.6 }}>
              A quick visual comparison of the weekly work limits on each stamp.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div className="card" style={{ padding: "26px 24px" }}>
              <Bar
                label="Stamp 2 - term time"
                pct={50}
                value="20 hrs"
                color="#7c5cff"
              />
              <Bar
                label="Stamp 2 - holiday periods"
                pct={100}
                value="40 hrs"
                color="#0ea5e9"
                delay={120}
              />
              <Bar
                label="Stamp 1G - graduate"
                pct={100}
                value="40 hrs (full-time)"
                color="#10b981"
                delay={240}
              />
              <Bar
                label="Stamp 1 / Stamp 4"
                pct={100}
                value="Full-time"
                color="#ec4899"
                delay={360}
              />
              <p
                style={{
                  fontSize: "0.74rem",
                  color: "#b0a0cc",
                  marginTop: 4,
                }}
              >
                Bars are relative to a 40-hour full-time week.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Permission duration chart ──────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Clock size={24} style={{ color: "#7c5cff" }} />
              How long does each permission last?
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 22, lineHeight: 1.6 }}>
              Typical maximum durations, in months.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div className="card" style={{ padding: "26px 24px" }}>
              <Bar
                label="Stamp 1G - Level 8 graduate"
                pct={50}
                value="12 months"
                color="#0ea5e9"
              />
              <Bar
                label="Stamp 1G - Level 9 / Master's"
                pct={100}
                value="24 months"
                color="#10b981"
                delay={120}
              />
              <Bar
                label="To Stamp 4 (Critical Skills)"
                pct={100}
                value="~2 years"
                color="#7c5cff"
                delay={240}
              />
              <Bar
                label="To citizenship (reckonable)"
                pct={100}
                value="~5 years"
                color="#f59e0b"
                delay={360}
              />
              <p
                style={{ fontSize: "0.74rem", color: "#b0a0cc", marginTop: 4 }}
              >
                Graduate-programme bars are to scale; residence bars are shown
                full to highlight the milestone.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Stamp 2 vs Stamp 1G ────────────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
              }}
            >
              Stamp 2 vs Stamp 1G
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 22, lineHeight: 1.6 }}>
              These are the two stamps every student deals with. The simplest way
              to think about it: <strong>Stamp 2 is for studying</strong>,{" "}
              <strong>Stamp 1G is for working after you graduate</strong>.
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div
              className="card visa-compare"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div className="visa-compare-head">
                <div className="visa-compare-cell visa-compare-rowlabel" />
                <div
                  className="visa-compare-cell"
                  style={{ color: "#7c5cff", borderTop: "3px solid #7c5cff" }}
                >
                  <GraduationCap size={18} />
                  <span>Stamp 2</span>
                </div>
                <div
                  className="visa-compare-cell"
                  style={{ color: "#0ea5e9", borderTop: "3px solid #0ea5e9" }}
                >
                  <Briefcase size={18} />
                  <span>Stamp 1G</span>
                </div>
              </div>
              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className="visa-compare-row"
                  style={{
                    background: i % 2 ? "rgba(237,232,255,0.35)" : "transparent",
                  }}
                >
                  <div className="visa-compare-cell visa-compare-rowlabel">
                    {row.label}
                  </div>
                  <div className="visa-compare-cell">{row.s2}</div>
                  <div className="visa-compare-cell">{row.s1g}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── How to apply for Stamp 1G ──────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
              }}
            >
              How to apply for Stamp 1G
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 22, lineHeight: 1.6 }}>
              Good news:{" "}
              <strong>you do NOT need to book an in-person appointment.</strong>{" "}
              Just like renewing Stamp 2, the whole thing is done online.
            </p>
          </Reveal>

          <div
            className="visa-steps"
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            }}
          >
            {[
              {
                n: "1",
                t: "Create your account online",
                d: "Everything is handled on the immigration portal - there is no appointment to book and no queue to stand in.",
              },
              {
                n: "2",
                t: "Submit your documents on the site",
                d: "After making your account, you simply upload your documents on the portal. That's it - nothing to post or hand in.",
              },
              {
                n: "3",
                t: "Wait for your transcript / results",
                d: "The main thing you're waiting on is your final transcript proving you completed your course. Once you have it, you're ready.",
              },
              {
                n: "4",
                t: "Get your new IRP",
                d: "Once approved, your permission is updated to Stamp 1G and you can start working full-time with no employment permit.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div
                  className="card glow-on-hover visa-lift"
                  style={{ padding: "20px 18px", height: "100%" }}
                >
                  <span
                    style={{
                      ...h3Style,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 999,
                      background: "#ede8ff",
                      color: "#7c5cff",
                      fontSize: "1.1rem",
                      marginBottom: 12,
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    style={{
                      ...h3Style,
                      fontSize: "1.05rem",
                      marginBottom: 6,
                    }}
                  >
                    {s.t}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.86rem",
                      color: "#6b5a8e",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Working hours under Stamp 2 (calendar chart) ───── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
              }}
            >
              Working 40 hours on Stamp 2
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 18, lineHeight: 1.6 }}>
              On Stamp 2 you can normally work{" "}
              <strong>20 hours a week during term</strong>. But{" "}
              <strong>twice a year</strong> you're allowed to work{" "}
              <strong>full-time, up to 40 hours a week</strong> - during the
              official holiday periods highlighted below.
            </p>
          </Reveal>

          {/* 12-month animated calendar */}
          <Reveal delay={60}>
            <div className="card" style={{ padding: "22px 22px 18px" }}>
              <div className="visa-year">
                {MONTHS.map((mo, i) => (
                  <div
                    key={mo.m}
                    className={`visa-month ${mo.full ? "full" : "part"}`}
                    style={{ animationDelay: `${i * 55}ms` }}
                    title={mo.note ?? (mo.full ? "Full-time allowed" : "20 hrs/week")}
                  >
                    {mo.m}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 18,
                  marginTop: 14,
                  flexWrap: "wrap",
                  fontSize: "0.78rem",
                  color: "#6b5a8e",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: "linear-gradient(135deg,#7c5cff,#5a3ee8)",
                    }}
                  />
                  Full-time OK (up to 40 hrs)
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background: "rgba(237,232,255,0.55)",
                    }}
                  />
                  Term time (20 hrs/week)
                </span>
              </div>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 16,
            }}
          >
            <Reveal>
              <div
                className="card glow-on-hover visa-lift"
                style={{ padding: "22px 20px", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      padding: 9,
                      borderRadius: 12,
                      background: "#fff3d6",
                      color: "#f59e0b",
                    }}
                  >
                    <CalendarDays size={20} />
                  </span>
                  <h3 style={{ ...h3Style, fontSize: "1.15rem" }}>Summer</h3>
                </div>
                <p
                  style={{
                    ...h3Style,
                    fontSize: "1.35rem",
                    color: "#7c5cff",
                    marginBottom: 4,
                  }}
                >
                  1 June – 30 September
                </p>
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "#6b5a8e",
                    lineHeight: 1.6,
                  }}
                >
                  Full-time, up to 40 hours/week. (September has 30 days - the
                  period ends on the 30th, not the 31st.)
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div
                className="card glow-on-hover visa-lift"
                style={{ padding: "22px 20px", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      padding: 9,
                      borderRadius: 12,
                      background: "#dceeff",
                      color: "#0ea5e9",
                    }}
                  >
                    <CalendarDays size={20} />
                  </span>
                  <h3 style={{ ...h3Style, fontSize: "1.15rem" }}>Winter</h3>
                </div>
                <p
                  style={{
                    ...h3Style,
                    fontSize: "1.35rem",
                    color: "#7c5cff",
                    marginBottom: 4,
                  }}
                >
                  15 December – 15 January
                </p>
                <p
                  style={{
                    fontSize: "0.86rem",
                    color: "#6b5a8e",
                    lineHeight: 1.6,
                  }}
                >
                  Full-time, up to 40 hours/week over the Christmas / New Year
                  break.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "14px 16px",
                borderRadius: 12,
                background: "rgba(237,232,255,0.5)",
                border: "1px solid var(--line)",
              }}
            >
              <Clock
                size={18}
                style={{ color: "#7c5cff", flexShrink: 0, marginTop: 2 }}
              />
              <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6 }}>
                Outside those two windows you're limited to{" "}
                <strong>20 hours per week</strong>. Going over the limit can put
                your permission - and any future Stamp 1G - at risk, so keep your
                hours documented.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ── Other stamps: 1A & 4 ───────────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 8px" }}
        >
          <Reveal>
            <h2
              style={{
                ...h2Style,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: 6,
              }}
            >
              Two more stamps worth knowing
            </h2>
            <p style={{ color: "#6b5a8e", marginBottom: 22, lineHeight: 1.6 }}>
              Depending on your career path, you may meet these along the way.
            </p>
          </Reveal>

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            <Reveal>
              <div
                className="card glow-on-hover visa-lift"
                style={{ padding: "22px 20px", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      padding: 9,
                      borderRadius: 12,
                      background: "#dcfce7",
                      color: "#10b981",
                    }}
                  >
                    <Calculator size={20} />
                  </span>
                  <h3 style={{ ...h3Style, fontSize: "1.2rem" }}>
                    Stamp 1A - Trainee accountants
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#38285c",
                    lineHeight: 1.7,
                  }}
                >
                  Stamp 1A is a special permission given <strong>only</strong> to
                  people doing <strong>full-time paid accountancy training</strong>{" "}
                  under a training contract with an Irish firm (regulated by
                  IAASA). It's not a general work stamp - it exists specifically
                  for trainee accountants completing their professional
                  qualification, usually over about 3–4 years.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div
                className="card glow-on-hover visa-lift"
                style={{ padding: "22px 20px", height: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      padding: 9,
                      borderRadius: 12,
                      background: "#fce7f3",
                      color: "#ec4899",
                    }}
                  >
                    <ShieldCheck size={20} />
                  </span>
                  <h3 style={{ ...h3Style, fontSize: "1.2rem" }}>
                    Stamp 4 - Long-term residence
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#38285c",
                    lineHeight: 1.7,
                  }}
                >
                  Stamp 4 is the big one: you can{" "}
                  <strong>
                    work for any employer with no employment permit
                  </strong>
                  , take up self-employment, and run a business. You usually
                  reach it after 5 years on an employment permit (or just 2 years
                  on a Critical Skills permit). Crucially, Stamp 4 time is{" "}
                  <strong>reckonable toward citizenship</strong>.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Citizenship / passport ─────────────────────────── */}
        <section
          style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px 56px" }}
        >
          <Reveal>
            <div
              className="card visa-lift"
              style={{
                padding: "30px 26px",
                background:
                  "linear-gradient(135deg, rgba(124,92,255,0.06), rgba(245,158,11,0.06))",
                border: "1px solid rgba(124,92,255,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    padding: 11,
                    borderRadius: 14,
                    background: "#fff3d6",
                    color: "#f59e0b",
                  }}
                >
                  <Flag size={24} />
                </span>
                <h2
                  style={{
                    ...h2Style,
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  Getting the Irish passport
                </h2>
              </div>
              <p style={{ color: "#38285c", lineHeight: 1.8, marginBottom: 16 }}>
                Becoming an Irish citizen is done through{" "}
                <strong>naturalisation</strong>. The core rule:
              </p>
              <ul style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {[
                  "You need 5 years of reckonable residence out of the last 9 years.",
                  "The final 12 months before you apply must be continuous residence in Ireland.",
                  "Time spent on a student stamp (Stamp 2) and on the graduate scheme (Stamp 1G) does NOT count - the clock effectively starts on Stamp 1 / Stamp 4.",
                  "Once you have the residence, you apply for naturalisation; if approved you become an Irish citizen and can get an Irish (EU) passport.",
                ].map((t, i) => (
                  <li
                    key={t}
                    className="visa-rule"
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: "0.92rem",
                      color: "#38285c",
                      lineHeight: 1.6,
                      animationDelay: `${i * 90}ms`,
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#9b8ec8",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                }}
              >
                Tip: a spouse of an Irish citizen can apply after 3 years. You can
                check your exact total on the official Naturalisation Residency
                Calculator at irishimmigration.ie.
              </p>
            </div>
          </Reveal>

          {/* Disclaimer */}
          <Reveal>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.78rem",
                color: "#9b8ec8",
                lineHeight: 1.6,
                maxWidth: 640,
                margin: "28px auto 0",
              }}
            >
              This is a friendly student guide, not legal advice. Rules and dates
              can change - always confirm the current details on{" "}
              <span style={{ color: "#7c5cff" }}>irishimmigration.ie</span> or
              with your college's international office before you apply.
            </p>
          </Reveal>

          {/* Back link */}
          <Reveal>
            <div style={{ textAlign: "center", marginTop: 26 }}>
              <Link href="/first-30-days" className="btn-ghost">
                ← Back to First 30 days
              </Link>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />
    </main>
  );
}
