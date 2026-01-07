/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'premium-dark': '#0a0a0a',
        'premium-gold': '#FFD700',
        'premium-accent': '#7C3AED',
      }
    },
  },
  plugins: [],
}
