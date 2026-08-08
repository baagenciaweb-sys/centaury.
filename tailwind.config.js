/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'banner-pan': {
          '0%': { transform: 'scale(1.08) translateX(0%)' },
          '50%': { transform: 'scale(1.08) translateX(-3%)' },
          '100%': { transform: 'scale(1.08) translateX(0%)' },
        },
      },
      animation: {
        'banner-pan': 'banner-pan 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
