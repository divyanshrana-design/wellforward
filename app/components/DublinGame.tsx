"use client";

import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  {
    q: "What does 'IRP' stand for?",
    options: ["Irish Registration Pass", "Irish Residence Permit", "International Residence Pass", "Immigration Residency Permit"],
    correct: 1,
    explain: "The Irish Residence Permit is what you need within 90 days of arriving. Book the appointment before you even land.",
  },
  {
    q: "Which transport card gets you 50% off Dublin Bus, DART, and Luas fares as a student?",
    options: ["Dublin City Card", "Student Travel Pass", "Student Leap Card", "UCD Travel Card"],
    correct: 2,
    explain: "The Student Leap Card is your best friend. Get it in your first week and register at studentleapcard.ie.",
  },
  {
    q: "What is a 'PPSN'?",
    options: ["Public Personal Service Number", "Personal Public Service Number", "Permanent Permit and Student Number", "Payment Processing System Number"],
    correct: 1,
    explain: "Your Personal Public Service Number is needed to work legally, pay tax, and access government services in Ireland.",
  },
  {
    q: "Smurfit Business School is based in which Dublin suburb?",
    options: ["Stillorgan", "Dún Laoghaire", "Blackrock", "Clontarf"],
    correct: 2,
    explain: "Smurfit is in Carysfort Avenue, Blackrock. The DART to Blackrock station is the easiest way to get there.",
  },
  {
    q: "What does an Irish person mean when they say something is 'grand'?",
    options: ["Expensive and luxurious", "Fine or okay", "Very large", "Completely broken"],
    correct: 1,
    explain: "Grand basically means fine, no problem, all good. You will hear it about fifty times a day.",
  },
  {
    q: "Which bank is generally easiest for international students to open an account with in Ireland?",
    options: ["KBC", "Ulster Bank", "AIB", "Permanent TSB"],
    correct: 2,
    explain: "AIB can open an account entirely on your phone with a video verification call. No branch visit required.",
  },
  {
    q: "The DART runs along which natural feature?",
    options: ["The River Liffey", "The Dublin coastline", "The Grand Canal", "The Wicklow Mountains"],
    correct: 1,
    explain: "The DART runs along the coast from Howth to Greystones. It's the scenic route to Blackrock for Smurfit students.",
  },
  {
    q: "What is 'the craic'?",
    options: ["A type of Irish bread", "Fun, good times, conversation", "A traditional Irish instrument", "The Dublin city centre area"],
    correct: 1,
    explain: "Craic (pronounced 'crack') means fun, atmosphere, and good conversation. 'What's the craic?' means 'what's happening?'",
  },
  {
    q: "How long do you have after arriving in Ireland to register your IRP?",
    options: ["30 days", "60 days", "90 days", "6 months"],
    correct: 2,
    explain: "You have 90 days from the date you enter Ireland. But IRP appointment slots fill up fast, so book as early as possible.",
  },
  {
    q: "What is Sláinte?",
    options: ["A type of Irish coffee", "Cheers, said when raising a glass", "The Irish word for welcome", "A Dublin neighbourhood"],
    correct: 1,
    explain: "Sláinte (pronounced SLAWN-cha) means cheers. Essential vocabulary for your first pub visit in Dublin.",
  },
];

const LEVEL_LABELS = [
  { min: 0,  max: 3,  label: "Fresh off the plane",  color: "#9b8ec8", advice: "Time to explore the guide below." },
  { min: 4,  max: 6,  label: "Getting your bearings", color: "#0ea5e9", advice: "Not bad at all. You know the basics." },
  { min: 7,  max: 8,  label: "Almost a local",        color: "#7c5cff", advice: "You have been paying attention." },
  { min: 9,  max: 10, label: "Dublin expert",          color: "#10b981", advice: "You are properly sorted. Go get a coffee." },
];

function getLevel(score: number) {
  return LEVEL_LABELS.find(l => score >= l.min && score <= l.max) ?? LEVEL_LABELS[0];
}

export default function DublinGame() {
  const [started, setStarted]     = useState(false);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [score, setScore]         = useState(0);
  const [finished, setFinished]   = useState(false);
  const [answers, setAnswers]     = useState<(number | null)[]>([]);
  const [showExplain, setShowExplain] = useState(false);
  const [timeLeft, setTimeLeft]   = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Shuffle questions on start, pick 6
  const [questions, setQuestions] = useState(QUESTIONS.slice(0, 6));

  const startGame = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(shuffled);
    setStarted(true);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setShowExplain(false);
    setTimeLeft(15);
  };

  // Timer
  useEffect(() => {
    if (!started || finished || selected !== null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(-1); // timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [started, current, selected, finished]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    setSelected(idx);
    const isCorrect = idx === questions[current].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
    setShowExplain(true);
  };

  const next = () => {
    const nextIdx = current + 1;
    if (nextIdx >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setShowExplain(false);
      setTimeLeft(15);
    }
  };

  const q = questions[current];
  const level = getLevel(score);

  // Card entrance animation
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (started && !finished) {
      setAnimate(false);
      const t = setTimeout(() => setAnimate(true), 30);
      return () => clearTimeout(t);
    }
  }, [current, started, finished]);

  if (!started) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ede8ff",
          borderRadius: 20,
          padding: "clamp(24px,4vw,40px)",
          maxWidth: 500,
          boxShadow: "0 12px 40px -12px rgba(124,92,255,0.18)",
          textAlign: "center",
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
          fontSize: "1.5rem",
        }}>
          🎯
        </div>
        <h3 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#1a0f2e",
          letterSpacing: "-0.025em",
          marginBottom: 10,
        }}>
          How ready are you for Dublin?
        </h3>
        <p style={{ fontSize: "0.88rem", color: "#3d2f60", lineHeight: 1.65, marginBottom: 22 }}>
          6 quick questions about life in Dublin and UCD. Takes about 90 seconds. Actually useful.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 22 }}>
          {["IRP", "PPSN", "Transport", "Irish slang", "Banking", "Campus"].map(tag => (
            <span key={tag} className="chip" style={{ cursor: "default", fontSize: "0.72rem" }}>{tag}</span>
          ))}
        </div>
        <button
          onClick={startGame}
          className="btn-primary"
          style={{ padding: "12px 32px", fontSize: "0.95rem", borderRadius: 12 }}
        >
          Start the quiz
        </button>
      </div>
    );
  }

  if (finished) {
    const lvl = getLevel(score);
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #ede8ff",
          borderRadius: 20,
          padding: "clamp(24px,4vw,40px)",
          maxWidth: 500,
          boxShadow: "0 12px 40px -12px rgba(124,92,255,0.18)",
          textAlign: "center",
          animation: "scaleIn 0.3s ease",
        }}
      >
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "3.5rem",
          fontWeight: 900,
          color: lvl.color,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          marginBottom: 6,
        }}>
          {score}/{questions.length}
        </div>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "#1a0f2e",
          marginBottom: 8,
        }}>
          {lvl.label}
        </div>
        <p style={{ fontSize: "0.85rem", color: "#6b5a8e", lineHeight: 1.6, marginBottom: 22 }}>
          {lvl.advice}
        </p>

        {/* Per-question result dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 22 }}>
          {questions.map((q, i) => (
            <div
              key={i}
              title={`Q${i+1}: ${answers[i] === q.correct ? "Correct" : "Wrong"}`}
              style={{
                width: 30, height: 30,
                borderRadius: "50%",
                background: answers[i] === q.correct
                  ? "linear-gradient(135deg, #10b981, #34d399)"
                  : "linear-gradient(135deg, #ef4444, #fb7185)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "0.72rem", fontWeight: 700,
              }}
            >
              {answers[i] === q.correct ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={startGame} className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.88rem", borderRadius: 10 }}>
            Try again
          </button>
          <a
            href="/first-30-days"
            className="btn-ghost"
            style={{ padding: "10px 24px", fontSize: "0.88rem", borderRadius: 10, textDecoration: "none", display: "inline-block" }}
          >
            See the checklist →
          </a>
        </div>
      </div>
    );
  }

  const timerPct = (timeLeft / 15) * 100;
  const timerColor = timeLeft > 8 ? "#10b981" : timeLeft > 4 ? "#f59e0b" : "#ef4444";

  return (
    <div
      ref={cardRef}
      style={{
        background: "white",
        border: "1px solid #ede8ff",
        borderRadius: 20,
        padding: "clamp(20px,4vw,36px)",
        maxWidth: 500,
        boxShadow: "0 12px 40px -12px rgba(124,92,255,0.18)",
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      {/* Progress row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: 22, height: 5,
                borderRadius: 3,
                background: i < current
                  ? (answers[i] === questions[i].correct ? "#10b981" : "#ef4444")
                  : i === current
                  ? "#7c5cff"
                  : "#ede8ff",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.72rem", color: "#9b8ec8" }}>
            {current + 1}/{questions.length}
          </span>
          <div style={{
            width: 32, height: 32,
            borderRadius: "50%",
            background: `conic-gradient(${timerColor} ${timerPct}%, #ede8ff 0%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              width: 24, height: 24,
              borderRadius: "50%",
              background: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: timerColor,
            }}>
              {timeLeft}
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <p style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontSize: "1.05rem",
        fontWeight: 700,
        color: "#1a0f2e",
        lineHeight: 1.45,
        marginBottom: 18,
        letterSpacing: "-0.015em",
      }}>
        {q.q}
      </p>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect  = i === q.correct;
          const revealed   = selected !== null;

          let bg = "rgba(245,241,255,0.7)";
          let border = "1.5px solid #ede8ff";
          let color = "#2a1d50";

          if (revealed) {
            if (isCorrect)        { bg = "rgba(16,185,129,0.12)"; border = "1.5px solid rgba(16,185,129,0.4)"; color = "#065f46"; }
            else if (isSelected)  { bg = "rgba(239,68,68,0.1)";  border = "1.5px solid rgba(239,68,68,0.35)"; color = "#7f1d1d"; }
            else                  { bg = "rgba(245,241,255,0.4)"; border = "1.5px solid #ede8ff"; color = "#9b8ec8"; }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              style={{
                background: bg,
                border,
                color,
                borderRadius: 10,
                padding: "11px 14px",
                textAlign: "left",
                fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif",
                cursor: selected !== null ? "default" : "pointer",
                transition: "all 0.22s ease",
                fontWeight: isCorrect && revealed ? 600 : 500,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{
                width: 22, height: 22,
                borderRadius: "50%",
                background: revealed && isCorrect ? "#10b981" : revealed && isSelected ? "#ef4444" : "#ede8ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.62rem",
                fontWeight: 700,
                color: revealed && (isCorrect || isSelected) ? "white" : "#7c5cff",
              }}>
                {revealed
                  ? isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + i)
                  : String.fromCharCode(65 + i)
                }
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explain + next */}
      {showExplain && (
        <div style={{ marginTop: 14, animation: "slideUp 0.3s ease" }}>
          <div style={{
            background: "rgba(124,92,255,0.06)",
            border: "1px solid rgba(124,92,255,0.15)",
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 12,
            fontSize: "0.82rem",
            color: "#38285c",
            lineHeight: 1.6,
          }}>
            {q.explain}
          </div>
          <button
            onClick={next}
            className="btn-primary"
            style={{ width: "100%", padding: "11px", fontSize: "0.88rem", borderRadius: 10 }}
          >
            {current + 1 >= questions.length ? "See results" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}
