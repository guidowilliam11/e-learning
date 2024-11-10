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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: "#F99B26",
        primaryDark: "#943500",
        secondary: "#545EE1",
        secondaryDark: "#383e95",
        secondaryLight: "#E5E7FB"
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      gridTemplateColumns: {
        contact: "1fr 2.25fr"
      }
    },
  },
  plugins: [],
}
