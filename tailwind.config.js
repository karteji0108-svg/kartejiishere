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
        // Enterprise Grade Palette
        "primary": {
          DEFAULT: "#0F172A", // Slate 900 - Core Brand
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        "accent": {
          DEFAULT: "#0EA5E9", // Sky 500 - Actionable, Clear
          hover: "#0284C7",   // Sky 600
          light: "#E0F2FE",   // Sky 100
        },
        "success": {
          DEFAULT: "#10B981", // Emerald 500
          bg: "#ECFDF5",      // Emerald 50
        },
        "warning": {
          DEFAULT: "#F59E0B", // Amber 500
          bg: "#FFFBEB",      // Amber 50
        },
        "danger": {
          DEFAULT: "#EF4444", // Red 500
          bg: "#FEF2F2",      // Red 50
        },
        "background": {
          light: "#F8FAFC", // Slate 50 - Very clean
          dark: "#0F172A",  // Slate 900 - Deep professional
        },
        "surface": {
          light: "#FFFFFF",
          dark: "#1E293B",  // Slate 800
        },
        "border": {
          light: "#E2E8F0", // Slate 200
          dark: "#334155",  // Slate 700
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
      },
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",
        DEFAULT: "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",    // Standard for enterprise
        "xl": "0.75rem",
        "2xl": "1rem",     // Large containers
        "full": "9999px",
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)', // Subtle, crisp border-like shadow
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.05)',
        'neu': '9px 9px 16px rgb(209, 213, 219, 0.5), -9px -9px 16px rgba(255, 255, 255, 0.8)', // Light Neumorphism
        'neu-dark': '5px 5px 10px #0b1121, -5px -5px 10px #131d3b', // Dark Neumorphism
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ios': 'cubic-bezier(0.25, 1, 0.5, 1)', // iOS smooth easing
        'material': 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Material standard
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        },
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(8px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
