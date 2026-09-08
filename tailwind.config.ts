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
        primary: {
          DEFAULT: "#15803d", // green-700 — forest canopy
          hover: "#166534", // green-800
        },
        secondary: {
          DEFAULT: "#f1f5f9", // slate-100
          dark: "#e2e8f0", // slate-200
        },
        bark: {
          DEFAULT: "#78350f", // amber-900 — trunk/soil accent
          light: "#b45309", // amber-700
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
