module.exports = {
  purge: {
    enabled: true,
    content: ["./public/**/*.html", "./public/**/*.js"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  variants: {},
  plugins: [],
};
