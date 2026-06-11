"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { X, Link2, Share2, Filter, UserPlus, AlertCircle } from "lucide-react";
import { STUDENT_PROFILES, INTEREST_TAGS, StudentProfile } from "@/lib/data";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

/* ─── Scroll reveal hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Profile card — intentionally varied heights ──────────────── */
function ProfileCard({ profile, onClick, index }: { profile: StudentProfile; onClick: () => void; index: number }) {
  const ref = useReveal();
  // Slight rotation variety — feels handmade not templated
  const rotations = ["-0.4deg", "0.3deg", "-0.2deg", "0.5deg", "0deg", "-0.3deg"];
  const rot = rotations[index % rotations.length];

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${(index % 4) * 60}ms` }}>
      <button
        onClick={onClick}
        className="card glow-on-hover text-left w-full group cursor-pointer relative overflow-hidden"
        style={{ padding: "18px 20px", transform: `rotate(${rot})` }}
        aria-label={`View ${profile.name} from ${profile.country}`}
      >
        {/* Hover bloom */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: "radial-gradient(ellipse at 50% -10%, rgba(124,92,255,0.09) 0%, transparent 65%)",
          }}
        />

        {/* New badge */}
        {profile.isNew && (
          <div
            className="absolute top-3 right-3"
            style={{
              background: "linear-gradient(135deg,#7c5cff,#5a3ee8)",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "2px 8px",
              borderRadius: 5,
              textTransform: "uppercase",
            }}
            aria-label="New member"
          >
            new
          </div>
        )}

        {/* Avatar row */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-[10px] bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-bold text-sm`}
            style={{
              boxShadow: "0 4px 12px -4px rgba(0,0,0,0.18)",
              letterSpacing: "0.03em",
            }}
            aria-hidden="true"
          >
            {getInitials(profile.name)}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div
              className="serif font-bold leading-tight truncate"
              style={{ fontSize: "1rem", color: "#1c1430" }}
            >
              {profile.name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9b8ec8", marginTop: 1 }}>
              {profile.countryFlag} {profile.country} · {profile.school.replace("Smurfit Business School","Smurfit").replace("Engineering","Eng").replace("Arts & Humanities","Arts")}
            </div>
          </div>
        </div>

        {/* Course — subtle, not a badge */}
        <p style={{ fontSize: "0.75rem", color: "#6b5a8e", marginBottom: 8, fontWeight: 500 }}>
          {profile.course}
        </p>

        {/* Bio — real text, not truncated to death */}
        <p
          style={{
            fontSize: "0.82rem",
            color: "#3d2f60",
            lineHeight: 1.58,
            marginBottom: 12,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {profile.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {profile.tags.slice(0, 3).map(t => (
            <span key={t} className="chip" style={{ cursor: "default", pointerEvents: "none" }}>{t}</span>
          ))}
          {profile.tags.length > 3 && (
            <span className="chip" style={{ opacity: 0.5, cursor: "default", pointerEvents: "none" }}>
              +{profile.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-2 pt-2"
          style={{ borderTop: "1px solid rgba(200,184,255,0.25)" }}
        >
          {profile.instagram && <Share2 size={13} style={{ color: "#9b8ec8" }} aria-label="Instagram" />}
          {profile.linkedin  && <Link2  size={13} style={{ color: "#9b8ec8" }} aria-label="LinkedIn" />}
          <span
            className="ml-auto text-xs font-medium"
            style={{ color: "#7c5cff", opacity: 0.85 }}
          >
            say hi →
          </span>
        </div>
      </button>
    </div>
  );
}

/* ─── Profile modal ──────────────────────────────────────────── */
function ProfileModal({ profile, onClose }: { profile: StudentProfile; onClose: () => void }) {
  const [reported, setReported] = useState(false);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass relative w-full max-w-sm rounded-2xl overflow-y-auto"
        style={{ padding: "26px", maxHeight: "90vh", animation: "scaleIn 0.2s ease" }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-name"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(200,184,255,0.3)", border: "none",
            width: 30, height: 30, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#6b5a8e",
          }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-14 h-14 rounded-[12px] bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-bold text-lg`}
            style={{ flexShrink: 0, boxShadow: "0 6px 18px -6px rgba(0,0,0,0.22)" }}
          >
            {getInitials(profile.name)}
          </div>
          <div>
            <h2
              id="modal-name"
              className="serif"
              style={{ fontSize: "1.3rem", color: "#1c1430" }}
            >
              {profile.name} {profile.countryFlag}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#9b8ec8" }}>{profile.course}</p>
            <p style={{ fontSize: "0.72rem", color: "#b0a0cc" }}>{profile.year} · {profile.country}</p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(200,184,255,0.18)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#2a1d50", lineHeight: 1.65 }}>
            {profile.bio}
          </p>
        </div>

        <div className="mb-5">
          <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", color: "#b0a0cc", textTransform: "uppercase", marginBottom: 8 }}>
            into
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.tags.map(t => <span key={t} className="chip" style={{ cursor: "default" }}>{t}</span>)}
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {profile.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm"
              style={{ textDecoration: "none", borderRadius: 10 }}
            >
              <Share2 size={15} />
              Connect on Instagram
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm"
              style={{ textDecoration: "none", borderRadius: 10 }}
            >
              <Link2 size={15} />
              Connect on LinkedIn
            </a>
          )}
        </div>

        <button
          onClick={() => setReported(true)}
          disabled={reported}
          style={{
            background: "none", border: "none", cursor: reported ? "default" : "pointer",
            fontSize: "0.72rem", color: reported ? "#22c55e" : "#b0a0cc",
            display: "flex", alignItems: "center", gap: 4, margin: "0 auto",
          }}
        >
          <AlertCircle size={11} />
          {reported ? "Reported — thank you" : "Report this profile"}
        </button>
      </div>
    </div>
  );
}

/* ─── Create profile prompt ─────────────────────────────────── */
function CreatePrompt() {
  const [open, setOpen]           = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]           = useState({
    name: "", course: "", country: "", bio: "",
    instagram: "", linkedin: "", agree: false,
  });

  if (submitted) {
    return (
      <div
        className="glass"
        style={{
          maxWidth: 420, margin: "0 auto 48px",
          padding: "28px 24px",
          borderRadius: 18,
          textAlign: "center",
          animation: "scaleIn 0.3s ease",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🎉</div>
        <h3 className="serif" style={{ fontSize: "1.2rem", color: "#1c1430", marginBottom: 6 }}>You&apos;re in!</h3>
        <p style={{ fontSize: "0.85rem", color: "#6b5a8e", lineHeight: 1.6 }}>
          Someone out there is about to be really glad you joined.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div
        style={{
          maxWidth: 440, margin: "0 auto 48px",
          padding: "22px 24px",
          borderRadius: 16,
          border: "1.5px dashed rgba(124,92,255,0.28)",
          background: "rgba(233,226,255,0.25)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 44, height: 44,
            borderRadius: 12,
            background: "rgba(200,184,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <UserPlus size={20} style={{ color: "#7c5cff" }} />
        </div>
        <h3 className="serif" style={{ fontSize: "1.1rem", color: "#1c1430", marginBottom: 5 }}>
          Add yourself first
        </h3>
        <p style={{ fontSize: "0.82rem", color: "#6b5a8e", lineHeight: 1.6, marginBottom: 14 }}>
          This works because everyone shows up. Drop your profile so someone can find you too — it takes 90 seconds.
        </p>
        <button onClick={() => setOpen(true)} className="btn-primary px-6 py-2.5 text-sm" style={{ borderRadius: 9 }}>
          Create my profile
        </button>
      </div>
    );
  }

  const inp = (placeholder: string, key: keyof typeof form, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[key] as string}
      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
      aria-label={placeholder}
      style={{
        width: "100%", padding: "11px 14px",
        background: "rgba(233,226,255,0.45)",
        border: "1px solid rgba(124,92,255,0.18)",
        borderRadius: 9, fontSize: "0.85rem",
        color: "#1c1430", outline: "none",
        fontFamily: "var(--font-sans)",
      }}
    />
  );

  return (
    <div
      className="glass"
      style={{
        maxWidth: 480, margin: "0 auto 48px",
        padding: "24px", borderRadius: 18,
        animation: "scaleIn 0.22s ease",
      }}
    >
      <h3 className="serif" style={{ fontSize: "1.2rem", color: "#1c1430", marginBottom: 4 }}>Create your profile</h3>
      <p style={{ fontSize: "0.8rem", color: "#9b8ec8", marginBottom: 18 }}>2 minutes · only UCD students will see this</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {inp("First name or display name", "name")}
        {inp("Course (e.g. MSc Business Analytics)", "course")}
        {inp("Home country", "country")}
        <textarea
          placeholder="Short bio — what you're into, what you're looking for (max 200 chars)"
          value={form.bio}
          onChange={e => setForm(p => ({ ...p, bio: e.target.value.slice(0, 200) }))}
          rows={3}
          aria-label="Bio"
          style={{
            width: "100%", padding: "11px 14px",
            background: "rgba(233,226,255,0.45)",
            border: "1px solid rgba(124,92,255,0.18)",
            borderRadius: 9, fontSize: "0.85rem",
            color: "#1c1430", resize: "none", outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {inp("Instagram URL", "instagram", "url")}
          {inp("LinkedIn URL", "linkedin", "url")}
        </div>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.agree}
            onChange={e => setForm(p => ({ ...p, agree: e.target.checked }))}
            style={{ marginTop: 3, accentColor: "#7c5cff" }}
          />
          <span style={{ fontSize: "0.76rem", color: "#9b8ec8", lineHeight: 1.55 }}>
            I agree to be kind, honest, and use this only for genuine connection — not promotions or anything weird.
          </span>
        </label>
        <button
          onClick={() => { if (form.name && form.agree) setSubmitted(true); }}
          disabled={!form.name || !form.agree}
          className="btn-primary py-3 text-sm"
          style={{
            borderRadius: 10,
            opacity: (!form.name || !form.agree) ? 0.45 : 1,
            cursor: (!form.name || !form.agree) ? "not-allowed" : "pointer",
          }}
        >
          Add my profile
        </button>
      </div>
    </div>
  );
}

/* ─── Running marquee of tags ───────────────────────────────── */
function TagMarquee() {
  return (
    <div className="marquee-wrap mb-8 py-3" style={{ borderTop: "1px solid rgba(200,184,255,0.25)", borderBottom: "1px solid rgba(200,184,255,0.25)" }}>
      <div className="marquee-track">
        {[...INTEREST_TAGS, ...INTEREST_TAGS].map((t, i) => (
          <span
            key={i}
            className="chip"
            style={{ cursor: "default", flexShrink: 0, fontSize: "0.75rem", padding: "5px 13px" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────── */
export default function MakeFriendSection() {
  const [selected, setSelected]     = useState<StudentProfile | null>(null);
  const [searchCourse, setSearchCourse] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [newOnly, setNewOnly]       = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const sectionRef = useReveal();

  const toggleTag = (t: string) =>
    setActiveTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const filtered = useMemo(() => STUDENT_PROFILES.filter(p => {
    if (newOnly && !p.isNew) return false;
    if (searchCourse && !p.course.toLowerCase().includes(searchCourse.toLowerCase()) && !p.school.toLowerCase().includes(searchCourse.toLowerCase())) return false;
    if (searchCountry && !p.country.toLowerCase().includes(searchCountry.toLowerCase())) return false;
    if (activeTags.length && !activeTags.every(t => p.tags.includes(t))) return false;
    return true;
  }), [searchCourse, searchCountry, activeTags, newOnly]);

  return (
    <section
      id="make-a-friend"
      className="relative z-10 section-padding"
      aria-labelledby="maf-title"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-10">

        {/* Section header */}
        <div ref={sectionRef} className="reveal mb-10">
          <span className="section-label">✦ the heart of wellforward</span>
          <h2
            className="serif mb-4"
            style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}
            id="maf-title"
          >
            Find people who <em className="grad-text-warm">get it.</em>
          </h2>
          <p style={{ maxWidth: 500, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            UCD international students who are figuring it out too. Filter by course, country, or what you&apos;re into — then take it to Instagram or LinkedIn. No in-app chat. This isn&apos;t a dating app. It&apos;s just people looking for people.
          </p>
        </div>

        {/* Tag marquee — adds life above the filter */}
        <TagMarquee />

        {/* Create profile prompt */}
        <CreatePrompt />

        {/* Filter bar — deliberately minimal, not a full search UI */}
        <div
          style={{
            background: "rgba(245,241,255,0.7)",
            border: "1px solid rgba(200,184,255,0.28)",
            borderRadius: 14,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <div className="flex flex-wrap gap-3 items-center">
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 140 }}>
              <Filter size={14} style={{ color: "#9b8ec8", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Course or school…"
                value={searchCourse}
                onChange={e => setSearchCourse(e.target.value)}
                aria-label="Filter by course"
                style={{
                  flex: 1, background: "transparent",
                  border: "none", outline: "none",
                  fontSize: "0.85rem", color: "#1c1430",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Country…"
              value={searchCountry}
              onChange={e => setSearchCountry(e.target.value)}
              aria-label="Filter by country"
              style={{
                width: 110, background: "transparent",
                border: "none", outline: "none",
                fontSize: "0.85rem", color: "#1c1430",
                fontFamily: "var(--font-sans)",
              }}
            />
            <label
              style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: "0.8rem", color: "#7c5cff", fontWeight: 500 }}
            >
              <input
                type="checkbox"
                checked={newOnly}
                onChange={e => setNewOnly(e.target.checked)}
                style={{ accentColor: "#7c5cff" }}
              />
              New this week
            </label>
            <button
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="chip"
              style={{ fontSize: "0.75rem", padding: "5px 12px" }}
            >
              {showTagFilter ? "Hide interests ↑" : "Filter by interest ↓"}
            </button>
            {(searchCourse || searchCountry || activeTags.length || newOnly) && (
              <button
                onClick={() => { setSearchCourse(""); setSearchCountry(""); setActiveTags([]); setNewOnly(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#b0a0cc", display: "flex", alignItems: "center", gap: 3 }}
              >
                <X size={12}/> clear
              </button>
            )}
          </div>

          {showTagFilter && (
            <div
              className="flex flex-wrap gap-1.5 pt-3 mt-3"
              style={{ borderTop: "1px solid rgba(200,184,255,0.25)" }}
            >
              {INTEREST_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`chip ${activeTags.includes(t) ? "active" : ""}`}
                  aria-pressed={activeTags.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Result count */}
        <p style={{ fontSize: "0.78rem", color: "#b0a0cc", marginBottom: 20 }}>
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          {filtered.length < STUDENT_PROFILES.length ? " matching" : " on Wellforward so far"}
        </p>

        {/* Profile grid — masonry-ish via CSS columns on desktop */}
        {filtered.length > 0 ? (
          <div
            style={{
              columns: "1",
              columnGap: "16px",
            }}
            className="sm:columns-2 lg:columns-3 xl:columns-4"
          >
            {filtered.map((p, i) => (
              <div key={p.id} style={{ breakInside: "avoid", marginBottom: 16 }}>
                <ProfileCard profile={p} onClick={() => setSelected(p)} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "56px 0" }}>
            <p style={{ fontSize: "2rem", marginBottom: 10 }}>🔭</p>
            <p className="serif" style={{ fontSize: "1.1rem", color: "#1c1430", marginBottom: 5 }}>No matches yet</p>
            <p style={{ fontSize: "0.85rem", color: "#9b8ec8" }}>
              Try adjusting your filters — or be the first from your country.
            </p>
          </div>
        )}
      </div>

      {selected && <ProfileModal profile={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
