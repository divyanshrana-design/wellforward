"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const DATA = {
  smurfit: {
    name: "UCD Smurfit",
    tagline: "Blackrock campus. Smaller, more intimate, slightly fancier.",
    emoji: "🏛️",
    getHere: [
      { icon: "🚂", title: "By DART", detail: "Blackrock DART station is 8 min walk from campus. DART every 15 min from Connolly/Pearse/Tara St. Get the Student Leap Card — DART fares add up." },
      { icon: "🚌", title: "By Bus",  detail: "Routes 7 and 7b run to Blackrock from the city. Route 145 from Heuston. Less reliable than DART for timing." },
      { icon: "🚶", title: "Walking", detail: "Blackrock village is a short walk — coffee shops, a great Saturday market, and the DART station. Explore it in your first weekend." },
    ],
    spots: [
      { icon: "☕", cat: "Coffee",  title: "The Smurfit Atrium Café",    detail: "The main meeting point. Good coffee, usually busy between 9–11am. Grab a window seat if you can." },
      { icon: "☕", cat: "Coffee",  title: "Legit Coffee, Blackrock",    detail: "A 5 min walk from campus. Better coffee than anything on campus. Worth the detour for a morning treat." },
      { icon: "🍕", cat: "Food",    title: "Campus canteen",             detail: "Lunch on weekdays. Not fine dining, but reliable. Wraps and hot food usually gone by 1pm." },
      { icon: "🍔", cat: "Food",    title: "Blackrock Village",          detail: "Good variety — Umi Falafel (highly recommended), Tesco Express for cheap lunches, a couple of pubs. 10 min walk." },
      { icon: "📚", cat: "Study",   title: "The Smurfit Library",        detail: "Well stocked for business resources. Quiet floors available. Book group study rooms online in advance." },
      { icon: "📚", cat: "Study",   title: "The Reading Room",           detail: "Quieter than the library and better for deep focus. Preferred by MSc students in second semester." },
      { icon: "🖨️", cat: "Print",   title: "Printing",                   detail: "Printers in the library. Load credit via UCD printing portal. Print from your phone using the mobile print app." },
      { icon: "💪", cat: "Gym",     title: "Nearest gym",                detail: "No gym on Smurfit campus. Energie Fitness in Blackrock, Total Fitness in Dún Laoghaire, or UCD Belfield Sport." },
    ],
  },
  belfield: {
    name: "UCD Belfield",
    tagline: "The main campus. Big, leafy, occasionally confusing.",
    emoji: "🌳",
    getHere: [
      { icon: "🚌", title: "By Bus",      detail: "Routes 39A, 11, 17, 46A stop at UCD. The 39A from Merrion Square is most direct. Download TFI Live for real-time arrivals." },
      { icon: "🚶", title: "On foot",     detail: "20–25 min walk from Donnybrook or Stillorgan. Cycling is popular — bike racks all over campus." },
      { icon: "🚗", title: "By car",      detail: "Paid parking on campus. Don't bother in the mornings. Dublin traffic is very real." },
    ],
    spots: [
      { icon: "☕", cat: "Coffee", title: "The Gourmet Coffee Bar",     detail: "In the main library. Reliable flat white. Often has a queue." },
      { icon: "☕", cat: "Coffee", title: "The Village",                detail: "The campus social hub — coffee, food, usually the most people. Good for finding study groups." },
      { icon: "🍕", cat: "Food",   title: "Sutherland Restaurant",      detail: "Decent lunch options. Not the cheapest, but better than the vending machines." },
      { icon: "📚", cat: "Study",  title: "James Joyce Library",        detail: "The main library. Quiet floors at the top. Book study rooms online via the library site." },
      { icon: "📚", cat: "Study",  title: "Agriculture & Food Sci.",    detail: "Often overlooked. Good quiet desk space and decent WiFi." },
      { icon: "🖨️", cat: "Print",  title: "Library & Student Centre",   detail: "Load credit on your student account via the UCD printing portal." },
      { icon: "💪", cat: "Gym",    title: "UCD Sport & Fitness",        detail: "Full gym on campus. Student membership subsidised. Swim, gym, classes. Busy in Sept — sign up early." },
      { icon: "🏥", cat: "Health", title: "UCD Student Health Service", detail: "On campus, for students only. Cheaper than a private GP. Register early in the year." },
    ],
  },
};

type CampusKey = "smurfit" | "belfield";

export default function CampusSection() {
  const [tab, setTab]     = useState<CampusKey>("smurfit");
  const [cat, setCat]     = useState("All");
  const headerRef = useReveal();
  const campus = DATA[tab];

  const cats      = ["All", ...Array.from(new Set(campus.spots.map(s => s.cat)))];
  const spots     = cat === "All" ? campus.spots : campus.spots.filter(s => s.cat === cat);

  return (
    <section id="campus" className="relative z-10 section-padding" aria-labelledby="campus-title">
      <div className="max-w-5xl mx-auto px-5 sm:px-10">

        <div ref={headerRef} className="reveal mb-10">
          <span className="section-label"><MapPin size={12} /> campus guide</span>
          <h2 id="campus-title" className="serif mb-4" style={{ fontSize: "clamp(1.9rem,5vw,3.2rem)", color: "#1c1430" }}>
            Campus <em className="grad-text" style={{ fontStyle: "italic" }}>Survival</em>
          </h2>
          <p style={{ maxWidth: 440, fontSize: "0.95rem", color: "#3d2f60", lineHeight: 1.65 }}>
            The honest guide to getting there, finding coffee, printing things, and surviving a week.
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "inline-flex",
            borderRadius: 12, padding: 5,
            background: "rgba(233,226,255,0.6)",
            border: "1px solid rgba(200,184,255,0.35)",
            marginBottom: 28,
          }}
          role="tablist"
        >
          {(["smurfit","belfield"] as CampusKey[]).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => { setTab(t); setCat("All"); }}
              style={{
                padding: "9px 20px", borderRadius: 8,
                border: "none", cursor: "pointer",
                fontSize: "0.85rem", fontWeight: 600,
                transition: "all 0.2s ease",
                ...(tab === t
                  ? { background: "linear-gradient(135deg,#7c5cff,#5a3ee8)", color: "#fff", boxShadow: "0 3px 12px -3px rgba(124,92,255,0.4)" }
                  : { background: "transparent", color: "#9b8ec8" }),
              }}
            >
              {DATA[t].emoji} {t === "smurfit" ? "Smurfit" : "Belfield"}
            </button>
          ))}
        </div>

        <h3 className="serif" style={{ fontSize: "1.4rem", color: "#1c1430", marginBottom: 3 }}>{campus.name}</h3>
        <p style={{ fontSize: "0.82rem", color: "#9b8ec8", marginBottom: 20 }}>{campus.tagline}</p>

        {/* Getting there */}
        <h4 style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#b0a0cc", marginBottom: 10 }}>
          Getting there
        </h4>
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {campus.getHere.map(m => (
            <div
              key={m.title}
              style={{
                background: "rgba(245,241,255,0.7)",
                border: "1px solid rgba(200,184,255,0.25)",
                borderRadius: 12, padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                <span style={{ fontSize: "1.2rem" }} aria-hidden="true">{m.icon}</span>
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1c1430" }}>{m.title}</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#3d2f60", lineHeight: 1.6 }}>{m.detail}</p>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`chip ${cat===c?"active":""}`}
              style={{ padding: "5px 12px" }}
              aria-pressed={cat === c}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {spots.map((s, i) => (
            <div
              key={s.title}
              className="card"
              style={{ padding: "14px 16px" }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }} aria-hidden="true">{s.icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1c1430", marginBottom: 3 }}>{s.title}</p>
                  <p style={{ fontSize: "0.78rem", color: "#3d2f60", lineHeight: 1.6 }}>{s.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
