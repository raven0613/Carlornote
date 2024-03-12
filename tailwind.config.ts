import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        seagull: {
          50: '#f3f9fc',
          100: '#e5f3f9',
          200: '#c6e6f1',
          300: '#84cbe1',
          400: '#5bbbd5',
          500: '#36a2c1',
          600: '#2684a3',
          700: '#206a84',
          800: '#1e596e',
          900: '#1e4a5c',
          950: '#14313d',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        hide: "opacity 5000ms ease-out"
      },
      keyframes: {
        opacity: {
          '0%': { opacity: "1" },
          '75%': { opacity: "1" },
          '100%': { opacity: '0' },
        }
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
