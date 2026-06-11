"use client";

// Seven morphing orbs — different sizes, speeds, paths, colors
// They breathe and drift like real ambient light, not computer-generated circles
export default function MeshBackground() {
  return (
    <div className="orb-field" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="orb orb-6" />
      <div className="orb orb-7" />
    </div>
  );
}
