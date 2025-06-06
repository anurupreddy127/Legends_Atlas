/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        edu: ['"Edu NSW ACT Cursive"', "cursive"],
        playfair: ['"Playfair Display"', "serif"],
      },
      colors: {
        parchment: "#FAF4E6",
        goldenrod: "#DAA520",
        slategrey: "#1F2937",
        indigoText: "#4B0082",
      },
    },
  },
  plugins: [],
};
