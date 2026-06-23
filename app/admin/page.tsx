"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Shield, Trash2, Eye, EyeOff, Pencil, X, Save,
  Search, GraduationCap, Users, AlertTriangle, Mail, MapPin,
} from "lucide-react";

const SERIF = "'Fraunces', Georgia, serif";

const h1Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 900,
  letterSpacing: "-0.03em",
};
const h2Style: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 700,
  letterSpacing: "-0.025em",
};

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  programme: string | null;
  school: string | null;
  intake_year: string | null;
  hometown: string | null;
  bio: string | null;
  interests: string | null;
  looking_for: string | null;
  photo_url: string | null;
  linkedin: string | null;
  instagram: string | null;
  contact_email: string | null;
  verified: boolean;
  hidden: boolean | null;
  created_at: string;
};

function getInitials(name: string) {
  return (name || "?").split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const EDIT_FIELDS: { key: keyof Profile; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "programme", label: "Programme" },
  { key: "school", label: "School" },
  { key: "intake_year", label: "Intake year" },
  { key: "hometown", label: "Hometown" },
  { key: "bio", label: "Bio" },
  { key: "interests", label: "Interests (comma separated)" },
  { key: "looking_for", label: "Looking for" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "contact_email", label: "Contact email" },
];

export default function AdminPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "denied" | "ok">("checking");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "senior">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Profile>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profiles", { cache: "no-store" });
      if (res.status === 403) {
        setAuthState("denied");
        return;
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
      setAuthState("ok");
    } catch {
      setAuthState("denied");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/check", { cache: "no-store" });
        const data = await res.json();
        if (!data.isAdmin) {
          setAuthState("denied");
          setTimeout(() => router.replace("/"), 1600);
          return;
        }
        await loadProfiles();
      } catch {
        setAuthState("denied");
        setTimeout(() => router.replace("/"), 1600);
      }
    })();
  }, [router, loadProfiles]);

  const handleDelete = async (p: Profile) => {
    if (!window.confirm(`Delete ${p.name} (${p.email}) permanently? This removes their profile and photo and cannot be undone.`)) {
      return;
    }
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/profiles/${p.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Could not delete.");
      } else {
        setProfiles(prev => prev.filter(x => x.id !== p.id));
        showToast(`Deleted ${p.name}.`);
      }
    } catch {
      showToast("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleHidden = async (p: Profile) => {
    const next = !(p.hidden === true);
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/profiles/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsMigration) {
          window.alert(
            "Hide/unhide needs a one-time database setup.\n\n" +
            "Open Supabase \u2192 SQL Editor \u2192 New query, run this once, then try again:\n\n" +
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT FALSE;"
          );
        } else {
          showToast(data.error || "Could not update.");
        }
      } else {
        setProfiles(prev => prev.map(x => (x.id === p.id ? { ...x, hidden: next } : x)));
        showToast(next ? `${p.name} is now hidden from the site.` : `${p.name} is visible again.`);
      }
    } catch {
      showToast("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const openEdit = (p: Profile) => {
    setEditing(p);
    const draft: Partial<Profile> = {};
    EDIT_FIELDS.forEach(f => { (draft as Record<string, unknown>)[f.key] = (p[f.key] ?? "") as unknown; });
    draft.role = p.role;
    setEditDraft(draft);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setBusyId(editing.id);
    try {
      const res = await fetch(`/api/admin/profiles/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Could not save.");
      } else {
        setProfiles(prev => prev.map(x => (x.id === editing.id ? { ...x, ...data.profile } : x)));
        showToast("Profile updated.");
        setEditing(null);
      }
    } catch {
      showToast("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = profiles.filter(p => {
    if (roleFilter !== "all" && p.role !== roleFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.programme || "").toLowerCase().includes(q) ||
      (p.hometown || "").toLowerCase().includes(q)
    );
  });

  const studentCount = profiles.filter(p => p.role === "student").length;
  const seniorCount = profiles.filter(p => p.role === "senior").length;
  const hiddenCount = profiles.filter(p => p.hidden === true).length;

  // ---- render ----
  if (authState === "checking") {
    return (
      <main style={{ minHeight: "100vh", position: "relative" }}>
        <MeshBackground />
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
          <p style={{ color: "var(--ink)", opacity: 0.6 }}>Checking access…</p>
        </div>
      </main>
    );
  }

  if (authState === "denied") {
    return (
      <main style={{ minHeight: "100vh", position: "relative" }}>
        <MeshBackground />
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: 14, textAlign: "center", padding: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fee2e2", display: "grid", placeItems: "center" }}>
            <AlertTriangle size={26} color="#dc2626" />
          </div>
          <h1 style={{ ...h2Style, fontSize: 24, color: "var(--ink)" }}>Restricted area</h1>
          <p style={{ color: "var(--ink)", opacity: 0.6, maxWidth: 380 }}>
            This page is only for the site moderator. Redirecting you home…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <MeshBackground />
      <Navbar />

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--ink)", color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 600, zIndex: 200, boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}>
          {toast}
        </div>
      )}

      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "120px 20px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(160deg, var(--violet) 0%, var(--violet-dark) 100%)", display: "grid", placeItems: "center", boxShadow: "0 8px 24px rgba(124,92,255,0.35)" }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ ...h1Style, fontSize: 34, color: "var(--ink)", lineHeight: 1.05 }}>Moderator dashboard</h1>
            <p style={{ color: "var(--ink)", opacity: 0.55, fontSize: 14, marginTop: 2 }}>
              Manage every profile on Wellforward.
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "24px 0 28px" }}>
          {[
            { icon: <Users size={15} />, label: "Total profiles", value: profiles.length },
            { icon: <GraduationCap size={15} />, label: "Students", value: studentCount },
            { icon: <Users size={15} />, label: "Seniors", value: seniorCount },
            { icon: <EyeOff size={15} />, label: "Hidden", value: hiddenCount },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.85)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 16px", minWidth: 130, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--violet-dark)", fontSize: 12, fontWeight: 600 }}>
                {s.icon} {s.label}
              </span>
              <span style={{ ...h2Style, fontSize: 26, color: "var(--ink)" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name, email, programme, hometown…"
              style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 12, border: "1px solid var(--line)", background: "rgba(255,255,255,0.9)", fontSize: 14, color: "var(--ink)", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.9)", border: "1px solid var(--line)", borderRadius: 12, padding: 4 }}>
            {(["all", "student", "senior"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, textTransform: "capitalize",
                  background: roleFilter === r ? "var(--violet)" : "transparent",
                  color: roleFilter === r ? "#fff" : "var(--ink)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ color: "var(--ink)", opacity: 0.6, padding: 20 }}>Loading profiles…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "var(--ink)", opacity: 0.6, padding: 20 }}>No profiles match your filters.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(p => {
              const isHidden = p.hidden === true;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                    background: isHidden ? "rgba(254,242,242,0.85)" : "rgba(255,255,255,0.9)",
                    border: `1px solid ${isHidden ? "#fecaca" : "var(--line)"}`,
                    borderRadius: 16, padding: "14px 16px",
                    opacity: busyId === p.id ? 0.5 : 1, transition: "opacity .2s",
                  }}
                >
                  {/* Avatar */}
                  {p.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photo_url} alt={p.name} style={{ width: 46, height: 46, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(160deg, var(--violet) 0%, var(--violet-dark) 100%)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                      {getInitials(p.name)}
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 15 }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: p.role === "senior" ? "#ede8ff" : "#e0f2fe", color: p.role === "senior" ? "var(--violet-dark)" : "#0369a1", textTransform: "capitalize" }}>{p.role}</span>
                      {isHidden && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: "#fee2e2", color: "#dc2626" }}>Hidden</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 3, flexWrap: "wrap", color: "var(--ink)", opacity: 0.6, fontSize: 12.5 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={12} /> {p.email}</span>
                      {p.programme && <span>{p.programme}</span>}
                      {p.hometown && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {p.hometown}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => openEdit(p)}
                      disabled={busyId === p.id}
                      title="Edit profile"
                      style={iconBtn("#ede8ff", "var(--violet-dark)")}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleToggleHidden(p)}
                      disabled={busyId === p.id}
                      title={isHidden ? "Unhide (show on site)" : "Hide from site"}
                      style={iconBtn("#fef3c7", "#b45309")}
                    >
                      {isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={busyId === p.id}
                      title="Delete permanently"
                      style={iconBtn("#fee2e2", "#dc2626")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit modal */}
      {editing && (
        <div
          onClick={() => setEditing(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(26,15,46,0.45)", backdropFilter: "blur(4px)", zIndex: 300, display: "grid", placeItems: "center", padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 540, maxHeight: "86vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <h2 style={{ ...h2Style, fontSize: 22, color: "var(--ink)" }}>Edit profile</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink)", opacity: 0.5 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Role</label>
              <select
                value={(editDraft.role as string) || "student"}
                onChange={e => setEditDraft(d => ({ ...d, role: e.target.value }))}
                style={inputStyle}
              >
                <option value="student">student</option>
                <option value="senior">senior</option>
              </select>
            </div>

            {EDIT_FIELDS.map(f => (
              <div key={f.key as string} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                {f.key === "bio" ? (
                  <textarea
                    value={(editDraft[f.key] as string) ?? ""}
                    onChange={e => setEditDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                ) : (
                  <input
                    value={(editDraft[f.key] as string) ?? ""}
                    onChange={e => setEditDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                onClick={saveEdit}
                disabled={busyId === editing.id}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", background: "var(--violet)", color: "#fff", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <Save size={15} /> Save changes
              </button>
              <button
                onClick={() => setEditing(null)}
                style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid var(--line)", cursor: "pointer", background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

function iconBtn(bg: string, color: string): React.CSSProperties {
  return {
    width: 38, height: 38, borderRadius: 10, border: "none", cursor: "pointer",
    background: bg, color, display: "grid", placeItems: "center",
  };
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink)", opacity: 0.7, marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line)",
  background: "#fff", fontSize: 14, color: "var(--ink)", outline: "none",
};
