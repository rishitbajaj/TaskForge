/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#0B0F19',
          surface: '#111827',
          card: '#1F2937',
          border: '#1F2937',
          muted: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};
