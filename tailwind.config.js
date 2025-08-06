const cutie = require("./colors.global");

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
      colors: {
        "cutie-pink": global.cutie.pink,
        "cutie-orange": global.cutie.orange,
        "cutie-green": global.cutie.green,
        "cutie-blue": global.cutie.blue,
        "cutie-purple": global.cutie.purple,
      },
    },
  },
  plugins: [],
};
