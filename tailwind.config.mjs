/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#171716',
        paper: '#F3F0EA',
        stone: '#D9D2C5',
        clay: '#9A765E',
        forest: '#243A32',
        mist: '#ECE7DE',
      },
      letterSpacing: {
        widecaps: '0.18em',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
};
