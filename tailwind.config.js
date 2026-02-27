/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark theme colors (flattened so Tailwind generates classes like 'bg-dark-bg')
        "dark-bg": "#0a0a0f",
        "dark-surface": "#13131a",
        "dark-elevated": "#1a1a24",
        "dark-border": "#2a2a35",
        // Gradient accent colors
        electric: {
          blue: "#00d4ff",
          violet: "#a855f7",
          teal: "#14b8a6",
        },
        // Priority colors
        priority: {
          low: "#10b981",
          medium: "#f59e0b",
          high: "#f97316",
          critical: "#ef4444",
        },
        // Status colors
        status: {
          planning: "#6366f1",
          progress: "#3b82f6",
          hold: "#f59e0b",
          review: "#8b5cf6",
          completed: "#10b981",
          blocked: "#ef4444",
          cancelled: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-sidebar": "linear-gradient(180deg, #1a1a24 0%, #0a0a0f 100%)",
        "gradient-accent": "linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)",
        "gradient-glow":
          "radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-lg": "0 0 40px rgba(0, 212, 255, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        glass: "10px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
