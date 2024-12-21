import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
      colors: {
        primary: '#56B2CF',
        secondary: '#388EA9'
      },
  		fontFamily: {
  			sans: [
  				'Inter"',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif',
  				'Apple Color Emoji"',
  				'Segoe UI Emoji"',
  				'Segoe UI Symbol"',
  				'Noto Color Emoji"'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
