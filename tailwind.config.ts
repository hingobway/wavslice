import type { Config } from 'tailwindcss';

import theme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src-tsx/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
