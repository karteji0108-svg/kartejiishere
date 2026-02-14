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

        // Ramadan Theme Colors (Specified by user)
        "ramadan-primary": "#0F5132",
        "ramadan-accent": "#2FAF6A",
        "ramadan-gold": "#D4AF37",

        // Specific Light Mode Gradients Start/End
        "light-start": "#6DD5FA",
        "light-end": "#B06AB3",

        // Specific Dark Mode Gradients Start/End
        "dark-start": "#0B1020",
        "dark-end": "#3B0F5A",
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
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        swing: 'swing 3s ease-in-out infinite',
        'swing-slow': 'swing 5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
