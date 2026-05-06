/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: 'var(--brand-blue)',
          cyan: 'var(--brand-cyan)',
          teal: 'var(--brand-teal)',
          navy: 'var(--brand-navy)',
        },
        bg: {
          base: 'var(--bg-base)',
          card: 'var(--bg-card)',
          sidebar: 'var(--bg-sidebar)',
          muted: 'var(--bg-muted)',
        },
        sage: {
          100: 'var(--sage-100)',
          300: 'var(--sage-300)',
          500: 'var(--sage-500)',
          700: 'var(--sage-700)',
        },
        feedback: {
          success: 'var(--feedback-success)',
          warning: 'var(--feedback-warning)',
          rest: 'var(--feedback-rest)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(29,78,216,0.06)',
        'card-hover': '0 4px 16px rgba(29,78,216,0.10)',
        'fab': '0 4px 20px rgba(34,211,238,0.30)',
        'sidebar': '2px 0 16px rgba(29,78,216,0.06)',
      },
      animation: {
        'draw-arc': 'drawArc 1s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        drawArc: {
          '0%': { strokeDashoffset: '440' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
      },
    },
  },
  plugins: [],
}
