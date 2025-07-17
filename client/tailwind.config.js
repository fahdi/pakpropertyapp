module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f5fa',
          100: '#ede3f5',
          200: '#d6b8ea',
          300: '#b47ad6',
          400: '#8d3ebd',
          500: '#6B1E9A', // Royal purple
          600: '#58197e',
          700: '#471364',
          800: '#35104a',
          900: '#230a2f',
        },
        secondary: {
          50: '#f5f6fa',
          100: '#e5e7f0',
          200: '#c3c7db',
          300: '#8e91b3',
          400: '#5a5e7a',
          500: '#2D2A4A', // Deep indigo/navy
          600: '#23203a',
          700: '#19162a',
          800: '#13101f',
          900: '#0a0710',
        },
        accent: {
          50: '#fffbea',
          100: '#fff3c4',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffd700', // Gold
          500: '#FFC300',
          600: '#e6b800',
          700: '#b38f00',
          800: '#806600',
          900: '#4d3d00',
        },
        neutral: {
          50: '#f5f5f7',
          100: '#e5e5ea',
          200: '#d1d1d6',
          300: '#a1a1aa',
          400: '#6e6e73',
          500: '#232323', // Main neutral color
          600: '#1a1a1a',
          700: '#141414',
          800: '#0f0f0f',
          900: '#050505',
        },
        warning: {
          50: '#fffbea',
          100: '#fff3c4',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffd700', // Gold for warning
          500: '#FFC300',
          600: '#e6b800',
          700: '#b38f00',
          800: '#806600',
          900: '#4d3d00',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
