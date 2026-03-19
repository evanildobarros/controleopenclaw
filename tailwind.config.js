/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./controle_agentes_ia/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita o modo escuro baseado na classe 'dark'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'emerald-primary': '#00A878', 
        'danger-red': '#D94B4B',
        'background-dark': '#121212', // Fundo escuro
        'surface-dark': '#1E1E1E',   // Superfície escura
        'text-light': '#E0E0E0',     // Texto claro
        'text-dark': '#212529',      // Texto escuro (para temas claros)
      },
    },
  },
  plugins: [],
}