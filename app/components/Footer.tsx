"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Mail, Heart, Phone } from "lucide-react";
import Link from "next/link";

const USEFUL_LINKS = [
  { label: "ISD: IRP Registration", href: "https://www.irishimmigration.ie" },
  { label: "MyWelfare.ie: PPS Number", href: "https://www.mywelfare.ie" },
  { label: "Student Leap Card", href: "https://www.studentleapcard.ie" },
  { label: "UCD Student Health", href: "https://www.ucd.ie/studenthealth/" },
  { label: "UCD Counselling", href: "https://www.ucd.ie/studentcounselling/" },
  { label: "RTB: Tenants Rights", href: "https://www.rtb.ie" },
];

const NAV_LINKS = [
  { label: "Meet people",   href: "/meet-people"   },
  { label: "Ask a senior",  href: "/ask-a-senior"  },
  { label: "First 30 days", href: "/first-30-days" },
  { label: "Student voices",href: "/voices"        },
  { label: "Join free",     href: "/join"          },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const revealRef = useReveal();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <footer className="relative z-10 overflow-hidden" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(59,46,140,0.04) 30%, rgba(59,46,140,0.09) 100%)" }}>
      {/* Squiggle top divider */}
      <div className="squiggle-divider" style={{ opacity: 0.5 }} />

      {/* Subtle orb in footer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          background: "radial-gradient(circle, rgba(124,92,255,0.07) 0%, transparent 70%)",
          bottom: "-15vw",
          right: "-10vw",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        {/* Header row */}
        <div ref={revealRef} className="reveal mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Wordmark */}
            <div>
              <span className="section-label" style={{ marginBottom: "10px", display: "inline-block" }}>
                ✦ made for you
              </span>
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: "#3B2E8C",
                  letterSpacing: "-0.02em",
                }}
              >
                <em>Well</em>
                <span style={{ color: "#7C5CFF", fontStyle: "normal" }}>forward</span>
              </h2>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#7B6EA8",
                  marginTop: "8px",
                  maxWidth: "380px",
                  lineHeight: 1.6,
                }}
              >
                A peer-built guide for UCD Smurfit students finding their feet in Dublin.
              </p>
            </div>

            {/* Tagline */}
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                color: "#9B8EC8",
                maxWidth: "260px",
                textAlign: "right",
                lineHeight: 1.5,
              }}
            >
              &ldquo;Every senior was once new here too.&rdquo;
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Explore */}
          <div>
            <h3
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9B8EC8",
                marginBottom: "14px",
              }}
            >
              Explore
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "0.88rem",
                      color: hovered === link.label ? "#7C5CFF" : "#5a4a8a",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={() => setHovered(link.label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "14px",
                        height: "1px",
                        background: hovered === link.label ? "#7C5CFF" : "#C8B8FF",
                        transition: "background 0.2s, width 0.2s",
                        flexShrink: 0,
                      }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official resources */}
          <div>
            <h3
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9B8EC8",
                marginBottom: "14px",
              }}
            >
              Official resources
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "9px" }}>
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.88rem",
                      color: hovered === link.href ? "#7C5CFF" : "#5a4a8a",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={() => setHovered(link.href)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <ExternalLink
                      size={11}
                      style={{
                        flexShrink: 0,
                        color: hovered === link.href ? "#7C5CFF" : "#C8B8FF",
                        transition: "color 0.2s",
                      }}
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mental health helplines */}
          <div>
            <h3
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9B8EC8",
                marginBottom: "6px",
              }}
            >
              If you need to talk
            </h3>
            <p style={{ fontSize: "0.76rem", color: "#9B8EC8", lineHeight: 1.55, marginBottom: "12px" }}>
              Two free, confidential phone lines open to everyone in Ireland. No referral needed. Completely anonymous.
            </p>

            {/* Niteline card */}
            <div
              style={{
                background: "rgba(200,184,255,0.18)",
                border: "1px solid rgba(124,92,255,0.12)",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "10px",
                transform: "rotate(-0.4deg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
                <Phone size={12} style={{ color: "#7C5CFF" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B4EFF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Niteline
                </span>
              </div>
              <a
                href="tel:1800793793"
                style={{ fontSize: "1.05rem", fontWeight: 700, color: "#3B2E8C", textDecoration: "none", fontFamily: "Georgia, serif" }}
              >
                1800 793 793
              </a>
              <p style={{ fontSize: "0.72rem", color: "#7B6EA8", marginTop: "3px", lineHeight: 1.4 }}>
                Student-run listening service. Run by college students, for college students. Open nightly 9pm to 2:30am during term time. Free to call.
              </p>
            </div>

            {/* Samaritans card */}
            <div
              style={{
                background: "rgba(233,226,255,0.35)",
                border: "1px solid rgba(124,92,255,0.10)",
                borderRadius: "12px",
                padding: "14px",
                transform: "rotate(0.3deg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
                <Heart size={12} style={{ color: "#7C5CFF" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B4EFF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Samaritans
                </span>
              </div>
              <a
                href="tel:116123"
                style={{ fontSize: "1.05rem", fontWeight: 700, color: "#3B2E8C", textDecoration: "none", fontFamily: "Georgia, serif" }}
              >
                116 123
              </a>
              <p style={{ fontSize: "0.72rem", color: "#7B6EA8", marginTop: "3px", lineHeight: 1.4 }}>
                Available 24 hours, 365 days a year. Completely confidential. You do not have to be suicidal to call. If something is weighing on you, this is for you.
              </p>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9B8EC8",
                marginBottom: "14px",
              }}
            >
              Say hello
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#7B6EA8", lineHeight: 1.65, marginBottom: "16px" }}>
              Found an error? Want to be a senior ambassador? Have an idea that could help other students?
            </p>
            <a
              href="mailto:divyansh.rana@ucdconnect.ie"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "0.85rem",
                textDecoration: "none",
                padding: "10px 18px",
              }}
            >
              <Mail size={13} />
              Send a message
            </a>

            <p
              style={{
                fontSize: "0.75rem",
                color: "#9B8EC8",
                marginTop: "12px",
                fontStyle: "italic",
              }}
            >
              We reply within a couple of days.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(200,184,255,0.25)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#9B8EC8" }}>
              © {year} Wellforward. UCD Smurfit Academic Project
            </p>
            <p style={{ fontSize: "0.75rem", color: "#9B8EC8" }}>
              Last updated: June 2025
            </p>
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#C8B8FF",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            Not officially affiliated with University College Dublin. Information is provided for guidance only. Always verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
