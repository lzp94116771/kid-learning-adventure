/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kid: [
          "KaiTi",
          "STKaiti",
          "SimSun",
          "Noto Serif CJK SC",
          "serif",
        ],
        ui: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(50, 38, 20, 0.14)",
      },
    },
  },
  plugins: [],
};
