/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f1',
          100: '#d0e8d5',
          500: '#1a472a',
          600: '#133621',
          700: '#0d251a',
          900: '#000a04',
        },
        secondary: {
          50: '#fffbf0',
          100: '#ffefd5',
          500: '#d4af37',
          600: '#c9a537',
          700: '#b89a2f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
