/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        display: ['Cairo', 'sans-serif'],
      },
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        sand: {
          50: '#fdfaf3',
          100: '#f9f0df',
          200: '#f1e0bd',
          300: '#e8cb94',
          400: '#ddb06b',
          500: '#d49a52',
          600: '#c47f45',
          700: '#a3643a',
          800: '#845036',
          900: '#6c4431',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd0c7',
          300: '#ffb0a0',
          400: '#ff856e',
          500: '#ff5a3c',
          600: '#f03e1d',
          700: '#c92f15',
          800: '#a42918',
          900: '#87271a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
