import { transform } from 'typescript';

// const primary = '#168e47';
const primary = '#b1c4b2';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['**/*.tsx', './index.html'],
  theme: {
    extend: {
      colors: {
        primary,
        'primary-fade': '#36454f',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0%',
          },
          '100%': {
            opacity: '100%',
          },
        },
        'fade-out': {
          '100%': {
            opacity: '0%',
            display: 'none',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms forwards',
        'fade-out': 'fade-out 150ms forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
