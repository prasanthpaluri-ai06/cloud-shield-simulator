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
        cs: {
          bg: '#080B14',
          sidebar: '#0B1020',
          surface: '#101522',
          surfaceElevated: '#151B2B',
          surfaceHover: '#171E2E',
          border: '#20283A',
          borderSubtle: '#182030',
          borderFocus: '#8B5CF6',
          textPrimary: '#F5F5F7',
          textSecondary: '#9CA3B5',
          textMuted: '#6B7280',
          brand: '#8B5CF6',
          brandSecondary: '#A78BFA',
          brandDark: '#6D28D9',
          brandGlow: 'rgba(139, 92, 246, 0.15)',
          green: '#10B981',
          greenBg: 'rgba(16, 185, 129, 0.1)',
          greenBorder: 'rgba(16, 185, 129, 0.25)',
          amber: '#F59E0B',
          amberBg: 'rgba(245, 158, 11, 0.1)',
          amberBorder: 'rgba(245, 158, 11, 0.25)',
          red: '#EF4444',
          redBg: 'rgba(239, 68, 68, 0.1)',
          redBorder: 'rgba(239, 68, 68, 0.25)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'brand-glow': '0 0 20px -2px rgba(139, 92, 246, 0.25)',
        'brand-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'surface-card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'
      },
      keyframes: {
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
