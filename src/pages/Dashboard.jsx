import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Dashboard = () => {
  const { isRamadan } = useRamadan();
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState('Maghrib');

  useEffect(() => {
    if (!isRamadan) return;

    // Simple countdown simulation to 18:00 (Maghrib)
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 0, 0, 0);

      if (now > target) {
        // If past Maghrib, count to Imsak (04:30 next day)
        target.setDate(target.getDate() + 1);
        target.setHours(4, 30, 0, 0);
        setNextPrayer('Imsak');
      } else {
        setNextPrayer('Maghrib');
      }

      const diff = target - now;
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRamadan]);

  return (
    <div className={`font-display text-slate-800 dark:text-slate-100 h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-background-light dark:bg-background-dark'}`}>
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
              className={`w-12 h-12 rounded-full object-cover border-2 shadow-sm ${isRamadan ? 'border-ramadan-gold ring-2 ring-ramadan-gold/30' : 'border-white dark:border-slate-700'}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-su39Htc4wi3TEewyRyPHSAqUFOG3GpB2xCageLYkYvMgZG5tM2dYwAXhVxKLEpWpMX1Zw7JvNeZRCA00kptWVYJKM6m7HbPr6vUcTQOAfM7WLd6xk4pFbDIuoBZkZn9-Qi_xYHAM6Fx0Fq5gb9BSrV6iyE9S-_rU9ZZVqTx9nhUwqsoLMKizjmQ6un-qrBVHInm_NCdIn9eNxLqsgGAKOUNlPUhmXyclEAfe1IfK7SvzDBIxq4yzV8aAjFJeFGCEeIaWVrPcNlo"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div>
            <p className={`text-sm font-medium ${isRamadan ? 'text-ramadan-primary dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {isRamadan ? 'Marhaban ya Ramadhan,' : 'Selamat Pagi,'}
            </p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Budi Santoso</h1>
            </div>
          </div>
          <button className="relative p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="material-icons-round text-[24px]">notifications_none</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          </button>
        </header>

      {/* Ramadan Special Section */}
      {isRamadan && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-ramadan-bg to-ramadan-primary rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
             {/* Decor */}
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fillOpacity="0"/>
                 <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
               </svg>
            </div>

            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">Menuju {nextPrayer}</p>
                <h2 className="text-3xl font-bold font-mono tracking-wide">{timeLeft}</h2>
                <p className="text-emerald-100 text-sm mt-1 flex items-center gap-1">
                  <span className="material-icons-round text-sm">location_on</span> Jakarta Selatan
                </p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-2 ml-auto">
                   <span className="material-icons-round text-2xl">{nextPrayer === 'Maghrib' ? 'nights_stay' : 'wb_twilight'}</span>
                </div>
                <p className="text-xs font-medium">Jadwal Sholat</p>
              </div>
            </div>
          </div>
        </section>
      )}

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
          <Link to="/gallery" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">collections</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Galeri<br/>Foto</span>
          </Link>
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
