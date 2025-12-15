/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EBEBEB", // That expensive-looking beige/grey
        secondary: "#1C1C1C", // Deep Charcoal Black (Text)
        tertiary: "#D4D4D4", // Light Grey accents
        accent: "#FF4D22", // Tiny pop of orange (optional, looks pro)
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Clean Swiss font
      },
    },
  },
  plugins: [],
};