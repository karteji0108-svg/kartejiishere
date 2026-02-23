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
  sum
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

  // Permission Checks
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  // Get first name for greeting
  const firstName = currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'Anggota';

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  }, [canViewFinance]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">

      {/* 1. Header Section */}
      <header className="px-6 pt-8 pb-6 bg-white dark:bg-gray-800 rounded-b-[2rem] shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-4xl">
          <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Selamat Datang,</p>
             <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {firstName}
                <span className="text-2xl">👋</span>
             </h1>
          </div>
          <Link to="/profile" className="relative">
             <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-md">
                {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-icons-round">person</span>
                    </div>
                )}
             </div>
             {/* Status Indicator */}
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-lg mx-auto md:max-w-4xl">

        {/* 2. Hero Carousel */}
        <section className="rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10">
            <HeroCarousel />
        </section>

        {/* 3. Quick Actions */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Akses Cepat</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <MenuButton
                    to="/activities"
                    icon="event"
                    label="Kegiatan"
                    colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MenuButton
                    to="/members"
                    icon="groups"
                    label="Anggota"
                    colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
                />
                <MenuButton
                    to="/gallery"
                    icon="collections"
                    label="Galeri"
                    colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                {canViewFinance ? (
                    <MenuButton
                        to="/finance"
                        icon="account_balance_wallet"
                        label="Keuangan"
                        colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    />
                ) : (
                     <MenuButton
                        to="/announcements"
                        icon="campaign"
                        label="Info"
                        colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
                    />
                )}
            </div>
        </section>

        {/* 4. Statistics Overview */}
        <section>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Statistik</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    label="Total Anggota"
                    value={formatNumber(stats.members)}
                    icon="people_alt"
                    gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
                />
                <StatCard
                    label="Kegiatan Selesai"
                    value={formatNumber(stats.activities)}
                    icon="task_alt"
                    gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                />

                {/* Finance Card - Full Width if available */}
                {canViewFinance && (
                    <div className="col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-800 p-6 shadow-xl shadow-emerald-900/20 text-white cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/finance')}>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium mb-1 flex items-center gap-1">
                                    <span className="material-icons-round text-base">account_balance</span>
                                    Saldo Kas
                                </p>
                                <h3 className="text-3xl font-bold tracking-tight">{formatCurrency(stats.balance)}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="material-icons-round text-2xl">arrow_forward</span>
                            </div>
                        </div>
                         {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-2xl"></div>
                    </div>
                )}
            </div>
        </section>

        {/* 5. Recent Announcements */}
        <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Info Terkini</h2>
                <Link to="/announcements" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-3">
                {announcements.length > 0 ? (
                    announcements.map(ann => (
                        <div key={ann.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 active:scale-[0.99] transition-transform">
                             <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                                <span className="material-icons-round text-xl">campaign</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-1">{ann.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
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

         {/* 6. Activities Slider */}
         <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Kegiatan Terbaru</h2>
                <Link to="/activities" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 no-scrollbar snap-x">
                 {recentActivities.length > 0 ? (
                    recentActivities.map(act => (
                        <div key={act.id} className="min-w-[260px] w-[260px] snap-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col active:scale-95 transition-transform h-full">
                            <div className="h-32 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span className="material-icons-round text-5xl opacity-50">image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-white/50">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-2 line-clamp-1">{act.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3 flex-1">{act.description}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
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

// --- Sub-components ---

const MenuButton = ({ to, icon, label, colorClass }) => (
    <Link to={to} className="flex flex-col items-center gap-3 group">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${colorClass} shadow-lg shadow-blue-900/5 group-hover:shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300 text-white`}>
            <span className="material-icons-round text-3xl drop-shadow-sm">{icon}</span>
        </div>
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</span>
    </Link>
);

const StatCard = ({ label, value, icon, gradient }) => (
    <div className={`p-5 rounded-2xl shadow-lg shadow-indigo-900/10 text-white relative overflow-hidden ${gradient}`}>
        <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="flex justify-between items-start mb-2">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <span className="material-icons-round text-xl">{icon}</span>
                </div>
             </div>
             <div>
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                <p className="text-white/80 text-xs font-medium mt-1">{label}</p>
             </div>
        </div>
        {/* Decor */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-6 -top-6 w-20 h-20 bg-black/5 rounded-full blur-xl"></div>
    </div>
);

const EmptyState = ({ message, fullWidth }) => (
    <div className={`${fullWidth ? 'w-full' : ''} py-8 px-4 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2`}>
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-gray-400 text-2xl">inbox</span>
        </div>
        <p className="text-xs text-gray-500 font-medium">{message}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
        </div>
    </div>
);

export default Dashboard;
