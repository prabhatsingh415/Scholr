/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366F1",
          hover: "#5558E3",
        },
        background: {
          primary: "#0A0A0A",
          secondary: "#1A1A1A",
          elevated: "#222222",
        },
        border: {
          subtle: "#2A2A2A",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#666666",
        },
      },
    },
  },
  plugins: [],
};
