import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        holly: {
          950: "#052e16",
          900: "#0b3d22",
          800: "#14532d",
          700: "#166534",
          600: "#15803d",
        },
        pine: {
          950: "#052e16",
          900: "#0b3d22",
          800: "#14532d",
          700: "#166534",
        },
        gold: {
          300: "#fde68a",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        },
        cranberry: {
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
        },
        snow: {
          50: "#f8fafc",
          100: "#f1f5f9",
        },
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
        snowfall: "snowfall linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 24px rgba(220, 38, 38, 0.35), 0 0 12px rgba(250, 204, 21, 0.25)",
          },
          "50%": {
            boxShadow:
              "0 0 36px rgba(220, 38, 38, 0.5), 0 0 20px rgba(250, 204, 21, 0.4)",
          },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        snowfall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(360deg)", opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
