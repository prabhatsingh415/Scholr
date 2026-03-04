/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
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
          box: "#1A1A1A",
        },
        border: {
          subtle: "#2A2A2A",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#666666",
        },
        live: {
          primary: "#15AC81",
          secondary: "#192A24",
          btn: "#10B981",
        },
      },

      fontSize: {
        display: [
          "64px",
          { letterSpacing: "-0.025em", lineHeight: "1", fontWeight: "300" },
        ],

        calendar: ["0.8rem", { lineHeight: "1.5" }],

        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1" }],
        xl: ["20px", { lineHeight: "1" }],
        "2xl": ["24px", { lineHeight: "1.25" }],
        "3xl": ["30px", { lineHeight: "1.25" }],
      },

      letterSpacing: {
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        widest: "0.1em",
      },
    },
  },
  plugins: [],
};
