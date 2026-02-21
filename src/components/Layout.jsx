import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';
import RamadanDecorations from './common/RamadanDecorations';
import RamadanBanner from './common/RamadanBanner';

const Layout = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { isRamadan } = useRamadan();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`flex flex-col h-screen ${isRamadan ? 'bg-black' : 'bg-gray-50'} transition-colors duration-1000`}>
      <RamadanDecorations />
      <RamadanBanner />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative z-10">
        <div className={`max-w-md mx-auto min-h-full shadow-xl relative transition-all duration-500 ${
            isRamadan
              ? 'bg-black/40 text-emerald-50 backdrop-blur-sm'
              : 'bg-white text-gray-900'
        }`}>
            {/* Header */}
            <header className={`${isRamadan ? 'bg-emerald-900/80 backdrop-blur-md text-emerald-50 border-b border-emerald-800/50' : 'bg-indigo-600 text-white shadow-md'} p-4 sticky top-0 z-30 transition-all duration-500`}>
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
                        {isRamadan && <span className="text-xl">🌙</span>}
                        {isRamadan ? 'Ramadhan Kareem' : 'Karang Taruna'}
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-xs opacity-90 font-medium">{currentUser?.name}</span>
                        <button onClick={logout} className="text-xs bg-white/20 p-1.5 rounded hover:bg-white/30 transition active:scale-95">
                            <span className="material-icons text-sm">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-4">
                <Outlet />
            </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t transition-colors duration-500 ${
          isRamadan
            ? 'bg-emerald-900/90 border-emerald-800/50 backdrop-blur-md text-emerald-100'
            : 'bg-white border-gray-200 text-gray-500'
      }`}>
        <div className="max-w-md mx-auto flex justify-around">
          <Link to="/dashboard" className={`flex flex-col items-center py-3 px-2 w-full transition ${isActive('/dashboard') ? (isRamadan ? 'text-emerald-400 font-bold scale-105' : 'text-indigo-600') : (isRamadan ? 'text-emerald-100/60 hover:text-emerald-100' : 'text-gray-400 hover:text-gray-600')}`}>
            <span className="material-icons">dashboard</span>
            <span className="text-[10px] mt-1">Dashboard</span>
          </Link>
          <Link to="/activities" className={`flex flex-col items-center py-3 px-2 w-full transition ${isActive('/activities') ? (isRamadan ? 'text-emerald-400 font-bold scale-105' : 'text-indigo-600') : (isRamadan ? 'text-emerald-100/60 hover:text-emerald-100' : 'text-gray-400 hover:text-gray-600')}`}>
            <span className="material-icons">event</span>
            <span className="text-[10px] mt-1">Kegiatan</span>
          </Link>
          <Link to="/announcements" className={`flex flex-col items-center py-3 px-2 w-full transition ${isActive('/announcements') ? (isRamadan ? 'text-emerald-400 font-bold scale-105' : 'text-indigo-600') : (isRamadan ? 'text-emerald-100/60 hover:text-emerald-100' : 'text-gray-400 hover:text-gray-600')}`}>
            <span className="material-icons">campaign</span>
            <span className="text-[10px] mt-1">Info</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
