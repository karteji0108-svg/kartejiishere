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
import PrayerTimes from '../components/common/PrayerTimes';
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
  const canManageMembers = hasRole('sekretaris') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');

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
    <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto md:max-w-4xl relative">
      {/* 1. Hero Carousel */}
      <HeroCarousel />
      <PrayerTimes />

      {/* 2. Quick Actions Grid */}
      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary dark:text-white">
            <span className="material-icons text-secondary text-xl">grid_view</span>
            Menu Utama
        </h2>
        <div className="grid grid-cols-4 gap-4">
            <MenuButton
                to="/activities"
                icon="event"
                label="Kegiatan"
                bg="bg-blue-50 dark:bg-blue-900/20"
                text="text-blue-600 dark:text-blue-400"
            />
            <MenuButton
                to="/members"
                icon="people"
                label="Anggota"
                bg="bg-indigo-50 dark:bg-indigo-900/20"
                text="text-indigo-600 dark:text-indigo-400"
            />
            <MenuButton
                to="/gallery"
                icon="collections"
                label="Galeri"
                bg="bg-purple-50 dark:bg-purple-900/20"
                text="text-purple-600 dark:text-purple-400"
            />
             {canViewFinance ? (
                <MenuButton
                    to="/finance"
                    icon="payments"
                    label="Keuangan"
                    bg="bg-emerald-50 dark:bg-emerald-900/20"
                    text="text-emerald-600 dark:text-emerald-400"
                />
            ) : (
                 <MenuButton
                    to="/announcements"
                    icon="campaign"
                    label="Info"
                    bg="bg-orange-50 dark:bg-orange-900/20"
                    text="text-orange-600 dark:text-orange-400"
                />
            )}

            {/* Expandable Rows for more features if needed */}
        </div>
      </section>

      {/* 3. Stats Overview - Minimalist Cards */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard
            label="Total Anggota"
            value={formatNumber(stats.members)}
            icon="groups"
            color="text-indigo-600"
            bgColor="bg-indigo-50"
        />
        <StatCard
            label="Kegiatan"
            value={formatNumber(stats.activities)}
            icon="history_edu"
             color="text-blue-600"
            bgColor="bg-blue-50"
        />
        {canViewFinance && (
            <div className="col-span-2 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 shadow-lg text-white flex justify-between items-center relative overflow-hidden group cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/finance')}>
                <div className="relative z-10">
                    <p className="text-emerald-100 text-sm font-medium mb-1">Saldo Kas Saat Ini</p>
                    <h3 className="text-2xl font-bold font-mono tracking-tight">{formatCurrency(stats.balance)}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <span className="material-icons text-white">account_balance_wallet</span>
                </div>
                {/* Decorative BG Pattern */}
                <div className="absolute -right-5 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
        )}
      </section>

      {/* 4. Recent Updates Feed */}
      <section>
         <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <span className="material-icons text-secondary text-xl">new_releases</span>
                Terkini
            </h2>
            <Link to="/announcements" className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors">
                Lihat Semua
            </Link>
        </div>

        <div className="space-y-4">
            {announcements.length > 0 ? (
                announcements.map(ann => (
                    <div key={ann.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 flex gap-4 items-start active:scale-[0.99] transition-transform">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                            <span className="material-icons text-lg">campaign</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{ann.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">{formatDate(ann.createdAt?.toDate())}</p>
                        </div>
                    </div>
                ))
            ) : (
                <EmptyState message="Belum ada pengumuman terbaru." />
            )}
        </div>
      </section>

       {/* 5. Upcoming Activities Preview */}
       <section>
         <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <span className="material-icons text-accent text-xl">event_available</span>
                Kegiatan Terbaru
            </h2>
            <Link to="/activities" className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors">
                Lihat Semua
            </Link>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 no-scrollbar">
            {recentActivities.length > 0 ? (
                recentActivities.map(act => (
                    <div key={act.id} className="min-w-[240px] w-[240px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700 flex flex-col active:scale-95 transition-transform">
                        <div className="h-24 bg-slate-200 dark:bg-slate-700 relative">
                             {/* Ideally, an image here. Placeholder for now. */}
                             <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <span className="material-icons text-4xl">image</span>
                             </div>
                             <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                                {formatDate(new Date(act.date))}
                             </div>
                        </div>
                        <div className="p-3">
                             <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1 truncate">{act.title}</h4>
                             <p className="text-xs text-slate-500 line-clamp-2">{act.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="w-full py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-sm text-slate-500">Belum ada kegiatan.</p>
                 </div>
            )}
        </div>

       </section>

      <BottomNav />
    </div>
  );
};

// Sub-components for cleaner code
const MenuButton = ({ to, icon, label, bg, text }) => (
    <Link to={to} className="flex flex-col items-center gap-2 group cursor-pointer">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${text} shadow-sm group-hover:scale-105 group-active:scale-95 transition-all duration-200 border border-transparent dark:border-slate-700`}>
            <span className="material-icons text-2xl">{icon}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{label}</span>
    </Link>
);

const StatCard = ({ label, value, icon, color, bgColor }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-28 relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
            <span className="text-xs text-slate-500 font-medium">{label}</span>
            <div className={`p-1.5 rounded-lg ${bgColor} ${color}`}>
                <span className="material-icons text-base">{icon}</span>
            </div>
        </div>
        <div className="z-10">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</h3>
        </div>
        {/* Subtle decorative circle */}
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full ${bgColor} opacity-50 blur-xl`}></div>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="py-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
        <span className="material-icons text-slate-300 text-3xl mb-2">inbox</span>
        <p className="text-sm text-slate-500">{message}</p>
    </div>
);

const DashboardSkeleton = () => (
    <div className="space-y-6 p-4">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <Skeleton className="h-16 w-16 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
        </div>
    </div>
);

export default Dashboard;
