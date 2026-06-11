"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ExternalLink, CheckCircle2, Circle, ClipboardList } from "lucide-react";
import { CHECKLIST_TASKS, ChecklistTask } from "@/lib/data";

const PHASE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  before: { label: "Before arrival", color: "#6B4EFF", bg: "rgba(107, 78, 255, 0.12)" },
  week1: { label: "Week 1", color: "#0EA5E9", bg: "rgba(14, 165, 233, 0.12)" },
  month1: { label: "Month 1", color: "#10B981", bg: "rgba(16, 185, 129, 0.12)" },
};

function TaskCard({
  task,
  done,
  onToggle,
}: {
  task: ChecklistTask;
  done: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const phase = PHASE_LABELS[task.phase];

  return (
    <div
      className="relative"
      style={{
        marginLeft: "48px",
      }}
    >
      {/* Timeline dot */}
      <button
        onClick={onToggle}
        className="absolute -left-12 top-5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500"
        style={{
          background: done
            ? "linear-gradient(135deg, #7C5CFF, #6B4EFF)"
            : "rgba(233, 226, 255, 0.8)",
          border: done ? "none" : "2px solid rgba(124, 92, 255, 0.4)",
          transform: done ? "scale(1.05)" : "scale(1)",
        }}
        aria-label={done ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
      >
        {done ? (
          <CheckCircle2 size={16} color="white" />
        ) : (
          <Circle size={16} color="#7C5CFF" />
        )}
      </button>

      <div
        className="card overflow-hidden"
        style={{
          border: done
            ? "1px solid rgba(124, 92, 255, 0.2)"
            : "1px solid rgba(255, 255, 255, 0.45)",
          opacity: done ? 0.7 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {/* Header row */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-start gap-3 p-5"
          aria-expanded={open}
          aria-controls={`task-${task.id}-content`}
        >
          <span className="text-2xl flex-shrink-0" aria-hidden="true">
            {task.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className="font-semibold text-base"
                style={{
                  color: done ? "#9B8EC8" : "#1a1033",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {task.title}
              </h3>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: phase.color, background: phase.bg }}
              >
                {phase.label}
              </span>
            </div>
            <p
              className="text-sm line-clamp-1"
              style={{ color: "#7B6EA8" }}
            >
              {task.what}
            </p>
          </div>
          <ChevronDown
            size={18}
            style={{
              color: "#7C5CFF",
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.25s ease",
              flexShrink: 0,
              marginTop: 2,
            }}
          />
        </button>

        {/* Expanded content */}
        {open && (
          <div
            id={`task-${task.id}-content`}
            style={{
              borderTop: "1px solid rgba(200, 184, 255, 0.3)",
              padding: "20px",
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(200, 184, 255, 0.18)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#9B8EC8" }}
                >
                  Why it matters
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3a2860" }}>
                  {task.why}
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(200, 184, 255, 0.18)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "#9B8EC8" }}
                >
                  How long it takes
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#3a2860" }}>
                  {task.howLong}
                </p>
              </div>
            </div>

            {/* What to bring */}
            <div className="mb-4">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#9B8EC8" }}
              >
                What to bring / prepare
              </p>
              <ul className="space-y-1">
                {task.whatToBring.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#3a2860" }}
                  >
                    <span style={{ color: "#7C5CFF", marginTop: 2 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitfall */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: "rgba(255, 200, 100, 0.15)",
                border: "1px solid rgba(255, 180, 0, 0.2)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "#B45309" }}
              >
                ⚠️ Common pitfall
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#78350F" }}>
                {task.pitfall}
              </p>
            </div>

            {/* Link + toggle done */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl"
                style={{ textDecoration: "none", display: "inline-flex" }}
              >
                {task.linkLabel}
                <ExternalLink size={13} />
              </a>
              <button
                onClick={onToggle}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                style={{
                  background: done
                    ? "rgba(200, 184, 255, 0.3)"
                    : "linear-gradient(135deg, #7C5CFF, #6B4EFF)",
                  color: done ? "#6B4EFF" : "white",
                }}
              >
                {done ? "Mark undone" : "Mark as done ✓"}
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
  const [activePhase, setActivePhase] = useState<"all" | "before" | "week1" | "month1">("all");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wellforward-checklist");
      if (saved) setDone(JSON.parse(saved));
    } catch {}
  }, []);

  // Save to localStorage
  const toggleTask = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("wellforward-checklist", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredTasks = activePhase === "all"
    ? CHECKLIST_TASKS
    : CHECKLIST_TASKS.filter((t) => t.phase === activePhase);

  const doneCount = CHECKLIST_TASKS.filter((t) => done[t.id]).length;
  const progress = Math.round((doneCount / CHECKLIST_TASKS.length) * 100);

  return (
    <section
      id="checklist"
      className="relative z-10 section-padding"
      aria-labelledby="checklist-title"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm"
            style={{
              background: "rgba(200, 184, 255, 0.4)",
              color: "#6B4EFF",
              border: "1px solid rgba(124, 92, 255, 0.2)",
            }}
          >
            <ClipboardList size={14} />
            The practical bit
          </div>
          <h2
            id="checklist-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            Your first{" "}
            <span className="gradient-text italic">30 days</span>
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            Everything you actually need to do — with honest notes on what&apos;s annoying,
            what takes longer than expected, and what to watch out for.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="glass-soft rounded-2xl p-5 mb-8"
          style={{ border: "1px solid rgba(200, 184, 255, 0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: "#4a3878" }}>
              Your progress
            </span>
            <span
              className="font-serif text-lg gradient-text"
            >
              {doneCount}/{CHECKLIST_TASKS.length}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${doneCount} of ${CHECKLIST_TASKS.length} tasks complete`}
            />
          </div>
          <p
            className="text-xs mt-2"
            style={{ color: "#9B8EC8" }}
          >
            {progress === 0
              ? "Tick things off as you go — progress saves automatically."
              : progress === 100
              ? "🎉 You're all set. Welcome to Dublin."
              : `${100 - progress}% left — you're getting there.`}
          </p>
        </div>

        {/* Phase filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", "before", "week1", "month1"] as const).map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className="chip text-sm py-2 px-4"
              style={
                activePhase === phase
                  ? {
                      background: "linear-gradient(135deg, #7C5CFF, #6B4EFF)",
                      color: "white",
                      border: "none",
                    }
                  : {}
              }
              aria-pressed={activePhase === phase}
            >
              {phase === "all"
                ? "All tasks"
                : phase === "before"
                ? "Before arrival"
                : phase === "week1"
                ? "Week 1"
                : "Month 1"}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div
          className="relative"
          style={{ paddingLeft: "8px" }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "20px",
              top: "20px",
              bottom: "20px",
              width: "2px",
              background: "linear-gradient(180deg, #7C5CFF 0%, rgba(200, 184, 255, 0.3) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="space-y-5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                done={!!done[task.id]}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 text-center"
        >
          <p className="text-xs" style={{ color: "#9B8EC8", lineHeight: 1.6 }}>
            Information is accurate as of 2024. Official processes change —
            always check the linked official sources before you act.
          </p>
        </div>
      </div>
    </section>
  );
}
