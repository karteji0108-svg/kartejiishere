import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate registration
    alert('Registrasi berhasil! Silakan login.');
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased h-screen flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Header / Branding Section */}
      <header className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Daftar Akun
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Bergabung dengan Karang Taruna.
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 px-6 w-full max-w-sm mx-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">person_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="name"
                name="name"
                placeholder="Nama Lengkap Anda"
                type="text"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">mail_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="email"
                name="email"
                placeholder="member@karangtaruna.org"
                type="email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">lock_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="confirmPassword">
              Konfirmasi Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">lock_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.98] mt-6"
            type="submit"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sudah punya akun?
            <Link to="/" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
              Login disini
            </Link>
          </p>
        </div>
      </main>

      {/* Footer Spacer */}
      <div className="h-8"></div>
    </div>
  );
};

export default Register;
