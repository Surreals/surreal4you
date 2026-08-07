/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SRRL visual system — see DESIGN.md
        bark: "#141811",
        moss: "#262b21",
        lichen: "#7e8a74",
        leaf: {
          DEFAULT: "#8fbf6a",
          pale: "#c3d9ac",
        },
        bone: "#eef1e8",
        line: "rgba(238,241,232,0.12)",
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
