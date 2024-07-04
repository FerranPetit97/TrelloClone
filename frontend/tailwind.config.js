/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "trello-animated": "url('src/assets/logos/trello-animated.gif')",
      },
    },
  },
  plugins: [],
};
