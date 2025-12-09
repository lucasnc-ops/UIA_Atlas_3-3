/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // UIA-inspired Architectural Light Theme (preserving key names for compatibility)
        mapbox: {
          black: '#ffffff',      // Main background (was black, now white)
          dark: '#f8f9fa',       // Secondary background/inputs (was dark gray, now very light gray)
          card: '#ffffff',       // Card background (was dark gray, now white)
          gray: '#64748b',       // Secondary text (was light gray, now slate-500)
          light: '#0f172a',      // Primary text (was white, now slate-900)
          border: '#e2e8f0',     // Borders (was dark gray, now slate-200)
        },
        // UIA Blue (Primary)
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bce0ff',
          300: '#85c6ff',
          400: '#46a3fa',
          500: '#1d7df2',
          600: '#006cb8', // Base UIA Blue
          700: '#005694',
          800: '#00497a',
          900: '#063d63',
          950: '#042742',
        },
        // UIA Yellow (Accent)
        accent: {
          50: '#fffbea',
          100: '#fff1c5',
          200: '#ffe285',
          300: '#fed831', // Base UIA Yellow
          400: '#fdbf07',
          500: '#f0a300',
          600: '#d17e00',
          700: '#a65902',
          800: '#88460b',
          900: '#733a10',
        },
        // Neutral architectural tones (Slate)
        stone: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.08em',
      },
    },
  },
  plugins: [],
}
