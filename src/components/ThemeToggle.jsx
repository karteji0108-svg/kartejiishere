import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <span className="material-icons-round text-gray-600 dark:text-gray-300">dark_mode</span>
      ) : (
        <span className="material-icons-round text-yellow-400">light_mode</span>
      )}
    </button>
  );
};

export default ThemeToggle;
