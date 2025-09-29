/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/routes/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Ensure SVG elements can be styled with Tailwind
      fill: {
        'current': 'currentColor',
      },
      stroke: {
        'current': 'currentColor',
      },
    },
  },
  corePlugins: {
    // Ensure SVG elements can be styled with width/height
    preflight: true,
  },
  plugins: [
    // Add a plugin to handle SVG sizing more predictably
    function({ addUtilities }) {
      const newUtilities = {
        '.icon': {
          'display': 'inline-block',
          'flex-shrink': '0',
          'vertical-align': 'middle',
        },
        '.icon-sm': {
          'width': '1rem',
          'height': '1rem',
        },
        '.icon-md': {
          'width': '1.25rem',
          'height': '1.25rem',
        },
        '.icon-lg': {
          'width': '1.5rem',
          'height': '1.5rem',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
