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
        ink: 'rgb(var(--color-ink-rgb) / <alpha-value>)',
        paper: 'rgb(var(--color-paper-rgb) / <alpha-value>)',
        stone: 'rgb(var(--color-stone-rgb) / <alpha-value>)',
        clay: 'rgb(var(--color-clay-rgb) / <alpha-value>)',
        forest: 'rgb(var(--color-forest-rgb) / <alpha-value>)',
        mist: 'rgb(var(--color-mist-rgb) / <alpha-value>)',
        navy: 'rgb(var(--color-forest-rgb) / <alpha-value>)',
        slate: 'rgb(var(--color-stone-rgb) / <alpha-value>)',
        brass: 'rgb(var(--color-clay-rgb) / <alpha-value>)',
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
