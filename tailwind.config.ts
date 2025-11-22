import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#020617"
        },
        accent: {
          cyan: "#22D3EE",
          indigo: "#6366F1"
        },
        trend: {
          positive: "#22C55E",
          negative: "#EF4444"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        glow: "0 0 40px rgba(34, 211, 238, 0.18)"
      },
      keyframes: {
        fadePulse: {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.4" }
        }
      },
      animation: {
        fadePulse: "fadePulse 1.2s ease-in-out"
      }
    }
  },
  plugins: []
};

export default config;
