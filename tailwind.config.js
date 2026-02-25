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
        "primary": {
          DEFAULT: "#0F172A", // Slate 900
          light: "#334155",
          dark: "#020617",
          content: "#F8FAFC",
        },
        "accent": {
          DEFAULT: "#2563EB", // Blue 600 - Standard Professional Blue
          light: "#60A5FA",
          dark: "#1D4ED8",
          content: "#FFFFFF",
        },
        "secondary": {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          content: "#0F172A",
        },
        "background": {
          light: "#F1F5F9", // Slate 100
          dark: "#020617",  // Slate 950
        },
        "surface": {
          light: "#FFFFFF",
          dark: "#1E293B",  // Slate 800
        }
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "md": "0.5rem",   // 8px
        "lg": "0.75rem",  // 12px
        "xl": "1rem",     // 16px
        "2xl": "1.5rem",  // 24px
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'nav': '0 -1px 3px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(5px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
