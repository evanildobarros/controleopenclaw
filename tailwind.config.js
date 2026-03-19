/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./controle_agentes_ia/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'emerald-primary': '#00A878', 
        'danger-red': '#D94B4B',
        'background-light': '#FFFFFF',
        'surface-light': '#F8F8F8',
        'text-dark': '#212529',
      },
    },
  },
  plugins: [],
}