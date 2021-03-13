module.exports = {
  purge: ["./index.html", "./src/**/*.{tsx,ts}"],
  darkMode: "media",
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
};
