import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        'headline-lg': ['28px', '36px'],
        'headline-md': ['24px', '32px'],
        'headline-sm': ['18px', '24px'],
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
      boxShadow: {
        'elevation-1':
          '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);',
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
      },
    },
  },
  plugins: [],
};
export default config;
