/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#fae4d2",
          50: "#FEFAF7",
          100: "#FDF5EF",
          200: "#FCEBDF",
          300: "#fae4d2",
          400: "#F5D4B8",
          500: "#F0C49E",
          600: "#EBB484",
          700: "#E6A46A",
          800: "#E19450",
          900: "#DC8436",
        },
        secondary: {
          50: "#F5F7FA",
          100: "#EBEFF5",
          200: "#D7DFEB",
          300: "#C3CFE1",
          400: "#AFBFD7",
          500: "#9BAFCD",
          600: "#879FC3",
          700: "#738FB9",
          800: "#5F7FAF",
          900: "#4B6FA5",
        },
        accent: {
          50: "#FFF5F0",
          100: "#FFEBE0",
          200: "#FFD7C1",
          300: "#FFC3A2",
          400: "#FFAF83",
          500: "#FF9B64",
          600: "#FF8745",
          700: "#FF7326",
          800: "#FF5F07",
          900: "#E54B00",
        },
      },
    },
  },
  plugins: [],
}
