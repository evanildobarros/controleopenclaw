/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'emerald-primary': '#04b983',
        'bg-base': '#0a0a0a',
        'bg-dark': '#121212',
        'surface-base': '#181818',
        'surface-elevated': '#242424',
        'text-primary': '#ffffff',
        'text-muted': '#a1a1aa',
        'danger-red': '#ef4444',
      },
    },
  },
  plugins: [],
}