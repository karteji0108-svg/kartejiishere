import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 h-screen overflow-hidden flex flex-col justify-between">
      {/* Top Status Bar Area (Simulated for iOS) */}
      <div className="h-12 w-full bg-background-light dark:bg-background-dark shrink-0"></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-5">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8 pt-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profil</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
            <span className="material-icons">settings</span>
          </button>
        </header>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 via-blue-400/20 to-primary/20"></div>
          <div className="relative mt-8 mb-4">
            <img
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-su39Htc4wi3TEewyRyPHSAqUFOG3GpB2xCageLYkYvMgZG5tM2dYwAXhVxKLEpWpMX1Zw7JvNeZRCA00kptWVYJKM6m7HbPr6vUcTQOAfM7WLd6xk4pFbDIuoBZkZn9-Qi_xYHAM6Fx0Fq5gb9BSrV6iyE9S-_rU9ZZVqTx9nhUwqsoLMKizjmQ6un-qrBVHInm_NCdIn9eNxLqsgGAKOUNlPUhmXyclEAfe1IfK7SvzDBIxq4yzV8aAjFJeFGCEeIaWVrPcNlo"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budi Santoso</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Ketua Karang Taruna</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Active</span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full">Verified</span>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mb-2">Akun</h3>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                <span className="material-icons-round">person</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Edit Profil</span>
            </div>
            <span className="material-icons-round text-gray-400">chevron_right</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-500">
                <span className="material-icons-round">lock</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Ganti Password</span>
            </div>
            <span className="material-icons-round text-gray-400">chevron_right</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500">
                <span className="material-icons-round">notifications</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Notifikasi</span>
            </div>
            <span className="material-icons-round text-gray-400">chevron_right</span>
          </button>

          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mt-6 mb-2">Tampilan</h3>

          <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-500">
                <span className="material-icons-round">
                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div className="text-left">
                  <span className="block font-medium text-gray-900 dark:text-white">Tema Gelap</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {theme === 'dark' ? 'Aktif' : 'Tidak aktif'}
                  </span>
              </div>
            </div>
            {/* Toggle Switch */}
            <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                <span className="sr-only">Toggle Dark Mode</span>
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
          </div>

          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 mt-6 mb-2">Lainnya</h3>

          <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-300">
                <span className="material-icons-round">help</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">Bantuan & Dukungan</span>
            </div>
            <span className="material-icons-round text-gray-400">chevron_right</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group mt-2"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-500">
                <span className="material-icons-round">logout</span>
              </div>
              <span className="font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">Keluar</span>
            </div>
          </button>
        </div>

        <div className="text-center mt-8 text-xs text-gray-400">
          Versi Aplikasi 1.0.0
        </div>

        {/* Bottom Spacer to ensure content isn't hidden by nav */}
        <div className="h-8"></div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
