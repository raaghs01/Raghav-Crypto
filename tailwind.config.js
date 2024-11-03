/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1a1b1e',
          200: '#2c2e33',
          300: '#3d4147',
          400: '#4a4f57',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};