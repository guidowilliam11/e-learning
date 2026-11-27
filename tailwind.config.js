/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'intermediate-gradient': 'linear-gradient(75.75deg, #F6CD5E -36.5%, #FF8E00 102.64%)',
        'pro-gradient': 'linear-gradient(80.76deg, #FFFFFF 15.21%, #7191BE 90.97%, #4B6E9E 113.06%)',
        'scholarly-gradient': 'linear-gradient(82.33deg, #7F86E8 -36.62%, #545EE1 53.04%, #2E337B 127.08%)'
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: "#F99B26",
        primaryDark: "#943500",
        secondary: "#545EE1",
        secondaryDark: "#383e95",
        secondaryLight: "#E5E7FB",
        // UI tokens: one action colour (indigo), orange kept for focus data (timer, activity graph).
        page: "#F7F7F8",
        line: "#E4E4E7",
        ink: { DEFAULT: "#18181B", 2: "#52525B", 3: "#71717A" },
        accent: { DEFAULT: "#4F55DA", hover: "#3F45C4", wash: "#EEF0FD" },
        focus: { DEFAULT: "#F99B26", ink: "#B45309", wash: "#FEF3E2" },
      },
      borderRadius: { card: "10px" },
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
