import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
        navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // Create new user doc
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'anggota',
                status: 'active',
                createdAt: serverTimestamp(),
            });
        }

        navigate('/dashboard');
    } catch (err) {
        console.error(err);
        setError('Gagal login dengan Google. Silakan coba lagi.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center relative overflow-hidden font-display py-12 sm:px-6 lg:px-8">

      {/* Aurora Background */}
      <div className="fluid-bg"></div>

      {/* Floating Blobs */}
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-float"></div>
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] animate-float animation-delay-2000"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <div className="w-28 h-28 glass-card flex items-center justify-center p-4 animate-fade-in-down shadow-glow">
                <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
        </div>
        <h2 className="text-center text-4xl font-bold text-white tracking-tight drop-shadow-md animate-fade-in-up">
          Selamat Datang
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300 animate-fade-in-up animation-delay-200">
          Masuk ke akun Karang Taruna Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up animation-delay-400">
        <div className="glass-card py-8 px-4 sm:rounded-2xl sm:px-10 border-white/10 dark:border-white/5 shadow-glass-lg backdrop-blur-xl">

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl relative text-sm font-medium flex items-center gap-2 backdrop-blur-md animate-pulse" role="alert">
              <span className="material-icons-round text-lg">error</span>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-round text-gray-400 text-xl group-focus-within:text-cyan-400 transition-colors">email</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-10 pr-3 py-3 sm:text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-round text-gray-400 text-xl group-focus-within:text-cyan-400 transition-colors">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-10 pr-3 py-3 sm:text-sm focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-gray-600 rounded bg-white/10"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Lupa password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-cyan-500/20 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="material-icons-round animate-spin text-sm">refresh</span> Memuat...
                    </span>
                ) : 'Masuk'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0F172A]/50 backdrop-blur-md text-gray-400 rounded-full border border-white/5">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mt-6">
               <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-white/10 rounded-xl shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors backdrop-blur-sm"
                >
                  <img className="h-5 w-5 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
                  <span>Google</span>
                </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline">
                Daftar sekarang
            </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
