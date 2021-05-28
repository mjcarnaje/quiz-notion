module.exports = {
  purge: {
    mode: "all",
    preserveHtmlElements: false,
    enabled: true,
    content: ["./public/**/*.html", "./public/**/*.js"],
    options: {
      keyframes: true,
    },
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
