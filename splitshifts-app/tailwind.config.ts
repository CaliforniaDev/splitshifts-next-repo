import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Light Mode
         */
        primary: '#35618E',
        'on-primary': '#FFFFFF',
        'primary-container': '#D1E4FF',
        'on-primary-container': '#001D36',

        secondary: '#535F70',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#D6E3F7',
        'on-secondary-container': '#101C2B',

        tertiary: '#29638A',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#CBE6FF',
        'on-tertiary-container': '#001E30',

        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'error-container': '#FFDAD6',
        'on-error-container': '#410002',

        surface: '#F7F9FF',
        'on-surface': '#181C20',
        'on-surface-variant': '#3F4947',

        outline: '#6F7977',
        'outline-variant': '#BEC9C6',
        shadow: '#000000',
        scrim: '#000000',
        'inverse-surface': '#2D3135',
        'inverse-on-surface': '#EEF1F6',
        'inverse-primary': '#A0CAFD',

        'surface-dim': '#D7DADF',
        'surface-bright': '#F7F9FF',

        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F1F4F9',
        'surface-container': '#EBEEF3',
        'surface-container-high': '#E5E8ED',
        'surface-container-highest': '#E0E3E8',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        'space-grotesk': [
          'var(--font-space-grotesk)',
          'Space Grotesk',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-lg': ['57px', '64px'],
        'display-md': ['45px', '52px'],
        'display-sm': ['36px', '44px'],
        'display-xs': ['22px', '28px'],
        'headline-lg': ['32px', '40px'],
        'headline-md': ['28px', '36px'],
        'headline-sm': ['24px', '32px'],
        'body-lg': ['16px', '24px'],
        'body-md': ['14px', '20px'],
        'body-sm': ['12px', '16px'],
        'label-lg': ['14px', '20px'],
        'label-md': ['12px', '16px'],
        'label-sm': ['11px', '16px'],
        'title-lg': ['22px', '28px'],
        'title-md': ['16px', '24px'],
        'title-sm': ['14px', '20px'],
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        16: '0.16',
        38: '0.38',
        'state-hover': '0.08',
        'state-focus': '0.10',
        'state-press': '0.10',
        'state-disabled': '0.12',
        'state-drag': '0.16',
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1':
          '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);',
        'elevation-2':
          '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3':
          '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
        'elevation-4':
          '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.30)',
        'elevation-5':
          '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px 0px rgba(0, 0, 0, 0.30)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'landing-gradient':
          'linear-gradient(180deg, #f7f9ff 15%, #D7DADF 100%)',
      },
      transitionProperty: {
        textfield: 'border, background-color, color, padding',
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
        'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1)',
        'expressive-fast-spatial': 'cubic-bezier(0.42, 1.67, 0.21, 0.9)', // Use 350ms
        'expressive-default-spatial': 'cubic-bezier(0.38, 1.21, 0.22, 1.00)', // Use 500ms
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        draw: {
          '0%': {
            strokeDashoffset: '20',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
        'expand-from-center': {
          '0%': {
            transform: 'scaleX(0)',
          },
          '100%': {
            transform: 'scaleX(1)',
          },
        },
        'dialog-scale-in': {
          '0%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(1.05)', // Starts slightly larger
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
        'dialog-scale-out': {
          '0%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.95)', // Ends slightly smaller
          },
        },
        'dropdown-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'scaleY(0)',
            transformOrigin: 'top',
          },
          '100%': {
            opacity: '1',
            transform: 'scaleY(1)',
            transformOrigin: 'top',
          },
        },
        'dropdown-fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) scaleY(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-8px) scaleY(0.95)',
          },
        },
        'dropdown-fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'scaleY(0)',
            transformOrigin: 'bottom',
          },
          '100%': {
            opacity: '1',
            transform: 'scaleY(1)',
            transformOrigin: 'bottom',
          },
        },
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slide-right': {
          '0%': {
            transform: 'translateX(-20px)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        draw: 'draw 0.8s ease-in-out forwards',
        'expand-from-center':
          'expand-from-center 0.2s cubic-bezier(0.2, 0, 0, 1) forwards',

        'dialog-scale-in':
          'dialog-scale-in 0.3s cubic-bezier(0.36, 0.66, 0.04, 1)', // iOS spring curve
        'dialog-scale-out':
          'dialog-scale-out 0.2s cubic-bezier(0.36, 0.66, 0.04, 1)',
        'dropdown-fade-in':
          'dropdown-fade-in 0.35s cubic-bezier(0.42, 1.67, 0.21, 0.9)',
        'dropdown-fade-in-up':
          'dropdown-fade-in-up 0.35s cubic-bezier(0.42, 1.67, 0.21, 0.9)',
        'dropdown-fade-out':
          'dropdown-fade-out 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left':
          'slide-in-left 0.2s cubic-bezier(0.05, 0.7, 0.1, 1) forwards',
        'slide-right':
          'slide-right 0.35s cubic-bezier(0.42, 1.67, 0.21, 0.9) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
