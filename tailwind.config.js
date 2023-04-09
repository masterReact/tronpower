/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Alkalami: ["Alkalami", "regular"],
        Cinzel: ["Cinzel", "regular"],
        Pacifico: ["Pacifico", "regular"],
        Indie: ["Indie", "regular"],
        Patua: ["Patua", "regular"],
      },
    },
  },
  plugins: [],
};
