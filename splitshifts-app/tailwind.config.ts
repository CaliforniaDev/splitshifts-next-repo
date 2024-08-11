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
        inter: ['Inter', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'font-size-display-lg': ['57px', '64px'],
        'font-size-display-md': ['45px', '52px'],
        'font-size-display-sm': ['36px', '44px'],
        'font-size-display-xs': ['22px', '28px'],
        'font-size-headline-lg': ['28px', '36px'],
        'font-size-headline-md': ['24px', '32px'],
        'font-size-headline-sm': ['18px', '24px'],
        'font-size-body-lg': ['16px', '24px'],
        'font-size-body-md': ['14px', '20px'],
        'font-size-body-sm': ['12px', '16px'],
        'font-size-label-lg': ['14px', '20px'],
        'font-size-label-md': ['12px', '16px'],
        'font-size-label-sm': ['11px', '16px'],
        'font-size-title-lg': ['22px', '28px'],
        'font-size-title-md': ['16px', '24px'],
        'font-size-title-sm': ['14px', '20px'],
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
