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
        'emerald-primary': '#04b983', // Um pouco mais vibrante
        'danger-red': '#d64b4b',
        'background-dark': '#0f0f0f', // Fundo principal mais escuro (quase preto)
        'surface-dark': '#1a1a1a',   // Painéis e cards um pouco mais claros que o fundo
        'text-light': '#e0e0e0',     // Texto claro principal
        'text-muted-dark': '#a0a0a0',// Texto secundário/mudo
        'text-dark': '#212529',      // Texto escuro (para temas claros)
        'background-light': '#ffffff',
        'surface-light': '#f5f5f5',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}