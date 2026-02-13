import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "w-full py-3.5 px-4 font-semibold rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-primary text-white shadow-primary/30 hover:bg-primary-dark",
    secondary: "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600",
    danger: "bg-red-500 text-white shadow-red-500/30 hover:bg-red-600",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, icon, error, ...props }) => (
  <div>
    {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <span className="material-icons-round text-xl">{icon}</span>
        </div>
      )}
      <input
        className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-transparent dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-sm font-medium text-slate-800 dark:text-white placeholder-gray-400 ${icon ? 'pl-10' : ''} ${error ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
  </div>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);
