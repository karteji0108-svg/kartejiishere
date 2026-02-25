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
        // 0. Fetch User Data
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

        // 1. Fetch Stats
        const membersColl = collection(db, 'users');
        const activitiesColl = collection(db, 'activities');
        const financeColl = collection(db, 'finance');

        const [membersSnapshot, activitiesSnapshot] = await Promise.all([
            getCountFromServer(query(membersColl, where('status', '==', 'active'))),
            getCountFromServer(activitiesColl)
        ]);

        let balance = 0;
        if (canViewFinance) {
             const financeSnapshot = await getDocs(financeColl);
             balance = financeSnapshot.docs.reduce((acc, doc) => {
                const data = doc.data();
                let amount = data.amount;
                if (typeof amount === 'string') {
                    amount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
                }
                const val = Number(amount);
                if (data.type === 'expense' || data.type === 'pengeluaran') {
                    return acc - (isNaN(val) ? 0 : val);
                } else {
                    return acc + (isNaN(val) ? 0 : val);
                }
             }, 0);
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

  const displayName = userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anggota';
  const firstName = displayName.split(' ')[0];
  const photoURL = userData?.photoURL || currentUser?.photoURL;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">

      {/* 1. Header Section */}
      <header className="px-6 pt-10 pb-6 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-lg mx-auto md:max-w-4xl">
          <div>
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Selamat Datang,</p>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {firstName}
                <span className="text-xl">👋</span>
             </h1>
          </div>
          <Link to="/profile" className="relative group">
             <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="material-icons-round">person</span>
                    </div>
                )}
             </div>
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-8 max-w-lg mx-auto md:max-w-4xl">

        {/* 2. Hero Carousel */}
        <section className="rounded-2xl overflow-hidden shadow-card">
            <HeroCarousel />
        </section>

        {/* 3. Quick Actions */}
        <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-4 gap-4">
                <MenuButton
                    to="/activities"
                    icon="event"
                    label="Kegiatan"
                    color="text-blue-600"
                    bg="bg-blue-50 dark:bg-blue-900/20"
                />
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
            </div>
        </section>

        {/* 4. Stats & Finance */}
        <section className="grid grid-cols-2 gap-4">
            <StatCard
                label="Total Anggota"
                value={formatNumber(stats.members)}
                icon="people"
                color="text-indigo-600"
            />
            <StatCard
                label="Kegiatan"
                value={formatNumber(stats.activities)}
                icon="event_available"
                color="text-blue-600"
            />

            {canViewFinance && (
                <div className="col-span-2 card p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => navigate('/finance')}>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                            Saldo Kas
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(stats.balance)}</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600">
                        <span className="material-icons-round">arrow_forward</span>
                    </div>
                </div>
            )}
        </section>

        {/* 5. Recent Announcements */}
        <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Info Terkini</h2>
                <Link to="/announcements" className="text-sm font-semibold text-accent hover:underline">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-3">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div key={ann.id} className="card p-4 flex gap-4 items-start">
                             <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-icons-round text-lg">campaign</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{ann.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ann.content}</p>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                    {formatDate(ann.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState message="Belum ada pengumuman." />
                )}
            </div>
        </section>

         {/* 6. Activities Slider */}
         <section>
             <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kegiatan Terbaru</h2>
                <Link to="/activities" className="text-sm font-semibold text-accent hover:underline">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar snap-x">
                 {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                        <div key={act.id} className="min-w-[240px] w-[240px] snap-center card overflow-hidden flex flex-col active:scale-95 transition-transform h-full">
                            <div className="h-28 bg-gray-200 dark:bg-gray-700 relative">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span className="material-icons-round text-4xl opacity-50">image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">{act.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">{act.description}</p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
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

const MenuButton = ({ to, icon, label, color, bg }) => (
    <Link to={to} className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-sm group-hover:scale-105 transition-transform`}>
            <span className="material-icons-round text-2xl">{icon}</span>
        </div>
        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-accent transition-colors">{label}</span>
    </Link>
);

const StatCard = ({ label, value, icon, color }) => (
    <div className="card p-4 flex flex-col justify-between h-24">
        <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
            <span className={`material-icons-round text-lg ${color}`}>{icon}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
);

const EmptyState = ({ message, fullWidth }) => (
    <div className={`${fullWidth ? 'w-full' : ''} py-6 px-4 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2`}>
        <span className="material-icons-round text-gray-300 text-2xl">inbox</span>
        <p className="text-xs text-gray-500">{message}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen p-6 space-y-8 animate-pulse bg-background-light dark:bg-background-dark">
         <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-14 w-full rounded-xl" />
             <Skeleton className="h-14 w-full rounded-xl" />
             <Skeleton className="h-14 w-full rounded-xl" />
             <Skeleton className="h-14 w-full rounded-xl" />
        </div>
    </div>
);

export default Dashboard;
