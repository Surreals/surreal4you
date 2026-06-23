/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SRRL visual system — see DESIGN.md
        asphalt: "#0a0c0e",
        graphite: "#23282e",
        concrete: "#6e7b86",
        xray: {
          DEFAULT: "#7fa8c9",
          pale: "#b9d3e3",
        },
        cold: "#e8eef2",
        signal: "#d11a2a",
        line: "rgba(255,255,255,0.10)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-rock-salt)", "cursive"],
      },
      hueRotate: {
        '-45': '-45deg',
        45: '45deg',
      },
    },
  },
  plugins: [],
}
