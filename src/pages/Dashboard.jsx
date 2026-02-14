import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ThemeToggle from '../components/ThemeToggle';
import RamadanBanner from '../components/RamadanBanner';
import { useRamadan } from '../context/RamadanContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, limit, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Skeleton from '../components/Skeleton';
import { ROLES, hasPermission, PERMISSIONS } from '../constants/roles';

// --- Widget Components ---

const AdminStats = ({ stats, loading }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="glass-card p-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">Total Anggota</p>
          <h3 className="text-xl font-bold">{loading ? "..." : stats.memberCount}</h3>
      </div>
      <div className="glass-card p-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">Saldo Kas</p>
          <h3 className="text-xl font-bold text-green-600">{loading ? "..." : `Rp ${stats.balance.toLocaleString()}`}</h3>
      </div>
  </div>
);

const ApprovalQueue = () => (
    <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase">Perlu Persetujuan</h3>
        <div className="glass-card p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600">
            Tidak ada pengajuan pending.
        </div>
    </div>
);

const QuickActions = ({ userRole }) => {
    return (
        <section className="mb-8 grid grid-cols-4 gap-3">
          {hasPermission(userRole, PERMISSIONS.MANAGE_MEMBERS) && (
            <Link to="/members/add" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <span className="material-icons-round">person_add</span>
                </div>
                <span className="text-[10px] font-medium text-center">Anggota</span>
            </Link>
          )}

          {hasPermission(userRole, PERMISSIONS.MANAGE_FINANCE) && (
            <Link to="/finance/add" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
                    <span className="material-icons-round">account_balance_wallet</span>
                </div>
                <span className="text-[10px] font-medium text-center">Keuangan</span>
            </Link>
          )}

          {(hasPermission(userRole, PERMISSIONS.MANAGE_ACTIVITIES) || hasPermission(userRole, PERMISSIONS.PROPOSE_ACTIVITY)) && (
            <Link to="/activities/create" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
                    <span className="material-icons-round">event</span>
                </div>
                <span className="text-[10px] font-medium text-center">Kegiatan</span>
            </Link>
          )}

          {hasPermission(userRole, PERMISSIONS.MANAGE_ANNOUNCEMENTS) && (
            <Link to="/announcements/create" className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <span className="material-icons-round">campaign</span>
                </div>
                <span className="text-[10px] font-medium text-center">Info</span>
            </Link>
          )}

          <Link to="/gallery" className="flex flex-col items-center gap-2 group">
             <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                 <span className="material-icons-round">photo_library</span>
             </div>
             <span className="text-[10px] font-medium text-center">Galeri</span>
          </Link>
        </section>
    );
};

// --- Main Component ---

const Dashboard = () => {
  const { isRamadan } = useRamadan();
  const { currentUser, userRole } = useAuth();
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState('Maghrib');
  const [userLocation, setUserLocation] = useState('Jakarta Selatan');

  const [stats, setStats] = useState({ balance: 0, memberCount: 0, activityCount: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const canUpload = hasPermission(userRole, PERMISSIONS.MANAGE_GALLERY) ||
                    hasPermission(userRole, PERMISSIONS.MANAGE_ACTIVITIES) ||
                    userRole === 'anggota';

  useEffect(() => {
    // Basic Geo
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Mock implementation for speed, real app uses fetch
                setUserLocation("Jakarta Selatan");
            },
            () => console.log("Geo permission denied")
        );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stats only if allowed
        let memberCount = 0;
        let balance = 0;

        if (hasPermission(userRole, PERMISSIONS.VIEW_MEMBERS)) {
            const usersSnap = await getDocs(collection(db, 'users'));
            memberCount = usersSnap.size;
        }

        if (hasPermission(userRole, PERMISSIONS.VIEW_FINANCE)) {
            const financeSnap = await getDocs(collection(db, 'finance'));
            financeSnap.forEach(doc => {
                const data = doc.data();
                if (data.type === 'income') balance += Number(data.amount);
                if (data.type === 'expense') balance -= Number(data.amount);
            });
        }

        const activitiesSnap = await getDocs(collection(db, 'activities')); // Public read usually
        const activityCount = activitiesSnap.size;

        setStats({ balance, memberCount, activityCount });

        // Recent Updates
        const updates = [];
        const recentActQ = query(collection(db, 'activities'), orderBy('date', 'asc'), limit(2));
        const recentActSnap = await getDocs(recentActQ);
        recentActSnap.forEach(doc => updates.push({ id: doc.id, type: 'activity', ...doc.data() }));

        const recentAnnQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(1));
        const recentAnnSnap = await getDocs(recentAnnQ);
        recentAnnSnap.forEach(doc => updates.push({ id: doc.id, type: 'announcement', ...doc.data() }));

        setRecentUpdates(updates);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  return (
    <div className={`font-display text-slate-800 dark:text-slate-100 h-screen overflow-hidden flex flex-col relative transition-colors duration-500
      ${isRamadan ? 'bg-ramadan' : 'bg-glass-light dark:bg-glass-dark'}`}>

      {/* Top Status Bar Area */}
      <div className="h-12 w-full shrink-0"></div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-5">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center glass-card p-1 shadow-lg">
                 <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                     {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                        <span className="material-icons text-gray-400 dark:text-gray-500 text-3xl flex items-center justify-center h-full w-full">person</span>
                     )}
                 </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1">Selamat Datang,</p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize ml-1">
                  {currentUser?.displayName || 'Pengguna'}
              </h1>
              <span className="ml-1 mt-1 inline-block text-[10px] bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 text-primary dark:text-primary-content px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                  {userRole?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex gap-3 items-center">
              <ThemeToggle className="glass-card !rounded-full !p-2 !shadow-none !border-white/20 hover:bg-white/30 dark:hover:bg-black/50 transition-colors" />
              <button className="relative p-2 rounded-full glass-card !shadow-none !border-white/20 text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-black/50 transition-colors">
                <span className="material-icons-round text-[24px]">notifications_none</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
              </button>
          </div>
        </header>

        {/* Role-Specific Dashboard Views */}

        {/* 1. Admin/Ketua Stats */}
        {(hasPermission(userRole, PERMISSIONS.VIEW_FINANCE) || hasPermission(userRole, PERMISSIONS.VIEW_MEMBERS)) && (
            <AdminStats stats={stats} loading={loading} />
        )}

        {/* 2. Approval Queue (Ketua/Wakil) */}
        {hasPermission(userRole, PERMISSIONS.APPROVE_ACTIVITIES) && (
            <ApprovalQueue />
        )}

        {/* 3. Quick Actions (Dynamic) */}
        <QuickActions userRole={userRole} />

        {/* 4. Recent Updates (Universal) */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Terbaru</h2>
            <Link to="/announcements" className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">Lihat Semua</Link>
          </div>
          <div className="flex flex-col gap-3">
            {loading ? (
               <Skeleton className="h-20 w-full rounded-xl" />
            ) : recentUpdates.length === 0 ? (
               <p className="text-center text-gray-500 text-sm py-4">Belum ada update terbaru.</p>
            ) : (
               recentUpdates.map((item, index) => (
                  <div key={item.id} className="glass-card p-4 flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${item.type === 'activity' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
                      <span className="material-icons-round">{item.type === 'activity' ? 'event' : 'campaign'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{item.description || item.content}</p>
                    </div>
                  </div>
               ))
            )}
          </div>
        </section>

        <div className="h-8"></div>
      </main>

      {/* FAB for Upload (Context-Aware) */}
      {canUpload && (
        <Link
            to="/gallery/add"
            className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
        >
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      <RamadanBanner />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
