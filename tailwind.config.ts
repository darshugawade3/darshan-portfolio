/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: { 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2" },
        gold: { 300: "#fde68a", 400: "#fbbf24", 500: "#f59e0b" },
        navy: { 900: "#020817", 800: "#050f1e", 700: "#071428" },
      },
      fontFamily: {
        sans: ["Exo 2", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
