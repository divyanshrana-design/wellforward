"use client";

import { useState, useMemo } from "react";
import { X, Link2, Share2, Filter, Sparkles, UserPlus, AlertCircle } from "lucide-react";
import { STUDENT_PROFILES, INTEREST_TAGS, SCHOOLS, StudentProfile } from "@/lib/data";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function ProfileCard({
  profile,
  onClick,
}: {
  profile: StudentProfile;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card text-left w-full group cursor-pointer relative overflow-hidden"
      style={{ padding: "20px" }}
      aria-label={`View profile of ${profile.name} from ${profile.country}`}
    >
      {/* Cursor glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 70%)",
        }}
      />

      {/* New badge */}
      {profile.isNew && (
        <span
          className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #7C5CFF, #6B4EFF)",
            color: "white",
          }}
        >
          New
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-purple-sm`}
          aria-hidden="true"
        >
          {getInitials(profile.name)}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-semibold truncate"
              style={{ color: "#1a1033", fontSize: "0.95rem" }}
            >
              {profile.name}
            </span>
            <span className="flag-emoji flex-shrink-0">{profile.countryFlag}</span>
          </div>
          <div
            className="text-xs truncate mt-0.5"
            style={{ color: "#7B6EA8" }}
          >
            {profile.course}
          </div>
          <div className="text-xs" style={{ color: "#9B8EC8" }}>
            {profile.year} · {profile.country}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p
        className="text-sm mb-3 leading-relaxed line-clamp-2"
        style={{ color: "#4a3878" }}
      >
        {profile.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {profile.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
        {profile.tags.length > 3 && (
          <span className="chip" style={{ opacity: 0.6 }}>
            +{profile.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(200, 184, 255, 0.3)" }}
      >
        {profile.instagram && (
          <Share2
            size={14}
            style={{ color: "#7C5CFF", opacity: 0.7 }}
            aria-label="Has Instagram"
          />
        )}
        {profile.linkedin && (
          <Link2
            size={14}
            style={{ color: "#7C5CFF", opacity: 0.7 }}
            aria-label="Has LinkedIn"
          />
        )}
        <span
          className="text-xs ml-auto font-medium"
          style={{ color: "#7C5CFF", opacity: 0.8 }}
        >
          View profile →
        </span>
      </div>
    </button>
  );
}

function ProfileModal({
  profile,
  onClose,
}: {
  profile: StudentProfile;
  onClose: () => void;
}) {
  const [reported, setReported] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ padding: "28px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-name"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-lavender-100 transition-colors"
          aria-label="Close profile"
        >
          <X size={18} style={{ color: "#7B6EA8" }} />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-purple-md`}
          >
            {getInitials(profile.name)}
          </div>
          <div>
            <h2
              id="modal-name"
              className="font-serif text-xl"
              style={{ color: "#1a1033" }}
            >
              {profile.name} {profile.countryFlag}
            </h2>
            <p className="text-sm" style={{ color: "#7B6EA8" }}>
              {profile.course}
            </p>
            <p className="text-xs" style={{ color: "#9B8EC8" }}>
              {profile.year} · {profile.country}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "rgba(200, 184, 255, 0.2)" }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#3a2860" }}
          >
            {profile.bio}
          </p>
        </div>

        {/* Interests */}
        <div className="mb-5">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#9B8EC8" }}
          >
            Into
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Connect buttons */}
        <div className="flex flex-col gap-2 mb-4">
          {profile.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm rounded-xl"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <Share2 size={16} />
              Connect on Instagram
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm rounded-xl"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <Link2 size={16} />
              Connect on LinkedIn
            </a>
          )}
        </div>

        {/* Report */}
        <button
          onClick={() => setReported(true)}
          className="text-xs flex items-center gap-1 mx-auto"
          style={{
            color: reported ? "#22c55e" : "#9B8EC8",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: 0.7,
          }}
          disabled={reported}
        >
          <AlertCircle size={12} />
          {reported ? "Thank you — report received" : "Report this profile"}
        </button>
      </div>
    </div>
  );
}

// ─── Create Profile CTA ───────────────────────────────────────────────────────
function CreateProfilePrompt() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    country: "",
    bio: "",
    instagram: "",
    linkedin: "",
    agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className="glass rounded-2xl p-8 text-center mb-10"
        style={{ maxWidth: 480, margin: "0 auto 40px" }}
      >
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-serif text-xl mb-2" style={{ color: "#1a1033" }}>
          You&apos;re in the mix!
        </h3>
        <p className="text-sm" style={{ color: "#7B6EA8" }}>
          Your profile has been added. Someone out there is about to be very glad you joined.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div
        className="glass-soft rounded-2xl p-6 mb-10 text-center"
        style={{
          maxWidth: 520,
          margin: "0 auto 40px",
          border: "1.5px dashed rgba(124, 92, 255, 0.25)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: "rgba(200, 184, 255, 0.4)" }}
        >
          <UserPlus size={22} style={{ color: "#7C5CFF" }} />
        </div>
        <h3
          className="font-serif text-lg mb-1"
          style={{ color: "#1a1033" }}
        >
          Add yourself first
        </h3>
        <p
          className="text-sm mb-4"
          style={{ color: "#7B6EA8", lineHeight: 1.6 }}
        >
          This works because everyone shows up for each other. Create your profile so someone else can find you too.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary px-6 py-2.5 text-sm"
        >
          Create my profile
        </button>
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl p-6 mb-10"
      style={{ maxWidth: 520, margin: "0 auto 40px" }}
    >
      <h3
        className="font-serif text-xl mb-1"
        style={{ color: "#1a1033" }}
      >
        Create your profile
      </h3>
      <p
        className="text-sm mb-5"
        style={{ color: "#7B6EA8" }}
      >
        It takes 2 minutes. Only UCD students can see this.
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="First name or display name"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(233, 226, 255, 0.5)",
            border: "1px solid rgba(124, 92, 255, 0.2)",
            color: "#1a1033",
            outline: "none",
          }}
          aria-label="Display name"
        />
        <input
          type="text"
          placeholder="Course (e.g. MSc Business Analytics)"
          value={formData.course}
          onChange={(e) => setFormData((p) => ({ ...p, course: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(233, 226, 255, 0.5)",
            border: "1px solid rgba(124, 92, 255, 0.2)",
            color: "#1a1033",
            outline: "none",
          }}
          aria-label="Course"
        />
        <input
          type="text"
          placeholder="Home country"
          value={formData.country}
          onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(233, 226, 255, 0.5)",
            border: "1px solid rgba(124, 92, 255, 0.2)",
            color: "#1a1033",
            outline: "none",
          }}
          aria-label="Home country"
        />
        <textarea
          placeholder="Short bio — what you're into, what you're looking for (max 200 chars)"
          value={formData.bio}
          onChange={(e) =>
            setFormData((p) => ({ ...p, bio: e.target.value.slice(0, 200) }))
          }
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm resize-none"
          style={{
            background: "rgba(233, 226, 255, 0.5)",
            border: "1px solid rgba(124, 92, 255, 0.2)",
            color: "#1a1033",
            outline: "none",
          }}
          aria-label="Bio"
        />
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="Instagram URL"
            value={formData.instagram}
            onChange={(e) => setFormData((p) => ({ ...p, instagram: e.target.value }))}
            className="flex-1 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(233, 226, 255, 0.5)",
              border: "1px solid rgba(124, 92, 255, 0.2)",
              color: "#1a1033",
              outline: "none",
            }}
            aria-label="Instagram URL"
          />
          <input
            type="url"
            placeholder="LinkedIn URL"
            value={formData.linkedin}
            onChange={(e) => setFormData((p) => ({ ...p, linkedin: e.target.value }))}
            className="flex-1 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(233, 226, 255, 0.5)",
              border: "1px solid rgba(124, 92, 255, 0.2)",
              color: "#1a1033",
              outline: "none",
            }}
            aria-label="LinkedIn URL"
          />
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agree}
            onChange={(e) => setFormData((p) => ({ ...p, agree: e.target.checked }))}
            className="mt-1 accent-violet-600"
          />
          <span className="text-xs" style={{ color: "#7B6EA8", lineHeight: 1.5 }}>
            I agree to the community guidelines — be kind, be honest, and don&apos;t use this for anything other than genuine connection.
          </span>
        </label>
        <button
          onClick={() => {
            if (formData.name && formData.agree) setSubmitted(true);
          }}
          disabled={!formData.name || !formData.agree}
          className="btn-primary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add my profile
        </button>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function MakeFriendSection() {
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterNew, setFilterNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProfiles = useMemo(() => {
    return STUDENT_PROFILES.filter((p) => {
      if (filterNew && !p.isNew) return false;
      if (filterCourse && !p.course.toLowerCase().includes(filterCourse.toLowerCase()) && !p.school.toLowerCase().includes(filterCourse.toLowerCase())) return false;
      if (filterCountry && !p.country.toLowerCase().includes(filterCountry.toLowerCase())) return false;
      if (filterTags.length > 0 && !filterTags.every((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [filterCourse, filterCountry, filterTags, filterNew]);

  const toggleTag = (tag: string) => {
    setFilterTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section
      id="make-a-friend"
      className="relative z-10 section-padding"
      aria-labelledby="make-friend-title"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm"
            style={{
              background: "rgba(200, 184, 255, 0.4)",
              color: "#6B4EFF",
              border: "1px solid rgba(124, 92, 255, 0.2)",
            }}
          >
            <Sparkles size={14} />
            The heart of Wellforward
          </div>
          <h2
            id="make-friend-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            Find people who{" "}
            <span className="gradient-text italic">get it.</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            Other UCD international students who are also figuring it out. Filter by course, interest, or home country — then take it to Instagram or LinkedIn.
          </p>
          <p
            className="text-sm mt-3"
            style={{ color: "#9B8EC8" }}
          >
            This is not a dating app. It&apos;s just people looking for people.
          </p>
        </div>

        {/* Create profile prompt */}
        <CreateProfilePrompt />

        {/* Filter bar */}
        <div
          className="glass-soft rounded-2xl p-4 mb-8"
          style={{ border: "1px solid rgba(200, 184, 255, 0.35)" }}
        >
          <div className="flex flex-wrap gap-3 items-center mb-3">
            <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
              <Filter size={14} style={{ color: "#7C5CFF" }} />
              <input
                type="text"
                placeholder="Search course or school…"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "#1a1033" }}
                aria-label="Filter by course or school"
              />
            </div>
            <input
              type="text"
              placeholder="Country…"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-transparent text-sm outline-none w-28"
              style={{ color: "#1a1033" }}
              aria-label="Filter by country"
            />
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filterNew}
                onChange={(e) => setFilterNew(e.target.checked)}
                className="accent-violet-600"
              />
              <span className="text-xs font-medium" style={{ color: "#7C5CFF" }}>
                New this week
              </span>
            </label>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background: showFilters ? "rgba(124,92,255,0.15)" : "rgba(200,184,255,0.3)",
                color: "#6B4EFF",
              }}
            >
              {showFilters ? "Hide interests" : "Filter by interest"}
            </button>
            {(filterCourse || filterCountry || filterTags.length > 0 || filterNew) && (
              <button
                onClick={() => {
                  setFilterCourse("");
                  setFilterCountry("");
                  setFilterTags([]);
                  setFilterNew(false);
                }}
                className="text-xs flex items-center gap-1"
                style={{ color: "#9B8EC8" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Tag filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: "1px solid rgba(200,184,255,0.3)" }}>
              {INTEREST_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`chip ${filterTags.includes(tag) ? "active" : ""}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <p
          className="text-sm mb-5"
          style={{ color: "#9B8EC8" }}
        >
          {filteredProfiles.length} student{filteredProfiles.length !== 1 ? "s" : ""}{" "}
          {filteredProfiles.length < STUDENT_PROFILES.length ? "matching your filters" : "on Wellforward so far"}
        </p>

        {/* Profile grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => setSelectedProfile(profile)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔭</div>
            <h3 className="font-serif text-lg mb-2" style={{ color: "#1a1033" }}>
              No matches yet
            </h3>
            <p className="text-sm" style={{ color: "#7B6EA8" }}>
              Try adjusting your filters — or be the first to join from your country or course.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </section>
  );
}
