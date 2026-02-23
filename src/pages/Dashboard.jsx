import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  getAggregateFromServer,
  sum,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import HeroCarousel from '../components/common/HeroCarousel';
import BottomNav from '../components/layout/BottomNav';

const Dashboard = () => {
  const { currentUser, userRole, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    members: 0,
    activities: 0,
    balance: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Permission Checks
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 0. Fetch User Data from Firestore
        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                 setUserData({
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                 });
            }
        }

        // 1. Fetch Stats (Parallel)
        const membersColl = collection(db, 'users');
        const activitiesColl = collection(db, 'activities');
        const financeColl = collection(db, 'finance');

        const [membersSnapshot, activitiesSnapshot] = await Promise.all([
            getCountFromServer(query(membersColl, where('status', '==', 'active'))),
            getCountFromServer(activitiesColl)
        ]);

        let balance = 0;
        if (canViewFinance) {
             const financeSnapshot = await getAggregateFromServer(financeColl, {
                totalBalance: sum('amount')
             });
             balance = financeSnapshot.data().totalBalance || 0;
        }

        setStats({
            members: membersSnapshot.data().count,
            activities: activitiesSnapshot.data().count,
            balance: balance
        });

        // 2. Fetch Recent Activities
        const activitiesQuery = query(activitiesColl, orderBy('date', 'desc'), limit(5));
        const activitiesDocs = await getDocs(activitiesQuery);
        setRecentActivities(activitiesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 3. Fetch Announcements
        const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
        const announcementsDocs = await getDocs(announcementsQuery);
        setAnnouncements(announcementsDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canViewFinance, currentUser]);

  // Get first name for greeting
  const displayName = userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anggota';
  const firstName = displayName.split(' ')[0];
  const photoURL = userData?.photoURL || currentUser?.photoURL;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 overflow-hidden relative">

      {/* Aurora Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto md:max-w-4xl p-6 space-y-8">

        {/* 1. Header Section */}
        <header className="flex justify-between items-center py-4">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 tracking-wide uppercase">Selamat Datang</p>
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2 drop-shadow-sm">
                    {firstName}
                    <span className="text-2xl animate-pulse">👋</span>
                </h1>
            </div>
            <Link to="/profile" className="relative group">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-glow group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-white dark:bg-gray-800">
                        {photoURL ? (
                            <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-icons-round">person</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm animate-pulse"></div>
            </Link>
        </header>

        {/* 2. Hero Carousel - Glass Card Wrapper */}
        <section className="glass-card p-1 shadow-glass-lg overflow-hidden relative group hover:shadow-glow transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-20"></div>
            <HeroCarousel />
        </section>

        {/* 3. Quick Actions - Glass Buttons */}
        <section>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full shadow-glow"></span>
                Akses Cepat
            </h2>
            <div className="grid grid-cols-4 gap-4">
                <MenuButton
                    to="/activities"
                    icon="event"
                    label="Kegiatan"
                    color="text-blue-500"
                    bg="from-blue-500/20 to-blue-600/5"
                />
                <MenuButton
                    to="/members"
                    icon="groups"
                    label="Anggota"
                    color="text-indigo-500"
                    bg="from-indigo-500/20 to-indigo-600/5"
                />
                <MenuButton
                    to="/gallery"
                    icon="collections"
                    label="Galeri"
                    color="text-purple-500"
                    bg="from-purple-500/20 to-purple-600/5"
                />
                {canViewFinance ? (
                    <MenuButton
                        to="/finance"
                        icon="account_balance_wallet"
                        label="Keuangan"
                        color="text-emerald-500"
                        bg="from-emerald-500/20 to-emerald-600/5"
                    />
                ) : (
                     <MenuButton
                        to="/announcements"
                        icon="campaign"
                        label="Info"
                        color="text-orange-500"
                        bg="from-orange-500/20 to-orange-600/5"
                    />
                )}
            </div>
        </section>

        {/* 4. Statistics Overview - Minimalist Glass Tiles */}
        <section className="grid grid-cols-2 gap-4">
            <StatCard
                label="Total Anggota"
                value={formatNumber(stats.members)}
                icon="people_alt"
                color="text-indigo-400"
                delay="0"
            />
            <StatCard
                label="Kegiatan Selesai"
                value={formatNumber(stats.activities)}
                icon="task_alt"
                color="text-blue-400"
                delay="100"
            />

            {/* Finance Card - Full Width Glass Gradient */}
            {canViewFinance && (
                <div className="col-span-2 glass-card p-6 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all hover:shadow-glow border-t border-white/20" onClick={() => navigate('/finance')}>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-teal-800/80 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity"></div>

                    {/* Inner Shine */}
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

                    <div className="relative z-10 flex justify-between items-center text-white">
                        <div>
                            <p className="text-emerald-100 text-sm font-medium mb-1 flex items-center gap-1 opacity-80 uppercase tracking-wider">
                                <span className="material-icons-round text-base">account_balance</span>
                                Saldo Kas
                            </p>
                            <h3 className="text-4xl font-display font-bold tracking-tight drop-shadow-md">{formatCurrency(stats.balance)}</h3>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-icons-round text-2xl">arrow_forward</span>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* 5. Recent Announcements - Translucent List */}
        <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full shadow-glow"></span>
                    Info Terkini
                </h2>
                <Link to="/announcements" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-3">
                {announcements.length > 0 ? (
                    announcements.map((ann, i) => (
                        <div key={ann.id} className="glass-card p-4 flex gap-4 hover:bg-white/20 dark:hover:bg-white/5 active:scale-[0.99] transition-all group border-l-4 border-l-orange-500/50" style={{ animationDelay: `${i * 100}ms` }}>
                             <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-orange-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <span className="material-icons-round text-xl">campaign</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-1">{ann.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed opacity-80">{ann.content}</p>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1 opacity-60">
                                    <span className="material-icons-round text-[10px]">schedule</span>
                                    {formatDate(ann.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState message="Belum ada pengumuman terbaru." />
                )}
            </div>
        </section>

         {/* 6. Activities Slider - Floating Cards */}
         <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full shadow-glow"></span>
                    Kegiatan Terbaru
                </h2>
                <Link to="/activities" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-8 -mx-6 px-6 no-scrollbar snap-x pt-2">
                 {recentActivities.length > 0 ? (
                    recentActivities.map((act, i) => (
                        <div key={act.id} className="min-w-[260px] w-[260px] snap-center glass-card overflow-hidden flex flex-col active:scale-95 transition-transform h-full hover:shadow-glow border-t border-white/20" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="h-32 bg-gray-200 dark:bg-gray-800/50 relative overflow-hidden group">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span className="material-icons-round text-5xl opacity-30">image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-lg border border-white/20">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{act.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3 flex-1 opacity-80">{act.description}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 opacity-60">
                                     <span className="material-icons-round text-[12px]">location_on</span>
                                     <span className="truncate max-w-[150px]">{act.location || 'Lokasi belum diatur'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState message="Belum ada kegiatan." fullWidth />
                )}
            </div>
         </section>
      </div>

      <BottomNav />
    </div>
  );
};

// --- Sub-components (Refactored for Glassmorphism) ---

const MenuButton = ({ to, icon, label, color, bg }) => (
    <Link to={to} className="flex flex-col items-center gap-3 group">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center glass-button ${bg} group-hover:scale-110 transition-all duration-300 shadow-glass-sm group-hover:shadow-glow relative overflow-hidden`}>
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className={`material-icons-round text-3xl drop-shadow-sm ${color}`}>{icon}</span>
        </div>
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors tracking-wide">{label}</span>
    </Link>
);

const StatCard = ({ label, value, icon, color, delay }) => (
    <div className="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border-t border-white/20" style={{ animationDelay: `${delay}ms` }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
             <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-inner ${color}`}>
                    <span className="material-icons-round text-xl">{icon}</span>
                </div>
             </div>
             <div>
                <h3 className="text-2xl font-display font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm group-hover:scale-105 transition-transform origin-left">{value}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 uppercase tracking-wider opacity-80">{label}</p>
             </div>
        </div>
    </div>
);

const EmptyState = ({ message, fullWidth }) => (
    <div className={`${fullWidth ? 'w-full' : ''} py-8 px-4 text-center glass-card border-dashed border-2 border-white/20 flex flex-col items-center justify-center gap-2 opacity-70`}>
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="material-icons-round text-gray-400 text-2xl">inbox</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">{message}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-8 animate-pulse">
        {/* Skeleton logic ... */}
         <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-8 w-48 bg-gray-300 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl bg-gray-300 dark:bg-gray-700" />
        <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
             <Skeleton className="h-20 w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
             <Skeleton className="h-20 w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
             <Skeleton className="h-20 w-full rounded-2xl bg-gray-300 dark:bg-gray-700" />
        </div>
    </div>
);

export default Dashboard;
