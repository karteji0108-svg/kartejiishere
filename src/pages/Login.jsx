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
      setError('Email atau password salah.');
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
        setError('Gagal login dengan Google.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900 font-display">

      {/* Background Blurs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl z-0 bg-white/20 dark:bg-purple-500/10"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl z-0 bg-blue-500/10"></div>

      <div className="w-full max-w-md relative z-10">

        <div className="glass-card p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-primary/20 to-purple-500/20 pointer-events-none"></div>

            <div className="text-center mb-8 relative">
                <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    <span className="material-icons text-4xl text-white">groups</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Karang Taruna
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Sistem Informasi & Manajemen Kegiatan
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-pulse">
                    <span className="material-icons text-red-500">error_outline</span>
                    <p className="text-sm text-red-600 dark:text-red-300 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 relative">
                <div className="relative group/input">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">email</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input pl-12"
                        required
                    />
                </div>

                <div className="relative group/input">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-primary transition-colors">lock</span>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input pl-12"
                        required
                    />
                </div>

                <div className="text-right">
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                        Lupa Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>Masuk</span>
                            <span className="material-icons text-sm">arrow_forward</span>
                        </>
                    )}
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-transparent text-gray-500 dark:text-gray-400 text-xs bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm">
                            Atau masuk dengan
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    <span>Google</span>
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Belum punya akun?
                    <Link to="/register" className="font-bold transition-colors ml-1 text-primary hover:text-blue-600">
                        Daftar Sekarang
                    </Link>
                </p>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-400">
                <p>&copy; {new Date().getFullYear()} Karang Taruna App. v2.0</p>
            </div>
        </div>
      </div>

       {/* Decorative Bottom Bar */}
       <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 text-primary"></div>
    </div>
  );
};

export default Login;
