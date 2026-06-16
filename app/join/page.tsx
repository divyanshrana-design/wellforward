"use client";

import { useEffect, useState, useRef } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, Mail, ArrowRight, Check, RefreshCw } from "lucide-react";
import { PROGRAMMES, SCHOOLS } from "@/lib/data";

const INTAKE_YEARS = ["2026/27", "2025/26", "2024/25", "2023/24", "2022/23"];
const isMeetPeople = (y: string) => y === "2026/27";

const INTERESTS = [
  "Sport", "Music", "Film", "Tech", "Politics", "Art",
  "Travel", "Food", "Gaming", "Books", "Fashion", "Volunteering",
  "Hiking", "Coffee", "Photography", "Yoga", "Running", "Cycling",
];

/* ─── OTP digit input ──────────────────────────────────────── */
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const next = digits.map((d, idx) => idx === i ? "" : d).join("");
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const char = v.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, idx) => idx === i ? char : d).join("");
    onChange(next);
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    if (pasted.length === 6) inputs.current[5]?.focus();
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 44, height: 52,
            border: digits[i] ? "2px solid #7c5cff" : "1.5px solid #ede8ff",
            borderRadius: 10,
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#1a0f2e",
            background: digits[i] ? "rgba(124,92,255,0.06)" : "white",
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
            fontFamily: "'Fraunces', Georgia, serif",
          }}
          onFocus={e => e.target.select()}
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─── Photo upload widget ───────────────────────────────────── */
function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          width: 88, height: 88,
          borderRadius: "50%",
          border: value ? "3px solid #7c5cff" : "2px dashed rgba(124,92,255,0.35)",
          background: value ? "transparent" : "rgba(200,184,255,0.15)",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          transition: "border-color 0.2s",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Upload profile photo"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Profile preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Camera size={26} style={{ color: "#9b8ec8" }} />
        )}
        {/* Hover overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "rgba(124,92,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s",
            borderRadius: "50%",
          }}
          className="photo-hover"
        >
          <Camera size={18} color="white" />
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
        aria-hidden="true"
      />
      <p style={{ fontSize: "0.72rem", color: "#9b8ec8", textAlign: "center" }}>
        {value ? "Tap to change photo" : "Add a photo (optional)"}
      </p>
    </div>
  );
}

/* ─── Step indicator ────────────────────────────────────────── */
function StepDots({ step, total }: { step: number; total: number }) {
  const labels = ["The basics", "Your profile", "Verify email"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: step > i + 1
              ? "linear-gradient(135deg, #10b981, #34d399)"
              : step === i + 1
              ? "linear-gradient(135deg, #7c5cff, #c8b8ff)"
              : "#ede8ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 700,
            color: step >= i + 1 ? "white" : "#9b8ec8",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}>
            {step > i + 1 ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div style={{
              width: 28, height: 2, borderRadius: 1,
              background: step > i + 1 ? "#7c5cff" : "#ede8ff",
              transition: "background 0.3s ease",
            }} />
          )}
        </div>
      ))}
      <span style={{ marginLeft: 6, fontSize: "0.75rem", color: "#9b8ec8", fontFamily: "'Inter', sans-serif" }}>
        {labels[(step - 1) % labels.length]}
      </span>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function JoinPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = success
  const [form, setForm] = useState({
    name: "", email: "", programme: "", school: "Smurfit Business School",
    intakeYear: "", hometown: "",
    photo: "",
    interests: "",
    bio: "", lookingFor: "",
  });
  const [otp, setOtp]           = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [apiLoading, setApiLoading]   = useState(false);
  const [apiError, setApiError]       = useState("");

  // Cursor glow effect
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

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const selectedInterests = form.interests ? form.interests.split(",").filter(Boolean) : [];
  const toggleInterest = (tag: string) => {
    const next = selectedInterests.includes(tag)
      ? selectedInterests.filter(t => t !== tag)
      : [...selectedInterests, tag];
    update("interests", next.join(","));
  };

  const isUcdEmail = (email: string) =>
    email.toLowerCase().endsWith("@ucdconnect.ie") || email.toLowerCase().endsWith("@ucd.ie");

  const sendOtp = async () => {
    if (!isUcdEmail(form.email)) return;
    setApiLoading(true);
    setOtpError("");
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send code.');
      setOtpSent(true);
      setResendTimer(60);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send code.');
    } finally {
      setApiLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.replace(/\D/g, '').length < 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }
    setApiLoading(true);
    setOtpError('');
    try {
      // Step 1 — verify OTP
      const verifyRes = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Invalid code.');

      // Step 2 — register profile
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          programme: form.programme,
          school: form.school,
          intakeYear: form.intakeYear,
          hometown: form.hometown,
          bio: form.bio,
          interests: form.interests,
          lookingFor: form.lookingFor,
          photo: form.photo,
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error ?? 'Failed to save profile.');

      setStep(4);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setApiLoading(false);
    }
  };

  // Intake-based routing label
  const intakeLabel = isMeetPeople(form.intakeYear)
    ? "You will appear on the Meet People page."
    : form.intakeYear !== ""
    ? "You will appear on the Ask a Senior page."
    : null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #ede8ff", borderRadius: 10,
    fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
    color: "#1a0f2e", background: "white", outline: "none",
    transition: "border-color 0.2s ease", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.8rem", fontWeight: 600,
    color: "#38285c", marginBottom: 6, letterSpacing: "0.01em",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#7c5cff");
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#ede8ff");

  /* ── Success screen ── */
  if (step === 4) {
    const isFresh = isMeetPeople(form.intakeYear);
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
              width: form.photo ? 80 : 64, height: form.photo ? 80 : 64,
              borderRadius: "50%",
              background: form.photo ? "transparent" : "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              overflow: "hidden",
              border: form.photo ? "3px solid #7c5cff" : "none",
            }}>
              {form.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Check size={28} color="white" />
              )}
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "2rem", fontWeight: 700, color: "#1a0f2e",
              letterSpacing: "-0.03em", marginBottom: 10,
            }}>
              Welcome, {form.name.split(" ")[0]}
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#38285c", lineHeight: 1.7, marginBottom: 20 }}>
              Your profile is live. You are now part of the Wellforward community.
            </p>

            {/* Routing card */}
            <div style={{
              background: isFresh ? "rgba(124,92,255,0.07)" : "rgba(16,185,129,0.07)",
              border: `1px solid ${isFresh ? "rgba(124,92,255,0.2)" : "rgba(16,185,129,0.2)"}`,
              borderRadius: 12, padding: "14px 18px", marginBottom: 24, textAlign: "left",
            }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: isFresh ? "#5a3ee8" : "#065f46", marginBottom: 4 }}>
                {isFresh ? `${form.intakeYear} intake` : "Alumni / Senior"}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6 }}>
                {isFresh
                  ? "Your profile will show up on the Meet People page so other incoming students can find you."
                  : "Your profile will show up on the Ask a Senior page where new students can reach out for advice."}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={isFresh ? "/meet-people" : "/ask-a-senior"}
                className="btn-primary"
                style={{ textDecoration: "none", padding: "12px 24px", fontSize: "0.9rem", borderRadius: 12 }}
              >
                {isFresh ? "See Meet People →" : "See Ask a Senior →"}
              </a>
              <a
                href="/"
                className="btn-ghost"
                style={{ textDecoration: "none", padding: "11px 20px", fontSize: "0.9rem", borderRadius: 12, display: "inline-block" }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <section style={{ paddingTop: 96, paddingBottom: 96, padding: "96px 20px" }}>
        <div className="max-w-6xl mx-auto" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "start",
        }}>

          {/* ─── LEFT: Value prop ─── */}
          <div style={{ paddingTop: 8 }}>
            <span className="eyebrow">Join free</span>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900, color: "#1a0f2e",
              letterSpacing: "-0.035em", lineHeight: 1.05,
              marginBottom: 20, marginTop: 14,
            }}>
              Be the person you{" "}
              <em className="grad-text" style={{ fontStyle: "italic" }}>needed</em>{" "}
              when you arrived.
            </h1>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Create a free profile and connect with other UCD international students. Same course, same country, or just the same boat.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Find your people", desc: "Browse students by course, hometown, and interests" },
                { title: "Ask a senior anything", desc: "Get real answers from students a year ahead of you" },
                { title: "Track your first 30 days", desc: "Personal checklist: IRP, PPSN, bank, Leap card" },
                { title: "@ucdconnect.ie verified", desc: "Real students only. No bots, no catfishing." },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l4 4 6-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a0f2e", marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "#6b5a8e", lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 40, padding: "16px 20px",
              background: "rgba(124,92,255,0.06)",
              border: "1px solid rgba(124,92,255,0.14)",
              borderRadius: 12, maxWidth: 400,
            }}>
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
            background: "white", border: "1px solid #ede8ff",
            borderRadius: 24, padding: "clamp(24px, 4vw, 40px)",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
          }}>
            <StepDots step={step} total={3} />

            {/* ── STEP 1: The basics ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6 }}>
                    The basics
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    Takes 2 minutes. Your UCD email is required for verification.
                  </p>
                </div>

                {/* Photo upload */}
                <PhotoUpload value={form.photo} onChange={v => update("photo", v)} />

                <div>
                  <label style={labelStyle}>Full name</label>
                  <input style={inputStyle} type="text" placeholder="Your name"
                    value={form.name} onChange={e => update("name", e.target.value)}
                    required onFocus={focus} onBlur={blur} />
                </div>

                <div>
                  <label style={labelStyle}>UCD email address</label>
                  <input style={inputStyle} type="email" placeholder="yourname@ucdconnect.ie"
                    value={form.email} onChange={e => update("email", e.target.value)}
                    required onFocus={focus} onBlur={blur} />
                  {form.email && !isUcdEmail(form.email) && (
                    <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>
                      UCD email required (@ucdconnect.ie or @ucd.ie)
                    </p>
                  )}
                  {form.email && isUcdEmail(form.email) && (
                    <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={11} /> Looks good
                    </p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Programme</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.programme}
                      onChange={e => update("programme", e.target.value)}
                      onFocus={focus} onBlur={blur}
                    >
                      <option value="">Select programme</option>
                      {(PROGRAMMES[form.school] ?? []).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Intake year</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.intakeYear}
                      onChange={e => update("intakeYear", e.target.value)}
                      onFocus={focus} onBlur={blur}
                    >
                      <option value="">Select year</option>
                      {INTAKE_YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Intake routing hint */}
                {intakeLabel && (
                  <div style={{
                    background: isMeetPeople(form.intakeYear) ? "rgba(124,92,255,0.07)" : "rgba(16,185,129,0.07)",
                    border: `1px solid ${isMeetPeople(form.intakeYear) ? "rgba(124,92,255,0.2)" : "rgba(16,185,129,0.2)"}`,

                    borderRadius: 10, padding: "10px 14px",
                    fontSize: "0.78rem",
                    color: isMeetPeople(form.intakeYear) ? "#5a3ee8" : "#065f46",
                    display: "flex", alignItems: "center", gap: 7,
                  }}>
                    <ArrowRight size={13} />
                    {intakeLabel}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Hometown / Country</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Mumbai, India"
                    value={form.hometown} onChange={e => update("hometown", e.target.value)}
                    onFocus={focus} onBlur={blur} />
                </div>

                <button
                  type="button" className="btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, marginTop: 4 }}
                  onClick={() => setStep(2)}
                  disabled={!form.name || !isUcdEmail(form.email) || apiLoading}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ── STEP 2: Profile ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6 }}>
                    Make it yours
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    This is what other students see on your profile.
                  </p>
                </div>

                <div>
                  <label style={labelStyle}>Interests — pick what applies</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                    {INTERESTS.map(tag => (
                      <button
                        key={tag} type="button"
                        onClick={() => toggleInterest(tag)}
                        style={{
                          padding: "6px 14px", borderRadius: 999,
                          fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
                          border: selectedInterests.includes(tag) ? "1.5px solid #7c5cff" : "1.5px solid #ede8ff",
                          background: selectedInterests.includes(tag) ? "rgba(124,92,255,0.1)" : "white",
                          color: selectedInterests.includes(tag) ? "#7c5cff" : "#6b5a8e",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Short bio</label>
                  <textarea
                    style={{ ...inputStyle, height: 90, resize: "none" }}
                    placeholder="Where you're from, what you're studying, what you're into..."
                    value={form.bio} onChange={e => update("bio", e.target.value.slice(0, 220))}
                    onFocus={focus} onBlur={blur}
                  />
                  <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 3, textAlign: "right" }}>
                    {form.bio.length}/220
                  </p>
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
                          onChange={() => {
                            const cur = form.lookingFor ? form.lookingFor.split(",") : [];
                            const next = cur.includes(opt.v) ? cur.filter(x => x !== opt.v) : [...cur, opt.v];
                            update("lookingFor", next.join(","));
                          }}
                          style={{ accentColor: "#7c5cff", width: 15, height: 15, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#38285c" }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" className="btn-ghost"
                    style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button type="button" className="btn-primary"
                    style={{ flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: apiLoading ? 0.7 : 1 }}
                    onClick={async () => { await sendOtp(); setStep(3); }}
                    disabled={apiLoading}
                  >
                    {apiLoading ? 'Sending…' : 'Send verification code →'}
                  </button>
                </div>

                <p style={{ fontSize: "0.72rem", color: "#9b8ec8", textAlign: "center", lineHeight: 1.5 }}>
                  By joining you agree to keep the community respectful and real. No spam, no hate.
                </p>
              </div>
            )}

            {/* ── STEP 3: OTP verification ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <Mail size={22} color="white" />
                  </div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 8 }}>
                    Check your email
                  </h2>
                  <p style={{ fontSize: "0.88rem", color: "#6b5a8e", lineHeight: 1.6 }}>
                    We sent a 6-digit code to{" "}
                    <strong style={{ color: "#7c5cff" }}>{form.email}</strong>.
                    Enter it below to verify your UCD address.
                  </p>
                </div>

                <OtpInput value={otp} onChange={setOtp} />

                {otpError && (
                  <p style={{ fontSize: "0.78rem", color: "#ef4444", textAlign: "center" }}>{otpError}</p>
                )}

                {apiError && (
                  <p style={{ fontSize: "0.78rem", color: "#ef4444", textAlign: "center" }}>{apiError}</p>
                )}

                <button
                  type="button" className="btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: apiLoading ? 0.7 : 1 }}
                  onClick={verifyOtp}
                  disabled={otp.replace(/\D/g, '').length < 6 || apiLoading}
                >
                  {apiLoading ? 'Creating your profile…' : 'Verify and create profile'}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => { sendOtp(); }}
                    disabled={resendTimer > 0 || apiLoading}
                    style={{
                      background: "none", border: "none", cursor: resendTimer > 0 ? "default" : "pointer",
                      fontSize: "0.78rem", color: resendTimer > 0 ? "#b0a0cc" : "#7c5cff",
                      display: "flex", alignItems: "center", gap: 5,
                    }}
                  >
                    <RefreshCw size={12} />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                  </button>
                  <span style={{ color: "#ede8ff" }}>·</span>
                  <button type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "#9b8ec8" }}
                    onClick={() => setStep(1)}
                  >
                    Change email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
