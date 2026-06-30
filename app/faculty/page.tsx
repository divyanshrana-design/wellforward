"use client";

import { useState, useEffect, useRef } from "react";
import MeshBackground from "../components/MeshBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  GraduationCap, Mail, Link2, Globe, BookOpen,
  MapPin, Search, X, ExternalLink, UserCheck,
  ChevronDown, Building2
} from "lucide-react";

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  programme: string;
  school: string;
  bio: string | null;
  photo_url: string | null;
  linkedin: string | null;
  instagram: string | null;
  contact_email: string | null;
  faculty_title: string | null;
  faculty_modules: string | null;
  faculty_office: string | null;
  faculty_website: string | null;
  created_at: string;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "https://" + url;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#7c5cff,#c8b8ff)",
  "linear-gradient(135deg,#0ea5e9,#38bdf8)",
  "linear-gradient(135deg,#10b981,#34d399)",
  "linear-gradient(135deg,#f59e0b,#fcd34d)",
  "linear-gradient(135deg,#ef4444,#fca5a5)",
  "linear-gradient(135deg,#8b5cf6,#a78bfa)",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.classList.add("visible"); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0 }
    );
    obs.observe(el);
    const t = setTimeout(() => el.classList.add("visible"), 600);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
  return ref;
}

/* ─── Faculty Card ────────────────────────────────────────────── */
function FacultyCard({ faculty, index, isLoggedIn }: { faculty: FacultyProfile; index: number; isLoggedIn: boolean | null }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useReveal();
  const modules = faculty.faculty_modules ? faculty.faculty_modules.split(",").map(m => m.trim()).filter(Boolean) : [];
  const color = getColor(faculty.name);

  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${index * 50}ms` }}>
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          cursor: "default",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px -8px rgba(124,92,255,0.2)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
          (e.currentTarget as HTMLDivElement).style.transform = "";
        }}
      >
        {/* Card header */}
        <div style={{ padding: "22px 22px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: 16, flexShrink: 0,
            background: faculty.photo_url ? "transparent" : color,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", border: "2px solid rgba(200,184,255,0.3)",
          }}>
            {faculty.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={faculty.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.2rem", fontWeight: 700, color: "white" }}>
                {getInitials(faculty.name)}
              </span>
            )}
          </div>

          {/* Name + title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h3 style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.05rem", fontWeight: 700,
                color: "#1a0f2e", letterSpacing: "-0.02em",
              }}>
                {faculty.faculty_title ? `${faculty.faculty_title} ` : ""}{faculty.name}
              </h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Building2 size={12} style={{ color: "#9b8ec8", flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: "#6b5a8e", fontWeight: 500 }}>
                UCD Smurfit Business School
              </span>
            </div>
            {faculty.faculty_office && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={12} style={{ color: "#9b8ec8", flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "#9b8ec8" }}>{faculty.faculty_office}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modules taught */}
        {modules.length > 0 && (
          <div style={{ padding: "0 22px 16px" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#8a78b8", marginBottom: 8 }}>
              Modules taught
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {modules.map((mod, i) => (
                <span key={i} style={{
                  fontSize: "0.72rem", fontWeight: 600,
                  color: "#7c5cff", background: "rgba(124,92,255,0.08)",
                  border: "1px solid rgba(124,92,255,0.15)",
                  padding: "3px 10px", borderRadius: 6,
                }}>
                  {mod}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio (expandable) */}
        {faculty.bio && (
          <div style={{ padding: "0 22px 16px" }}>
            <p style={{
              fontSize: "0.85rem", color: "#38285c", lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: "vertical",
              overflow: expanded ? "visible" : "hidden",
            }}>
              {faculty.bio}
            </p>
            {faculty.bio.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.75rem", color: "#7c5cff", fontWeight: 600,
                  padding: "4px 0", display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
            )}
          </div>
        )}

        {/* Footer - links */}
        <div style={{
          padding: "14px 22px",
          borderTop: "1px solid rgba(200,184,255,0.2)",
          display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
        }}>
          {/* Contact - only visible if logged in */}
          {isLoggedIn === null ? null : isLoggedIn ? (
            <>
              {(faculty.contact_email || faculty.email) && (
                <a
                  href={`mailto:${faculty.contact_email || faculty.email}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 8, textDecoration: "none",
                    fontSize: "0.8rem", fontWeight: 600,
                    background: "linear-gradient(135deg,#7c5cff,#5a3ee8)",
                    color: "white", border: "1.5px solid transparent",
                  }}
                >
                  <Mail size={13} /> Email
                </a>
              )}
              {faculty.linkedin && (
                <a
                  href={ensureHttps(faculty.linkedin)}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 8, textDecoration: "none",
                    fontSize: "0.8rem", fontWeight: 600,
                    background: "rgba(124,92,255,0.08)",
                    color: "#7c5cff", border: "1.5px solid rgba(124,92,255,0.2)",
                  }}
                >
                  <Link2 size={13} /> LinkedIn
                </a>
              )}
              {faculty.faculty_website && (
                <a
                  href={ensureHttps(faculty.faculty_website)}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 14px", borderRadius: 8, textDecoration: "none",
                    fontSize: "0.8rem", fontWeight: 600,
                    background: "rgba(14,165,233,0.08)",
                    color: "#0ea5e9", border: "1.5px solid rgba(14,165,233,0.2)",
                  }}
                >
                  <Globe size={13} /> Website
                </a>
              )}
            </>
          ) : (
            <Link
              href="/login"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 14px", borderRadius: 8, textDecoration: "none",
                fontSize: "0.8rem", fontWeight: 600,
                background: "rgba(124,92,255,0.06)",
                color: "#7c5cff", border: "1.5px solid rgba(124,92,255,0.15)",
              }}
            >
              <UserCheck size={13} /> Log in to see contact
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const headerRef = useReveal();

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

  useEffect(() => {
    fetch("/api/faculty")
      .then(r => r.json())
      .then(d => { setFaculty(d.faculty ?? []); setLoading(false); })
      .catch(() => setLoading(false));

    fetch("/api/me", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setIsLoggedIn(!!d.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const filtered = faculty.filter(f => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      (f.faculty_title ?? "").toLowerCase().includes(q) ||
      (f.faculty_modules ?? "").toLowerCase().includes(q) ||
      (f.bio ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <main className="relative min-h-screen">
      <MeshBackground />
      <Navbar />

      <div style={{ paddingTop: 64 }}>
        <section className="relative z-10 section-padding" style={{ paddingBottom: 32 }}>
          <div className="max-w-5xl mx-auto px-5 sm:px-10">

            <div ref={headerRef} className="reveal mb-10">
              <span className="section-label">
                <GraduationCap size={12} /> UCD Smurfit Faculty
              </span>
              <h1
                className="serif"
                style={{
                  fontSize: "clamp(2rem,5vw,3.4rem)",
                  color: "#1c1430",
                  letterSpacing: "-0.035em",
                  marginBottom: 16,
                  marginTop: 12,
                }}
              >
                Meet the{" "}
                <em className="grad-text" style={{ fontStyle: "italic" }}>faculty</em>
              </h1>
              <p style={{ maxWidth: 520, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.7, marginBottom: 28 }}>
                UCD Smurfit faculty who have registered on Wellforward. See what modules they teach,
                and reach out if you have questions about your programme or research.
              </p>

              {/* Search bar */}
              <div style={{ position: "relative", maxWidth: 440 }}>
                <Search size={16} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "#9b8ec8", pointerEvents: "none",
                }} />
                <input
                  type="text"
                  placeholder="Search by name, module, or subject…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px 12px 42px",
                    border: "1.5px solid #ede8ff", borderRadius: 12,
                    fontFamily: "'Inter', sans-serif", fontSize: "0.9rem",
                    color: "#1a0f2e", background: "white", outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#7c5cff")}
                  onBlur={e => (e.target.style.borderColor = "#ede8ff")}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#9b8ec8", display: "flex",
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9b8ec8" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "3px solid #ede8ff", borderTopColor: "#7c5cff",
                  animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
                }} />
                <p style={{ fontSize: "0.9rem" }}>Loading faculty…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                background: "white", border: "1px solid #ede8ff",
                borderRadius: 20, maxWidth: 480, margin: "0 auto",
              }}>
                {search ? (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</div>
                    <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a0f2e", marginBottom: 8 }}>No results</p>
                    <p style={{ fontSize: "0.85rem", color: "#6b5a8e" }}>
                      Try a different search term or clear the filter.
                    </p>
                    <button
                      onClick={() => setSearch("")}
                      style={{
                        marginTop: 16, padding: "9px 20px", borderRadius: 10, cursor: "pointer",
                        background: "rgba(124,92,255,0.08)", border: "1.5px solid rgba(124,92,255,0.2)",
                        color: "#7c5cff", fontWeight: 600, fontSize: "0.85rem",
                      }}
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: 12 }}>🎓</div>
                    <p style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a0f2e", marginBottom: 8 }}>
                      No faculty yet
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#6b5a8e", lineHeight: 1.6 }}>
                      Faculty profiles will appear here once professors register.
                      If you&apos;re a professor at UCD Smurfit, join using your{" "}
                      <strong>@ucd.ie</strong> email.
                    </p>
                    <Link
                      href="/join"
                      className="btn-primary"
                      style={{
                        textDecoration: "none", display: "inline-block",
                        marginTop: 16, padding: "10px 24px", borderRadius: 10, fontSize: "0.88rem",
                      }}
                    >
                      Register as faculty →
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <>
                <p style={{ fontSize: "0.8rem", color: "#9b8ec8", marginBottom: 20 }}>
                  {filtered.length} {filtered.length === 1 ? "faculty member" : "faculty members"}
                  {search ? ` matching "${search}"` : " registered"}
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 20,
                }}>
                  {filtered.map((f, i) => (
                    <FacultyCard key={f.id} faculty={f} index={i} isLoggedIn={isLoggedIn} />
                  ))}
                </div>
              </>
            )}

            {/* CTA for faculty to join */}
            {!loading && (
              <div style={{
                marginTop: 48, padding: "28px 32px",
                background: "linear-gradient(135deg, rgba(124,92,255,0.06) 0%, rgba(200,184,255,0.12) 100%)",
                border: "1px solid rgba(124,92,255,0.15)",
                borderRadius: 20,
                display: "flex", flexWrap: "wrap",
                alignItems: "center", justifyContent: "space-between", gap: 20,
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <BookOpen size={18} style={{ color: "#7c5cff" }} />
                    <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.1rem", fontWeight: 700, color: "#1a0f2e" }}>
                      Are you a UCD Smurfit professor?
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#38285c", lineHeight: 1.6, maxWidth: 480 }}>
                    Register your faculty profile so students can find you, see what modules you teach,
                    and reach out with questions. Takes 2 minutes.
                  </p>
                </div>
                <Link
                  href="/join"
                  className="btn-primary"
                  style={{
                    textDecoration: "none", display: "inline-flex",
                    alignItems: "center", gap: 8,
                    padding: "12px 24px", borderRadius: 12, fontSize: "0.9rem", whiteSpace: "nowrap",
                  }}
                >
                  <GraduationCap size={16} /> Register as faculty
                  <ExternalLink size={13} />
                </Link>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
