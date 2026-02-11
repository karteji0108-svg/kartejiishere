import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Dashboard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 h-screen overflow-hidden flex flex-col relative">
      {/* Top Status Bar Area (Simulated for iOS) */}
      <div className="h-12 w-full shrink-0"></div>

      {/* Main Content Scroll Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-5">
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt="Admin Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-su39Htc4wi3TEewyRyPHSAqUFOG3GpB2xCageLYkYvMgZG5tM2dYwAXhVxKLEpWpMX1Zw7JvNeZRCA00kptWVYJKM6m7HbPr6vUcTQOAfM7WLd6xk4pFbDIuoBZkZn9-Qi_xYHAM6Fx0Fq5gb9BSrV6iyE9S-_rU9ZZVqTx9nhUwqsoLMKizjmQ6un-qrBVHInm_NCdIn9eNxLqsgGAKOUNlPUhmXyclEAfe1IfK7SvzDBIxq4yzV8aAjFJeFGCEeIaWVrPcNlo"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Selamat Pagi,</p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Budi Santoso</h1>
            </div>
          </div>
          <button className="relative p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="material-icons-round text-[24px]">notifications_none</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          </button>
        </header>

        {/* Summary Cards Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ringkasan</h2>
          </div>
          {/* Horizontal Scroll Container */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 snap-x">
            {/* Balance Card (Primary) */}
            <div className="snap-start shrink-0 w-[280px] bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-black opacity-10 rounded-full blur-xl"></div>
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <span className="material-icons-round text-white">account_balance_wallet</span>
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">+12% bln ini</span>
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm mb-1">Saldo Kas Aktif</p>
                <h3 className="text-2xl font-bold tracking-tight">Rp 12.500.000</h3>
              </div>
            </div>
            {/* Members Card */}
            <div className="snap-start shrink-0 w-[160px] bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
                  <span className="material-icons-round">groups</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">142</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Anggota</p>
              </div>
            </div>
            {/* Activities Card */}
            <div className="snap-start shrink-0 w-[160px] bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-500">
                  <span className="material-icons-round">event_note</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">3</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Agenda Baru</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 grid grid-cols-4 gap-3">
          <Link to="/members" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">person_add</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Tambah<br/>Anggota</span>
          </Link>
          <Link to="/activities" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">post_add</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Buat<br/>Laporan</span>
          </Link>
          <Link to="/announcements" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">campaign</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Info<br/>Baru</span>
          </Link>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">qr_code_scanner</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Scan<br/>QR</span>
          </button>
        </section>

        {/* Recent Updates Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Terbaru</h2>
            <a className="text-sm font-medium text-primary hover:text-blue-600 transition-colors" href="#">Lihat Semua</a>
          </div>
          <div className="flex flex-col gap-3">
            {/* Update Item 1: Meeting */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-icons-round">meeting_room</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">Rapat Bulanan</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2">Besok</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Pembahasan program kerja Q3 di Aula Desa.</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <span className="material-icons-round text-[14px]">schedule</span> 19:00 WIB
                </div>
              </div>
            </div>
            {/* Update Item 2: Pending Payment */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <span className="material-icons-round">pending_actions</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">Iuran Wajib</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2">2j lalu</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">5 Anggota belum melunasi iuran bulan ini.</p>
                <button className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 px-2 py-1 rounded-md">
                  Ingatkan
                </button>
              </div>
            </div>
            {/* Update Item 3: New Member */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <span className="material-icons-round">person_add_alt</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">Pendaftaran Baru</h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2">Hari ini</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1"><span className="font-medium text-slate-800 dark:text-slate-200">Siti Aminah</span> menunggu verifikasi akun.</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-md shadow-sm shadow-blue-500/20">Verifikasi</button>
                  <button className="text-xs font-medium text-slate-500 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">Detail</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Bottom Spacer to ensure content isn't hidden by nav */}
        <div className="h-8"></div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
