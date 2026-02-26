import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import ThemeToggle from '../components/common/ThemeToggle';
import RamadanBanner from '../components/common/RamadanBanner';
import PrayerTimes from '../components/common/PrayerTimes';
import HeroCarousel from '../components/common/HeroCarousel';
import { useRamadan } from '../context/RamadanContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Skeleton from '../components/common/Skeleton';
import { hasPermission, PERMISSIONS } from '../constants/roles';

// --- Widget Components ---

const AdminStats = ({ stats, loading }) => (
  <section className="mb-10 px-1">
      <div className="grid grid-cols-2 gap-4">
          <Link to="/members" className="glass-card p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-[40px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="z-10">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                      <span className="material-icons-round text-xl">groups</span>
                  </div>
                  <p className="text-caption font-bold uppercase tracking-wider opacity-70">Anggota</p>
              </div>
              <h3 className="text-display text-slate-800 dark:text-white z-10">{loading ? "..." : stats.memberCount}</h3>
          </Link>

          <Link to="/finance" className="glass-card p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/10 rounded-bl-[40px] -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
              <div className="z-10">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                      <span className="material-icons-round text-xl">account_balance_wallet</span>
                  </div>
                  <p className="text-caption font-bold uppercase tracking-wider opacity-70">Saldo Kas</p>
              </div>
              <h3 className="text-h2 text-slate-800 dark:text-white truncate z-10">{loading ? "..." : `Rp ${(stats.balance/1000).toLocaleString('id-ID')}k`}</h3>
          </Link>
      </div>
  </section>
);

// --- Main Component ---

const Dashboard = () => {
  const { isRamadan } = useRamadan();
  const { currentUser, userRole } = useAuth();
  const [stats, setStats] = useState({ balance: 0, memberCount: 0, activityCount: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const canUpload = hasPermission(userRole, PERMISSIONS.MANAGE_GALLERY) ||
                    hasPermission(userRole, PERMISSIONS.MANAGE_ACTIVITIES) ||
                    userRole === 'anggota';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
            }
        }

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
                let amount = data.amount;
                if (typeof amount === 'string') {
                    amount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
                }
                const numAmount = Number(amount) || 0;
                if (data.type === 'income') balance += numAmount;
                if (data.type === 'expense') balance -= numAmount;
            });
        }

        const activitiesSnap = await getDocs(collection(db, 'activities'));
        const activityCount = activitiesSnap.size;

        setStats({ balance, memberCount, activityCount });

        const updates = [];
        const recentActQ = query(collection(db, 'activities'), orderBy('date', 'asc'), limit(2));
        const recentActSnap = await getDocs(recentActQ);
        recentActSnap.forEach(doc => updates.push({ id: doc.id, type: 'activity', ...doc.data() }));

        const recentAnnQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(2));
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
  }, [userRole, currentUser]);

  const displayName = userProfile?.fullName || userProfile?.displayName || currentUser?.displayName || 'Pengguna';
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  const hour = new Date().getHours();
  let greeting = 'Pagi';
  if (hour >= 10) greeting = 'Siang';
  if (hour >= 15) greeting = 'Sore';
  if (hour >= 18) greeting = 'Malam';

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <main className="main-content pb-32 px-6 pt-safe mt-8">

        {/* Modern Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <Link to="/profile" className="relative group">
                 <div className="w-14 h-14 rounded-full overflow-hidden glass-card p-0.5 shadow-xl transition-transform group-hover:scale-105">
                     {photoURL ? (
                        <img src={photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                     ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center rounded-full text-white font-bold text-xl">
                            {displayName[0]}
                        </div>
                     )}
                 </div>
                 <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full"></span>
             </Link>
             <div>
                <p className="text-caption opacity-80 font-medium">Selamat {greeting},</p>
                <h1 className="text-h1 font-extrabold capitalize text-slate-900 dark:text-white">
                    {displayName.split(' ')[0]}
                </h1>
             </div>
          </div>
          <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center relative hover:scale-105 transition-transform text-slate-700 dark:text-white">
            <span className="material-icons-round text-2xl">notifications_none</span>
            <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Hero Section */}
        <div className="mb-10 -mx-2">
            <HeroCarousel />
        </div>

        {isRamadan && <div className="mb-10"><PrayerTimes /></div>}

        {/* Stats Row */}
        {(hasPermission(userRole, PERMISSIONS.VIEW_FINANCE) || hasPermission(userRole, PERMISSIONS.VIEW_MEMBERS)) && (
            <AdminStats stats={stats} loading={loading} />
        )}

        {/* Recent Updates */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-h2 font-bold text-slate-900 dark:text-white">Update Terbaru</h3>
            <Link to="/announcements" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span className="material-icons-round text-slate-600 dark:text-slate-400">arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            {loading ? (
               <Skeleton className="h-28 w-full rounded-[24px]" />
            ) : recentUpdates.length === 0 ? (
               <div className="glass-card p-10 text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="material-icons-round text-4xl text-slate-300">inbox</span>
                   </div>
                   <p className="text-body font-medium">Belum ada update terbaru.</p>
               </div>
            ) : (
               recentUpdates.map((item) => (
                  <div key={item.id} className="glass-card p-5 flex items-start gap-5 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group relative overflow-hidden">
                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm
                        ${item.type === 'activity'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                            : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
                      <span className="material-icons-round text-3xl">{item.type === 'activity' ? 'event' : 'campaign'}</span>
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex flex-col gap-1 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {item.type === 'activity' ? 'Event' : 'Info'}
                          </span>
                          <h4 className="text-h3 font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{item.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description || item.content}</p>
                    </div>
                  </div>
               ))
            )}
          </div>
        </section>
      </main>

      {/* FAB for Upload (Context-Aware) */}
      {canUpload && (
        <Link
            to="/gallery/add"
            className="fixed bottom-32 right-6 w-16 h-16 bg-primary text-white rounded-[24px] shadow-2xl shadow-primary/30 flex items-center justify-center z-40 hover:scale-110 active:scale-90 transition-all"
        >
            <span className="material-icons-round text-3xl">add</span>
        </Link>
      )}

      <RamadanBanner />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
