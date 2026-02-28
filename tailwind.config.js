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
        // Vibrant & Playful Palette
        "primary": {
          DEFAULT: "#7C3AED", // Vibrant Indigo 600
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
        "accent": {
          DEFAULT: "#F59E0B", // Bright Amber 500
          hover: "#D97706",   // Amber 600
          light: "#FEF3C7",   // Amber 100
        },
        "success": {
          DEFAULT: "#10B981", // Emerald 500
          bg: "#D1FAE5",      // Emerald 100
        },
        "warning": {
          DEFAULT: "#F59E0B", // Amber 500
          bg: "#FEF3C7",      // Amber 100
        },
        "danger": {
          DEFAULT: "#EF4444", // Red 500
          bg: "#FEE2E2",      // Red 100
        },
        "background": {
          light: "#FDFDFD", // Very soft warm white
          dark: "#0F0A19",  // Very deep purple
        },
        "surface": {
          light: "#FFFFFF",
          dark: "#1A1525",  // Deep purple surface
        },
        "border": {
          light: "#F3F4F6", // Gray 100
          dark: "#2D2440",  // Dark purple border
        }
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // Added for chunkier headers
      },
      borderRadius: {
        "none": "0",
        "sm": "0.25rem",
        DEFAULT: "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",    // Bubbly cards
        "2xl": "2rem",     // Large bubbly containers
        "3xl": "2.5rem",
        "full": "9999px",
      },
      boxShadow: {
        'sm': '0 2px 4px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 4px 8px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'md': '0 8px 16px -2px rgba(124, 58, 237, 0.1), 0 4px 8px -2px rgba(124, 58, 237, 0.05)', // Tinted shadow
        'lg': '0 12px 24px -4px rgba(124, 58, 237, 0.15), 0 8px 12px -4px rgba(124, 58, 237, 0.08)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', // Bouncy shadow
        'glass': '0 8px 32px 0 rgba(124, 58, 237, 0.08)', // Tinted glass shadow
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)', // Neo-brutalism optional
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ios': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'material': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'bouncy': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Playful bounce
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards', // Bouncier up
        'scale-in': 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards', // Bouncy scale
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        },
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(12px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
            '0%': { opacity: '0', transform: 'scale(0.9)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
