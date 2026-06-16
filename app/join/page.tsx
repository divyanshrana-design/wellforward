"use client";

import { useEffect, useState, useRef } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PROGRAMMES } from "@/lib/data";
import { Camera, Mail, Check, ArrowRight, ArrowLeft, Users, GraduationCap } from "lucide-react";

const INTAKE_YEARS = ["2025/26", "2024/25", "2023/24", "2022/23 or earlier"];
const ALL_PROGRAMMES = Object.values(PROGRAMMES).flat();

const INTERESTS = [
  "Sport", "Music", "Film", "Tech", "Politics", "Art",
  "Travel", "Food", "Gaming", "Books", "Fashion", "Volunteering",
  "Running", "Hiking", "Coffee", "Photography",
];

type Step = 1 | 2 | 3;

export default function JoinPage() {
  const [step, setStep]           = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent]     = useState(false);
  const [otpError, setOtpError]   = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    programme: "",
    intakeYear: "",
    hometown: "",
    bio: "",
    interests: [] as string[],
    lookingFor: [] as string[],
  });

  useEffect(() => {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = false;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) {
      document.addEventListener("pointermove", e => {
        tx = e.clientX; ty = e.clientY;
        glow.classList.add("active");
        if (!raf) { raf = true; requestAnimationFrame(loop); }
      });
    }
    function loop() {
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) requestAnimationFrame(loop);
      else raf = false;
    }
    return () => { document.body.removeChild(glow); };
  }, []);

  const update = (k: keyof typeof form, v: string | string[]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (tag: string) =>
    update("interests", form.interests.includes(tag)
      ? form.interests.filter(t => t !== tag)
      : [...form.interests, tag]);

  const toggleLookingFor = (v: string) =>
    update("lookingFor", form.lookingFor.includes(v)
      ? form.lookingFor.filter(x => x !== v)
      : [...form.lookingFor, v]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Send OTP
  const sendOtp = () => {
    if (!form.email.endsWith("@ucdconnect.ie")) return;
    setOtpSent(true);
    setOtpError(false);
  };

  // Verify OTP (mock: any 6-digit code works for demo)
  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length === 6 && /^\d+$/.test(code)) {
      setSubmitted(true);
    } else {
      setOtpError(true);
    }
  };

  // OTP input handling
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleOtpChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  // Intake routing label
  const getRoutingLabel = () => {
    if (!form.intakeYear) return null;
    const isCurrent = form.intakeYear === "2025/26";
    return {
      page: isCurrent ? "Meet People" : "Ask a Senior",
      icon: isCurrent ? <Users size={14} /> : <GraduationCap size={14} />,
      desc: isCurrent
        ? "Your profile will appear on the Meet People page where new students can find you."
        : "Your profile will appear on the Ask a Senior page where incoming students can reach out to you.",
      color: isCurrent ? "#0ea5e9" : "#7c5cff",
    };
  };

  const routing = getRoutingLabel();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #ede8ff",
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    color: "#1a0f2e",
    background: "white",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#38285c",
    marginBottom: 6,
    letterSpacing: "0.01em",
  };

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px" }}>
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 24,
            padding: "56px 48px", textAlign: "center", maxWidth: 520, width: "100%",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.14)",
            animation: "scaleIn 0.3s ease",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Check size={28} color="white" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.03em", marginBottom: 12 }}>
              You are in.
            </h2>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 12 }}>
              Welcome to Wellforward, {form.name.split(" ")[0]}.
            </p>
            {routing && (
              <div style={{
                background: `rgba(${routing.color === "#0ea5e9" ? "14,165,233" : "124,92,255"},0.06)`,
                border: `1px solid rgba(${routing.color === "#0ea5e9" ? "14,165,233" : "124,92,255"},0.18)`,
                borderRadius: 12, padding: "14px 18px", marginBottom: 24,
                display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              }}>
                <span style={{ color: routing.color }}>{routing.icon}</span>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a0f2e", marginBottom: 3 }}>
                    Profile going to: {routing.page}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    {routing.desc}
                  </div>
                </div>
              </div>
            )}
            <p style={{ fontSize: "0.82rem", color: "#9b8ec8" }}>
              Your profile is now live. Other UCD students can find you and get in touch.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ─── OTP screen ─── */
  if (otpSent) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px" }}>
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 24,
            padding: "clamp(32px,5vw,48px)", maxWidth: 440, width: "100%",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
            animation: "scaleIn 0.25s ease",
          }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Mail size={22} color="white" />
              </div>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", marginBottom: 8 }}>
                Check your email
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#6b5a8e", lineHeight: 1.6 }}>
                We sent a 6-digit code to{" "}
                <strong style={{ color: "#7c5cff" }}>{form.email}</strong>.
                Enter it below to verify your UCD address.
              </p>
            </div>

            {/* OTP boxes */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: 46, height: 54,
                    textAlign: "center",
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#1a0f2e",
                    border: `2px solid ${otpError ? "#ef4444" : digit ? "#7c5cff" : "#ede8ff"}`,
                    borderRadius: 10,
                    background: digit ? "rgba(124,92,255,0.05)" : "white",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#ef4444", marginBottom: 12 }}>
                That code does not match. Please try again.
              </p>
            )}

            <button
              onClick={verifyOtp}
              className="btn-primary"
              style={{ width: "100%", padding: "13px", fontSize: "0.95rem", borderRadius: 12, marginBottom: 14 }}
            >
              Verify and finish
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setOtpSent(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "#9b8ec8", textDecoration: "underline" }}
              >
                Go back and change email
              </button>
            </div>

            <p style={{ fontSize: "0.7rem", color: "#b0a0cc", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
              Tip: enter any 6 digits for this demo. In production, a real OTP would be emailed via Resend.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  /* ─── Main form ─── */
  const STEPS = [
    { num: 1, label: "Basics" },
    { num: 2, label: "Your profile" },
    { num: 3, label: "Verify" },
  ];

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <section style={{ paddingTop: 96, paddingBottom: 96, padding: "96px 20px" }}>
        <div
          className="max-w-6xl mx-auto"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,80px)", alignItems: "start" }}
        >

          {/* ─── LEFT: Value prop ─── */}
          <div style={{ paddingTop: 8 }}>
            <span className="eyebrow">Join free</span>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.4rem,5vw,3.8rem)",
              fontWeight: 900,
              color: "#1a0f2e",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              marginBottom: 20,
              marginTop: 14,
            }}>
              Be the person you{" "}
              <em className="grad-text" style={{ fontStyle: "italic" }}>needed</em>{" "}
              when you arrived.
            </h1>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Create a free profile and connect with other UCD international students. Find someone from the same country, same course, or just the same boat.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Find your people", desc: "Browse students by course, hometown, and interests" },
                { title: "Ask a senior anything", desc: "Get real answers from students a year ahead of you" },
                { title: "Track your first 30 days", desc: "IRP, PPSN, bank, Leap card — all in one place" },
                { title: "@ucdconnect.ie verified", desc: "Real students only. No bots, no strangers from the internet" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Check size={12} color="white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a0f2e", marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#6b5a8e", lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: "16px 20px", background: "rgba(124,92,255,0.06)", border: "1px solid rgba(124,92,255,0.14)", borderRadius: 12, maxWidth: 400 }}>
              <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                &ldquo;I found my two closest friends here within the first week. We were all from completely different countries but in the same MSc programme.&rdquo;
              </p>
              <div style={{ marginTop: 10, fontSize: "0.75rem", color: "#9b8ec8", fontWeight: 600 }}>
                Ananya, MSc Data Analytics, India
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Multi-step form ─── */}
          <div style={{
            background: "white",
            border: "1px solid #ede8ff",
            borderRadius: 24,
            padding: "clamp(24px,4vw,40px)",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
          }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
              {STEPS.map((s, idx) => (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: step > s.num ? "linear-gradient(135deg,#10b981,#34d399)" : step === s.num ? "linear-gradient(135deg,#7c5cff,#c8b8ff)" : "#ede8ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 700,
                    color: step >= s.num ? "white" : "#9b8ec8",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}>
                    {step > s.num ? <Check size={13} /> : s.num}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: step === s.num ? "#7c5cff" : "#9b8ec8", fontWeight: step === s.num ? 600 : 400, display: idx < STEPS.length - 1 ? undefined : undefined }}>
                    {s.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: 20, height: 2, borderRadius: 1, background: step > s.num ? "#7c5cff" : "#ede8ff", transition: "background 0.3s ease" }} />
                  )}
                </div>
              ))}
            </div>

            {/* ── Step 1: Basics ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "scaleIn 0.2s ease" }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 4 }}>
                    The basics
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    Takes 2 minutes. We only need the essentials.
                  </p>
                </div>

                {/* Photo upload */}
                <div>
                  <label style={labelStyle}>Profile photo (optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      onClick={() => fileRef.current?.click()}
                      style={{
                        width: 64, height: 64, borderRadius: "50%",
                        border: "2px dashed rgba(124,92,255,0.35)",
                        background: avatarPreview ? "transparent" : "rgba(124,92,255,0.05)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0, overflow: "hidden",
                        transition: "border-color 0.2s ease, background 0.2s ease",
                      }}
                    >
                      {avatarPreview
                        ? <img src={avatarPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <Camera size={22} style={{ color: "#9b8ec8" }} />
                      }
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.82rem", color: "#7c5cff", fontWeight: 600, padding: 0, marginBottom: 4, display: "block" }}
                      >
                        {avatarPreview ? "Change photo" : "Upload a photo"}
                      </button>
                      <span style={{ fontSize: "0.72rem", color: "#b0a0cc" }}>JPG or PNG. Shown on your profile.</span>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Full name</label>
                  <input
                    style={inputStyle} type="text" placeholder="Your name"
                    value={form.name} onChange={e => update("name", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#7c5cff")}
                    onBlur={e => (e.target.style.borderColor = "#ede8ff")}
                  />
                </div>

                <div>
                  <label style={labelStyle}>UCD email address</label>
                  <input
                    style={inputStyle} type="email" placeholder="yourname@ucdconnect.ie"
                    value={form.email} onChange={e => update("email", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#7c5cff")}
                    onBlur={e => (e.target.style.borderColor = "#ede8ff")}
                  />
                  <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 5 }}>
                    UCD email required. This keeps the community real.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Programme</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.programme}
                      onChange={e => update("programme", e.target.value)}
                    >
                      <option value="">Select programme</option>
                      {ALL_PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Intake year</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.intakeYear}
                      onChange={e => update("intakeYear", e.target.value)}
                    >
                      <option value="">Select year</option>
                      {INTAKE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Routing preview */}
                {routing && (
                  <div style={{
                    background: `rgba(${routing.color === "#0ea5e9" ? "14,165,233" : "124,92,255"},0.06)`,
                    border: `1px solid rgba(${routing.color === "#0ea5e9" ? "14,165,233" : "124,92,255"},0.18)`,
                    borderRadius: 10, padding: "12px 14px",
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                    <span style={{ color: routing.color, flexShrink: 0, marginTop: 1 }}>{routing.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1a0f2e", marginBottom: 2 }}>
                        Your profile will appear on: {routing.page}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                        {routing.desc}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Hometown / Country</label>
                  <input
                    style={inputStyle} type="text" placeholder="e.g. Mumbai, India"
                    value={form.hometown} onChange={e => update("hometown", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#7c5cff")}
                    onBlur={e => (e.target.style.borderColor = "#ede8ff")}
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12 }}
                  onClick={() => setStep(2)}
                  disabled={!form.name || !form.email || !form.intakeYear}
                >
                  Continue <ArrowRight size={15} style={{ display: "inline", marginLeft: 6, verticalAlign: "middle" }} />
                </button>
              </div>
            )}

            {/* ── Step 2: Profile ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "scaleIn 0.2s ease" }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 4 }}>
                    Make it yours
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    This is what other students see on your profile.
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Short bio</label>
                  <textarea
                    style={{ ...inputStyle, height: 90, resize: "none" }}
                    placeholder="Tell others a bit about yourself. Where you are from, what you are studying, what you are into..."
                    value={form.bio} onChange={e => update("bio", e.target.value.slice(0, 220))}
                    onFocus={e => (e.target.style.borderColor = "#7c5cff")}
                    onBlur={e => (e.target.style.borderColor = "#ede8ff")}
                  />
                  <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 4, textAlign: "right" }}>
                    {form.bio.length}/220
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Interests: pick what applies</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                    {INTERESTS.map(tag => (
                      <button
                        key={tag} type="button"
                        onClick={() => toggleInterest(tag)}
                        style={{
                          padding: "6px 14px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 500,
                          cursor: "pointer",
                          border: form.interests.includes(tag) ? "1.5px solid #7c5cff" : "1.5px solid #ede8ff",
                          background: form.interests.includes(tag) ? "rgba(124,92,255,0.1)" : "white",
                          color: form.interests.includes(tag) ? "#7c5cff" : "#6b5a8e",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>What are you looking for?</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                    {[
                      { v: "friends",   label: "Friends to hang out with" },
                      { v: "study",     label: "Study partners" },
                      { v: "flatmates", label: "Flatmates or housing tips" },
                      { v: "advice",    label: "Practical advice about Dublin" },
                    ].map(opt => (
                      <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={form.lookingFor.includes(opt.v)}
                          onChange={() => toggleLookingFor(opt.v)}
                          style={{ accentColor: "#7c5cff", width: 15, height: 15, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#38285c" }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" className="btn-ghost" style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }} onClick={() => setStep(1)}>
                    <ArrowLeft size={15} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12 }}
                    onClick={() => setStep(3)}
                  >
                    Continue <ArrowRight size={15} style={{ display: "inline", marginLeft: 6, verticalAlign: "middle" }} />
                  </button>
                </div>

                <p style={{ fontSize: "0.72rem", color: "#9b8ec8", textAlign: "center", lineHeight: 1.5 }}>
                  By joining you agree to keep the community respectful and real. No spam, no hate.
                </p>
              </div>
            )}

            {/* ── Step 3: Verify ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "scaleIn 0.2s ease" }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 4 }}>
                    Verify your email
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    We will send a one-time code to your @ucdconnect.ie address to confirm you are a real UCD student.
                  </p>
                </div>

                <div style={{
                  background: "rgba(124,92,255,0.04)",
                  border: "1px solid rgba(124,92,255,0.14)",
                  borderRadius: 12,
                  padding: "16px 18px",
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#38285c", marginBottom: 4 }}>
                    Sending verification code to:
                  </p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#7c5cff" }}>
                    {form.email}
                  </p>
                </div>

                {/* Profile summary */}
                <div style={{ background: "rgba(245,241,255,0.6)", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", color: "#9b8ec8", textTransform: "uppercase", marginBottom: 10 }}>
                    Your profile preview
                  </p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: avatarPreview ? "transparent" : "linear-gradient(135deg,#7c5cff,#c8b8ff)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden", flexShrink: 0,
                      color: "white", fontWeight: 700, fontSize: "0.85rem",
                    }}>
                      {avatarPreview
                        ? <img src={avatarPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : form.name.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a0f2e" }}>{form.name || "Your name"}</div>
                      <div style={{ fontSize: "0.72rem", color: "#9b8ec8" }}>{form.programme || "Programme"} · {form.intakeYear || "Intake"}</div>
                    </div>
                  </div>
                  {form.bio && <p style={{ fontSize: "0.78rem", color: "#3d2f60", lineHeight: 1.5 }}>{form.bio.slice(0, 100)}{form.bio.length > 100 ? "..." : ""}</p>}
                  {routing && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: routing.color }}>{routing.icon}</span>
                      <span style={{ fontSize: "0.72rem", color: "#6b5a8e" }}>Will appear on: <strong>{routing.page}</strong></span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" className="btn-ghost" style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }} onClick={() => setStep(2)}>
                    <ArrowLeft size={15} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12 }}
                    onClick={sendOtp}
                    disabled={!form.email.endsWith("@ucdconnect.ie")}
                  >
                    <Mail size={15} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                    Send verification code
                  </button>
                </div>

                {!form.email.endsWith("@ucdconnect.ie") && (
                  <p style={{ fontSize: "0.72rem", color: "#ef4444", textAlign: "center" }}>
                    Your email must end in @ucdconnect.ie
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
