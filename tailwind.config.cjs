/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      width: {
        "aims": "500px"
      },
      height: {
        "aims": "700px"
      },
      backgroundColor: {
        "st-btn": "#0E9D1C"
      },
      borderColor: {
        "st-btn": "#1ABB00"
      },
      fontFamily: {
        "dancing-script": ["Dancing Script", "sans-serif"],
        "oxygen-bold": ["Oxygen Bold",  "sans-serif"]
      },
      colors: {
        "act-btns": "#1492C8"
      },
      fontSize: {
        "btn-into": "17px"
      }
    },
  },

  plugins: [],
};

module.exports = config;
