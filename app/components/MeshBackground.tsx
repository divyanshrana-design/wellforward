"use client";

// Six soft, slow-drifting morphing orbs — cream/lavender palette
// Background stays quiet — it supports the content, doesn't compete
export default function MeshBackground() {
  return (
    <div className="orb-field" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="orb orb-6" />
    </div>
  );
}
