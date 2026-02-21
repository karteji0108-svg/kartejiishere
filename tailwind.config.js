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
        // Modern Karang Taruna Palette
        "primary": {
          DEFAULT: "#0F172A", // Taruna Navy - Professional, Strong
          light: "#334155",
          dark: "#020617",
          content: "#F8FAFC",
        },
        "accent": {
          DEFAULT: "#0284C7", // Energetic Blue - Active, Modern
          light: "#38BDF8",
          dark: "#0369A1",
          content: "#FFFFFF",
        },
        "secondary": {
          DEFAULT: "#F59E0B", // Youth Yellow - Spirit, Optimism
          light: "#FBBF24",
          dark: "#D97706",
          content: "#0F172A",
        },
        "background": {
          light: "#F8FAFC", // Clean Slate - Better than pure white
          dark: "#0F172A",  // Deep Navy - Better than pure black
        },
        "surface": {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
        "success": "#10B981",
        "error": "#EF4444",
        "warning": "#F59E0B",
        "info": "#3B82F6",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "none": "0",
        "sm": "0.25rem",
        "DEFAULT": "0.5rem",
        "md": "0.75rem", // 12px - Modern Standard
        "lg": "1rem",     // 16px - Cards
        "xl": "1.5rem",   // 24px - Large Containers
        "2xl": "2rem",    // 32px
        "3xl": "2.5rem",  // 40px
        "full": "9999px",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(2, 132, 199, 0.5)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
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
    },
  },
  plugins: [],
}
