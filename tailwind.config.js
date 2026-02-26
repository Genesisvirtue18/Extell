/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#08142b',
        deep: '#061022',
        electric: '#1f7bff',
        accent: '#ed2125',
        cobalt: '#171d5a',
        slate: '#6f7f9a',
        card: '#f8fbff'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(31,123,255,0.4), 0 16px 48px rgba(4,19,45,0.35)'
      },
      backgroundImage: {
        'tech-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
        'hero-gradient': 'linear-gradient(130deg, #061022 0%, #0b1c3e 45%, #123b86 100%)'
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
