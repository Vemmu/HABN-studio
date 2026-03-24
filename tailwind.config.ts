import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf4f3",
          100: "#fce8e6",
          200: "#f9d5d2",
          300: "#f4b5af",
          400: "#ec8a81",
          500: "#e0665a",
          600: "#cc4a3e",
          700: "#ac3c32",
          800: "#8f352e",
          900: "#77332d",
          950: "#401612",
        },
        accent: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#f9d7ac",
          300: "#f5bb77",
          400: "#f09440",
          500: "#ec761a",
          600: "#dd5c10",
          700: "#b74410",
          800: "#923615",
          900: "#762f14",
          950: "#401509",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
