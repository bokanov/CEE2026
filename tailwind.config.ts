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
        pine: {
          950: "#0a1f14",
          900: "#0f2e1c",
          800: "#164228",
          700: "#1d5634",
        },
        gold: {
          400: "#f0d78c",
          500: "#e8c547",
          600: "#c9a227",
        },
        cranberry: {
          500: "#c41e3a",
          600: "#9e1830",
        },
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(232, 197, 71, 0.25)" },
          "50%": { boxShadow: "0 0 32px rgba(232, 197, 71, 0.45)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
