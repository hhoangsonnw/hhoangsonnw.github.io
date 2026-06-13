import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          50: '#f4f0e7',
          100: '#e8dfcf',
          500: '#2f8a68',
          700: '#1f604f',
          950: '#090d0c',
        },
        neon: {
          cyan: '#4fb6aa',
          green: '#2f8a68',
          magenta: '#a94b58',
          amber: '#d5a253',
        },
      },
      boxShadow: {
        glow: '0 20px 50px rgba(9, 13, 12, 0.18)',
        matrix: '0 0 0 1px rgba(213, 162, 83, 0.18), 0 18px 48px rgba(9, 13, 12, 0.26)',
      },
      fontFamily: {
        display: ['Iowan Old Style', 'Palatino', 'Charter', 'ui-serif', 'Georgia', 'serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        sans: ['Aptos', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.72' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
      },
      animation: {
        scan: 'scan 7s linear infinite',
        flicker: 'flicker 4s infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [
    typography({
      className: 'prose',
    }),
  ],
};
