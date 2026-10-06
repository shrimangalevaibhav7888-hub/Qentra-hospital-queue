/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qentra: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dbe4fe',
          300: '#bfd0fc',
          400: '#94b3f8',
          500: '#648ef2',
          600: '#436ce8',
          700: '#2f51d4',
          800: '#2942ac',
          900: '#253a87',
          950: '#172354',
        },
        lavender: {
          50: '#faf8ff',
          100: '#f4f0fe',
          200: '#eae2fd',
          300: '#d9cbfa',
          400: '#bfa7f5',
          500: '#a380ee',
          600: '#895ce0',
          700: '#7344c8',
        },
        navy: {
          800: '#131e3a',
          900: '#0b132b',
          950: '#070b1a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'float': '0 20px 35px -5px rgba(37, 99, 235, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px rgba(79, 70, 229, 0.15)',
        'inner-light': 'inset 0 1px 2px rgba(255, 255, 255, 0.6)'
      }
    },
  },
  plugins: [],
}
