import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { useRamadan } from '../context/RamadanContext';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isRamadan } = useRamadan();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Gagal login. Periksa email dan password.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists, if not create
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'anggota', // Default role
                createdAt: serverTimestamp(),
                isRamadanMode: false // Default preference
            });
        }

        toast.success(`Selamat datang, ${user.displayName}!`);
        navigate('/dashboard');
    } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("Gagal login dengan Google.");
    }
  };

  return (
    <div className={`min-h-screen font-display flex flex-col relative transition-colors duration-500 overflow-hidden
      ${isRamadan
        ? 'bg-ramadan text-white selection:bg-ramadan-gold/30 selection:text-ramadan-gold'
        : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100 selection:bg-primary/20 selection:text-primary'
      }`}
    >

      {/* Background Decor */}
      <div className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl z-0 ${isRamadan ? 'bg-emerald-500/20' : 'bg-white/20 dark:bg-purple-500/10'}`}></div>
      <div className={`absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl z-0 ${isRamadan ? 'bg-ramadan-gold/10' : 'bg-blue-500/10'}`}></div>

      {/* Theme Toggle - Absolute Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle className="glass-card !p-2 !rounded-full !shadow-none !border-white/20" />
      </div>

      {/* Header / Branding Section */}
      <header className="flex-1 flex flex-col items-center justify-end pb-8 px-6 animate-fade-in-down relative z-10">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          {/* Logo Container */}
          <div className={`relative w-28 h-28 mx-auto rounded-3xl shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105 duration-500 group
            ${isRamadan ? 'bg-white/10 shadow-ramadan-gold/20 backdrop-blur-md border border-ramadan-gold/30' : 'glass-card'}`}>
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isRamadan ? 'bg-gradient-to-tr from-emerald-500/20 to-ramadan-gold/20' : 'bg-gradient-to-tr from-primary/20 to-purple-500/20'}`}></div>
            <img
              alt="KARTEJI Logo Symbol"
              className="w-20 h-20 object-contain drop-shadow-md relative z-10"
              src={logo}
            />
          </div>
          <div className="space-y-1">
            {isRamadan && (
              <p className="text-ramadan-gold font-bold tracking-widest uppercase text-xs animate-pulse mb-2">
                ✨ Marhaban ya Ramadhan ✨
              </p>
            )}
            <h1 className={`text-4xl font-extrabold tracking-tight ${isRamadan ? 'text-white drop-shadow-md' : 'text-slate-900 dark:text-white'}`}>
              KARTEJI
            </h1>
            <p className={`text-sm font-medium ${isRamadan ? 'text-emerald-100/80' : 'text-slate-600 dark:text-slate-300'}`}>
              Karang Taruna Digital Management
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 px-6 w-full max-w-sm mx-auto animate-fade-in-up relative z-10 pb-10">
        <div className="glass-card p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
                <label className="label-primary ml-1" htmlFor="email">
                Email Address
                </label>
                <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-round text-xl">mail_outline</span>
                </div>
                <input
                    className="glass-input w-full pl-10 pr-3 py-3"
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
                <div className="flex items-center justify-between ml-1">
                <label className="label-primary mb-0" htmlFor="password">
                    Password
                </label>
                <a className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors" href="#">
                    Forgot Password?
                </a>
                </div>
                <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-icons-round text-xl">lock_outline</span>
                </div>
                <input
                    className="glass-input w-full pl-10 pr-10 py-3"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <span className="material-icons-round text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] mt-6
                ${isRamadan
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:to-emerald-800 shadow-emerald-500/30'
                    : 'bg-primary hover:bg-primary-dark shadow-primary/30'
                } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="material-icons-round animate-spin text-sm">refresh</span>
                        Logging in...
                    </span>
                ) : 'Log In'}
            </button>
            </form>

            {/* Alternative Login */}
            <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20 dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isRamadan ? 'bg-transparent text-emerald-200/60' : 'bg-transparent text-gray-500 dark:text-gray-400'}`}>
                    Or continue with
                </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={handleGoogleLogin}
                    className="glass-input w-full inline-flex justify-center items-center py-2.5 px-4 !bg-white/40 dark:!bg-black/30 hover:!bg-white/60 dark:hover:!bg-black/50 transition-all hover:scale-[1.02]"
                    type="button"
                >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
                </button>
                <button className="glass-input w-full inline-flex justify-center items-center py-2.5 px-4 !bg-white/40 dark:!bg-black/30 hover:!bg-white/60 dark:hover:!bg-black/50 transition-all hover:scale-[1.02]" type="button">
                <svg className="h-5 w-5 mr-2 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"></path>
                </svg>
                Apple
                </button>
            </div>
            </div>
        </div>
      </main>

      {/* Footer / Register Link */}
      <footer className="py-8 text-center px-6 relative z-10">
        <p className={`text-sm ${isRamadan ? 'text-emerald-100/70' : 'text-gray-500 dark:text-gray-400'}`}>
          Join the movement.
          <Link to="/register" className={`font-bold transition-colors ml-1 ${isRamadan ? 'text-ramadan-gold hover:text-white' : 'text-primary hover:text-blue-600'}`}>
            Register Here
          </Link>
        </p>

        {/* Bottom Pattern Decor */}
        <div className={`fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${isRamadan ? 'text-ramadan-gold' : 'text-primary'}`}></div>
      </footer>
    </div>
  );
};

export default Login;
