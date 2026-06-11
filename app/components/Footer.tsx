"use client";

import { ExternalLink, Mail } from "lucide-react";

const USEFUL_LINKS = [
  { label: "ISD — IRP Registration", href: "https://www.irishimmigration.ie" },
  { label: "MyWelfare.ie — PPS Number", href: "https://www.mywelfare.ie" },
  { label: "Student Leap Card", href: "https://www.studentleapcard.ie" },
  { label: "UCD Student Health", href: "https://www.ucd.ie/studenthealth/" },
  { label: "UCD Counselling", href: "https://www.ucd.ie/studentcounselling/" },
  { label: "RTB — Tenants Rights", href: "https://www.rtb.ie" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative z-10"
      style={{
        background: "rgba(59, 46, 140, 0.06)",
        borderTop: "1px solid rgba(200, 184, 255, 0.3)",
        paddingTop: "48px",
        paddingBottom: "32px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <h2
              className="font-serif text-2xl mb-2"
              style={{ color: "#3B2E8C" }}
            >
              Well<span style={{ color: "#7C5CFF" }}>forward</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#7B6EA8" }}>
              A platform for UCD international students to find each other, ask seniors, and navigate their first weeks in Dublin.
            </p>
            <p
              className="text-xs mt-3"
              style={{ color: "#9B8EC8", fontStyle: "italic" }}
            >
              Built by international students at UCD Smurfit as an academic project.
              Not officially affiliated with University College Dublin.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "#9B8EC8" }}
            >
              Official resources
            </h3>
            <ul className="space-y-2">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 group"
                    style={{ color: "#7B6EA8", textDecoration: "none" }}
                  >
                    <ExternalLink
                      size={12}
                      className="flex-shrink-0 group-hover:text-purple-500 transition-colors"
                    />
                    <span className="group-hover:text-purple-600 transition-colors">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "#9B8EC8" }}
            >
              Get in touch
            </h3>
            <p className="text-sm mb-4" style={{ color: "#7B6EA8", lineHeight: 1.6 }}>
              Found an error? Have a suggestion? Want to be added as a senior ambassador? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:wellforward.ucd@gmail.com"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              style={{ textDecoration: "none" }}
            >
              <Mail size={14} />
              Submit feedback
            </a>

            {/* Emergency */}
            <div
              className="mt-5 rounded-xl p-3"
              style={{
                background: "rgba(200, 184, 255, 0.2)",
                border: "1px solid rgba(124, 92, 255, 0.15)",
              }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "#6B4EFF" }}>
                📞 Support
              </p>
              <p className="text-xs" style={{ color: "#4a3878", lineHeight: 1.5 }}>
                Niteline (night-time listening): <a href="tel:1800793793" className="font-semibold" style={{ color: "#7C5CFF" }}>1800 793 793</a>
                <br />
                Samaritans: <a href="tel:116123" className="font-semibold" style={{ color: "#7C5CFF" }}>116 123</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5"
          style={{ borderTop: "1px solid rgba(200, 184, 255, 0.25)" }}
        >
          <p className="text-xs" style={{ color: "#9B8EC8" }}>
            © {year} Wellforward — UCD Smurfit Academic Project
          </p>
          <p className="text-xs" style={{ color: "#9B8EC8" }}>
            Last updated: June 2025 · Information is for guidance only — always verify with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
