/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito_400Regular", "sans-serif"],
        "nunito-medium": ["Nunito_500Medium", "sans-serif"],
        "nunito-bold": ["Nunito_700Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
