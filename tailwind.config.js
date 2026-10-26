/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // SRRL station system — see DESIGN.md. Every colour is a CSS variable so
      // the night / day themes swap in globals.css without touching markup.
      colors: {
        bg: "var(--bg)",
        panel: {
          DEFAULT: "var(--panel)",
          2: "var(--panel-2)",
        },
        line: "var(--line)",
        ink: "var(--ink)",
        dim: "var(--dim)",
        red: "var(--red)",
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        sign: ["var(--font-rock-salt)", "cursive"],
      },
    },
  },
  plugins: [],
};
