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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            '--tw-prose-body': 'var(--foreground)',
            '--tw-prose-headings': 'var(--foreground)',
            '--tw-prose-links': 'var(--primary)',
            '--tw-prose-links-hover': 'var(--primary/90)',
            '--tw-prose-underline': 'var(--primary/20)',
            '--tw-prose-underline-hover': 'var(--primary)',
            '--tw-prose-bold': 'var(--foreground)',
            '--tw-prose-counters': 'var(--muted-foreground)',
            '--tw-prose-bullets': 'var(--muted-foreground)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
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
