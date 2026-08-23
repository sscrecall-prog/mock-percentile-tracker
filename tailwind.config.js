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
        // Neon Cyber Glass 3D Signature Accents
        neon: {
          cyan: '#00D2FF',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          violet: '#A855F7',
          magenta: '#EC4899',
          pink: '#D946EF',
          emerald: '#10B981',
          mint: '#34D399',
          amber: '#F59E0B',
          gold: '#FBBF24',
          crimson: '#F43F5E',
          red: '#EF4444',
        },
        electric: {
          blue: '#00D2FF', // Electric Cyan Primary
          dark: '#0066FF',
          glow: 'rgba(0, 210, 255, 0.45)',
          light: '#E0F7FF',
        },
        cyber: {
          purple: '#8B5CF6',
          magenta: '#EC4899',
          pink: '#D946EF',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
        mint: {
          DEFAULT: '#34D399',
          dark: '#10B981',
          emerald: '#059669',
          glow: 'rgba(52, 211, 153, 0.45)',
        },
        alert: {
          red: '#F43F5E',
          dark: '#E11D48',
          glow: 'rgba(244, 63, 94, 0.35)',
        },
        lavender: '#A855F7',
        pinkAccent: '#EC4899',
        sky: '#00D2FF',
        orangeAccent: '#FB923C',
        amberAccent: '#F59E0B',

        // Deep Space & Cyber Glass Surfaces (Dark Mode Default)
        darkBg: '#050814',
        darkSurface: '#0C1228',
        darkElevated: '#131B38',
        darkContainer: '#0E1630',
        darkCard: '#0C1228',
        darkBorder: 'rgba(255, 255, 255, 0.09)',

        // Light mode surfaces (Crisp porcelain)
        lightBg: '#F8FAFC',
        lightSurface: '#FFFFFF',
        lightContainer: '#F1F5F9',
        lightCard: '#FFFFFF',
        lightBorder: 'rgba(15, 23, 42, 0.08)',

        // Warm Cream mode surfaces
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
        'glow-blue': '0 0 25px -3px rgba(0, 210, 255, 0.45)',
        'glow-cyan': '0 0 30px -3px rgba(0, 210, 255, 0.55)',
        'glow-purple': '0 0 30px -3px rgba(139, 92, 246, 0.55)',
        'glow-magenta': '0 0 30px -3px rgba(236, 72, 153, 0.55)',
        'glow-mint': '0 0 25px -3px rgba(16, 185, 129, 0.45)',
        'glow-gold': '0 0 25px -3px rgba(245, 158, 11, 0.45)',
        'glow-alert': '0 0 25px -3px rgba(244, 63, 94, 0.45)',
        'cyber-glass': '0 12px 40px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'cyber-cta': '0 0 25px rgba(139, 92, 246, 0.45), 0 0 50px rgba(217, 70, 239, 0.25)',
        '3d-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        '3d-light': '0 10px 30px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.05)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
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
