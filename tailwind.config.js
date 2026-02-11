/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "primary-dark": "#0b63be",
        "primary-content": "#ffffff",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "surface-light": "#ffffff",
        "surface-dark": "#1c2630",
        "neutral-surface": "#ffffff",
        "neutral-surface-dark": "#1a2632",

        // Ramadan Theme Colors
        "ramadan-primary": "#10B981", // Emerald 500
        "ramadan-gold": "#F59E0B",    // Amber 500
        "ramadan-accent": "#D97706",  // Amber 600
        "ramadan-bg": "#064E3B",      // Emerald 900 (for deep backgrounds)
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      keyframes: {
        swing: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      animation: {
        swing: 'swing 3s ease-in-out infinite',
        'swing-slow': 'swing 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
