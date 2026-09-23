/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0a0e14',
          900: '#0d1117',
          850: '#11161f',
          800: '#161b22',
          700: '#1c2230',
          600: '#242b3d',
          500: '#2d3548',
        },
        defender: {
          DEFAULT: '#58a6ff',
          50: '#e0f0ff',
          100: '#b3d4ff',
          200: '#8ab8ff',
          300: '#6faaff',
          400: '#58a6ff',
          500: '#3b8be0',
          600: '#2b6db5',
          700: '#1e5085',
          800: '#163659',
          900: '#0e2340',
        },
        toxic: {
          DEFAULT: '#3fb950',
          50: '#e6ffe8',
          100: '#b3f5bd',
          200: '#8aeb9a',
          300: '#5fdc73',
          400: '#3fb950',
          500: '#2ea03f',
          600: '#22802f',
          700: '#1a6024',
          800: '#13401a',
          900: '#0d2a12',
        },
        danger: {
          DEFAULT: '#f85149',
          50: '#ffeceb',
          100: '#ffc4c0',
          200: '#ff9b94',
          300: '#f87a72',
          400: '#f85149',
          500: '#e0362f',
          600: '#b82822',
          700: '#8e1f1b',
          800: '#661714',
          900: '#420f0d',
        },
        warning: {
          DEFAULT: '#f0883e',
          400: '#f0883e',
          500: '#d9701a',
        },
        muted: {
          DEFAULT: '#7d8590',
          light: '#9ba3ae',
          dark: '#565d66',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        sans: ['Inter', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 4s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'flash-red': 'flashRed 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'pingSlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 12px 0 currentColor' },
          '50%': { opacity: '0.6', boxShadow: '0 0 24px 4px currentColor' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
        flashRed: {
          '0%': { opacity: '0' },
          '20%': { opacity: '0.6' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pingSlow: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
