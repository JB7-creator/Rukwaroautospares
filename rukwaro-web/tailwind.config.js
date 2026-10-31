/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E11D23',
          redHover: '#C4151B',
          redDark: '#9E0E13',
          redLight: '#FEE2E2',
          charcoal: '#08080D',
          charcoalLight: '#16181F',
          midgray: '#242834',
          slate: '#4B5563',
          lightgray: '#E5E7EB',
          offwhite: '#F9FAFB',
        }
      },
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(225, 29, 35, 0.15), 0 8px 10px -6px rgba(225, 29, 35, 0.1)',
        'card': '0 4px 20px -2px rgba(8, 8, 13, 0.06), 0 2px 6px -1px rgba(8, 8, 13, 0.04)',
        'elevated': '0 20px 40px -15px rgba(8, 8, 13, 0.1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        beam: {
          '0%': { transform: 'translateX(-70vw) skewX(-16deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '45%': { opacity: '0.55' },
          '55%': { transform: 'translateX(130vw) skewX(-16deg)', opacity: '0' },
          '100%': { transform: 'translateX(130vw) skewX(-16deg)', opacity: '0' },
        },
        shine: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        cue: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(6px)', opacity: '0.35' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        beam: 'beam 12s ease-in-out infinite',
        shine: 'shine 5s linear infinite',
        cue: 'cue 1.8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
