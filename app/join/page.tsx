"use client";

import { useEffect, useState, useRef } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Camera, Mail, ArrowRight, Check, RefreshCw, Lock, Eye, EyeOff,
  GraduationCap, User, BookOpen, MapPin, Globe,
} from "lucide-react";
import { PROGRAMMES, SCHOOLS } from "@/lib/data";
import { compressImage } from "@/lib/image";

const INTAKE_YEARS = ["2026/27", "2025/26", "2024/25", "2023/24", "2022/23"];
const isMeetPeople = (y: string) => y === "2026/27";

const FACULTY_TITLES = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Dr.",
  "Adjunct Professor",
  "Lecturer",
  "Senior Lecturer",
];

const INTERESTS = [
  "Sport", "Music", "Film", "Tech", "Politics", "Art",
  "Travel", "Food", "Gaming", "Books", "Fashion", "Volunteering",
  "Hiking", "Coffee", "Photography", "Yoga", "Running", "Cycling",
];

/* ─── OTP digit input ──────────────────────────────────────── */
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const target = digits[i] ? i : Math.max(0, i - 1);
      const next = digits.map((d, idx) => (idx === target ? "" : d)).join("");
      onChange(next);
      if (i > 0 && !digits[i]) inputs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const char = v.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, idx) => (idx === i ? char : d)).join("");
    onChange(next);
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = ev => { if (ev.target?.result) onChange(ev.target.result as string); };
      reader.readAsDataURL(file);
    }
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
          <img src={value} alt="Profile preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Camera size={26} style={{ color: "#9b8ec8" }} />
        )}
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
function StepDots({ step, total, isFaculty }: { step: number; total: number; isFaculty: boolean }) {
  const labels = isFaculty
    ? ["The basics", "Your profile", "Verify email"]
    : ["The basics", "Your profile", "Verify email"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: step > i + 1
              ? "linear-gradient(135deg, #10b981, #34d399)"
              : step === i + 1
              ? isFaculty
                ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
                : "linear-gradient(135deg, #7c5cff, #c8b8ff)"
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
              background: step > i + 1 ? (isFaculty ? "#0ea5e9" : "#7c5cff") : "#ede8ff",
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

/* ─── Account type selector ─────────────────────────────────── */
function AccountTypeSelector({
  value,
  onChange,
}: {
  value: "student" | "faculty";
  onChange: (v: "student" | "faculty") => void;
}) {
  const options = [
    {
      id: "student" as const,
      icon: <User size={20} />,
      label: "I&apos;m a student",
      desc: "UCD international student — connect with others, track admin tasks, ask seniors.",
      color: "#7c5cff",
      bg: "rgba(124,92,255,0.06)",
      border: "rgba(124,92,255,0.25)",
    },
    {
      id: "faculty" as const,
      icon: <GraduationCap size={20} />,
      label: "I&apos;m faculty",
      desc: "UCD Smurfit professor or lecturer — list your modules so students can find and reach out to you.",
      color: "#0ea5e9",
      bg: "rgba(14,165,233,0.06)",
      border: "rgba(14,165,233,0.25)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#38285c", marginBottom: 2 }}>
        Which best describes you?
      </p>
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          style={{
            display: "flex", gap: 14, alignItems: "flex-start",
            padding: "14px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
            border: `2px solid ${value === opt.id ? opt.border : "#ede8ff"}`,
            background: value === opt.id ? opt.bg : "white",
            transition: "all 0.18s ease",
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: value === opt.id ? opt.bg : "rgba(200,184,255,0.15)",
            border: `1.5px solid ${value === opt.id ? opt.border : "#ede8ff"}`,
            color: value === opt.id ? opt.color : "#9b8ec8",
            transition: "all 0.18s",
          }}>
            {opt.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.92rem",
              fontWeight: 700, color: value === opt.id ? opt.color : "#1a0f2e",
              marginBottom: 3, transition: "color 0.18s",
            }}
              dangerouslySetInnerHTML={{ __html: opt.label }}
            />
            <div style={{ fontSize: "0.78rem", color: "#6b5a8e", lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: opt.desc }}
            />
          </div>
          {value === opt.id && (
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2,
              background: opt.color,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check size={11} color="white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */
export default function JoinPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = success
  const [accountType, setAccountType] = useState<"student" | "faculty">("student");
  const isFaculty = accountType === "faculty";

  const [form, setForm] = useState({
    name: "", email: "", password: "", repeatPassword: "",
    programme: "", school: "Smurfit Business School",
    intakeYear: "", hometown: "",
    photo: "",
    interests: "",
    bio: "", lookingFor: "",
    linkedin: "", instagram: "", contactEmail: "",
    // Faculty-specific
    facultyTitle: "",
    facultyModules: "", // comma-separated
    facultyOffice: "",
    facultyWebsite: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp]           = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [apiLoading, setApiLoading]   = useState(false);
  const [apiError, setApiError]       = useState("");
  // Faculty modules as an array for easier editing
  const [moduleInput, setModuleInput] = useState("");

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

  // Faculty modules helpers
  const modules = form.facultyModules ? form.facultyModules.split(",").map(m => m.trim()).filter(Boolean) : [];
  const addModule = () => {
    const trimmed = moduleInput.trim();
    if (!trimmed || modules.includes(trimmed)) { setModuleInput(""); return; }
    update("facultyModules", [...modules, trimmed].join(","));
    setModuleInput("");
  };
  const removeModule = (mod: string) => {
    update("facultyModules", modules.filter(m => m !== mod).join(","));
  };

  const isUcdEmail = (email: string) =>
    email.toLowerCase().endsWith("@ucdconnect.ie") || email.toLowerCase().endsWith("@ucd.ie");

  const passwordTooShort = form.password.length > 0 && form.password.length < 8;
  const passwordsMatch   = form.repeatPassword.length > 0 && form.password === form.repeatPassword;
  const passwordsMismatch = form.repeatPassword.length > 0 && form.password !== form.repeatPassword;

  const step1Valid = isFaculty
    ? !!form.name && isUcdEmail(form.email) && form.password.length >= 8 && form.password === form.repeatPassword
    : !!form.name && isUcdEmail(form.email) && form.password.length >= 8 && form.password === form.repeatPassword && !!form.programme && !!form.intakeYear;

  const sendOtp = async () => {
    if (!isUcdEmail(form.email)) return;
    setApiLoading(true);
    setOtpError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send code.");
      setOtpSent(true);
      setResendTimer(60);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : "Failed to send code.");
    } finally {
      setApiLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.replace(/\D/g, "").length < 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setApiLoading(true);
    setOtpError("");
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error ?? "Invalid code.");

      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          name: form.name,
          programme: isFaculty ? "Faculty" : form.programme,
          school: form.school,
          intakeYear: isFaculty ? "Faculty" : form.intakeYear,
          hometown: isFaculty ? null : form.hometown,
          bio: form.bio,
          interests: isFaculty ? null : form.interests,
          lookingFor: isFaculty ? null : form.lookingFor,
          photo: form.photo,
          linkedin: form.linkedin || null,
          instagram: isFaculty ? null : (form.instagram || null),
          contactEmail: form.contactEmail || null,
          password: form.password,
          // Faculty fields
          facultyTitle:   isFaculty ? (form.facultyTitle || null) : null,
          facultyModules: isFaculty ? (form.facultyModules || null) : null,
          facultyOffice:  isFaculty ? (form.facultyOffice || null) : null,
          facultyWebsite: isFaculty ? (form.facultyWebsite || null) : null,
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error ?? "Failed to save profile.");

      try { window.sessionStorage.setItem("wf_is_logged_in", "1"); } catch { /* ignore */ }

      setStep(4);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setApiLoading(false);
    }
  };

  const intakeLabel = !isFaculty
    ? isMeetPeople(form.intakeYear)
      ? "You will appear on the Meet People page."
      : form.intakeYear !== ""
      ? "You will appear on the Ask a Senior page."
      : null
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
    (e.target.style.borderColor = isFaculty ? "#0ea5e9" : "#7c5cff");
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#ede8ff");

  const primaryColor = isFaculty ? "#0ea5e9" : "#7c5cff";

  /* ── Success screen ── */
  if (step === 4) {
    if (isFaculty) {
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
                background: form.photo ? "transparent" : "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
                overflow: "hidden",
                border: form.photo ? "3px solid #0ea5e9" : "none",
              }}>
                {form.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <GraduationCap size={28} color="white" />
                )}
              </div>
              <h2 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "2rem", fontWeight: 700, color: "#1a0f2e",
                letterSpacing: "-0.03em", marginBottom: 10,
              }}>
                Welcome, {form.facultyTitle ? `${form.facultyTitle} ` : ""}{form.name.split(" ").slice(-1)[0]}
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#38285c", lineHeight: 1.7, marginBottom: 20 }}>
                Your faculty profile is live. Students can now find you on the Faculty page.
              </p>
              <div style={{
                background: "rgba(14,165,233,0.07)",
                border: "1px solid rgba(14,165,233,0.2)",
                borderRadius: 12, padding: "14px 18px", marginBottom: 24, textAlign: "left",
              }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0369a1", marginBottom: 4 }}>
                  UCD Smurfit Faculty
                </p>
                <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6 }}>
                  Your profile is listed in the Faculty directory. Students can see your modules, bio, and contact details.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="/faculty"
                  style={{
                    textDecoration: "none", padding: "12px 24px", fontSize: "0.9rem", borderRadius: 12,
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", color: "white", fontWeight: 700,
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  <GraduationCap size={15} /> See Faculty page →
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
              {isFaculty ? (
                <>
                  Connect with{" "}
                  <em className="grad-text" style={{ fontStyle: "italic" }}>students.</em>
                </>
              ) : (
                <>
                  Be the person you{" "}
                  <em className="grad-text" style={{ fontStyle: "italic" }}>needed</em>{" "}
                  when you arrived.
                </>
              )}
            </h1>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              {isFaculty
                ? "Register your faculty profile and let UCD Smurfit students find you. List the modules you teach so new students know who to reach out to."
                : "Create a free profile and connect with other UCD international students. Same course, same country, or just the same boat."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(isFaculty ? [
                { title: "List your modules", desc: "Students see exactly which subjects you teach" },
                { title: "Be discoverable", desc: "Students search the faculty directory by name or module" },
                { title: "Easy contact", desc: "Logged-in students can email or connect via LinkedIn" },
                { title: "@ucd.ie verified", desc: "Only verified UCD accounts. Real faculty only." },
              ] : [
                { title: "Find your people", desc: "Browse students by course, hometown, and interests" },
                { title: "Ask a senior anything", desc: "Get real answers from students a year ahead of you" },
                { title: "Track your first 30 days", desc: "Personal checklist: IRP, PPSN, bank, Leap card" },
                { title: "@ucdconnect.ie verified", desc: "Real students only. No bots, no catfishing." },
              ]).map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: isFaculty
                      ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
                      : "linear-gradient(135deg, #7c5cff, #c8b8ff)",
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
                {isFaculty
                  ? "&ldquo;Having a place where students can see who teaches what and reach out directly makes a real difference to their onboarding experience.&rdquo;"
                  : "&ldquo;I found my two closest friends here within the first week. We were all from completely different countries but in the same MSc programme.&rdquo;"}
              </p>
              <div style={{ marginTop: 10, fontSize: "0.75rem", color: "#9b8ec8", fontWeight: 600 }}>
                {isFaculty ? "UCD Smurfit, International Student Services" : "Ananya, MSc Data Analytics, India"}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Multi-step form ─── */}
          <div style={{
            background: "white", border: "1px solid #ede8ff",
            borderRadius: 24, padding: "clamp(24px, 4vw, 40px)",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
          }}>
            <StepDots step={step} total={3} isFaculty={isFaculty} />

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

                {/* Account type selector */}
                <AccountTypeSelector value={accountType} onChange={v => { setAccountType(v); }} />

                {/* Divider */}
                <div style={{ height: 1, background: "#f0ecff", margin: "2px 0" }} />

                {/* Photo upload */}
                <PhotoUpload value={form.photo} onChange={v => update("photo", v)} />

                <div>
                  <label style={labelStyle}>Full name</label>
                  <input style={inputStyle} type="text" placeholder="Your name"
                    value={form.name} onChange={e => update("name", e.target.value)}
                    required onFocus={focus} onBlur={blur} />
                </div>

                {/* Faculty title (only for faculty) */}
                {isFaculty && (
                  <div>
                    <label style={labelStyle}>
                      Title <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer" }}
                      value={form.facultyTitle}
                      onChange={e => update("facultyTitle", e.target.value)}
                      onFocus={focus} onBlur={blur}
                    >
                      <option value="">Select title (optional)</option>
                      {FACULTY_TITLES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>UCD email address</label>
                  <input style={inputStyle} type="email"
                    placeholder={isFaculty ? "yourname@ucd.ie" : "yourname@ucdconnect.ie"}
                    value={form.email} onChange={e => update("email", e.target.value)}
                    required onFocus={focus} onBlur={blur} />
                  {form.email && !isUcdEmail(form.email) && (
                    <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>
                      UCD email required ({isFaculty ? "@ucd.ie" : "@ucdconnect.ie or @ucd.ie"})
                    </p>
                  )}
                  {form.email && isUcdEmail(form.email) && (
                    <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={11} /> Looks good
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Create a password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                    <input
                      style={{ ...inputStyle, paddingLeft: 38, paddingRight: 42 }}
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={e => update("password", e.target.value)}
                      autoComplete="new-password"
                      onFocus={focus} onBlur={blur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9b8ec8", display: "flex", padding: 4 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordTooShort && (
                    <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>Use at least 8 characters.</p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Repeat password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                    <input
                      style={{ ...inputStyle, paddingLeft: 38 }}
                      type={showPassword ? "text" : "password"}
                      placeholder="Type your password again"
                      value={form.repeatPassword}
                      onChange={e => update("repeatPassword", e.target.value)}
                      autoComplete="new-password"
                      onFocus={focus} onBlur={blur}
                    />
                  </div>
                  {passwordsMismatch && (
                    <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>Passwords don&apos;t match.</p>
                  )}
                  {passwordsMatch && !passwordTooShort && (
                    <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={11} /> Passwords match
                    </p>
                  )}
                </div>

                {/* ── STUDENT-ONLY: Programme + intake ── */}
                {!isFaculty && (
                  <>
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
                  </>
                )}

                <button
                  type="button"
                  style={{
                    width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, marginTop: 4,
                    background: isFaculty
                      ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                      : "linear-gradient(160deg, #7c5cff 0%, #5a3ee8 100%)",
                    color: "white", fontWeight: 700, border: "none", cursor: step1Valid ? "pointer" : "not-allowed",
                    opacity: step1Valid && !apiLoading ? 1 : 0.5,
                    fontFamily: "'Inter', sans-serif",
                    transition: "opacity 0.2s",
                  }}
                  onClick={() => setStep(2)}
                  disabled={!step1Valid || apiLoading}
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
                    {isFaculty ? "Your faculty profile" : "Make it yours"}
                  </h2>
                  <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                    {isFaculty
                      ? "This is what students see when they browse the Faculty page."
                      : "This is what other students see on your profile."}
                  </p>
                </div>

                {/* ── FACULTY profile fields ── */}
                {isFaculty ? (
                  <>
                    {/* Modules taught */}
                    <div>
                      <label style={labelStyle}>
                        Modules you teach <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(add one at a time)</span>
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          style={{ ...inputStyle, flex: 1 }}
                          type="text"
                          placeholder="e.g. Strategic Management"
                          value={moduleInput}
                          onChange={e => setModuleInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addModule(); } }}
                          onFocus={focus} onBlur={blur}
                        />
                        <button
                          type="button"
                          onClick={addModule}
                          style={{
                            padding: "12px 18px", borderRadius: 10, cursor: "pointer",
                            background: "rgba(14,165,233,0.1)", border: "1.5px solid rgba(14,165,233,0.25)",
                            color: "#0ea5e9", fontWeight: 700, fontSize: "0.85rem", whiteSpace: "nowrap",
                          }}
                        >
                          + Add
                        </button>
                      </div>
                      {modules.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
                          {modules.map((mod, i) => (
                            <span key={i} style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "4px 12px", borderRadius: 999,
                              fontSize: "0.78rem", fontWeight: 600,
                              background: "rgba(14,165,233,0.08)", border: "1.5px solid rgba(14,165,233,0.2)",
                              color: "#0284c7",
                            }}>
                              {mod}
                              <button
                                type="button"
                                onClick={() => removeModule(mod)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", display: "flex", padding: 0, marginLeft: 2 }}
                                aria-label={`Remove ${mod}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 6 }}>
                        Add all programmes/subjects you teach — students search by module name.
                      </p>
                    </div>

                    {/* Office location */}
                    <div>
                      <label style={labelStyle}>
                        Office location <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                        <input
                          style={{ ...inputStyle, paddingLeft: 38 }}
                          type="text"
                          placeholder="e.g. Room Q206, Quinn School"
                          value={form.facultyOffice}
                          onChange={e => update("facultyOffice", e.target.value)}
                          onFocus={focus} onBlur={blur}
                        />
                      </div>
                    </div>

                    {/* Faculty website */}
                    <div>
                      <label style={labelStyle}>
                        Academic / personal website <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Globe size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                        <input
                          style={{ ...inputStyle, paddingLeft: 38 }}
                          type="url"
                          placeholder="https://people.ucd.ie/yourname"
                          value={form.facultyWebsite}
                          onChange={e => update("facultyWebsite", e.target.value)}
                          onFocus={focus} onBlur={blur}
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label style={labelStyle}>
                        Short bio <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <textarea
                        style={{ ...inputStyle, height: 90, resize: "none" }}
                        placeholder="Your research interests, teaching philosophy, or what you love about UCD Smurfit..."
                        value={form.bio}
                        onChange={e => update("bio", e.target.value.slice(0, 300))}
                        onFocus={focus} onBlur={blur}
                      />
                      <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 3, textAlign: "right" }}>
                        {form.bio.length}/300
                      </p>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label style={labelStyle}>
                        LinkedIn URL <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input style={inputStyle} type="url" placeholder="https://linkedin.com/in/yourname"
                        value={form.linkedin} onChange={e => update("linkedin", e.target.value)} onFocus={focus} onBlur={blur} />
                    </div>

                    {/* Public contact email */}
                    <div>
                      <label style={labelStyle}>
                        Public contact email <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(shown to logged-in students)</span>
                      </label>
                      <input style={inputStyle} type="email" placeholder="your@ucd.ie (or other)"
                        value={form.contactEmail} onChange={e => update("contactEmail", e.target.value)} onFocus={focus} onBlur={blur} />
                      <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 4 }}>
                        Can be the same as your UCD email or a different contact address.
                      </p>
                    </div>
                  </>
                ) : (
                  /* ── STUDENT profile fields ── */
                  <>
                    <div>
                      <label style={labelStyle}>Interests - pick what applies</label>
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
                      <label style={labelStyle}>
                        Short bio <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(optional)</span>
                      </label>
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

                    <details style={{ marginTop: -4 }}>
                      <summary style={{ fontSize: "0.8rem", color: "#7c5cff", cursor: "pointer", fontWeight: 600, listStyle: "none", display: "flex", alignItems: "center", gap: 6 }}>
                        ＋ Add LinkedIn / Instagram / email (optional)
                      </summary>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0ecff" }}>
                        <div>
                          <label style={labelStyle}>LinkedIn URL</label>
                          <input style={inputStyle} type="url" placeholder="https://linkedin.com/in/yourname"
                            value={form.linkedin} onChange={e => update("linkedin", e.target.value)} onFocus={focus} onBlur={blur} />
                        </div>
                        <div>
                          <label style={labelStyle}>Instagram handle</label>
                          <input style={inputStyle} type="text" placeholder="@yourhandle"
                            value={form.instagram} onChange={e => update("instagram", e.target.value)} onFocus={focus} onBlur={blur} />
                        </div>
                        <div>
                          <label style={labelStyle}>Public email <span style={{ color: "#b0a0cc", fontWeight: 400 }}>(seniors only - shown to logged-in users)</span></label>
                          <input style={inputStyle} type="email" placeholder="your@email.com"
                            value={form.contactEmail} onChange={e => update("contactEmail", e.target.value)} onFocus={focus} onBlur={blur} />
                        </div>
                      </div>
                    </details>
                  </>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" className="btn-ghost"
                    style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12, border: "none",
                      background: isFaculty
                        ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                        : "linear-gradient(160deg, #7c5cff 0%, #5a3ee8 100%)",
                      color: "white", fontWeight: 700, cursor: "pointer",
                      opacity: apiLoading ? 0.7 : 1, fontFamily: "'Inter', sans-serif",
                    }}
                    onClick={async () => { await sendOtp(); setStep(3); }}
                    disabled={apiLoading}
                  >
                    {apiLoading ? "Sending…" : "Send verification code →"}
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
                    background: isFaculty
                      ? "linear-gradient(135deg, #0ea5e9, #38bdf8)"
                      : "linear-gradient(135deg, #7c5cff, #c8b8ff)",
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
                    <strong style={{ color: primaryColor }}>{form.email}</strong>.
                    Enter it below to verify your UCD address.
                  </p>
                </div>

                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.35)",
                  borderRadius: 10, padding: "10px 13px",
                }}>
                  <span style={{ fontSize: "1rem", lineHeight: 1.3 }} aria-hidden="true">⚠️</span>
                  <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.5, margin: 0 }}>
                    <strong>[Can&apos;t see it? Check your spam / junk folder.]</strong>{" "}
                    The code sometimes lands there - mark it &ldquo;Not spam&rdquo; so future emails arrive in your inbox.
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
                  type="button"
                  style={{
                    width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, border: "none",
                    background: isFaculty
                      ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                      : "linear-gradient(160deg, #7c5cff 0%, #5a3ee8 100%)",
                    color: "white", fontWeight: 700, cursor: "pointer",
                    opacity: (otp.replace(/\D/g, "").length < 6 || apiLoading) ? 0.5 : 1,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onClick={verifyOtp}
                  disabled={otp.replace(/\D/g, "").length < 6 || apiLoading}
                >
                  {apiLoading ? "Creating your profile…" : "Verify and create profile"}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => { sendOtp(); }}
                    disabled={resendTimer > 0 || apiLoading}
                    style={{
                      background: "none", border: "none", cursor: resendTimer > 0 ? "default" : "pointer",
                      fontSize: "0.78rem", color: resendTimer > 0 ? "#b0a0cc" : primaryColor,
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
