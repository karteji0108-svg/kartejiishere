import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isRamadan } = useRamadan();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Password dan Konfirmasi Password tidak sama.');
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      // Registration successful, redirect to login or dashboard
      // Usually signup logs them in automatically in Firebase
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Gagal melakukan registrasi. Email mungkin sudah terdaftar.');
    }

    setLoading(false);
  };

  return (
    <div className={`font-display antialiased h-screen flex flex-col justify-between transition-colors duration-500 overflow-y-auto
      ${isRamadan
        ? 'bg-gradient-to-b from-ramadan-bg to-emerald-900 text-white selection:bg-ramadan-gold/30 selection:text-ramadan-gold'
        : 'bg-background-light dark:bg-background-dark text-gray-900 dark:text-white selection:bg-primary/20 selection:text-primary'
      }`}
    >
      {/* Header / Branding Section */}
      <header className="flex-1 flex flex-col items-center justify-end py-8 px-6 min-h-[160px]">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Daftar Akun
            </h1>
            <p className={`text-sm font-medium ${isRamadan ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Bergabung dengan Karang Taruna.
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 px-6 w-full max-w-sm mx-auto pb-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className={`block text-sm font-semibold ml-1 ${isRamadan ? 'text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`} htmlFor="name">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className={`block text-sm font-semibold ml-1 ${isRamadan ? 'text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`} htmlFor="email">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className={`block text-sm font-semibold ml-1 ${isRamadan ? 'text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`} htmlFor="password">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className={`block text-sm font-semibold ml-1 ${isRamadan ? 'text-emerald-100' : 'text-gray-700 dark:text-gray-300'}`} htmlFor="confirmPassword">
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform active:scale-[0.98] mt-6
               ${isRamadan
                ? 'bg-gradient-to-r from-ramadan-primary to-ramadan-bg border-ramadan-gold/30 hover:from-emerald-500 hover:to-emerald-800 focus:ring-ramadan-gold shadow-ramadan-gold/20'
                : 'bg-primary hover:bg-blue-600 focus:ring-primary shadow-primary/20'
              } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${isRamadan ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}`}>
            Sudah punya akun?
            <Link to="/" className={`font-semibold transition-colors ml-1 ${isRamadan ? 'text-ramadan-gold hover:text-white' : 'text-primary hover:text-primary/80'}`}>
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
