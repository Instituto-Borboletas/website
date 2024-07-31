/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#56B2CF",
        secondary: "#388EA9",
      },
    },
  },
  plugins: [],
}

