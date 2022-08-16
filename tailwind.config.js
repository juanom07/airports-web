/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': 'rgba(0, 30, 60, 0.9)',
      },
    },
  },
  plugins: [],
}