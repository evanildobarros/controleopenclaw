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
        // Light Command Palette (Based on User request: All fonts MUST be black)
        'emerald-primary': '#04b983',
        'emerald-glow': 'rgba(4, 185, 131, 0.1)',
        'bg-base': '#ffffff', 
        'surface-base': '#fafafa',
        'surface-elevated': '#f0f0f0',
        'text-primary': '#000000',
        'text-muted': '#000000',
        'danger-red': '#cc0000',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}