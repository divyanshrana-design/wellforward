"use client";

import { useEffect, useRef, useState } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, Upload, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const SMURFIT_PROGRAMMES = [
  "MBA",
  "MSc Business Analytics",
  "MSc Project Management",
  "MSc Strategic Management",
  "MSc Management (Corporate Finance)",
  "MSc Management (Marketing)",
  "MSc International Business",
  "MSc Human Resource Management",
  "MSc Supply Chain Management",
  "MSc Finance",
  "MSc Accounting",
  "MSc Digital Marketing",
];

const INTAKE_YEARS = [
  "2025/26",
  "2024/25",
  "2023/24",
  "2022/23 or earlier",
];

const INTERESTS = [
  "Sport", "Music", "Film", "Tech", "Politics", "Art",
  "Travel", "Food", "Gaming", "Books", "Fashion", "Volunteering",
  "Hiking", "Coffee", "Photography", "Running",
];

type Step = 1 | 2 | 3 | 4; // basics → profile → otp → done

export default function JoinPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: "", email: "", programme: "", intakeYear: "", hometown: "",
    bio: "", interests: "", lookingFor: "", photoPreview: "",
  });
  const [otpValue, setOtpValue]   = useState("");
  const [otpError, setOtpError]   = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const toggleInterest = (tag: string) => {
    const current = form.interests ? form.interests.split(",") : [];
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    update("interests", next.join(","));
  };
  const selectedInterests = form.interests ? form.interests.split(",").filter(Boolean) : [];

  const toggleLookingFor = (v: string) => {
    const cur = form.lookingFor ? form.lookingFor.split(",") : [];
    const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
    update("lookingFor", next.join(","));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Photo must be under 5MB"); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => update("photoPreview", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validateEmail = (email: string) => {
    const valid = email.toLowerCase().endsWith("@ucdconnect.ie");
    setEmailValid(email.length > 0 ? valid : null);
    return valid;
  };

  // Routing text based on intake year
  const intakeRoute = form.intakeYear === "2025/26"
    ? { page: "Meet People", desc: "Your profile will appear in the Meet People section so incoming students can find you.", href: "/meet-people" }
    : form.intakeYear
    ? { page: "Ask a Senior", desc: "Since you started before 2025/26, your profile will appear as a Senior Ambassador in the Ask a Senior section.", href: "/ask-a-senior" }
    : null;

  const handleStep1Next = () => {
    if (!validateEmail(form.email)) return;
    setStep(2);
  };

  const handleStep2Next = () => setStep(3);

  const handleSendOtp = () => {
    // UI-only: in production, send OTP via Resend to the UCD email
    setOtpError("");
  };

  const handleVerifyOtp = () => {
    // Demo: any 6-digit code works; in production verify against Resend/DB
    if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      setOtpError("Please enter the 6-digit code from your email.");
      return;
    }
    setStep(4);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #ede8ff", borderRadius: 10,
    fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
    color: "#1a0f2e", background: "white", outline: "none",
    transition: "border-color 0.2s ease", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.8rem", fontWeight: 600, color: "#38285c",
    marginBottom: 6, letterSpacing: "0.01em",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    ((e.target as HTMLElement).style.borderColor = "#7c5cff");
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    ((e.target as HTMLElement).style.borderColor = "#ede8ff");

  const STEP_LABELS = ["Basics", "Profile", "Verify", "Done"];

  /* ─── Submitted / Done ─────────────────── */
  if (step === 4) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px" }}>
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 24,
            padding: "56px 48px", textAlign: "center", maxWidth: 520, width: "100%",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.14)", animation: "scaleIn 0.3s ease",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <CheckCircle2 size={28} color="white" />
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif", fontSize: "2rem",
              fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.03em", marginBottom: 12,
            }}>
              You are in.
            </h2>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 12 }}>
              Welcome, <strong style={{ color: "#7c5cff" }}>{form.name}</strong>.
              Your profile is now live.
            </p>
            {intakeRoute && (
              <div style={{
                background: "rgba(124,92,255,0.06)",
                border: "1px solid rgba(124,92,255,0.15)",
                borderRadius: 12,
                padding: "16px 18px",
                marginBottom: 24,
                textAlign: "left",
              }}>
                <p style={{ fontSize: "0.82rem", color: "#38285c", lineHeight: 1.6 }}>
                  {intakeRoute.desc}
                </p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {intakeRoute && (
                <a
                  href={intakeRoute.href}
                  className="btn-primary"
                  style={{ textDecoration: "none", padding: "12px 24px", fontSize: "0.9rem", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  Go to {intakeRoute.page} <ArrowRight size={14} />
                </a>
              )}
              <a href="/" className="btn-ghost" style={{ textDecoration: "none", padding: "12px 24px", fontSize: "0.9rem", borderRadius: 12, display: "inline-block" }}>
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

      <section style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-10" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }}>

          {/* ─── LEFT: Value prop ─── */}
          <div style={{ paddingTop: 8 }}>
            <span className="eyebrow">Join free</span>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900, color: "#1a0f2e", letterSpacing: "-0.035em",
              lineHeight: 1.05, marginBottom: 20, marginTop: 14,
            }}>
              Be the person you{" "}
              <em className="grad-text" style={{ fontStyle: "italic" }}>needed</em>{" "}
              when you arrived.
            </h1>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Create a free profile and connect with other UCD international students — from the same country, the same course, or just the same boat.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                { title: "Find your people", desc: "Browse students by course, hometown, and interests" },
                { title: "Ask a senior anything", desc: "Get real answers from students a year ahead of you" },
                { title: "Track your first 30 days", desc: "IRP, PPSN, bank, Leap card — sorted" },
                { title: "@ucdconnect.ie only", desc: "Real students only. No bots, no catfishing." },
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

            {/* Intake routing explainer */}
            <div style={{ background: "rgba(124,92,255,0.06)", border: "1px solid rgba(124,92,255,0.14)", borderRadius: 12, padding: "16px 18px" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7c5cff", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Where will your profile appear?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.82rem", color: "#38285c", lineHeight: 1.5 }}>
                  <span style={{ color: "#7c5cff", fontWeight: 700, flexShrink: 0 }}>2025/26</span>
                  <span>You are a new student. Your profile appears in <strong>Meet People</strong> so others can find you.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "0.82rem", color: "#38285c", lineHeight: 1.5 }}>
                  <span style={{ color: "#7c5cff", fontWeight: 700, flexShrink: 0 }}>2024/25 or earlier</span>
                  <span>You are a senior. Your profile appears in <strong>Ask a Senior</strong> so newcomers can reach out.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Multi-step form ─── */}
          <div style={{
            background: "white", border: "1px solid #ede8ff",
            borderRadius: 24, padding: "clamp(24px, 4vw, 40px)",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
          }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
              {STEP_LABELS.map((label, i) => {
                const n = i + 1;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", flex: n < 4 ? "1 0 auto" : "0 0 auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: done || active ? "linear-gradient(135deg, #7c5cff, #c8b8ff)" : "#ede8ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.72rem", fontWeight: 700,
                        color: done || active ? "white" : "#9b8ec8",
                        transition: "all 0.3s ease",
                      }}>
                        {done ? (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : n}
                      </div>
                      <span style={{ fontSize: "0.6rem", color: active ? "#7c5cff" : "#b0a0cc", fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}>
                        {label}
                      </span>
                    </div>
                    {n < 4 && (
                      <div style={{ flex: 1, height: 2, background: step > n ? "#7c5cff" : "#ede8ff", margin: "0 4px", marginBottom: 18, transition: "background 0.3s ease" }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ─── Step 1: Basics ─── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6 }}>The basics</h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>Takes 2 minutes. We only need the essentials.</p>
                </div>

                {/* Photo upload */}
                <div>
                  <label style={labelStyle}>Profile photo (optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: 72, height: 72, borderRadius: 16,
                        background: form.photoPreview ? "transparent" : "rgba(200,184,255,0.3)",
                        border: "2px dashed rgba(124,92,255,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", overflow: "hidden", flexShrink: 0,
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                    >
                      {form.photoPreview
                        ? <img src={form.photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <Camera size={22} style={{ color: "#9b8ec8" }} />
                      }
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-ghost"
                        style={{ padding: "8px 16px", fontSize: "0.82rem", borderRadius: 9, display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <Upload size={13} />
                        {form.photoPreview ? "Change photo" : "Upload photo"}
                      </button>
                      <p style={{ fontSize: "0.7rem", color: "#b0a0cc", marginTop: 5 }}>JPG or PNG, max 5MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} style={{ display: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Full name</label>
                  <input style={inputStyle} type="text" placeholder="Your name" value={form.name}
                    onChange={e => update("name", e.target.value)} required onFocus={focus} onBlur={blur} />
                </div>

                <div>
                  <label style={labelStyle}>UCD email address</label>
                  <div style={{ position: "relative" }}>
                    <input
                      style={{ ...inputStyle, paddingRight: 36, borderColor: emailValid === false ? "#ef4444" : emailValid === true ? "#10b981" : "#ede8ff" }}
                      type="email" placeholder="yourname@ucdconnect.ie"
                      value={form.email}
                      onChange={e => { update("email", e.target.value); validateEmail(e.target.value); }}
                      required onFocus={focus}
                      onBlur={e => { blur(e); validateEmail(form.email); }}
                    />
                    {emailValid === true && (
                      <CheckCircle2 size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#10b981" }} />
                    )}
                    {emailValid === false && (
                      <AlertCircle size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#ef4444" }} />
                    )}
                  </div>
                  {emailValid === false && (
                    <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>Must be a @ucdconnect.ie address</p>
                  )}
                  {emailValid === null && (
                    <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 4 }}>UCD email required. Keeps the community real.</p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Programme</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                      value={form.programme} onChange={e => update("programme", e.target.value)}
                      onFocus={focus} onBlur={blur}
                    >
                      <option value="">Select programme</option>
                      {SMURFIT_PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Intake year</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                      value={form.intakeYear} onChange={e => update("intakeYear", e.target.value)}
                      onFocus={focus} onBlur={blur}
                    >
                      <option value="">Select year</option>
                      {INTAKE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Routing preview */}
                {intakeRoute && (
                  <div style={{ background: "rgba(124,92,255,0.06)", border: "1px solid rgba(124,92,255,0.14)", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: "0.78rem", color: "#38285c", lineHeight: 1.55 }}>
                      <strong style={{ color: "#7c5cff" }}>Your profile will appear in: {intakeRoute.page}.</strong>{" "}
                      {intakeRoute.desc}
                    </p>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Hometown or country</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Mumbai, India"
                    value={form.hometown} onChange={e => update("hometown", e.target.value)}
                    onFocus={focus} onBlur={blur} />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, marginTop: 4, opacity: (!form.name || !form.email || emailValid !== true) ? 0.45 : 1, cursor: (!form.name || !form.email || emailValid !== true) ? "not-allowed" : "pointer" }}
                  onClick={handleStep1Next}
                  disabled={!form.name || !form.email || emailValid !== true}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* ─── Step 2: Profile details ─── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6 }}>Make it yours</h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>This is what other students see when they find your profile.</p>
                </div>

                <div>
                  <label style={labelStyle}>Short bio</label>
                  <textarea
                    style={{ ...inputStyle, height: 88, resize: "none" }}
                    placeholder="Where you are from, what you are studying, what you are into..."
                    value={form.bio} onChange={e => update("bio", e.target.value.slice(0, 220))}
                    onFocus={focus as never} onBlur={blur as never}
                  />
                  <p style={{ fontSize: "0.7rem", color: "#b0a0cc", marginTop: 4 }}>{form.bio.length}/220 characters</p>
                </div>

                <div>
                  <label style={labelStyle}>Interests — pick what applies</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                    {INTERESTS.map(tag => (
                      <button
                        key={tag} type="button" onClick={() => toggleInterest(tag)}
                        style={{
                          padding: "6px 14px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 500, cursor: "pointer",
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
                  <label style={labelStyle}>What are you looking for?</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
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
                          style={{ accentColor: "#7c5cff", width: 15, height: 15 }}
                        />
                        <span style={{ fontSize: "0.85rem", color: "#38285c" }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" className="btn-ghost"
                    style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }}
                    onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary"
                    style={{ flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12 }}
                    onClick={handleStep2Next}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ─── Step 3: OTP verification ─── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6 }}>Verify your email</h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.55 }}>
                    We sent a 6-digit code to{" "}
                    <strong style={{ color: "#7c5cff" }}>{form.email}</strong>.
                    Enter it below to confirm your UCD email.
                  </p>
                </div>

                <div style={{
                  background: "rgba(124,92,255,0.06)",
                  border: "1px solid rgba(124,92,255,0.14)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}>
                  <Mail size={18} style={{ color: "#7c5cff", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a0f2e", marginBottom: 3 }}>Check your inbox</p>
                    <p style={{ fontSize: "0.78rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                      An email with your verification code was sent to your @ucdconnect.ie address. Check your spam folder if you do not see it within a minute.
                    </p>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>6-digit verification code</label>
                  <input
                    style={{
                      ...inputStyle,
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textAlign: "center",
                      color: "#7c5cff",
                      borderColor: otpError ? "#ef4444" : "#ede8ff",
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={otpValue}
                    onChange={e => { setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                    onFocus={focus} onBlur={blur}
                  />
                  {otpError && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>{otpError}</p>}
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: otpValue.length !== 6 ? 0.45 : 1, cursor: otpValue.length !== 6 ? "not-allowed" : "pointer" }}
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length !== 6}
                >
                  Verify and create profile
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "#9b8ec8", textAlign: "center" }}
                >
                  Did not receive a code? Resend
                </button>

                <button type="button" className="btn-ghost"
                  style={{ padding: "10px", fontSize: "0.88rem", borderRadius: 10 }}
                  onClick={() => setStep(2)}>
                  Back
                </button>

                <p style={{ fontSize: "0.72rem", color: "#9b8ec8", textAlign: "center", lineHeight: 1.5 }}>
                  By joining you agree to keep the community respectful and real. No spam, no hate. Just students helping students.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
