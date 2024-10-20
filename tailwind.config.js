// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('tailwind-scrollbar')({ nocompatible: true }),({ preferredStrategy: 'pseudoelements' })
//   ],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '::-webkit-scrollbar': { display: 'none' }, /* For Chrome, Safari, and Opera */
          '-ms-overflow-style': 'none', /* For Internet Explorer and Edge */
          'scrollbar-width': 'none' /* For Firefox */
        },
      });
    }
  ],
};
