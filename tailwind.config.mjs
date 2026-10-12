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
        ink: '#17394C',
        paper: '#F6F3EC',
        stone: '#809098',
        clay: '#B89A62',
        forest: '#17394C',
        mist: '#E8ECEC',
        navy: '#17394C',
        slate: '#809098',
        brass: '#B89A62',
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
