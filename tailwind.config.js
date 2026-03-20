/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./controle_agentes_ia/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        // Emerald Command Palette
        'emerald-primary': '#04b983',
        'emerald-glow': 'rgba(4, 185, 131, 0.15)',
        'bg-base': '#0a0a0a',
        'surface-base': '#141414',
        'surface-elevated': '#1e1e1e',
        'text-primary': '#e0e0e0',
        'text-muted': '#a0a0a0',
        'danger-red': '#d64b4b',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}