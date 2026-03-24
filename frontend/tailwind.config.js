/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fa',
          100: '#e3ebf6',
          200: '#cddced',
          300: '#adc4e0',
          400: '#8ba6cf',
          500: '#718abc',
          600: '#5c6ea4',
          700: '#4c5986',
          800: '#414d6f',
          900: '#2f468c', // Deep Royal Blue
          950: '#222847',
        },
        accent: {
          light: '#f3f4f6', // Soft Gray
          DEFAULT: '#2f468c', // Deep Royal Blue
          dark: '#1e3066',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
