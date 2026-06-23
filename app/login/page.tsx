"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isUcdEmail = (e: string) =>
    e.toLowerCase().endsWith("@ucdconnect.ie") || e.toLowerCase().endsWith("@ucd.ie");

  // If already logged in, go straight to profile
  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(d => { if (d.loggedIn) router.replace("/profile"); })
      .catch(() => {});
  }, [router]);

  const signIn = async () => {
    if (!isUcdEmail(email)) {
      setError("Please use your UCD email (@ucdconnect.ie or @ucd.ie).");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.notFound) {
          setError("No account found for this email. Tap “Join free” below to create one.");
        } else if (data.needsPassword) {
          setError("This account has no password yet. Tap “Forgot password?” to set one.");
        } else {
          setError(data.error ?? "Could not sign in.");
        }
        return;
      }
      // Prime the navbar's cached auth state so the destination page shows the
      // logged-in buttons immediately (no flash to logged-out).
      try { window.sessionStorage.setItem("wf_is_logged_in", "1"); } catch { /* ignore */ }
      // Full reload so the Navbar re-reads the new session everywhere.
      window.location.href = "/profile";
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
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
              <Lock size={22} color="white" />
            </div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.6rem", fontWeight: 700, color: "#1a0f2e", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#6b5a8e", lineHeight: 1.6 }}>
              Sign in with your UCD email and password.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>UCD email address</label>
              <input
                style={inputStyle} type="email" placeholder="yourname@ucdconnect.ie"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") signIn(); }}
                onFocus={focus} onBlur={blur}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 42 }}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") signIn(); }}
                  onFocus={focus} onBlur={blur}
                  autoComplete="current-password"
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
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <Link href="/forgot-password" style={{ fontSize: "0.76rem", color: "#7c5cff", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && <p style={{ fontSize: "0.78rem", color: "#ef4444" }}>{error}</p>}

            <button
              type="button" className="btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, opacity: loading ? 0.7 : 1 }}
              onClick={signIn}
              disabled={loading || !isUcdEmail(email) || !password}
            >
              {loading ? "Signing you in…" : "Sign in"}
            </button>

            <p style={{ fontSize: "0.78rem", color: "#9b8ec8", textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link href="/join" style={{ color: "#7c5cff", textDecoration: "underline", fontWeight: 600 }}>
                Join free
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
