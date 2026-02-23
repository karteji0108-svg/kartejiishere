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
          DEFAULT: "#0F172A",
          light: "#334155",
          dark: "#020617",
          content: "#F8FAFC",
        },
        "accent": {
          DEFAULT: "#0284C7",
          light: "#38BDF8",
          dark: "#0369A1",
          content: "#FFFFFF",
        },
        "secondary": {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          content: "#0F172A",
        },
        "background": {
          light: "#F8FAFC",
          dark: "#0F172A",
        },
        "glass": {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(15, 23, 42, 0.6)",
          border: "rgba(255, 255, 255, 0.2)",
          shine: "rgba(255, 255, 255, 0.1)",
        }
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.1)',
        'glow': '0 0 20px rgba(2, 132, 199, 0.5)',
        'neon': '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
