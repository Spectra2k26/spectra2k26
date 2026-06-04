/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spectra: {
          black: '#030712',
          dark: '#0a0f1e',
          card: '#0d1426',
          border: '#1a2540',
          emerald: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
            glow: '#10b98133',
          },
          gold: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            glow: '#f59e0b33',
          },
          silver: '#9ca3af',
          bronze: '#cd7c3c',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui'],
        body: ['var(--font-body)', 'system-ui'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'count-up': 'count-up 0.3s ease-out',
        'ticker': 'ticker 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'rank-up': 'rank-up 0.5s ease-out',
        'rank-down': 'rank-down 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'ticker': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(-100%)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'rank-up': {
          from: { transform: 'translateY(20px)', color: '#10b981' },
          to: { transform: 'translateY(0)', color: 'inherit' },
        },
        'rank-down': {
          from: { transform: 'translateY(-20px)', color: '#ef4444' },
          to: { transform: 'translateY(0)', color: 'inherit' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
