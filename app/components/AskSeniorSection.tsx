"use client";

import { useState, useMemo } from "react";
import { X, Mail, Link2, GraduationCap } from "lucide-react";
import { SENIOR_PROFILES, SCHOOLS, SeniorProfile } from "@/lib/data";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function SeniorCard({
  senior,
  onClick,
}: {
  senior: SeniorProfile;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card text-left w-full group cursor-pointer relative overflow-hidden"
      style={{ padding: "20px" }}
      aria-label={`View profile of senior ${senior.name}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-start gap-3 mb-3">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-purple-sm`}
        >
          {getInitials(senior.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-semibold truncate"
              style={{ color: "#1a1033", fontSize: "0.95rem" }}
            >
              {senior.name}
            </span>
            <span className="flag-emoji">{senior.countryFlag}</span>
          </div>
          <div className="text-xs mt-0.5 truncate" style={{ color: "#7B6EA8" }}>
            {senior.programme}
          </div>
          <div className="text-xs" style={{ color: "#9B8EC8" }}>
            Class of {senior.graduationYear}
          </div>
        </div>
      </div>

      {/* Ask me about */}
      <div
        className="rounded-xl px-3 py-2 mb-3"
        style={{ background: "rgba(200, 184, 255, 0.25)" }}
      >
        <p className="text-xs font-medium" style={{ color: "#7C5CFF" }}>
          💬 Ask me about:
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#4a3878" }}>
          {senior.askMeAbout}
        </p>
      </div>

      <div
        className="flex items-center gap-2 pt-2"
        style={{ borderTop: "1px solid rgba(200, 184, 255, 0.3)" }}
      >
        {senior.email && (
          <Mail size={13} style={{ color: "#7C5CFF", opacity: 0.7 }} />
        )}
        {senior.linkedin && (
          <Link2 size={13} style={{ color: "#7C5CFF", opacity: 0.7 }} />
        )}
        <span
          className="text-xs ml-auto font-medium"
          style={{ color: "#7C5CFF", opacity: 0.8 }}
        >
          Get in touch →
        </span>
      </div>
    </button>
  );
}

function SeniorModal({
  senior,
  onClose,
}: {
  senior: SeniorProfile;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ padding: "28px" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="senior-modal-name"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-lavender-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} style={{ color: "#7B6EA8" }} />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${senior.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-purple-md`}
          >
            {getInitials(senior.name)}
          </div>
          <div>
            <h2
              id="senior-modal-name"
              className="font-serif text-xl"
              style={{ color: "#1a1033" }}
            >
              {senior.name} {senior.countryFlag}
            </h2>
            <p className="text-sm" style={{ color: "#7B6EA8" }}>
              {senior.programme}
            </p>
            <p className="text-xs" style={{ color: "#9B8EC8" }}>
              Class of {senior.graduationYear} · {senior.country}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl px-4 py-3 mb-4"
          style={{ background: "rgba(200, 184, 255, 0.25)" }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: "#7C5CFF" }}>
            💬 Ask me about
          </p>
          <p className="text-sm" style={{ color: "#4a3878" }}>
            {senior.askMeAbout}
          </p>
        </div>

        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "rgba(233, 226, 255, 0.4)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#3a2860" }}>
            {senior.bio}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {senior.email && (
            <a
              href={senior.email}
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm rounded-xl"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <Mail size={15} />
              Send an email
            </a>
          )}
          {senior.linkedin && (
            <a
              href={senior.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm rounded-xl"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <Link2 size={15} />
              View on LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AskSeniorSection() {
  const [selectedSenior, setSelectedSenior] = useState<SeniorProfile | null>(null);
  const [activeSchool, setActiveSchool] = useState<string>("All");

  const schools = ["All", ...Array.from(new Set(SENIOR_PROFILES.map((s) => s.school)))];

  const filtered = useMemo(() => {
    if (activeSchool === "All") return SENIOR_PROFILES;
    return SENIOR_PROFILES.filter((s) => s.school === activeSchool);
  }, [activeSchool]);

  return (
    <section
      id="ask-a-senior"
      className="relative z-10 section-padding"
      aria-labelledby="seniors-title"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(200, 184, 255, 0.12) 50%, transparent 100%)",
      }}
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
            <GraduationCap size={14} />
            Real seniors. Real answers.
          </div>
          <h2
            id="seniors-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            Ask a{" "}
            <span className="gradient-text italic">Senior</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            Students who went through it last year — and remember what it was like.
            Reach out. They signed up specifically to help.
          </p>
        </div>

        {/* School tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {schools.map((school) => (
            <button
              key={school}
              onClick={() => setActiveSchool(school)}
              className="chip text-sm py-2 px-4"
              style={{
                ...(activeSchool === school
                  ? {
                      background: "linear-gradient(135deg, #7C5CFF, #6B4EFF)",
                      color: "white",
                      border: "none",
                    }
                  : {}),
              }}
              aria-pressed={activeSchool === school}
            >
              {school === "Smurfit Business School" ? "Smurfit" : school}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((senior) => (
            <SeniorCard
              key={senior.id}
              senior={senior}
              onClick={() => setSelectedSenior(senior)}
            />
          ))}
        </div>

        {/* Want to be a senior? */}
        <div
          className="glass-soft rounded-2xl p-6 mt-10 text-center"
          style={{
            border: "1.5px dashed rgba(124, 92, 255, 0.25)",
            maxWidth: 480,
            margin: "40px auto 0",
          }}
        >
          <p
            className="font-serif text-lg mb-2"
            style={{ color: "#1a1033" }}
          >
            Were you here last year?
          </p>
          <p className="text-sm mb-4" style={{ color: "#7B6EA8", lineHeight: 1.6 }}>
            If you&apos;re a returning or graduated UCD student who wants to help incoming internationals,
            we&apos;d love to add you to this directory.
          </p>
          <a
            href="mailto:wellforward.ucd@gmail.com?subject=I want to be a senior on Wellforward"
            className="btn-primary px-6 py-2.5 text-sm inline-block"
            style={{ textDecoration: "none" }}
          >
            Get in touch
          </a>
        </div>
      </div>

      {selectedSenior && (
        <SeniorModal
          senior={selectedSenior}
          onClose={() => setSelectedSenior(null)}
        />
      )}
    </section>
  );
}
