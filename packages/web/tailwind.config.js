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
    },
  },
  plugins: [],
};
