"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ExternalLink, CheckCircle2, Circle, ClipboardList } from "lucide-react";
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

function TaskCard({ task, done, onToggle, index }: {
  task: typeof CHECKLIST_TASKS[0];
  done: boolean; onToggle: () => void; index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useReveal();
  const ph = PHASE[task.phase];

  return (
    <div ref={ref} className="reveal" style={{ marginLeft: 52, transitionDelay: `${index * 40}ms` }}>
      {/* Timeline dot — positioned absolutely relative to parent */}
      <button
        onClick={onToggle}
        className="tl-dot absolute -left-[52px] top-5"
        style={{
          ...(done
            ? { background: "linear-gradient(135deg,#7c5cff,#5a3ee8)", color: "#fff", boxShadow: "0 0 0 4px rgba(124,92,255,0.18)" }
            : {}),
        } as React.CSSProperties & Record<string, unknown>}
        aria-label={`${done ? "Uncheck" : "Check"} ${task.title}`}
      >
        {done
          ? <CheckCircle2 size={15} />
          : <Circle size={15} style={{ color: "#7c5cff" }} />
        }
      </button>

      <div
        className="card overflow-hidden"
        style={{
          opacity: done ? 0.62 : 1,
          transition: "opacity 0.3s ease, transform 0.22s cubic-bezier(.22,.68,0,1.2), box-shadow 0.22s ease",
        }}
      >
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-start gap-3 p-5"
          aria-expanded={open}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 1 }} aria-hidden="true">{task.icon}</span>
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
                {task.title}
              </span>
              <span
                style={{
                  fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: ph.color, background: ph.bg,
                  padding: "2px 8px", borderRadius: 4,
                }}
              >
                {ph.label}
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
          <div
            style={{ borderTop: "1px solid rgba(200,184,255,0.25)", padding: "18px 20px" }}
          >
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
                What to bring / prepare
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

            <div
              style={{
                background: "rgba(255,193,7,0.12)",
                border: "1px solid rgba(255,193,7,0.22)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#92400e", marginBottom: 4 }}>
                ⚠ common pitfall
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
                {done ? "Mark as undone" : "Mark done ✓"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChecklistSection() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState<"all"|"before"|"week1"|"month1">("all");
  const headerRef = useReveal();

  useEffect(() => {
    try { const s = localStorage.getItem("wf-checklist"); if (s) setDone(JSON.parse(s)); } catch {}
  }, []);

  const toggle = (id: string) => setDone(prev => {
    const next = { ...prev, [id]: !prev[id] };
    try { localStorage.setItem("wf-checklist", JSON.stringify(next)); } catch {}
    return next;
  });

  const tasks = phase === "all" ? CHECKLIST_TASKS : CHECKLIST_TASKS.filter(t => t.phase === phase);
  const doneCount = CHECKLIST_TASKS.filter(t => done[t.id]).length;
  const pct = Math.round((doneCount / CHECKLIST_TASKS.length) * 100);

  return (
    <section id="checklist" className="relative z-10 section-padding" aria-labelledby="checklist-title">
      <div className="max-w-3xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-10">
          <span className="section-label"><ClipboardList size={12} /> the practical bit</span>
          <h2 id="checklist-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
            Your first <em className="grad-text" style={{ fontStyle: "italic" }}>30 days</em>
          </h2>
          <p style={{ maxWidth: 480, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            Everything you actually need to do — with honest notes on what&apos;s annoying, what takes longer than expected, and what to watch out for.
          </p>
        </div>

        {/* Progress */}
        <div
          style={{
            background: "rgba(245,241,255,0.7)",
            border: "1px solid rgba(200,184,255,0.28)",
            borderRadius: 14, padding: "18px 20px", marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: "0.85rem", color: "#3d2f60", fontWeight: 500 }}>Progress</span>
            <span className="serif grad-text" style={{ fontSize: "1.5rem" }}>{doneCount}/{CHECKLIST_TASKS.length}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p style={{ fontSize: "0.72rem", color: "#b0a0cc", marginTop: 7 }}>
            {pct === 0 ? "Tick tasks off as you go — saves automatically." : pct === 100 ? "🎉 You're all set. Welcome to Dublin." : `${100 - pct}% left — you've got this.`}
          </p>
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
        <div style={{ position: "relative", paddingLeft: 8 }}>
          {/* The vertical line */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 20, top: 20, bottom: 20,
              width: 2,
              background: "linear-gradient(180deg, #7c5cff 0%, rgba(200,184,255,0.3) 100%)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tasks.map((t, i) => (
              <div key={t.id} style={{ position: "relative" }}>
                <TaskCard task={t} done={!!done[t.id]} onToggle={() => toggle(t.id)} index={i} />
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 28, fontSize: "0.72rem", color: "#b0a0cc", textAlign: "center", lineHeight: 1.6 }}>
          Information accurate as of 2024–25. Always check linked official sources before acting.
        </p>
      </div>
    </section>
  );
}
