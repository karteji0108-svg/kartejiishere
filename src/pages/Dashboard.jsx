import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useRamadan } from '../context/RamadanContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, limit, where, doc, updateDoc, getDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '../config/firebase';
import Skeleton from '../components/Skeleton';
import { ROLES, hasPermission, PERMISSIONS } from '../constants/roles';

// --- Widget Components ---

const AdminStats = ({ stats, loading }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-500">Total Anggota</p>
          <h3 className="text-xl font-bold">{loading ? "..." : stats.memberCount}</h3>
      </div>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs text-gray-500">Saldo Kas</p>
          <h3 className="text-xl font-bold text-green-600">{loading ? "..." : `Rp ${stats.balance.toLocaleString()}`}</h3>
      </div>
  </div>
);

const ApprovalQueue = () => (
    <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase">Perlu Persetujuan</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center text-sm text-gray-500 border border-dashed border-gray-300 dark:border-gray-700">
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

          <Link to="/gallery/add" className="flex flex-col items-center gap-2 group">
             <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                 <span className="material-icons-round">add_a_photo</span>
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

  // Self-Healing removed in favor of correct RBAC.
  // Note: If you are locked out, manually set your role to 'super_admin' in Firestore console.

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
            const usersSnap = await getCountFromServer(collection(db, 'users'));
            memberCount = usersSnap.data().count;
        }

        if (hasPermission(userRole, PERMISSIONS.VIEW_FINANCE)) {
            const financeSnap = await getDocs(collection(db, 'finance'));
            financeSnap.forEach(doc => {
                const data = doc.data();
                if (data.type === 'income') balance += Number(data.amount);
                if (data.type === 'expense') balance -= Number(data.amount);
            });
        }

        const activitiesSnap = await getCountFromServer(collection(db, 'activities'));
        const activityCount = activitiesSnap.data().count;

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
      ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-background-light dark:bg-background-dark'}`}>

      {/* Top Status Bar Area */}
      <div className="h-12 w-full shrink-0"></div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-5">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center bg-gray-200 ${isRamadan ? 'border-ramadan-gold ring-2 ring-ramadan-gold/30' : 'border-white dark:border-slate-700'}`}>
                 {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <span className="material-icons text-gray-400">person</span>
                 )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Selamat Datang,</p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                  {currentUser?.displayName || 'Pengguna'}
              </h1>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {userRole?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button className="relative p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <span className="material-icons-round text-[24px]">notifications_none</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
          </button>
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
                  <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-4">
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

      <BottomNav />
    </div>
  );
};

export default Dashboard;
