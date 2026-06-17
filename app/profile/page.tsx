"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, Check, LogOut, Save, ArrowLeft, User } from "lucide-react";
import { PROGRAMMES, SCHOOLS, INTEREST_TAGS } from "@/lib/data";

const INTAKE_YEARS = ["2026/27", "2025/26", "2024/25", "2023/24", "2022/23"];

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          width: 96, height: 96, borderRadius: "50%",
          border: value ? "3px solid #7c5cff" : "2px dashed rgba(124,92,255,0.35)",
          background: value ? "transparent" : "rgba(200,184,255,0.15)",
          cursor: "pointer", overflow: "hidden", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Change profile photo"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Camera size={28} style={{ color: "#9b8ec8" }} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(124,92,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0, transition: "opacity 0.2s", borderRadius: "50%",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
        >
          <Camera size={20} color="white" />
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <p style={{ fontSize: "0.72rem", color: "#9b8ec8" }}>Tap to change photo</p>
    </div>
  );
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  programme: string;
  school: string;
  intake_year: string;
  hometown: string | null;
  bio: string | null;
  interests: string | null;
  looking_for: string | null;
  photo_url: string | null;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);

  // Editable form state
  const [form, setForm] = useState({
    name: "", programme: "", school: "Smurfit Business School",
    intakeYear: "", hometown: "", bio: "", interests: "", lookingFor: "", photo: "",
  });

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
    color: "#38285c", marginBottom: 6,
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#7c5cff");
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#ede8ff");

  // Load session + profile
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(d => {
        if (!d.loggedIn || !d.user) {
          router.replace('/join');
          return;
        }
        const u: UserProfile = d.user;
        setUser(u);
        setForm({
          name: u.name ?? "",
          programme: u.programme ?? "",
          school: u.school ?? "Smurfit Business School",
          intakeYear: u.intake_year ?? "",
          hometown: u.hometown ?? "",
          bio: u.bio ?? "",
          interests: u.interests ?? "",
          lookingFor: u.looking_for ?? "",
          photo: u.photo_url ?? "",
        });
        setLoading(false);
      })
      .catch(() => { router.replace('/join'); });
  }, [router]);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const selectedInterests = form.interests ? form.interests.split(",").filter(Boolean) : [];
  const toggleInterest = (tag: string) => {
    const next = selectedInterests.includes(tag)
      ? selectedInterests.filter(t => t !== tag)
      : [...selectedInterests, tag];
    update("interests", next.join(","));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch('/api/register', {
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
          photo: form.photo.startsWith('data:') ? form.photo : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save.');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/me', { method: 'DELETE' });
    router.push('/');
  };

  if (loading) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "3px solid #ede8ff", borderTopColor: "#7c5cff",
              animation: "spin 0.7s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ color: "#9b8ec8", fontSize: "0.9rem" }}>Loading your profile…</p>
          </div>
        </div>
      </main>
    );
  }

  const isMeetPeople = form.intakeYear === "2026/27";
  const avatarBg = "linear-gradient(135deg, #7c5cff, #c8b8ff)";

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <section style={{ paddingTop: 96, paddingBottom: 96, padding: "100px 20px 80px" }}>
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#9b8ec8", fontSize: "0.82rem", marginBottom: 24, padding: 0 }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Profile header card */}
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 20,
            padding: "28px 28px 20px", marginBottom: 20,
            boxShadow: "0 8px 32px -12px rgba(92,60,220,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: form.photo && !form.photo.startsWith('data:') ? "transparent" : avatarBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", flexShrink: 0,
                  border: form.photo ? "2px solid #7c5cff" : "none",
                }}>
                  {form.photo && !form.photo.startsWith('data:') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>{getInitials(form.name)}</span>
                  )}
                </div>
                <div>
                  <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a0f2e", margin: 0 }}>
                    {form.name || "Your profile"}
                  </h1>
                  <p style={{ fontSize: "0.78rem", color: "#9b8ec8", margin: "2px 0 0" }}>{user?.email}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                  background: isMeetPeople ? "rgba(124,92,255,0.1)" : "rgba(16,185,129,0.1)",
                  color: isMeetPeople ? "#7c5cff" : "#059669",
                  border: `1px solid ${isMeetPeople ? "rgba(124,92,255,0.2)" : "rgba(16,185,129,0.2)"}`,
                }}>
                  <User size={10} style={{ display: "inline", marginRight: 3 }} />
                  {isMeetPeople ? "Meet People" : "Ask a Senior"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div style={{
            background: "white", border: "1px solid #ede8ff", borderRadius: 20,
            padding: "28px", boxShadow: "0 8px 32px -12px rgba(92,60,220,0.12)",
          }}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "#1a0f2e", marginBottom: 24, marginTop: 0 }}>
              Edit your profile
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Photo */}
              <PhotoUpload
                value={form.photo}
                onChange={v => update("photo", v)}
              />

              {/* Name */}
              <div>
                <label style={labelStyle}>Full name</label>
                <input style={inputStyle} type="text" value={form.name}
                  onChange={e => update("name", e.target.value)} onFocus={focus} onBlur={blur} />
              </div>

              {/* Programme + intake year */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Programme</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.programme}
                    onChange={e => update("programme", e.target.value)} onFocus={focus} onBlur={blur}>
                    <option value="">Select programme</option>
                    {(PROGRAMMES[form.school] ?? []).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Intake year</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.intakeYear}
                    onChange={e => update("intakeYear", e.target.value)} onFocus={focus} onBlur={blur}>
                    <option value="">Select year</option>
                    {INTAKE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Hometown */}
              <div>
                <label style={labelStyle}>Hometown / Country</label>
                <input style={inputStyle} type="text" placeholder="e.g. Mumbai, India"
                  value={form.hometown} onChange={e => update("hometown", e.target.value)}
                  onFocus={focus} onBlur={blur} />
              </div>

              {/* Bio */}
              <div>
                <label style={labelStyle}>Short bio</label>
                <textarea
                  style={{ ...inputStyle, height: 90, resize: "none" }}
                  placeholder="Where you're from, what you're studying, what you're into..."
                  value={form.bio}
                  onChange={e => update("bio", e.target.value.slice(0, 220))}
                  onFocus={focus} onBlur={blur}
                />
                <p style={{ fontSize: "0.68rem", color: "#b0a0cc", marginTop: 3, textAlign: "right" }}>
                  {form.bio.length}/220
                </p>
              </div>

              {/* Interests */}
              <div>
                <label style={labelStyle}>Interests</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                  {INTEREST_TAGS.map(tag => (
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

              {/* Looking for */}
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

              {/* Error */}
              {error && (
                <p style={{ fontSize: "0.82rem", color: "#ef4444", textAlign: "center" }}>{error}</p>
              )}

              {/* Save button */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.name}
                className="btn-primary"
                style={{
                  width: "100%", padding: "14px", fontSize: "0.95rem", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saved ? (
                  <><Check size={16} /> Saved!</>
                ) : saving ? (
                  "Saving…"
                ) : (
                  <><Save size={16} /> Save changes</>
                )}
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "none", border: "1px solid #ede8ff", borderRadius: 12,
                  padding: "12px", fontSize: "0.85rem", cursor: "pointer",
                  color: "#9b8ec8", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 7, width: "100%",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ede8ff"; (e.currentTarget as HTMLButtonElement).style.color = "#9b8ec8"; }}
              >
                <LogOut size={14} /> Sign out
              </button>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
