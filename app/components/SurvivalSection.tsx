"use client";

import { useEffect, useRef, useState } from "react";
import BubbleField from "./BubbleField";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// Each card can expand to show more detail
function SurvivalCard({
  num,
  title,
  urgency,
  summary,
  accentGradient,
  delay = 0,
  offset = 0,
  detail,
}: {
  num: string;
  title: string;
  urgency: string;
  urgencyColor: string;
  summary: string;
  accentGradient: string;
  delay?: number;
  offset?: number;
  detail: React.ReactNode;
}) {
  const ref = useReveal();
  const [open, setOpen] = useState(false);

  return (
    <div
      ref={ref}
      className="reveal survival-card bubble-card"
      style={{
        transitionDelay: `${delay}ms`,
        "--accent-gradient": accentGradient,
        marginTop: offset,
        cursor: "pointer",
      } as React.CSSProperties}
      onClick={() => setOpen(!open)}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && setOpen(!open)}
    >
      {/* Frosted bubbles + cursor-following liquid glow (canvas, behind content) */}
      <BubbleField accentGradient={accentGradient} />

      {/* Content sits above the bubble canvas */}
      <div className="bubble-card-content" style={{ position: "relative", zIndex: 1 }}>
        {/* Number — glassy bubble treatment */}
        <div className="survival-num-wrap">
          <span
            className="survival-num"
            style={{ background: accentGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            {num}
          </span>
        </div>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#1a0f2e",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            {title}
          </h3>
          <span style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 9px",
            borderRadius: 999,
            background: urgency === "Do before you land" ? "rgba(124,92,255,0.12)" : "rgba(200,184,255,0.3)",
            color: urgency === "Do before you land" ? "#5a3ee8" : "#6b5a8e",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {urgency}
          </span>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
          {summary}
        </p>

        {/* Expand toggle */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#7c5cff",
          userSelect: "none",
        }}>
          <span>{open ? "Hide details" : "How to do it →"}</span>
          <span style={{
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            fontSize: "0.7rem",
          }}>▼</span>
        </div>

        {/* Expanded detail */}
        {open && (
          <div
            style={{
              marginTop: 18,
              paddingTop: 18,
              borderTop: "1px dashed rgba(124,92,255,0.15)",
              animation: "slideUp 0.3s ease",
            }}
            onClick={e => e.stopPropagation()}
          >
            {detail}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable step list inside detail panels
function Steps({ steps }: { steps: { text: string }[] }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{
            minWidth: 24, height: 24,
            borderRadius: "50%",
            background: "rgba(124,92,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#7c5cff",
            flexShrink: 0,
          }}>
            {i + 1}
          </span>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.6, margin: 0 }}>
            {s.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

// Tip box
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 14,
      background: "rgba(124,92,255,0.06)",
      border: "1px solid rgba(124,92,255,0.15)",
      borderRadius: 10,
      padding: "12px 14px",
      fontSize: "0.82rem",
      color: "#38285c",
      lineHeight: 1.6,
    }}>
      <strong style={{ color: "#7c5cff" }}>Tip: </strong>
      {children}
    </div>
  );
}

export default function SurvivalSection() {
  const headRef = useReveal();

  const cards = [
    {
      num: "01",
      title: "IRP Registration",
      urgency: "Do before you land",
      urgencyColor: "#5a3ee8",
      summary:
        "The Irish Residence Permit is the most time-sensitive thing on this list. Book your appointment online before you even arrive. Appointments fill up fast, Leave it too late and you could be waiting months.",
      accentGradient: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
      detail: (
        <div>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
            IRP proves your legal right to be in Ireland. You need it to work part-time, open certain accounts, and apply for some services. The appointment system is through the Irish Immigration Service.
          </p>
          <Steps steps={[
            { text: "Go to inis.gov.ie and create an account before you travel." },
            { text: "Book your IRP appointment slot. Pick the earliest available date, even if it is weeks away." },
            { text: "Arrive in Ireland. Your countdown (90 days) starts from your entry date." },
            { text: "Bring your passport, acceptance letter, proof of accommodation, and proof of finances to the appointment." },
            { text: "Your IRP card will be posted to your address within a few weeks." },
          ]} />
          <Tip>
            You can book the appointment before you land. This is the single biggest time-saver. Most students don&apos;t know this and end up in a 2 to 3 month queue.
          </Tip>
        </div>
      ),
    },
    {
      num: "02",
      title: "PPSN: Your Tax Number",
      urgency: "Week 1–2",
      urgencyColor: "#6b5a8e",
      summary:
        "Your Personal Public Service Number is Ireland's version of a national tax ID. You need it to work legally, claim tax credits, and access some public services. It's free to get.",
      accentGradient: "linear-gradient(135deg, #5a3ee8, #b87dff)",
      detail: (
        <div>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
            Think of PPSN as your identity number for anything government-related in Ireland: work, tax, and certain benefits. Without it, any employer legally can&apos;t pay you.
          </p>
          <Steps steps={[
            { text: "Go to mywelfare.ie and create a MyWelfare account." },
            { text: "Apply for a PPSN online. You will need your passport and proof of address in Ireland." },
            { text: "You may be asked to attend an appointment at your local Intreo / Department of Social Protection office." },
            { text: "Your PPSN is posted to your address. Keep it safe. You will use it for everything." },
          ]} />
          <Tip>
            mywelfare.ie is the official government portal. Don&apos;t pay any third-party service to do this. It is completely free.
          </Tip>
        </div>
      ),
    },
    {
      num: "03",
      title: "Bank Account: AIB",
      urgency: "Week 1",
      urgencyColor: "#6b5a8e",
      summary:
        "You'll need an Irish bank account to receive wages, pay rent, and set up direct debits. AIB is the most student-friendly option. You can open an account entirely on your phone in about 20 minutes.",
      accentGradient: "linear-gradient(135deg, #6040f0, #7ec8ff)",
      detail: (
        <div>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
            AIB (Allied Irish Banks) has a free current account for students and you can verify your identity via a short video call in the app. No branch visit needed.
          </p>
          <Steps steps={[
            { text: "Download the AIB Mobile app and start the account opening process." },
            { text: "Have your passport ready for identity verification." },
            { text: "Complete the video verification call in the app. Takes about 5 minutes." },
            { text: "Enter your Irish address. A one-time code will be posted to that address." },
            { text: "Enter the code in the app. Your account details and debit card arrive by post within about a week." },
          ]} />
          <Tip>
            You need an Irish address to apply. If you&apos;re in student accommodation, use that address. Your card arrives separately. You can use your account details to receive money before the card arrives.
          </Tip>
        </div>
      ),
    },
    {
      num: "04",
      title: "Leap Card: Get It Day One",
      urgency: "Day of arrival",
      urgencyColor: "#7c5cff",
      summary:
        "A Leap card is a reloadable travel card for Dublin buses, the DART train, and the Luas tram. €2 per journey, and trips under 90 minutes are free if you change between buses. Get the student version for 50% off.",
      accentGradient: "linear-gradient(135deg, #b87dff, #7ec8ff)",
      detail: (
        <div>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
            A regular Leap card costs €5 to buy. The Student Leap card gives you 50% off all fares: €2 becomes €1. You need your student ID and UCD email to qualify.
          </p>
          <Steps steps={[
            { text: "Pick up a regular Leap card at the airport, any newsagent, or a Leap vendor (€5, includes €0 credit)." },
            { text: "Top it up immediately. You can do this at the newsagent or at Luas/DART machines." },
            { text: "Go to leapcard.ie to register and upgrade to a Student Leap card using your UCD student ID." },
            { text: "Your upgraded card is posted to you within a week. In the meantime, use the regular card." },
          ]} />
          <Tip>
            Always tap on AND tap off when using the Leap card on Dublin Bus. If you forget to tap off, you you will be charged the maximum fare for that route.
          </Tip>
        </div>
      ),
    },
    {
      num: "05",
      title: "SIM Card: Go with 48",
      urgency: "Day of arrival",
      urgencyColor: "#6b5a8e",
      summary:
        "You need a working Irish number as soon as possible. Banks, IRP offices, and landlords all ask for it. 48 is one of the cheapest options: around €12 to 13 a month for unlimited 5G data, calls, and texts.",
      accentGradient: "linear-gradient(135deg, #c8b8ff, #7c5cff)",
      detail: (
        <div>
          <p style={{ fontSize: "0.87rem", color: "#38285c", lineHeight: 1.65, marginBottom: 14 }}>
            48 is a prepay provider that runs on the Three network, which has strong 5G coverage across Dublin including the UCD campus.
          </p>
          <Steps steps={[
            { text: "Pick up a 48 SIM at any newsagent, Tesco, or the 48 website (free SIM, or delivered by post)." },
            { text: "Insert the SIM and activate it at 48.ie. Takes about 3 minutes." },
            { text: "Top up €12–13 online and select the monthly 5G bundle." },
            { text: "Set up auto-top-up so it renews automatically each month." },
          ]} />
          <Tip>
            Other decent options: GoMo (€9.99/month, unlimited everything), Vodafone PAYG, or Three prepay. 48 and GoMo are consistently the cheapest for students.
          </Tip>
        </div>
      ),
    },
  ];

  return (
    <section
      id="survival"
      className="section-alt"
      style={{ padding: "96px 0" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        {/* Section header */}
        <div ref={headRef} className="reveal" style={{ marginBottom: 56, maxWidth: 680 }}>
          <span className="eyebrow">The stuff nobody tells you</span>
          <h2 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 700,
            color: "#1a0f2e",
            letterSpacing: "-0.03em",
            marginBottom: 14,
            lineHeight: 1.1,
          }}>
            Your first week in Dublin,{" "}
            <em style={{ fontStyle: "italic" }}>sorted.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, maxWidth: 560 }}>
            IRP, PPSN, bank account, Leap card, SIM. Every YouTube guide mentions
            them. None of them explain <em>exactly</em> how to do it, what order to do it
            in, or what trips people up. This does.
          </p>
        </div>

        {/* Cards grid — staggered editorial arrangement.
            On wide screens we drop into a 3-column masonry-ish layout where
            alternating columns are nudged down, giving the section a relaxed,
            magazine-like rhythm instead of a rigid grid. */}
        <div className="survival-grid">
          {cards.map((card, i) => {
            // Column-based vertical offset for the staggered look.
            // (CSS clamps this to 0 on narrow screens via .survival-grid rules.)
            const col = i % 3;
            const offsets = [0, 38, 18];
            return (
              <SurvivalCard
                key={card.num}
                {...card}
                delay={i * 90}
                offset={offsets[col]}
              />
            );
          })}
        </div>

        {/* Bottom note */}
        <div
          style={{
            marginTop: 48,
            background: "white",
            border: "1px solid rgba(124,92,255,0.15)",
            borderRadius: 14,
            padding: "18px 22px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            maxWidth: 620,
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: "rgba(124,92,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: 1,
          }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#7c5cff" }}>!</span>
          </div>
          <p style={{ fontSize: "0.83rem", color: "#38285c", lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: "#1a0f2e" }}>Important:</strong> Information here is for guidance only and was accurate at the time of writing. Always verify
            current requirements at the official government websites. Rules do change.
            When in doubt, ask your international student office at UCD.
          </p>
        </div>

      </div>
    </section>
  );
}
