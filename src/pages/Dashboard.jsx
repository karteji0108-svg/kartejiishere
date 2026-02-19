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
  <section className="mb-8">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
          <div className="glass-card p-5 min-w-[150px] sm:min-w-[180px] snap-center flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                      <span className="material-icons-round text-sm">groups</span>
                  </div>
                  <p className="text-caption">Total Warga</p>
              </div>
              <h3 className="text-display text-slate-800 dark:text-white">{loading ? "..." : stats.memberCount}</h3>
          </div>

          <div className="glass-card p-5 min-w-[190px] sm:min-w-[220px] snap-center flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
              <div>
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                      <span className="material-icons-round text-sm">account_balance_wallet</span>
                  </div>
                  <p className="text-caption">Saldo Kas</p>
              </div>
              <h3 className="text-h1 text-slate-800 dark:text-white truncate">{loading ? "..." : `Rp ${stats.balance.toLocaleString('id-ID')}`}</h3>
          </div>
      </div>
  </section>
);

const QuickActionItem = ({ to, icon, label, color }) => (
    <Link to={to} className="flex flex-col items-center gap-3 min-w-[72px] sm:min-w-[80px] snap-center group">
        <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-sm border border-white/20 dark:border-white/5 ${color}`}>
            <span className="material-icons-round text-2xl sm:text-3xl">{icon}</span>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight max-w-[80px] break-words">{label}</span>
    </Link>
);

const QuickActions = ({ userRole }) => {
    return (
        <section className="mb-8">
            <h3 className="text-h3 text-slate-800 dark:text-white mb-4 px-1">Menu Cepat</h3>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
                {hasPermission(userRole, PERMISSIONS.MANAGE_MEMBERS) && (
                    <QuickActionItem to="/members/add" icon="person_add" label="Tambah Warga" color="bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300" />
                )}
                {hasPermission(userRole, PERMISSIONS.MANAGE_FINANCE) && (
                    <QuickActionItem to="/finance/add" icon="payments" label="Catat Kas" color="bg-green-100/80 dark:bg-green-900/40 text-green-600 dark:text-green-300" />
                )}
                {(hasPermission(userRole, PERMISSIONS.MANAGE_ACTIVITIES) || hasPermission(userRole, PERMISSIONS.PROPOSE_ACTIVITY)) && (
                    <QuickActionItem to="/activities/create" icon="event_note" label="Buat Acara" color="bg-orange-100/80 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300" />
                )}
                {hasPermission(userRole, PERMISSIONS.MANAGE_ANNOUNCEMENTS) && (
                    <QuickActionItem to="/announcements/create" icon="campaign" label="Info Baru" color="bg-purple-100/80 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300" />
                )}
                <QuickActionItem to="/gallery/add" icon="add_a_photo" label="Upload Foto" color="bg-pink-100/80 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300" />
            </div>
        </section>
    );
};

// --- Main Component ---

const Dashboard = () => {
  const { isRamadan } = useRamadan();
  const { currentUser, userRole } = useAuth();
  const [stats, setStats] = useState({ balance: 0, memberCount: 0, activityCount: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

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

  // Get greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Selamat Pagi';
  if (hour >= 10) greeting = 'Selamat Siang';
  if (hour >= 15) greeting = 'Selamat Sore';
  if (hour >= 18) greeting = 'Selamat Malam';

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      {/*
         Removed manual 'h-12' spacer.
         Main content uses 'pt-safe' via 'main-content' class or direct style.
         Dashboard needs extra top padding for the header greeting.
      */}
      <main className="main-content pb-32 px-6 pt-safe mt-6">

        {/* Modern Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <p className="text-caption mb-1 opacity-80">{greeting},</p>
            <h1 className="text-h1 capitalize leading-tight">
                {displayName.split(' ')[0]}
            </h1>
          </div>
          <div className="flex gap-3">
             <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center relative hover:scale-105 transition-transform">
                <span className="material-icons-round text-slate-700 dark:text-white">notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
             </button>
             <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden glass-card p-0.5 shadow-md hover:scale-105 transition-transform">
                 {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                 ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-full">
                        <span className="material-icons text-slate-400 text-lg">person</span>
                    </div>
                 )}
             </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="mb-8 -mx-1">
            <HeroCarousel />
        </div>

        {isRamadan && <div className="mb-8"><PrayerTimes /></div>}

        {/* Stats Row */}
        {(hasPermission(userRole, PERMISSIONS.VIEW_FINANCE) || hasPermission(userRole, PERMISSIONS.VIEW_MEMBERS)) && (
            <AdminStats stats={stats} loading={loading} />
        )}

        {/* Quick Actions */}
        <QuickActions userRole={userRole} />

        {/* Recent Updates */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-h3 text-slate-800 dark:text-white">Terbaru</h3>
            <Link to="/announcements" className="text-sm font-semibold text-primary hover:text-blue-600 transition-colors">Lihat Semua</Link>
          </div>
          <div className="flex flex-col gap-4">
            {loading ? (
               <Skeleton className="h-24 w-full rounded-3xl" />
            ) : recentUpdates.length === 0 ? (
               <div className="glass-card p-8 text-center">
                   <span className="material-icons-round text-4xl text-slate-300 mb-2">inbox</span>
                   <p className="text-caption">Belum ada update terbaru.</p>
               </div>
            ) : (
               recentUpdates.map((item) => (
                  <div key={item.id} className="glass-card p-4 flex items-start gap-4 hover:bg-white/40 dark:hover:bg-black/30 transition-colors cursor-pointer group">
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm
                        ${item.type === 'activity'
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                      <span className="material-icons-round text-2xl">{item.type === 'activity' ? 'event' : 'campaign'}</span>
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex justify-between items-start">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white truncate pr-2">{item.title}</h4>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-medium">
                              {item.type === 'activity' ? 'Event' : 'Info'}
                          </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description || item.content}</p>
                    </div>
                  </div>
               ))
            )}
          </div>
        </section>
      </main>

      <RamadanBanner />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
