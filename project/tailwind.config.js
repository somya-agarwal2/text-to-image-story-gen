/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffcccc',
          300: '#ffaaaa',
          400: '#ff8888',
          500: '#ff6b6b',
          600: '#ff5555',
          700: '#ff3333',
          800: '#cc2222',
          900: '#991111',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-magical': 'linear-gradient(135deg, #FFE5F7 0%, #E3F6FF 100%)',
        'gradient-coral': 'linear-gradient(135deg, #ff6b6b, #ff8a80)',
        'gradient-teal': 'linear-gradient(135deg, #4ecdc4, #26a69a)',
        'gradient-story': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'page-flip': 'pageFlip 0.6s ease-in-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'magical': '0 8px 32px rgba(255, 107, 107, 0.2), 0 4px 16px rgba(78, 205, 196, 0.1)',
        'story': '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'glow-coral': '0 0 20px rgba(255, 107, 107, 0.4)',
        'glow-teal': '0 0 20px rgba(78, 205, 196, 0.4)',
      },
    },
  },
  plugins: [],
};