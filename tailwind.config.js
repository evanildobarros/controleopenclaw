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
        'text-primary': '#e4e4e7', // Softened white for reduced eye strain
        'text-muted': '#a1a1aa',
        'danger-red': '#ef4444',
        'surface-light': '#ffffff', // Added based on AgentConfigTrigger.tsx
        'happiness-1': '#04b983', // Mapped from emerald-primary for consistency
        'happiness-2': '#03a976', // Proposed slight darker shade for hover state
        'blue-400': '#60a5fa', // Added based on AgentConfigTrigger.tsx (for dark text)
      },
    },
  },
  plugins: [],
}