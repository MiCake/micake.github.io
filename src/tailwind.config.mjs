/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors - "Cozy Engineering" Palette
        brand: {
          primary: '#FF9F1C',      // Warm Orange - Cat-Cake logo
          secondary: '#FFBF69',    // Soft Yellow
          accent: '#F97316',       // Deeper Orange for CTAs
        },
        // Background Colors
        bg: {
          dark: '#12100E',         // Deep Cocoa/Warm Black
          light: '#FFFDF7',        // Cream White
        },
        // Surface Colors (Cards, Panels)
        surface: {
          dark: '#1F1B18',         // Chocolate
          'dark-hover': '#2A2420', // Lighter Chocolate (hover)
          light: '#FFFFFF',        // Pure White
          'light-hover': '#FEF7ED', // Cream (hover)
        },
        // Text Colors
        text: {
          primary: {
            dark: '#FEFEFE',       // Almost white for dark mode
            light: '#1F1B18',      // Chocolate for light mode
          },
          secondary: {
            dark: '#A8A29E',       // Warm gray for dark mode
            light: '#78716C',      // Stone gray for light mode
          },
          muted: {
            dark: '#6B6560',       // Muted warm gray
            light: '#A8A29E',      // Muted stone
          },
        },
        // Border Colors
        border: {
          dark: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(0, 0, 0, 0.08)',
          accent: 'rgba(255, 159, 28, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 159, 28, 0.3)',
            opacity: 1,
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 159, 28, 0.6)',
            opacity: 0.8,
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-orange': '0 0 30px rgba(255, 159, 28, 0.4)',
        'glow-orange-lg': '0 0 60px rgba(255, 159, 28, 0.5)',
        'soft-dark': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'soft-light': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
