/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        thai: {
          gold: '#FFD700',
          'gold-dark': '#FFA500',
          red: '#DC143C',
          'red-dark': '#B22222',
          green: '#228B22',
          'green-dark': '#006400',
        },
      },
      fontFamily: {
        'thai': ['Noto Sans Thai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

