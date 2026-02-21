import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">

      {/* Main Content Area - Full Height, Scrollable */}
      <main className="flex-1 overflow-y-auto pb-24 relative w-full max-w-md mx-auto bg-white dark:bg-slate-950 shadow-2xl min-h-screen">
            {/* Modern Header - Sticky & Clean */}
            <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex justify-between items-center transition-all">
                <div>
                    <h1 className="font-display font-extrabold text-xl text-primary tracking-tight">
                        Karang Taruna
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Aditya Karya Mahatva Yodha</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* User Avatar - Professional Look */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full pl-1 pr-3 py-1 border border-slate-200 dark:border-slate-700">
                        <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold uppercase">
                            {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
                            {currentUser?.name?.split(' ')[0]}
                        </span>
                    </div>
                </div>
            </header>

            <div className="p-5 space-y-6">
                <Outlet />
            </div>
      </main>

      {/* Modern Bottom Navigation - Thumb Friendly & Clear */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">

          <Link to="/dashboard" className="flex-1 flex flex-col items-center justify-center h-full group active:scale-95 transition-transform">
            <div className={`p-1.5 rounded-full transition-colors mb-1 ${isActive('/dashboard') ? 'bg-accent/10 text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <span className="material-icons text-2xl">dashboard</span>
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${isActive('/dashboard') ? 'text-accent' : 'text-slate-400'}`}>
                Beranda
            </span>
          </Link>

          <Link to="/activities" className="flex-1 flex flex-col items-center justify-center h-full group active:scale-95 transition-transform">
            <div className={`p-1.5 rounded-full transition-colors mb-1 ${isActive('/activities') ? 'bg-accent/10 text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <span className="material-icons text-2xl">event_note</span>
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${isActive('/activities') ? 'text-accent' : 'text-slate-400'}`}>
                Kegiatan
            </span>
          </Link>

          {/* Center Action Button (Floating Look) - Optional for future features like 'Scan QR' or 'Add Post' */}
          {/*
          <div className="relative -top-5">
            <button className="w-14 h-14 bg-secondary rounded-full shadow-lg shadow-secondary/30 flex items-center justify-center text-white active:scale-90 transition-transform border-4 border-white dark:border-slate-950">
                <span className="material-icons text-3xl">add</span>
            </button>
          </div>
          */}

          <Link to="/announcements" className="flex-1 flex flex-col items-center justify-center h-full group active:scale-95 transition-transform">
            <div className={`p-1.5 rounded-full transition-colors mb-1 ${isActive('/announcements') ? 'bg-accent/10 text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <span className="material-icons text-2xl">campaign</span>
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${isActive('/announcements') ? 'text-accent' : 'text-slate-400'}`}>
                Info
            </span>
          </Link>

          <Link to="/profile" className="flex-1 flex flex-col items-center justify-center h-full group active:scale-95 transition-transform">
             {/* Profile tab usually links to account settings */}
            <div className={`p-1.5 rounded-full transition-colors mb-1 ${isActive('/profile') ? 'bg-accent/10 text-accent' : 'text-slate-400 group-hover:text-slate-600'}`}>
                <span className="material-icons text-2xl">person</span>
            </div>
            <span className={`text-[10px] font-bold tracking-wide ${isActive('/profile') ? 'text-accent' : 'text-slate-400'}`}>
                Akun
            </span>
          </Link>

        </div>
      </nav>
    </div>
  );
};

export default Layout;
