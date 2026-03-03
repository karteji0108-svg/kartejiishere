const fs = require('fs');

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Enterprise Palette (Slate & Blue tones)
        "primary": {
          DEFAULT: "#0f172a", // Slate 900
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        "accent": {
          DEFAULT: "#2563eb", // Blue 600
          hover: "#1d4ed8",   // Blue 700
          light: "#dbeafe",   // Blue 100
        },
        "success": {
          DEFAULT: "#059669", // Emerald 600
          bg: "#d1fae5",      // Emerald 100
        },
        "warning": {
          DEFAULT: "#d97706", // Amber 600
          bg: "#fef3c7",      // Amber 100
        },
        "danger": {
          DEFAULT: "#dc2626", // Red 600
          bg: "#fee2e2",      // Red 100
        },
        "background": {
          light: "#f8fafc", // Slate 50
          dark: "#0f172a",  // Slate 900
        },
        "surface": {
          light: "#ffffff",
          dark: "#1e293b",  // Slate 800
        },
        "border": {
          light: "#e2e8f0", // Slate 200
          dark: "#334155",  // Slate 700
        }
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
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
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",
        DEFAULT: "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px",
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)', // Flat card shadow
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // Subdued glass shadow
      },
      transitionTimingFunction: {
        'smooth': 'ease-in-out',
        'ios': 'ease-out',
        'material': 'ease-in-out',
        'bouncy': 'ease-out', // Remove bouncy, map to ease-out
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'scale-in': 'fade-in 0.2s ease-out forwards', // Map scale-in to fade-in for less pop
        'float': 'none', // Disable float
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
        },
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(4px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
}
`;

fs.writeFileSync('tailwind.config.js', tailwindConfig);

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }

  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 24px);
  }

  /* Glassmorphism Utility - Subdued for Enterprise */
  .glass {
    @apply bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm;
  }

  /* Standard Card Style - Clean, structured */
  .card {
    @apply bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200 hover:border-slate-300 dark:hover:border-slate-600;
  }

  /* Standard Input Style - Professional focus */
  .input-field {
    @apply w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-900 focus:border-accent outline-none transition-colors duration-200 text-slate-900 dark:text-white placeholder-slate-400 font-normal text-sm;
  }

  /* Page Header Text - Clean */
  .page-header {
      @apply text-2xl font-semibold text-slate-900 dark:text-white tracking-tight;
  }

  /* Section Title */
  .section-title {
      @apply text-lg font-semibold text-slate-900 dark:text-white mb-4 tracking-tight;
  }
}

body {
  @apply bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-body antialiased selection:bg-accent-light selection:text-accent-hover transition-colors duration-300 ease-in-out;
}
`;

fs.writeFileSync('src/index.css', indexCss);
