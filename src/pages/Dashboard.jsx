import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useRamadan } from '../context/RamadanContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const Dashboard = () => {
  const { isRamadan } = useRamadan();
  const { currentUser, userRole } = useAuth(); // Assume we might want to display name properly later
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState('Maghrib');

  // Data States
  const [stats, setStats] = useState({
    balance: 0,
    memberCount: 0,
    activityCount: 0
  });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ramadan Timer Logic
  useEffect(() => {
    if (!isRamadan) return;

    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 0, 0, 0);

      if (now > target) {
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

  // Data Fetching Logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Members Count
        const usersSnap = await getDocs(collection(db, 'users'));
        const memberCount = usersSnap.size;

        // 2. Fetch Finance Balance
        const financeSnap = await getDocs(collection(db, 'finance'));
        let balance = 0;
        financeSnap.forEach(doc => {
          const data = doc.data();
          if (data.type === 'income') balance += Number(data.amount);
          if (data.type === 'expense') balance -= Number(data.amount);
        });

        // 3. Fetch Upcoming Activities Count
        const today = new Date().toISOString().split('T')[0]; // Simple date comparison
        // Note: Firestore string filtering is simple, but ideally use Timestamps.
        // Assuming date stored as string YYYY-MM-DD or ISO
        const activitiesQ = query(collection(db, 'activities'), where('date', '>=', today));
        const activitiesSnap = await getDocs(activitiesQ);
        const activityCount = activitiesSnap.size;

        setStats({ balance, memberCount, activityCount });

        // 4. Fetch Recent Updates (Mix of Activities and Announcements for demo)
        // Let's just fetch latest 3 activities for simplicity as "Updates"
        // Or better: mix 1 latest activity, 1 latest announcement

        const updates = [];

        // Latest Activity
        const recentActQ = query(collection(db, 'activities'), orderBy('date', 'asc'), limit(2));
        const recentActSnap = await getDocs(recentActQ);
        recentActSnap.forEach(doc => {
           updates.push({ id: doc.id, type: 'activity', ...doc.data() });
        });

        // Latest Announcement
        const recentAnnQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(1));
        const recentAnnSnap = await getDocs(recentAnnQ);
        recentAnnSnap.forEach(doc => {
           updates.push({ id: doc.id, type: 'announcement', ...doc.data() });
        });

        setRecentUpdates(updates);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

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
              {/* Fallback avatar logic needed if no user photo */}
              <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center bg-gray-200 ${isRamadan ? 'border-ramadan-gold ring-2 ring-ramadan-gold/30' : 'border-white dark:border-slate-700'}`}>
                 {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <span className="material-icons text-gray-400">person</span>
                 )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div>
              <p className={`text-sm font-medium ${isRamadan ? 'text-ramadan-primary dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {isRamadan ? 'Marhaban ya Ramadhan,' : 'Selamat Pagi,'}
              </p>
              {/* We might need to fetch the user's name from Firestore profile if not in auth object, but auth object usually has displayName */}
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser?.displayName || 'Pengguna'}</h1>
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
                {/* <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">+12% bln ini</span> */}
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 text-sm mb-1">Saldo Kas Aktif</p>
                <h3 className="text-2xl font-bold tracking-tight">{loading ? '...' : formatCurrency(stats.balance)}</h3>
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{loading ? '...' : stats.memberCount}</h3>
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{loading ? '...' : stats.activityCount}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Agenda Baru</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 grid grid-cols-4 gap-3">
          <Link to="/members/add" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">person_add</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Tambah<br/>Anggota</span>
          </Link>
          <Link to="/announcements/create" className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-primary group-active:scale-95 transition-transform">
              <span className="material-icons-round">post_add</span>
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Buat<br/>Info</span>
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
            <Link to="/announcements" className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">Lihat Semua</Link>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
               <p className="text-center text-gray-500 text-sm py-4">Memuat data...</p>
            ) : recentUpdates.length === 0 ? (
               <p className="text-center text-gray-500 text-sm py-4">Belum ada update terbaru.</p>
            ) : (
               recentUpdates.map(item => (
                  <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${item.type === 'activity' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
                      <span className="material-icons-round">{item.type === 'activity' ? 'event' : 'campaign'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
                        {/* Simple date display */}
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-2">
                           {item.date ? new Date(item.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'Info'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.description || item.content}</p>
                      {item.type === 'activity' && item.time && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          <span className="material-icons-round text-[14px]">schedule</span> {item.time}
                        </div>
                      )}
                    </div>
                  </div>
               ))
            )}
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
