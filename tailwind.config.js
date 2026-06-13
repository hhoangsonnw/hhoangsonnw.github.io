import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#14f195',
          700: '#08a66c',
          950: '#020617',
        },
        neon: {
          cyan: '#22d3ee',
          green: '#39ff88',
          magenta: '#f472b6',
          amber: '#fbbf24',
        },
      },
      boxShadow: {
        glow: '0 0 36px rgba(34, 211, 238, 0.22)',
        matrix: '0 0 28px rgba(57, 255, 136, 0.22)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
