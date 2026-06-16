"use client";

import { useEffect, useState } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JoinPage() {
  const [step, setStep]         = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", program: "", year: "",
    hometown: "", interests: "", bio: "", lookingFor: "",
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

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const INTERESTS = ["Sport","Music","Film","Tech","Politics","Art","Travel","Food","Gaming","Books","Fashion","Volunteering"];
  const toggleInterest = (tag: string) => {
    const current = form.interests ? form.interests.split(",") : [];
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    update("interests", next.join(","));
  };
  const selectedInterests = form.interests ? form.interests.split(",").filter(Boolean) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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

  if (submitted) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", paddingTop: 64, padding: "120px 20px",
        }}>
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 24,
            padding: "56px 48px", textAlign: "center", maxWidth: 520, width: "100%",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.14)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cff, #c8b8ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M2 11l8 8L26 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "2rem", fontWeight: 700, color: "#1a0f2e",
              letterSpacing: "-0.03em", marginBottom: 12,
            }}>
              You&apos;re on the list
            </h2>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 28 }}>
              We&apos;ll send a verification link to{" "}
              <strong style={{ color: "#7c5cff" }}>{form.email}</strong>.
              Once verified, your profile goes live and other students can find you.
            </p>
            <p style={{ fontSize: "0.82rem", color: "#9b8ec8" }}>
              Didn&apos;t get the email? Check your spam folder or contact us at{" "}
              <a href="mailto:hello@wellforward.ie" style={{ color: "#7c5cff" }}>hello@wellforward.ie</a>
            </p>
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
        <div className="max-w-6xl mx-auto" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", alignItems: "start" }}>

          {/* ─── LEFT: Value prop ─── */}
          <div style={{ paddingTop: 8 }}>
            <span className="eyebrow">Join free</span>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 900,
              color: "#1a0f2e",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              marginBottom: 20,
              marginTop: 14,
            }}>
              Be the person you{" "}
              <em className="grad-text" style={{ fontStyle: "italic" }}>
                needed
              </em>{" "}
              when you arrived.
            </h1>
            <p style={{ fontSize: "1rem", color: "#38285c", lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Create a free profile and connect with other UCD international students — from the same country, the same course, or just the same boat.
            </p>

            {/* Benefits list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "Find your people", desc: "Browse students by course, hometown, and interests" },
                { title: "Ask a senior anything", desc: "Get real answers from students a year ahead of you" },
                { title: "Track your first 30 days", desc: "Personal checklist: IRP, PPSN, bank, Leap card — done" },
                { title: "@ucdconnect.ie verified", desc: "Real students only — no catfishing, no bots" },
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

            {/* Social proof */}
            <div style={{
              marginTop: 40, padding: "16px 20px",
              background: "rgba(124,92,255,0.06)",
              border: "1px solid rgba(124,92,255,0.14)",
              borderRadius: 12,
              maxWidth: 400,
            }}>
              <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                &ldquo;I found my two closest friends here within the first week. We were all from completely different countries but in the same MSc programme.&rdquo;
              </p>
              <div style={{ marginTop: 10, fontSize: "0.75rem", color: "#9b8ec8", fontWeight: 600 }}>
                — Ananya, MSc Data Analytics, India
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Multi-step form ─── */}
          <div style={{
            background: "white",
            border: "1px solid #ede8ff",
            borderRadius: 24,
            padding: "clamp(24px, 4vw, 40px)",
            boxShadow: "0 24px 80px -20px rgba(92,60,220,0.12)",
          }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              {[1, 2].map(n => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: step >= n ? "linear-gradient(135deg, #7c5cff, #c8b8ff)" : "#ede8ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.72rem", fontWeight: 700,
                    color: step >= n ? "white" : "#9b8ec8",
                    transition: "all 0.3s ease",
                  }}>
                    {step > n ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : n}
                  </div>
                  {n < 2 && (
                    <div style={{ width: 40, height: 2, borderRadius: 1, background: step > n ? "#7c5cff" : "#ede8ff", transition: "background 0.3s ease" }} />
                  )}
                </div>
              ))}
              <span style={{ marginLeft: 4, fontSize: "0.78rem", color: "#9b8ec8", fontFamily: "'Inter', sans-serif" }}>
                Step {step} of 2
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <h2 style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "1.5rem", fontWeight: 700,
                      color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6,
                    }}>The basics</h2>
                    <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                      Takes 2 minutes. We only need the essentials.
                    </p>
                  </div>

                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input
                      style={inputStyle} type="text" placeholder="Your name"
                      value={form.name} onChange={e => update("name", e.target.value)}
                      required
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#7c5cff"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ede8ff"}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>UCD email address</label>
                    <input
                      style={inputStyle} type="email" placeholder="yourname@ucdconnect.ie"
                      value={form.email} onChange={e => update("email", e.target.value)}
                      required
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#7c5cff"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ede8ff"}
                    />
                    <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 5 }}>
                      UCD email required for verification — keeps the community real
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Programme</label>
                      <input
                        style={inputStyle} type="text" placeholder="e.g. MSc Finance"
                        value={form.program} onChange={e => update("program", e.target.value)}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#7c5cff"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ede8ff"}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Year</label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={form.year} onChange={e => update("year", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="1st">1st year</option>
                        <option value="2nd">2nd year</option>
                        <option value="3rd">3rd year</option>
                        <option value="4th">4th year</option>
                        <option value="postgrad">Postgrad</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Hometown / Country</label>
                    <input
                      style={inputStyle} type="text" placeholder="e.g. Mumbai, India"
                      value={form.hometown} onChange={e => update("form.hometown", e.target.value)}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#7c5cff"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#ede8ff"}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12, marginTop: 4 }}
                    onClick={() => setStep(2)}
                    disabled={!form.name || !form.email}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <h2 style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontSize: "1.5rem", fontWeight: 700,
                      color: "#1a0f2e", letterSpacing: "-0.025em", marginBottom: 6,
                    }}>Make it yours</h2>
                    <p style={{ fontSize: "0.83rem", color: "#6b5a8e", lineHeight: 1.5 }}>
                      This is what other students see when they find your profile.
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
                            padding: "6px 14px",
                            borderRadius: 999,
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            cursor: "pointer",
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
                      placeholder="Tell others a little about yourself — where you're from, what you're studying, what you're into…"
                      value={form.bio} onChange={e => update("bio", e.target.value)}
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#7c5cff"}
                      onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "#ede8ff"}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>What are you looking for?</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                      {[
                        { v: "friends",  label: "Friends to hang out with" },
                        { v: "study",    label: "Study partners" },
                        { v: "flatmates",label: "Flatmates / housing tips" },
                        { v: "advice",   label: "Practical advice about Dublin" },
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
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ flex: "0 0 auto", padding: "13px 20px", fontSize: "0.9rem", borderRadius: 12 }}
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 1, padding: "14px", fontSize: "0.95rem", borderRadius: 12 }}
                    >
                      Create my profile ✦
                    </button>
                  </div>

                  <p style={{ fontSize: "0.72rem", color: "#9b8ec8", textAlign: "center", lineHeight: 1.5 }}>
                    By joining you agree to keep the community respectful and real.
                    No spam, no hate — just students helping students.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
