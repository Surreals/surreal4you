/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      hueRotate: {
        '-45': '-45deg',
        45: '45deg',
      }
    },
  },
  plugins: [],
}

