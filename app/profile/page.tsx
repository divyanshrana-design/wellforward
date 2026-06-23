"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Camera, Check, Save, User,
  Pencil, X, Mail, MapPin,
  GraduationCap, Calendar, Link2,
} from "lucide-react";
import { compressImage } from "@/lib/image";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}
import { PROGRAMMES, SCHOOLS, INTEREST_TAGS } from "@/lib/data";

const INTAKE_YEARS = ["2026/27", "2025/26", "2024/25", "2023/24", "2022/23"];

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// Ensure a URL always has a protocol so it doesn't resolve relative to current domain
function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "https://" + url;
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-700",
  "from-indigo-500 to-blue-700",
  "from-fuchsia-500 to-pink-700",
  "from-sky-500 to-cyan-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
];
function avatarColorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

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
          width: 88, height: 88, borderRadius: "50%",
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
          <Camera size={26} style={{ color: "#9b8ec8" }} />
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
          <Camera size={18} color="white" />
        </div>
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      <p style={{ fontSize: "0.7rem", color: "#9b8ec8" }}>Tap to change photo</p>
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
  linkedin?: string | null;
  instagram?: string | null;
  contact_email?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Editable form state
  const [form, setForm] = useState({
    name: "", programme: "", school: "Smurfit Business School",
    intakeYear: "", hometown: "", bio: "", interests: "", lookingFor: "",
    photo: "", linkedin: "", instagram: "", contactEmail: "",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 13px",
    border: "1.5px solid #ede8ff", borderRadius: 10,
    fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
    color: "#1a0f2e", background: "white", outline: "none",
    transition: "border-color 0.2s ease", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Inter', sans-serif",
    fontSize: "0.75rem", fontWeight: 600,
    color: "#38285c", marginBottom: 5,
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#7c5cff");
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#ede8ff");

  // Load session + profile
  useEffect(() => {
    let cancelled = false;

    const applyUser = (u: UserProfile) => {
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
        linkedin: u.linkedin ?? "",
        instagram: u.instagram ?? "",
        contactEmail: u.contact_email ?? "",
      });
      setLoading(false);
    };

    // Try /api/me; if it briefly reports logged-out right after a login
    // redirect (cookie not yet committed), retry once before giving up.
    const load = async (attempt = 0): Promise<void> => {
      try {
        const r = await fetch('/api/me', { cache: 'no-store' });
        const d = await r.json();
        if (cancelled) return;
        if (d.loggedIn && d.user) {
          applyUser(d.user as UserProfile);
          return;
        }
        if (attempt < 1) {
          await new Promise(res => setTimeout(res, 400));
          return load(attempt + 1);
        }
        router.replace('/join');
      } catch {
        if (cancelled) return;
        if (attempt < 1) {
          await new Promise(res => setTimeout(res, 400));
          return load(attempt + 1);
        }
        router.replace('/join');
      }
    };

    load();
    return () => { cancelled = true; };
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
          linkedin: form.linkedin || null,
          instagram: form.instagram || null,
          contactEmail: form.contactEmail || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save.');
      setSaved(true);
      // Update local user state to reflect saved values
      setUser(prev => prev ? {
        ...prev,
        name: form.name,
        bio: form.bio,
        interests: form.interests,
        hometown: form.hometown,
        linkedin: form.linkedin,
        instagram: form.instagram,
        contact_email: form.contactEmail,
      } : prev);
      setTimeout(() => { setSaved(false); setEditMode(false); }, 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="relative min-h-screen">
        <MeshBackground />
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              border: "3px solid #ede8ff", borderTopColor: "#7c5cff",
              animation: "spin 0.7s linear infinite", margin: "0 auto 14px",
            }} />
            <p style={{ color: "#9b8ec8", fontSize: "0.88rem" }}>Loading your profile…</p>
          </div>
        </div>
      </main>
    );
  }

  const isMeetPeople = (form.intakeYear || user?.intake_year) === "2026/27";
  const avatarGradient = `bg-gradient-to-br ${avatarColorFor(form.name || user?.name || "")}`;
  const displayPhoto = form.photo && !form.photo.startsWith('data:') ? form.photo : (form.photo.startsWith('data:') ? form.photo : null);
  const interestList = form.interests ? form.interests.split(",").filter(Boolean) : [];
  const lookingForList = form.lookingFor ? form.lookingFor.split(",").filter(Boolean) : [];

  const lookingForLabels: Record<string, string> = {
    friends: "Friends to hang out with",
    study: "Study partners",
    flatmates: "Flatmates or housing tips",
    advice: "Practical advice about Dublin",
  };

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <section style={{ padding: "88px 20px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header actions row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 20px", borderRadius: 10, cursor: "pointer",
                    background: "linear-gradient(135deg,#7c5cff,#5a3ee8)",
                    color: "white", border: "none",
                    fontFamily: "'Inter',sans-serif", fontSize: "0.875rem", fontWeight: 600,
                    boxShadow: "0 4px 14px -4px rgba(124,92,255,0.45)",
                  }}
                >
                  <Pencil size={14} /> Edit profile
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                    background: "transparent", border: "1.5px solid #ede8ff",
                    color: "#9b8ec8", fontFamily: "'Inter',sans-serif", fontSize: "0.875rem", fontWeight: 500,
                  }}
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: editMode ? "1fr 1fr" : "1fr",
            gap: 24,
            transition: "grid-template-columns 0.3s ease",
            alignItems: "start",
          }}
            className="profile-grid"
          >
            {/* ── LEFT: Profile card (always shown) ── */}
            <div style={{
              background: "white",
              border: "1px solid #ede8ff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 8px 32px -12px rgba(92,60,220,0.1)",
            }}>
              {/* Hero band */}
              <div style={{
                height: 80,
                background: "linear-gradient(135deg, #7c5cff 0%, #c8b8ff 100%)",
              }} />

              <div style={{ padding: "0 28px 28px", marginTop: -44 }}>
                {/* Avatar */}
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  border: "3px solid white",
                  overflow: "hidden",
                  boxShadow: "0 4px 16px -4px rgba(124,92,255,0.3)",
                  marginBottom: 14,
                  cursor: editMode ? "pointer" : "default",
                }}>
                  {displayPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayPhoto} alt={form.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div
                      className={`w-full h-full ${avatarGradient} flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {getInitials(form.name)}
                    </div>
                  )}
                </div>
                {!displayPhoto && !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    style={{
                      marginBottom: 8, background: "none", border: "none",
                      fontSize: "0.7rem", color: "#9b8ec8", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <Camera size={11} /> Add a photo - it helps others recognise you
                  </button>
                )}

                {/* Name + role badge */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.45rem", fontWeight: 700, color: "#1a0f2e", margin: "0 0 4px" }}>
                      {form.name || "Your name"}
                    </h1>
                    <p style={{ fontSize: "0.8rem", color: "#9b8ec8", margin: 0 }}>{user?.email}</p>
                  </div>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                    background: isMeetPeople ? "rgba(124,92,255,0.1)" : "rgba(16,185,129,0.1)",
                    color: isMeetPeople ? "#7c5cff" : "#059669",
                    border: `1px solid ${isMeetPeople ? "rgba(124,92,255,0.2)" : "rgba(16,185,129,0.2)"}`,
                    whiteSpace: "nowrap",
                  }}>
                    <User size={10} style={{ display: "inline", marginRight: 3 }} />
                    {isMeetPeople ? "Meet People" : "Ask a Senior"}
                  </span>
                </div>

                {/* Key details */}
                <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.programme && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#38285c" }}>
                      <GraduationCap size={14} style={{ color: "#9b8ec8", flexShrink: 0 }} />
                      <span>{form.programme}</span>
                    </div>
                  )}
                  {form.intakeYear && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#38285c" }}>
                      <Calendar size={14} style={{ color: "#9b8ec8", flexShrink: 0 }} />
                      <span>Intake {form.intakeYear}</span>
                    </div>
                  )}
                  {form.hometown && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#38285c" }}>
                      <MapPin size={14} style={{ color: "#9b8ec8", flexShrink: 0 }} />
                      <span>{form.hometown}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {form.bio && (
                  <div style={{
                    marginTop: 18,
                    background: "rgba(200,184,255,0.15)",
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}>
                    <p style={{ fontSize: "0.85rem", color: "#2a1d50", lineHeight: 1.7, margin: 0 }}>
                      {form.bio}
                    </p>
                  </div>
                )}

                {/* Interests */}
                {interestList.length > 0 && (
                  <div style={{ marginTop: 18 }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#b0a0cc", textTransform: "uppercase", marginBottom: 8 }}>
                      Into
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {interestList.map(t => (
                        <span key={t} className="chip" style={{ cursor: "default" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Looking for */}
                {lookingForList.length > 0 && (
                  <div style={{ marginTop: 18 }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#b0a0cc", textTransform: "uppercase", marginBottom: 8 }}>
                      Looking for
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {lookingForList.map(v => (
                        <span key={v} style={{
                          display: "inline-block", padding: "4px 11px", borderRadius: 999,
                          fontSize: "0.78rem", background: "rgba(16,185,129,0.1)",
                          border: "1px solid rgba(16,185,129,0.2)", color: "#065f46",
                        }}>
                          {lookingForLabels[v] ?? v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact links */}
                {(form.linkedin || form.instagram || form.contactEmail) ? (
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    {form.linkedin && (
                      <a href={ensureHttps(form.linkedin)} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#0077b5", textDecoration: "none" }}>
                        <Link2 size={14} style={{ color: "#0077b5" }} />
                        <span style={{ borderBottom: "1px solid rgba(0,119,181,0.3)" }}>LinkedIn</span>
                      </a>
                    )}
                    {form.instagram && (
                      <a href={`https://instagram.com/${form.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#c2185b", textDecoration: "none" }}>
                        <InstagramIcon size={14} />
                        <span style={{ borderBottom: "1px solid rgba(194,24,91,0.3)" }}>@{form.instagram.replace(/^@/, '')}</span>
                      </a>
                    )}
                    {form.contactEmail && (
                      <a href={`mailto:${form.contactEmail}`}
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#7c5cff", textDecoration: "none" }}>
                        <Mail size={14} style={{ color: "#7c5cff" }} />
                        <span style={{ borderBottom: "1px solid rgba(124,92,255,0.3)" }}>{form.contactEmail}</span>
                      </a>
                    )}
                  </div>
                ) : !editMode && (
                  <div style={{
                    marginTop: 18, padding: "12px 14px", borderRadius: 10,
                    background: "rgba(124,92,255,0.05)", border: "1px dashed rgba(124,92,255,0.2)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: "1rem" }}>👁</span>
                    <div>
                      <p style={{ fontSize: "0.78rem", color: "#6b5a8e", margin: "0 0 4px", fontWeight: 600 }}>
                        Add your contact details
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#9b8ec8", margin: 0, lineHeight: 1.5 }}>
                        LinkedIn, Instagram or email - these are shown to other logged-in users so they can reach you.
                      </p>
                    </div>
                  </div>
                )}

                {/* Prompt if profile incomplete */}
                {!form.bio && !editMode && (
                  <div style={{
                    marginTop: 20, padding: "14px 16px", borderRadius: 12,
                    background: "rgba(124,92,255,0.06)", border: "1px dashed rgba(124,92,255,0.2)",
                    textAlign: "center",
                  }}>
                    <p style={{ fontSize: "0.8rem", color: "#9b8ec8", margin: "0 0 10px" }}>
                      Your profile is looking a bit empty - add a bio to show up in the community.
                    </p>
                    <button
                      onClick={() => setEditMode(true)}
                      style={{
                        background: "linear-gradient(135deg,#7c5cff,#5a3ee8)",
                        color: "white", border: "none", borderRadius: 8,
                        padding: "8px 20px", fontSize: "0.8rem", fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Complete your profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Edit form (only shown in edit mode) ── */}
            {editMode && (
              <div
                style={{
                  background: "white",
                  border: "1px solid #ede8ff",
                  borderRadius: 20,
                  padding: "26px",
                  boxShadow: "0 8px 32px -12px rgba(92,60,220,0.1)",
                  animation: "slideIn 0.25s ease",
                }}
              >
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#1a0f2e", margin: "0 0 22px" }}>
                  Edit your profile
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
                    <label style={labelStyle}>
                      Short bio <span style={{ fontWeight: 400, color: "#b0a0cc" }}>(optional)</span>
                    </label>
                    <textarea
                      style={{ ...inputStyle, height: 80, resize: "none" }}
                      placeholder="Where you're from, what you're studying, what you're into..."
                      value={form.bio}
                      onChange={e => update("bio", e.target.value.slice(0, 220))}
                      onFocus={focus} onBlur={blur}
                    />
                    <p style={{ fontSize: "0.66rem", color: "#b0a0cc", marginTop: 2, textAlign: "right" }}>
                      {form.bio.length}/220
                    </p>
                  </div>

                  {/* ── Social links ── */}
                  <div style={{ borderTop: "1px solid #f0ecff", paddingTop: 14 }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", color: "#b0a0cc", textTransform: "uppercase", marginBottom: 6 }}>
                      Contact &amp; Social
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#9b8ec8", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: "0.8rem" }}>👁</span> Shown to other logged-in Wellforward users in your profile card
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>LinkedIn URL</label>
                        <input style={inputStyle} type="url"
                          placeholder="https://linkedin.com/in/yourname"
                          value={form.linkedin}
                          onChange={e => update("linkedin", e.target.value)}
                          onFocus={focus} onBlur={blur} />
                      </div>
                      <div>
                        <label style={labelStyle}>Instagram handle <span style={{ fontWeight: 400, color: "#b0a0cc" }}>(optional)</span></label>
                        <input style={inputStyle} type="text"
                          placeholder="@yourhandle or just yourhandle"
                          value={form.instagram}
                          onChange={e => update("instagram", e.target.value)}
                          onFocus={focus} onBlur={blur} />
                      </div>
                      <div>
                        <label style={labelStyle}>Public contact email <span style={{ fontWeight: 400, color: "#b0a0cc" }}>(optional)</span></label>
                        <input style={inputStyle} type="email"
                          placeholder="shown to logged-in users only"
                          value={form.contactEmail}
                          onChange={e => update("contactEmail", e.target.value)}
                          onFocus={focus} onBlur={blur} />
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label style={labelStyle}>Interests</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {INTEREST_TAGS.map(tag => (
                        <button
                          key={tag} type="button"
                          onClick={() => toggleInterest(tag)}
                          style={{
                            padding: "5px 12px", borderRadius: 999,
                            fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
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
                            style={{ accentColor: "#7c5cff", width: 14, height: 14, cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "0.82rem", color: "#38285c" }}>{opt.label}</span>
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
                      width: "100%", padding: "13px", fontSize: "0.9rem", borderRadius: 12,
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
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 720px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </main>
  );
}
