"use client";

export default function MeshBackground() {
  return (
    <div
      className="mesh-bg"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* Blob 1 — lavender, top left */}
      <div
        className="mesh-blob"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-15vw",
          left: "-10vw",
          background:
            "radial-gradient(circle at center, #C8B8FF 0%, #E9E2FF 50%, transparent 80%)",
          animation: "meshDrift1 18s ease-in-out infinite",
        }}
      />
      {/* Blob 2 — soft pink, top right */}
      <div
        className="mesh-blob"
        style={{
          width: "45vw",
          height: "45vw",
          top: "5vw",
          right: "-10vw",
          background:
            "radial-gradient(circle at center, #FFD6EE 0%, #F5E6FF 50%, transparent 80%)",
          animation: "meshDrift2 22s ease-in-out infinite",
        }}
      />
      {/* Blob 3 — periwinkle, middle */}
      <div
        className="mesh-blob"
        style={{
          width: "50vw",
          height: "50vw",
          top: "35vh",
          left: "25vw",
          background:
            "radial-gradient(circle at center, #B8C8FF 0%, #D6E4FF 50%, transparent 80%)",
          animation: "meshDrift3 26s ease-in-out infinite",
        }}
      />
      {/* Blob 4 — pale blue, bottom right */}
      <div
        className="mesh-blob"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "-10vw",
          right: "-5vw",
          background:
            "radial-gradient(circle at center, #C4E0FF 0%, #E0EEFF 50%, transparent 80%)",
          animation: "meshDrift4 20s ease-in-out infinite",
        }}
      />
      {/* Blob 5 — lavender deep, bottom left */}
      <div
        className="mesh-blob"
        style={{
          width: "35vw",
          height: "35vw",
          bottom: "10vh",
          left: "-8vw",
          background:
            "radial-gradient(circle at center, #A890FF 0%, #C8B8FF 40%, transparent 80%)",
          animation: "meshDrift1 24s ease-in-out infinite reverse",
          opacity: 0.35,
        }}
      />
    </div>
  );
}
