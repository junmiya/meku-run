/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#faf9f7',
        'card-bg': '#ffffff',
        'text-primary': '#2d3436',
        'text-secondary': '#636e72',
        'accent-red': '#dc2626',
        'accent-gold': '#f59e0b',
        'accent-green': '#059669',
        'accent-blue': '#3b82f6',
      },
      fontFamily: {
        'japanese': ['Noto Serif JP', 'Yu Mincho', 'serif'],
        'sans-japanese': ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
}