/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0a0a0a',
        deep: '#050505',
        electric: '#111111',
        accent: '#ed2125',
        cobalt: '#121212',
        slate: '#737373',
        card: '#f8fbff'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(17,17,17,0.4), 0 16px 48px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'tech-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
        'hero-gradient': 'linear-gradient(130deg, #080808 0%, #121212 45%, #22090a 100%)'
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'IBM Plex Sans', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseLine: {
          '0%': { opacity: '0.1', transform: 'scaleX(0.8)' },
          '100%': { opacity: '1', transform: 'scaleX(1)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseLine: 'pulseLine 1.8s ease-in-out infinite alternate',
        spinSlow: 'spinSlow 18s linear infinite'
      }
    }
  },
  plugins: []
};
