/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Emerald Focus & Gold Brand Palette
        electric: {
          blue: '#10B981', // Vivid Emerald Focus
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.35)',
          light: '#ECFDF5',
        },
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
        mint: {
          DEFAULT: '#34D399',
          dark: '#10B981',
          emerald: '#059669',
          glow: 'rgba(52, 211, 153, 0.35)',
        },
        alert: {
          red: '#EF4648',
          dark: '#D42D30',
          glow: 'rgba(239, 70, 72, 0.25)',
        },
        lavender: '#A78BFA',
        pinkAccent: '#F472B6',
        sky: '#38BDF8',
        orangeAccent: '#FB923C',
        amberAccent: '#F59E0B',
        // Dark theme surfaces (Preserved exact deep dark palette)
        darkBg: '#15171D',
        darkSurface: '#1B1E26',
        darkElevated: '#222733',
        darkContainer: '#1F2430',
        darkCard: '#191D26',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        // Light theme surfaces
        lightBg: '#F4F7FB',
        lightSurface: '#FFFFFF',
        lightContainer: '#E8EEF5',
        lightCard: '#FFFFFF',
        lightBorder: 'rgba(15, 23, 42, 0.08)',
        // Warm Cream theme surfaces
        warmBg: '#F7F4EE',
        warmSurface: '#FFFDF9',
        warmContainer: '#ECE5D8',
        warmCard: '#FFFDF9',
        warmBorder: 'rgba(30, 41, 59, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(16, 185, 129, 0.45)', // Emerald primary glow
        'glow-mint': '0 0 25px -5px rgba(52, 211, 153, 0.45)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.45)', // Gold accent glow
        'glow-alert': '0 0 25px -5px rgba(239, 70, 72, 0.35)',
        '3d-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        '3d-light': '0 10px 30px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.05)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('light', '.light &');
      addVariant('warm-cream', '.warm-cream &');
    }
  ],
}
