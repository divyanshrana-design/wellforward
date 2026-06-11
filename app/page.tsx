"use client";

import MeshBackground from "./components/MeshBackground";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MakeFriendSection from "./components/MakeFriendSection";
import AskSeniorSection from "./components/AskSeniorSection";
import ChecklistSection from "./components/ChecklistSection";
import GlossarySection from "./components/GlossarySection";
import CampusSection from "./components/CampusSection";
import VoicesSection from "./components/VoicesSection";
import Footer from "./components/Footer";

export default function Home() {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Always-on animated mesh background */}
      <MeshBackground />

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <HeroSection
        onMakeFriend={() => scrollToSection("#make-a-friend")}
        onBrowseGuide={() => scrollToSection("#checklist")}
      />

      {/* Make a Friend */}
      <MakeFriendSection />

      {/* Ask a Senior */}
      <AskSeniorSection />

      {/* First 30 Days Checklist */}
      <ChecklistSection />

      {/* What is a…? Glossary */}
      <GlossarySection />

      {/* Campus Survival */}
      <CampusSection />

      {/* Voices */}
      <VoicesSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
