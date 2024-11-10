/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-black": "#1C1C1B",
        "dark-gray": "#3D3D3B",
        "greenish-gray": "#636B5E",
        "light-beige": "#E8DBC7",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
};
