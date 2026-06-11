"use client";

import { useState } from "react";
import { MapPin, Bus, Coffee, BookOpen, Dumbbell, Printer, UtensilsCrossed } from "lucide-react";

const CAMPUS_DATA = {
  belfield: {
    name: "UCD Belfield",
    tagline: "The main campus. Big, leafy, occasionally confusing.",
    emoji: "🌳",
    getHere: [
      {
        icon: "🚌",
        title: "By Bus",
        detail: "Routes 39A, 11, 17, 46A stop at UCD. The 39A from the city centre (Merrion Square) is the most direct. Download TFI Live to see real-time arrivals.",
      },
      {
        icon: "🚶",
        title: "On Foot",
        detail: "20–25 min walk from Donnybrook or Stillorgan. Cycling is popular — there are bike racks across campus.",
      },
      {
        icon: "🚗",
        title: "By Car",
        detail: "There's paid parking on campus. Don't bother in the mornings. Dublin traffic is very real.",
      },
    ],
    spots: [
      {
        icon: "☕",
        category: "Coffee",
        title: "The Gourmet Coffee Bar",
        detail: "In the main library. Reliable flat white. Often has a queue.",
      },
      {
        icon: "☕",
        category: "Coffee",
        title: "The Village",
        detail: "The campus social hub — coffee, food, and usually the most people. Good for finding study groups.",
      },
      {
        icon: "🍕",
        category: "Food",
        title: "The Restaurant at Sutherland School",
        detail: "Decent lunch options. Not the cheapest, but better than the vending machines.",
      },
      {
        icon: "🍔",
        category: "Food",
        title: "The Café at O'Brien Centre",
        detail: "Close to the engineering buildings. Quick grab-and-go options.",
      },
      {
        icon: "📚",
        category: "Study",
        title: "James Joyce Library",
        detail: "The main library. Quiet study floors at the top. Book a study room online via the library website if you need a group space.",
      },
      {
        icon: "📚",
        category: "Study",
        title: "The Agriculture & Food Science Building",
        detail: "Often overlooked. Has good quiet desk space and decent WiFi.",
      },
      {
        icon: "🖨️",
        category: "Print",
        title: "Printing — Library & Student Centre",
        detail: "Printers in the main library and Student Centre. Load credit on your student account via the UCD printing portal.",
      },
      {
        icon: "💪",
        category: "Gym",
        title: "UCD Sport & Fitness",
        detail: "Full gym on campus. Student membership is subsidised. Swim, gym, classes. Busy in September — sign up early.",
      },
      {
        icon: "🏥",
        category: "Health",
        title: "UCD Student Health Service",
        detail: "On campus, specifically for students. Cheaper than a private GP for Belfield students. Register early in the year.",
      },
    ],
  },
  smurfit: {
    name: "UCD Smurfit",
    tagline: "Blackrock campus. Smaller, more intimate, slightly fancier.",
    emoji: "🏛️",
    getHere: [
      {
        icon: "🚂",
        title: "By DART",
        detail: "Blackrock DART station is 8 minutes walk from the campus. The DART runs every 15 min from Connolly/Pearse/Tara St. Get the Student Leap Card — DART fares add up fast.",
      },
      {
        icon: "🚌",
        title: "By Bus",
        detail: "Route 7 and 7b run to Blackrock from the city centre. Route 145 goes from Heuston. Less reliable than DART for timing.",
      },
      {
        icon: "🚶",
        title: "Walking from Blackrock",
        detail: "Blackrock village is a short walk — coffee shops, a great Saturday market, and the DART station. Explore it in your first weekend.",
      },
    ],
    spots: [
      {
        icon: "☕",
        category: "Coffee",
        title: "The Smurfit Atrium Café",
        detail: "The main meeting point. Good coffee, usually busy between 9–11am. Grab a window seat if you can.",
      },
      {
        icon: "☕",
        category: "Coffee",
        title: "Legit Coffee, Blackrock",
        detail: "A 5-minute walk from campus. Better coffee than anything on campus. Worth the detour for a morning treat.",
      },
      {
        icon: "🍕",
        category: "Food",
        title: "Campus canteen",
        detail: "Lunch options on weekdays. Not fine dining, but reliable. Wraps and hot food usually gone by 1pm.",
      },
      {
        icon: "🍔",
        category: "Food",
        title: "Blackrock Village",
        detail: "Good variety — Umi Falafel (highly recommended), Tesco Express for cheap lunches, a couple of pubs with food. A 10-minute walk.",
      },
      {
        icon: "📚",
        category: "Study",
        title: "The Smurfit Library",
        detail: "Well stocked for business resources. Quiet floors available. Book group study rooms in advance online.",
      },
      {
        icon: "📚",
        category: "Study",
        title: "The Reading Room",
        detail: "Quieter than the library and better for deep focus work. Preferred by MSc students in second semester.",
      },
      {
        icon: "🖨️",
        category: "Print",
        title: "Printing",
        detail: "Printers in the library. Load credit via the UCD printing portal. Print from your phone using the mobile print app.",
      },
      {
        icon: "🏋️",
        category: "Gym",
        title: "Nearest gym",
        detail: "No gym on Smurfit campus. Nearest options: Energie Fitness in Blackrock, Total Fitness in Dún Laoghaire, or sign up for UCD Belfield Sport (longer journey but great facilities).",
      },
    ],
  },
};

export default function CampusSection() {
  const [activeTab, setActiveTab] = useState<"belfield" | "smurfit">("smurfit");
  const [activeCategory, setActiveCategory] = useState("All");

  const campus = CAMPUS_DATA[activeTab];
  const categories = ["All", "Coffee", "Food", "Study", "Print", "Gym", "Health"];
  const filteredSpots =
    activeCategory === "All"
      ? campus.spots
      : campus.spots.filter((s) => s.category === activeCategory);

  return (
    <section
      id="campus"
      className="relative z-10 section-padding"
      aria-labelledby="campus-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
            <MapPin size={14} />
            Your campus guide
          </div>
          <h2
            id="campus-title"
            className="font-serif mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1a1033",
            }}
          >
            Campus{" "}
            <span className="gradient-text italic">Survival</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#4a3878", lineHeight: 1.65 }}
          >
            The honest guide to getting around, finding coffee, and surviving lectures.
          </p>
        </div>

        {/* Campus tabs */}
        <div
          className="flex rounded-2xl p-1.5 mb-8 mx-auto"
          style={{
            background: "rgba(233, 226, 255, 0.6)",
            border: "1px solid rgba(200, 184, 255, 0.4)",
            maxWidth: 380,
          }}
          role="tablist"
        >
          {(["smurfit", "belfield"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveCategory("All");
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab
                  ? {
                      background: "linear-gradient(135deg, #7C5CFF, #6B4EFF)",
                      color: "white",
                      boxShadow: "0 4px 12px -4px rgba(124, 92, 255, 0.4)",
                    }
                  : { color: "#7B6EA8" }
              }
            >
              {CAMPUS_DATA[tab].emoji} {tab === "smurfit" ? "Smurfit" : "Belfield"}
            </button>
          ))}
        </div>

        {/* Campus name */}
        <div className="mb-6">
          <h3
            className="font-serif text-2xl mb-1"
            style={{ color: "#1a1033" }}
          >
            {campus.name}
          </h3>
          <p className="text-sm" style={{ color: "#7B6EA8" }}>
            {campus.tagline}
          </p>
        </div>

        {/* Getting here */}
        <div className="mb-8">
          <h4
            className="font-semibold text-sm uppercase tracking-wider mb-3"
            style={{ color: "#9B8EC8" }}
          >
            Getting there
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {campus.getHere.map((method) => (
              <div
                key={method.title}
                className="glass-soft rounded-xl p-4"
                style={{ border: "1px solid rgba(200, 184, 255, 0.3)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl" aria-hidden="true">{method.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: "#1a1033" }}>
                    {method.title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4a3878" }}>
                  {method.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip text-sm py-1.5 px-3 ${activeCategory === cat ? "active" : ""}`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Spots grid */}
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredSpots.map((spot) => (
            <div
              key={spot.title}
              className="card"
              style={{ padding: "16px 18px" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">
                  {spot.icon}
                </span>
                <div>
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: "#1a1033" }}
                  >
                    {spot.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#4a3878" }}>
                    {spot.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
