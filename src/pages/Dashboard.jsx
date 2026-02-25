import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';
import Skeleton from '../components/Skeleton';
import HeroCarousel from '../components/common/HeroCarousel';
import BottomNav from '../components/layout/BottomNav';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';

const Dashboard = () => {
  const { currentUser, hasRole } = useAuth();
  const { isRamadanMode } = useRamadan();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ members: 0, activities: 0, balance: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const canManage = hasRole('super_admin') || hasRole('ketua') || hasRole('wakil_ketua');
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch User Profile
        if (currentUser?.uid) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    setUserProfile(userSnapshot.data());
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        }

        // 1. Stats Counters
        // Members count
        const membersColl = collection(db, 'users');
        const membersSnapshot = await getCountFromServer(membersColl);
        const membersCount = membersSnapshot.data().count;

        // Activities count
        const activitiesColl = collection(db, 'activities');
        const activitiesSnapshot = await getCountFromServer(activitiesColl);
        const activitiesCount = activitiesSnapshot.data().count;

        // Finance Balance (Client-side aggregation for safety)
        let balance = 0;
        if (canViewFinance) {
             const financeQ = query(collection(db, 'finance'));
             const financeSnapshot = await getDocs(financeQ);
             financeSnapshot.docs.forEach(doc => {
                 const data = doc.data();
                 const amount = typeof data.amount === 'string' ? parseFloat(data.amount.replace(/[^\d.-]/g, '')) : data.amount;
                 if (data.type === 'income') balance += amount || 0;
                 if (data.type === 'expense') balance -= amount || 0;
             });
        }

        setStats({ members: membersCount, activities: activitiesCount, balance });

        // 2. Recent Activities
        const activitiesQ = query(
          collection(db, 'activities'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const actSnapshot = await getDocs(activitiesQ);
        setRecentActivities(actSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // 3. Recent Announcements
        const announcementsQ = query(
            collection(db, 'announcements'),
            orderBy('createdAt', 'desc'),
            limit(3)
        );
        const annSnapshot = await getDocs(announcementsQ);
        setAnnouncements(annSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            };
        }));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, canViewFinance]);

  if (loading) return <DashboardSkeleton />;

  // User Display Name Logic
  const displayName = userProfile?.fullName || currentUser?.displayName || 'Pengguna';
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-display pb-24">
      {/* 1. Modern Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30 transition-all">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">Selamat Datang,</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {displayName.split(' ')[0]}
            </h1>
        </div>
        <Link to="/profile" className="relative group">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800 transition-shadow shadow-sm group-active:scale-95">
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent">
                        <span className="material-icons-round text-2xl">person</span>
                    </div>
                )}
            </div>
        </Link>
      </header>

      <div className="px-6 space-y-8">

        {/* 2. Hero Section */}
        <section className="rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/30 transform transition-all active:scale-[0.99]">
            <HeroCarousel />
        </section>

        {/* 3. Quick Actions */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu Utama</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <MenuButton
                    to="/members"
                    icon="groups"
                    label="Anggota"
                    color="text-indigo-600"
                    bg="bg-indigo-50 dark:bg-indigo-900/20"
                />
                <MenuButton
                    to="/gallery"
                    icon="collections"
                    label="Galeri"
                    color="text-purple-600"
                    bg="bg-purple-50 dark:bg-purple-900/20"
                />
                {canViewFinance ? (
                    <MenuButton
                        to="/finance"
                        icon="account_balance_wallet"
                        label="Keuangan"
                        color="text-emerald-600"
                        bg="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                ) : (
                     <MenuButton
                        to="/announcements"
                        icon="campaign"
                        label="Info"
                        color="text-orange-600"
                        bg="bg-orange-50 dark:bg-orange-900/20"
                    />
                )}
                 <MenuButton
                    to="/activities"
                    icon="event"
                    label="Kegiatan"
                    color="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
            </div>
        </section>

        {/* 4. Stats & Finance Overview */}
        <section className="grid grid-cols-2 gap-4">
            <StatCard
                label="Total Anggota"
                value={formatNumber(stats.members)}
                icon="people"
                color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            />
            <StatCard
                label="Kegiatan"
                value={formatNumber(stats.activities)}
                icon="event_available"
                color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />

            {canViewFinance && (
                <div className="col-span-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/20 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/finance')}>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider mb-1">
                                Saldo Kas Saat Ini
                            </p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight">{formatCurrency(stats.balance)}</h3>
                        </div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                            <span className="material-icons-round text-white">arrow_forward</span>
                        </div>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
                </div>
            )}
        </section>

        {/* 5. Activities Feed */}
         <section>
             <div className="flex justify-between items-end mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kegiatan Terbaru</h2>
                <Link to="/activities" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-6 -mx-6 px-6 no-scrollbar snap-x">
                 {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                        <Link to={`/activities/${act.id}`} key={act.id} className="min-w-[260px] w-[260px] snap-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col active:scale-[0.98] transition-all h-full">
                            <div className="h-36 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span className="material-icons-round text-4xl opacity-30">image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/95 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100/50">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1.5 line-clamp-1">{act.title}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                     <span className="material-icons-round text-[14px] text-accent">location_on</span>
                                     <span className="truncate max-w-[180px]">{act.location || 'Lokasi belum diatur'}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{act.description}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <EmptyState message="Belum ada kegiatan." fullWidth />
                )}
            </div>
         </section>

        {/* 6. Announcements List */}
        <section className="pb-8">
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Info Terkini</h2>
                <Link to="/announcements" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-3">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div key={ann.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex gap-4 items-start shadow-sm border border-gray-100 dark:border-gray-700">
                             <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-icons-round text-xl">campaign</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 pr-2">{ann.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{formatDate(ann.createdAt)}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{ann.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState message="Belum ada pengumuman." />
                )}
            </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

// --- Sub-components ---

const MenuButton = ({ to, icon, label, color, bg }) => (
    <Link to={to} className="flex flex-col items-center gap-3 group cursor-pointer active:scale-95 transition-transform">
        <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center ${bg} ${color} shadow-sm border border-black/5 dark:border-white/5 transition-all group-hover:shadow-md`}>
            <span className="material-icons-round text-[28px]">{icon}</span>
        </div>
        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 tracking-tight">{label}</span>
    </Link>
);

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-28 relative overflow-hidden group">
        <div className="flex justify-between items-start z-10">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                <span className="material-icons-round text-sm">{icon}</span>
            </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white z-10">{value}</h3>
    </div>
);

const EmptyState = ({ message, fullWidth }) => (
    <div className={`${fullWidth ? 'w-full' : ''} py-8 px-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-3`}>
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-gray-300 text-xl">inbox</span>
        </div>
        <p className="text-xs font-medium text-gray-500">{message}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen p-6 space-y-8 animate-pulse bg-gray-50 dark:bg-gray-900">
         <div className="flex justify-between items-center">
            <div className="space-y-3">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        <Skeleton className="h-56 w-full rounded-3xl shadow-sm" />
        <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
             <Skeleton className="h-20 w-full rounded-2xl" />
             <Skeleton className="h-20 w-full rounded-2xl" />
             <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
    </div>
);

export default Dashboard;
