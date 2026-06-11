import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        lavender: {
          50: "#F5F1FF",
          100: "#E9E2FF",
          200: "#C8B8FF",
          300: "#A890FF",
          400: "#8B6EFF",
          500: "#7C5CFF",
          600: "#6B4EFF",
          700: "#5A3EE8",
          800: "#4A30CC",
          900: "#3B2E8C",
        },
        // Background
        bg: {
          primary: "#F5F1FF",
          secondary: "#E9E2FF",
          surface: "#C8B8FF",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "purple-sm": "0 4px 16px -4px rgba(124, 92, 255, 0.2)",
        "purple-md":
          "0 8px 24px -8px rgba(124, 92, 255, 0.25), 0 4px 12px -4px rgba(124, 92, 255, 0.15)",
        "purple-lg":
          "0 24px 60px -24px rgba(124, 92, 255, 0.28), 0 8px 24px -12px rgba(124, 92, 255, 0.15)",
        "purple-xl":
          "0 32px 80px -20px rgba(124, 92, 255, 0.35), 0 12px 32px -8px rgba(124, 92, 255, 0.2)",
      },
      backgroundImage: {
        "gradient-lavender": "linear-gradient(135deg, #7C5CFF 0%, #C8B8FF 100%)",
        "gradient-warm":
          "linear-gradient(135deg, #7C5CFF 0%, #FF7EB3 50%, #7EC8FF 100%)",
        "gradient-hero": "linear-gradient(180deg, #E9E2FF 0%, #F5F1FF 60%, #fff 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(233,226,255,0.6) 0%, rgba(245,241,255,0.8) 100%)",
      },
      animation: {
        "mesh-drift-1": "meshDrift1 18s ease-in-out infinite",
        "mesh-drift-2": "meshDrift2 22s ease-in-out infinite",
        "mesh-drift-3": "meshDrift3 26s ease-in-out infinite",
        "mesh-drift-4": "meshDrift4 20s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "scale-in": "scaleIn 0.4s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        meshDrift1: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(8%, -12%) scale(1.1)" },
          "66%": { transform: "translate(-5%, 8%) scale(0.95)" },
        },
        meshDrift2: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(-10%, 8%) scale(1.05)" },
          "66%": { transform: "translate(6%, -10%) scale(1.1)" },
        },
        meshDrift3: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "50%": { transform: "translate(12%, 6%) scale(1.08)" },
        },
        meshDrift4: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1.05)" },
          "50%": { transform: "translate(-8%, -8%) scale(0.95)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
