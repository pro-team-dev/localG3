/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: "#B1DFCC",
          btn: "#5CA385",
          "primary-0": "#277453",
          "primary-3": "#07462B",
          "primary-4": "#00170D",
        },
      },
    },
  },
  plugins: [],
};
