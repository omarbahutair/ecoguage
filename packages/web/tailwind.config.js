import { transform } from 'typescript';

// const primary = '#168e47';
const primary = '#b1c4b2';
const primaryFade = '#36454f';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['**/*.tsx', './index.html'],
  theme: {
    extend: {
      colors: {
        primary,
        'primary-fade': primaryFade,
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
        slide: {
          '0%': {
            transform: 'translateX(0px)',
          },
          '25%': {
            transform: 'translateX(-2px)',
          },
          '50%': {
            transform: 'translateX(0px)',
          },
          '75%': {
            transform: 'translateX(2px)',
          },
          '100%': {
            transform: 'translateX(0px)',
          },
        },
        'slide-left': {
          '0%': {
            transform: 'translateX(0px)',
          },
          '25%': {
            transform: 'translateX(-4px)',
          },
          '50%': {
            transform: 'translateX(0px)',
          },
          '100%': {
            transform: 'translateX(0px)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms forwards',
        'fade-out': 'fade-out 150ms forwards',
        slide: 'slide 500ms linear',
        'slide-left': 'slide-left 1000ms infinite',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
