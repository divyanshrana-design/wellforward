"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { KeyRound, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";

/* ─── OTP digit input (same behaviour as the join/login pages) ─────────── */
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
          aria-label={`Code digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const isUcdEmail = (e: string) =>
    e.toLowerCase().endsWith("@ucdconnect.ie") || e.toLowerCase().endsWith("@ucd.ie");

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const sendResetCode = async () => {
    if (!isUcdEmail(email)) {
      setError("Please use your UCD email (@ucdconnect.ie or @ucd.ie).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.notFound) {
          setError("No account found for this email. Tap “Join free” below to create one.");
        } else {
          setError(data.error ?? "Could not send code.");
        }
        return;
      }
      setStage("reset");
      setResendTimer(60);
    } catch {
      setError("Could not send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (otp.replace(/\D/g, "").length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not reset password.");
      // Logged straight in — reload so the Navbar reflects the new session.
      window.location.href = "/profile";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
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
    fontSize: "0.8rem", fontWeight: 600,
    color: "#38285c", marginBottom: 6, letterSpacing: "0.01em",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#7c5cff");
  const blur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#ede8ff");

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 20px" }}>
        <div style={{
          background: "white", border: "1px solid #ede8ff", borderRadius: 24,
          padding: "clamp(28px, 4vw, 44px)", maxWidth: 440, width: "100%",
          boxShadow: "0 24px 80px -20px rgba(92,60,220,0.14)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <KeyRound size={22} color="white" />
            </div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Reset your password
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#6b5a8e", lineHeight: 1.6 }}>
              {stage === "email"
                ? "Enter your UCD email and we'll send you a one-time code to reset your password."
                : <>We sent a 6-digit code to <strong style={{ color: "#7c5cff" }}>{email}</strong>. Enter it below with your new password.</>}
            </p>
          </div>

          {stage === "email" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>UCD email address</label>
                <input
                  style={inputStyle} type="email" placeholder="yourname@ucdconnect.ie"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendResetCode(); }}
                  onFocus={focus} onBlur={blur}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              {error && <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{error}</p>}
              <button
                type="button" className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                onClick={sendResetCode}
                disabled={loading || !isUcdEmail(email)}
              >
                {loading ? "Sending…" : "Send reset code →"}
              </button>
              <p style={{ fontSize: "0.78rem", color: "#9b8ec8", textAlign: "center" }}>
                Remembered it?{" "}
                <Link href="/login" style={{ color: "#7c5cff", textDecoration: "underline", fontWeight: 600 }}>
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Spam folder hint */}
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.35)",
                borderRadius: 10, padding: "10px 13px",
              }}>
                <span style={{ fontSize: "1rem", lineHeight: 1.3 }} aria-hidden="true">⚠️</span>
                <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.5, margin: 0 }}>
                  <strong>[ Can&apos;t see it? Check your spam / junk folder. ]</strong>{" "}
                  The code sometimes lands there.
                </p>
              </div>

              <OtpInput value={otp} onChange={setOtp} />

              <div>
                <label style={labelStyle}>New password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                  <input
                    style={{ ...inputStyle, paddingLeft: 38, paddingRight: 42 }}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={focus} onBlur={blur}
                    autoComplete="new-password"
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
              </div>

              <div>
                <label style={labelStyle}>Repeat new password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#b0a0cc", pointerEvents: "none" }} />
                  <input
                    style={{ ...inputStyle, paddingLeft: 38 }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Type it again"
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") resetPassword(); }}
                    onFocus={focus} onBlur={blur}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {error && <p style={{ fontSize: "0.78rem", color: "#ef4444", textAlign: "center" }}>{error}</p>}

              <button
                type="button" className="btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: loading ? 0.7 : 1 }}
                onClick={resetPassword}
                disabled={loading}
              >
                {loading ? "Resetting…" : "Reset password & sign in"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={sendResetCode}
                  disabled={resendTimer > 0 || loading}
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
                  onClick={() => { setStage("email"); setOtp(""); setError(""); }}
                >
                  Change email
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
