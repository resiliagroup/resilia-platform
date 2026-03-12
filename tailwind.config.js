/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        resilia: {
          navy:  '#0A1628',
          blue:  '#1B4FD8',
          teal:  '#009B8D',
          teal2: '#00C9B1',
          warm:  '#F8F6F3',
          amber: '#D97706',
          red:   '#DC2626',
        },
      },
    },
  },
  plugins: [],
}
