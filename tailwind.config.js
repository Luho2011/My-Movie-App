/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",  // App Router Pfade
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",  // Falls du Pages Ordner hast
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};