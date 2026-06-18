"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ExternalLink, CheckCircle2, Circle, ClipboardList, Star, Flame, Trophy, Zap } from "lucide-react";
import { CHECKLIST_TASKS } from "@/lib/data";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const PHASE = {
  before: { label: "Before arrival", color: "#7c5cff", bg: "rgba(124,92,255,0.1)" },
  week1:  { label: "Week 1",         color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
  month1: { label: "Month 1",        color: "#10b981", bg: "rgba(16,185,129,0.1)" },
} as const;

// XP per task based on urgency
const TASK_XP: Record<string, number> = {
  irp: 150, pps: 100, leap: 60, bank: 80, gp: 70,
  sim: 50, accommodation: 90, "ucd-reg": 80, mygovid: 40, groceries: 30,
};

// Confetti burst — pure CSS keyframe confetti pieces
function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const colors = ["#7c5cff","#c8b8ff","#ffd166","#06d6a0","#ef476f","#118ab2"];
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
      {Array.from({ length: 32 }).map((_, i) => {
        const color = colors[i % colors.length];
        const left = 20 + Math.random() * 60;
        const delay = Math.random() * 0.4;
        const dur = 1.2 + Math.random() * 0.6;
        const size = 6 + Math.random() * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "40%",
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              background: color,
              animation: `confettiFall ${dur}s ${delay}s ease-out forwards`,
              transform: `rotate(${Math.random()*360}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

// XP pop-up that floats up and fades
function XpPop({ xp, onDone }: { xp: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", top: "45%", left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg,#7c5cff,#c8b8ff)",
      color: "white",
      fontFamily: "'Fraunces', Georgia, serif",
      fontSize: "1.6rem",
      fontWeight: 900,
      padding: "10px 24px",
      borderRadius: 999,
      pointerEvents: "none",
      zIndex: 9999,
      animation: "xpFloat 1s ease-out forwards",
      boxShadow: "0 8px 32px -8px rgba(124,92,255,0.5)",
    }}>
      +{xp} XP
    </div>
  );
}

function TaskCard({ task, done, onToggle, index }: {
  task: typeof CHECKLIST_TASKS[0];
  done: boolean; onToggle: () => void; index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useReveal();
  const ph = PHASE[task.phase];
  const xp = TASK_XP[task.id] ?? 50;

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${index * 40}ms` }}>
      <div
        className="card overflow-hidden"
        style={{
          opacity: done ? 0.65 : 1,
          transition: "all 0.3s cubic-bezier(.22,.68,0,1.2)",
          transform: done ? "scale(0.99)" : "scale(1)",
        }}
      >
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-start gap-3 p-5"
          aria-expanded={open}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="serif font-bold"
                style={{
                  fontSize: "0.98rem",
                  color: done ? "#9b8ec8" : "#1c1430",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {done && <span style={{ marginRight: 6 }}>✓</span>}
                {task.title}
              </span>
              <span style={{
                fontSize: "0.65rem", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: ph.color, background: ph.bg,
                padding: "2px 8px", borderRadius: 4,
              }}>
                {ph.label}
              </span>
              {/* XP badge */}
              <span style={{
                fontSize: "0.62rem", fontWeight: 700,
                color: "#7c5cff",
                background: "rgba(124,92,255,0.08)",
                border: "1px solid rgba(124,92,255,0.15)",
                padding: "2px 7px", borderRadius: 4,
                display: "flex", alignItems: "center", gap: 3,
              }}>
                <Zap size={9} /> {xp} XP
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#9b8ec8", lineHeight: 1.5, display: open ? "none" : undefined }}
               className="line-clamp-1">
              {task.what}
            </p>
          </div>
          <ChevronDown
            size={17}
            style={{
              color: "#9b8ec8", flexShrink: 0, marginTop: 3,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.22s ease",
            }}
          />
        </button>

        {/* Expanded */}
        {open && (
          <div style={{ borderTop: "1px solid rgba(200,184,255,0.25)", padding: "18px 20px" }}>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {[
                { label: "Why it matters", text: task.why },
                { label: "How long",       text: task.howLong },
              ].map(({ label, text }) => (
                <div key={label} style={{ background: "rgba(200,184,255,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#b0a0cc", marginBottom: 5 }}>{label}</p>
                  <p style={{ fontSize: "0.82rem", color: "#2a1d50", lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#b0a0cc", marginBottom: 7 }}>
                What to bring
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {task.whatToBring.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: "0.82rem", color: "#2a1d50" }}>
                    <span style={{ color: "#7c5cff", marginTop: 1, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              background: "rgba(255,193,7,0.1)",
              border: "1px solid rgba(255,193,7,0.22)",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 14,
            }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#92400e", marginBottom: 4 }}>
                Common pitfall
              </p>
              <p style={{ fontSize: "0.82rem", color: "#78350f", lineHeight: 1.6 }}>{task.pitfall}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={task.link} target="_blank" rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-sm"
                style={{ textDecoration: "none", borderRadius: 8 }}
              >
                {task.linkLabel} <ExternalLink size={12} />
              </a>
              <button
                onClick={onToggle}
                className={done ? "btn-secondary" : "btn-primary"}
                style={{ padding: "8px 16px", fontSize: "0.82rem", borderRadius: 8 }}
              >
                {done ? "Mark as undone" : `Mark done  +${xp} XP`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Level config
const LEVELS = [
  { name: "Just arrived", min: 0,   icon: "✈️",  color: "#9b8ec8" },
  { name: "Getting there", min: 150, icon: "🗺️",  color: "#0ea5e9" },
  { name: "Almost sorted", min: 350, icon: "📋",  color: "#7c5cff" },
  { name: "Fully sorted",  min: 600, icon: "🏆",  color: "#f59e0b" },
  { name: "Dublin local",  min: 900, icon: "☘️",  color: "#10b981" },
];

function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return { ...LEVELS[i], index: i, next: LEVELS[i + 1] };
  }
  return { ...LEVELS[0], index: 0, next: LEVELS[1] };
}

export default function ChecklistSection() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"all"|"before"|"week1"|"month1">("all");
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpPop, setXpPop] = useState<number | null>(null);
  const [streakToday, setStreakToday] = useState(0);
  const headerRef = useReveal();

  useEffect(() => {
    try {
      const s = localStorage.getItem("wf-checklist");
      if (s) setDone(JSON.parse(s));
      const today = new Date().toDateString();
      const lastDay = localStorage.getItem("wf-streak-day");
      const streak = parseInt(localStorage.getItem("wf-streak") || "0");
      if (lastDay === today) setStreakToday(streak);
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => {
    setDone(prev => {
      const isNowDone = !prev[id];
      const next = { ...prev, [id]: isNowDone };
      try { localStorage.setItem("wf-checklist", JSON.stringify(next)); } catch {}

      if (isNowDone) {
        const xp = TASK_XP[id] ?? 50;
        setXpPop(xp);
        const newTotal = Object.entries(next).filter(([,v]) => v).reduce((s,[k]) => s + (TASK_XP[k] ?? 50), 0);
        const newDone = Object.values(next).filter(Boolean).length;
        // Confetti on certain milestones
        if (newDone === CHECKLIST_TASKS.length || newDone % 3 === 0) setShowConfetti(true);
        // Update streak
        try {
          const today = new Date().toDateString();
          const lastDay = localStorage.getItem("wf-streak-day");
          const streak = parseInt(localStorage.getItem("wf-streak") || "0");
          const newStreak = lastDay === today ? streak : streak + 1;
          localStorage.setItem("wf-streak", String(newStreak));
          localStorage.setItem("wf-streak-day", today);
          setStreakToday(newStreak);
        } catch {}
      }
      return next;
    });
  }, []);

  const totalXp = Object.entries(done).filter(([,v]) => v).reduce((s,[k]) => s + (TASK_XP[k] ?? 50), 0);
  const doneCount = CHECKLIST_TASKS.filter(t => done[t.id]).length;
  const pct = Math.round((doneCount / CHECKLIST_TASKS.length) * 100);
  const tasks = phase === "all" ? CHECKLIST_TASKS : CHECKLIST_TASKS.filter(t => t.phase === phase);
  const level = getLevel(totalXp);
  const nextLevelXp = level.next?.min ?? totalXp;
  const levelPct = level.next ? Math.min(100, Math.round(((totalXp - level.min) / (nextLevelXp - level.min)) * 100)) : 100;

  const motivational = pct === 0
    ? "Tick things off as you go. Each one saves you stress later."
    : pct === 100
    ? "You did everything. Genuinely impressive."
    : pct < 30
    ? "Good start. The IRP one really can't wait."
    : pct < 60
    ? "You're ahead of most people at this stage."
    : "Nearly there. The last few are quick.";

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60vh) rotate(720deg); opacity: 0; }
        }
        @keyframes xpFloat {
          0% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-80px); opacity: 0; }
        }
        @keyframes levelUp {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
      {xpPop !== null && <XpPop xp={xpPop} onDone={() => setXpPop(null)} />}

      <section id="checklist" className="relative z-10 section-padding" aria-labelledby="checklist-title">
        <div className="max-w-3xl mx-auto px-5 sm:px-10">

          <div ref={headerRef} className="reveal mb-10">
            <span className="section-label"><ClipboardList size={12} /> the practical bit</span>
            <h2 id="checklist-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
              Your first <em className="grad-text" style={{ fontStyle: "italic" }}>30 days</em>
            </h2>
            <p style={{ maxWidth: 480, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
              Everything you need to sort. Real notes on what takes longer than expected and what catches people out.
            </p>
          </div>

          {/* Player card — XP + level */}
          <div style={{
            background: "white",
            border: "1px solid #ede8ff",
            borderRadius: 18,
            padding: "20px 22px",
            marginBottom: 16,
            boxShadow: "0 4px 24px -8px rgba(124,92,255,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Level badge */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "linear-gradient(135deg,#7c5cff,#c8b8ff)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                  boxShadow: "0 4px 16px -4px rgba(124,92,255,0.35)",
                  animation: doneCount > 0 ? "levelUp 0.4s ease" : "none",
                }}>
                  {level.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.02em" }}>
                    {level.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#9b8ec8" }}>Level {level.index + 1} of {LEVELS.length}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {/* XP total */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 900, color: "#7c5cff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {totalXp}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#9b8ec8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>XP</div>
                </div>

                {/* Streak */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                    <Flame size={16} style={{ color: streakToday > 0 ? "#f59e0b" : "#c8b8ff" }} />
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 900, color: streakToday > 0 ? "#f59e0b" : "#c8b8ff", lineHeight: 1 }}>
                      {streakToday}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#9b8ec8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>day streak</div>
                </div>

                {/* Tasks done */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 900, color: "#1a0f2e", lineHeight: 1 }}>
                    {doneCount}<span style={{ fontSize: "0.9rem", color: "#9b8ec8" }}>/{CHECKLIST_TASKS.length}</span>
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#9b8ec8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>done</div>
                </div>
              </div>
            </div>

            {/* Progress to next level */}
            {level.next && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.72rem", color: "#6b5a8e" }}>Progress to &ldquo;{level.next.name}&rdquo;</span>
                  <span style={{ fontSize: "0.72rem", color: "#7c5cff", fontWeight: 600 }}>{totalXp} / {nextLevelXp} XP</span>
                </div>
                <div style={{ height: 6, background: "#ede8ff", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${levelPct}%`,
                    background: "linear-gradient(90deg,#7c5cff,#c8b8ff)",
                    borderRadius: 3,
                    transition: "width 0.6s cubic-bezier(.22,.68,0,1)",
                  }} />
                </div>
              </div>
            )}
            {pct === 100 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Trophy size={16} style={{ color: "#f59e0b" }} />
                <span style={{ fontSize: "0.82rem", color: "#92400e", fontWeight: 600 }}>All done. You are properly sorted.</span>
              </div>
            )}

            {/* Overall progress bar */}
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, background: "#ede8ff", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: "linear-gradient(90deg,#7c5cff,#10b981)",
                  borderRadius: 2,
                  transition: "width 0.6s cubic-bezier(.22,.68,0,1)",
                }} />
              </div>
              <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 6 }}>{motivational}</p>
            </div>
          </div>

          {/* Phase filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["all","before","week1","month1"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`chip ${phase === p ? "active" : ""}`}
                style={{ fontSize: "0.78rem", padding: "6px 14px" }}
                aria-pressed={phase === p}
              >
                {p === "all" ? "All tasks" : p === "before" ? "Before arrival" : p === "week1" ? "Week 1" : "Month 1"}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: 72 }}>
            {/* Vertical line — 20px from left edge of this container */}
            <div aria-hidden="true" style={{
              position: "absolute",
              left: 20, top: 0, bottom: 0,
              width: 2,
              background: "linear-gradient(180deg, #7c5cff 0%, rgba(200,184,255,0.3) 100%)",
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tasks.map((t, i) => (
                <div key={t.id} style={{ position: "relative" }}>
                  {/* Dot button — absolutely positioned at left edge of container, centered on line */}
                  <button
                    onClick={() => toggle(t.id)}
                    className="tl-dot"
                    style={{
                      position: "absolute",
                      left: -68,
                      top: 16,
                      zIndex: 2,
                      ...(done[t.id]
                        ? { background: "linear-gradient(135deg,#7c5cff,#5a3ee8)", color: "#fff", boxShadow: "0 0 0 4px rgba(124,92,255,0.18)" }
                        : { background: "white", border: "2px solid rgba(124,92,255,0.3)", color: "#7c5cff" }),
                    } as React.CSSProperties}
                    aria-label={`${done[t.id] ? "Uncheck" : "Check"} ${t.title}`}
                  >
                    {done[t.id]
                      ? <CheckCircle2 size={15} />
                      : <Circle size={15} style={{ color: "#7c5cff" }} />
                    }
                  </button>
                  <TaskCard task={t} done={!!done[t.id]} onToggle={() => toggle(t.id)} index={i} />
                </div>
              ))}
            </div>
          </div>

          <p style={{ marginTop: 28, fontSize: "0.72rem", color: "#b0a0cc", textAlign: "center", lineHeight: 1.6 }}>
            Info accurate as of 2024/25. Check official sources before acting.
          </p>
        </div>
      </section>
    </>
  );
}
