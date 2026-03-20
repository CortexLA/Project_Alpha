/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',       // slate-900
        foreground: 'var(--color-foreground)',       // slate-200
        primary: {
          DEFAULT: 'var(--color-primary)',           // teal-400 custom
          foreground: 'var(--color-primary-foreground)', // near-black
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',         // slate-800
          foreground: 'var(--color-secondary-foreground)', // slate-100
        },
        accent: {
          DEFAULT: 'var(--color-accent)',            // blue-500
          foreground: 'var(--color-accent-foreground)', // white
        },
        card: {
          DEFAULT: 'var(--color-card)',              // slate-800
          foreground: 'var(--color-card-foreground)', // slate-50
        },
        popover: {
          DEFAULT: 'var(--color-popover)',           // slate-800
          foreground: 'var(--color-popover-foreground)', // slate-50
        },
        muted: {
          DEFAULT: 'var(--color-muted)',             // slate-700
          foreground: 'var(--color-muted-foreground)', // slate-400
        },
        border: 'var(--color-border)',               // slate-700
        input: 'var(--color-input)',                 // slate-800
        ring: 'var(--color-ring)',                   // teal-400 custom
        success: {
          DEFAULT: 'var(--color-success)',           // emerald-500
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)',           // amber-500
          foreground: 'var(--color-warning-foreground)', // gray-800
        },
        error: {
          DEFAULT: 'var(--color-error)',             // red-500
          foreground: 'var(--color-error-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',       // red-500
          foreground: 'var(--color-destructive-foreground)', // white
        },
        surface: {
          0: 'var(--color-surface-0)',               // slate-900
          1: 'var(--color-surface-1)',               // slate-800
          2: 'var(--color-surface-2)',               // slate-700
        },
      },
      fontFamily: {
        heading: ['JetBrains Mono', 'monospace'],
        body: ['Manrope', 'sans-serif'],
        caption: ['Inter', 'sans-serif'],
        data: ['Fira Code', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.2' }],
        'h1': ['1.875rem', { lineHeight: '1.25' }],
        'h2': ['1.5rem', { lineHeight: '1.3' }],
        'h3': ['1.25rem', { lineHeight: '1.4' }],
        'h4': ['1.125rem', { lineHeight: '1.5' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        DEFAULT: '10px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      height: {
        'nav': '64px',
        'touch': '48px',
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 0 0 1px rgba(255,255,255,0.05)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        'elevation-3': '0 6px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'elevation-4': '0 12px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'glow-primary': '0 0 20px rgba(0,212,170,0.1)',
        'glow-primary-active': '0 0 20px rgba(0,212,170,0.25)',
        'glow-accent': '0 0 40px rgba(59,130,246,0.15)',
        'glow-error': '0 0 20px rgba(239,68,68,0.2)',
      },
      transitionTimingFunction: {
        'tactical': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'base': '250ms',
      },
      zIndex: {
        'navigation': '100',
        'modal': '200',
        'alert': '300',
        'tooltip': '400',
      },
      animation: {
        'pulse-threat': 'pulse-threat 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'skeleton': 'skeleton-pulse 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'pulse-threat': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'skeleton-pulse': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideDown': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      maxWidth: {
        'prose': '70ch',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};