import type { Config } from 'tailwindcss';
// import config from '../design-system/tailwind.config'

const config: Config = {
  content: [
    '../../packages/**/*.{ts,tsx,js,jsx}',
    // '../design-system/tailwind.config.ts',
    // '../design-system/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
