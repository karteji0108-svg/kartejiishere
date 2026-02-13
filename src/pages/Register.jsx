import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isRamadan } = useRamadan();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Password dan Konfirmasi Password tidak sama.');
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      toast.success('Registrasi berhasil! Selamat datang.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Gagal melakukan registrasi. Email mungkin sudah terdaftar.');
    }

    setLoading(false);
  };

  return (
    <div className={`font-display antialiased h-screen flex flex-col justify-between transition-colors duration-500 overflow-y-auto relative
      ${isRamadan
        ? 'bg-gradient-to-b from-ramadan-bg to-emerald-900 text-white selection:bg-ramadan-gold/30 selection:text-ramadan-gold'
        : 'bg-background-light dark:bg-background-dark text-gray-900 dark:text-white selection:bg-primary/20 selection:text-primary'
      }`}
    >

      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl z-0 ${isRamadan ? 'bg-emerald-500/20' : 'bg-purple-500/10'}`}></div>

      {/* Header / Branding Section */}
      <header className="flex-1 flex flex-col items-center justify-end py-8 px-6 min-h-[160px] animate-fade-in-down relative z-10">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Daftar Akun
            </h1>
            <p className={`text-sm font-medium ${isRamadan ? 'text-emerald-100/80' : 'text-gray-500 dark:text-gray-400'}`}>
              Bergabung dengan komunitas Karang Taruna.
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 px-6 w-full max-w-sm mx-auto pb-10 animate-fade-in-up relative z-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="label-primary ml-1" htmlFor="name">
              Nama Lengkap
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-icons-round text-xl">person_outline</span>
              </div>
              <input
                className="input-primary pl-10"
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
            <label className="label-primary ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-icons-round text-xl">mail_outline</span>
              </div>
              <input
                className="input-primary pl-10"
                id="email"
                name="email"
                placeholder="member@karteji.org"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="label-primary ml-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-icons-round text-xl">lock_outline</span>
              </div>
              <input
                className="input-primary pl-10 pr-10"
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer focus:outline-none"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons-round text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="label-primary ml-1" htmlFor="confirmPassword">
              Konfirmasi Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-icons-round text-xl">lock_outline</span>
              </div>
              <input
                className="input-primary pl-10 pr-10"
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
            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] mt-6
               ${isRamadan
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:to-emerald-800 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-primary/30'
              } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center gap-2">
                    <span className="material-icons-round animate-spin text-sm">refresh</span>
                    Mendaftarkan...
                </span>
            ) : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className={`text-sm ${isRamadan ? 'text-emerald-200/80' : 'text-gray-500 dark:text-gray-400'}`}>
            Sudah punya akun?
            <Link to="/" className={`font-bold transition-colors ml-1 ${isRamadan ? 'text-ramadan-gold hover:text-white' : 'text-primary hover:text-primary-dark'}`}>
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
