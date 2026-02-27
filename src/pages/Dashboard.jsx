import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/common/Skeleton';
import HeroCarousel from '../components/common/HeroCarousel';
import BottomNav from '../components/layout/BottomNav';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';

const Dashboard = () => {
  const { currentUser, hasRole } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ members: 0, activities: 0, balance: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const canManage = hasRole('super_admin') || hasRole('ketua') || hasRole('wakil_ketua');
  const canViewFinance = hasRole('bendahara') || hasRole('ketua') || hasRole('wakil_ketua') || hasRole('super_admin');
  const canApprove = hasRole('super_admin') || hasRole('ketua') || hasRole('wakil_ketua');

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
        const usersColl = collection(db, 'users');
        const totalUsersSnapshot = await getCountFromServer(usersColl);
        const totalUsers = totalUsersSnapshot.data().count;

        let pending = 0;
        try {
            const pendingQ = query(usersColl, where('status', '==', 'pending'));
            const pendingSnap = await getCountFromServer(pendingQ);
            pending = pendingSnap.data().count;
        } catch (e) {
             const pendingQ = query(usersColl, where('status', '==', 'pending'));
             const snap = await getDocs(pendingQ);
             pending = snap.size;
        }
        setPendingCount(pending);

        let rejected = 0;
        try {
             const rejectedQ = query(usersColl, where('status', '==', 'rejected'));
             const rejectedSnap = await getCountFromServer(rejectedQ);
             rejected = rejectedSnap.data().count;
        } catch (e) {
             const rejectedQ = query(usersColl, where('status', '==', 'rejected'));
             const snap = await getDocs(rejectedQ);
             rejected = snap.size;
        }

        const activeMembers = Math.max(0, totalUsers - pending - rejected);

        const activitiesColl = collection(db, 'activities');
        const activitiesSnapshot = await getCountFromServer(activitiesColl);
        const activitiesCount = activitiesSnapshot.data().count;

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

        setStats({ members: activeMembers, activities: activitiesCount, balance });

        const activitiesQ = query(
          collection(db, 'activities'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const actSnapshot = await getDocs(activitiesQ);
        setRecentActivities(actSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
  }, [currentUser, canViewFinance, canApprove]);

  if (loading) return <DashboardSkeleton />;

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Pengguna';
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-32">
      {/* 1. Header (Clean & Minimal) */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-end bg-background-light dark:bg-background-dark sticky top-0 z-30">
        <div>
            <p className="text-sm text-primary-500 dark:text-primary-400 font-medium mb-1">Selamat Datang,</p>
            <h1 className="text-2xl font-bold text-primary-900 dark:text-white tracking-tight">
                {displayName.split(' ')[0]}
            </h1>
        </div>
        <Link to="/profile" className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md transition-transform group-hover:scale-105">
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300">
                        <span className="material-icons-round text-xl">person</span>
                    </div>
                )}
            </div>
        </Link>
      </header>

      <div className="px-6 space-y-8">

        {/* 2. Hero Section */}
        <section className="rounded-2xl overflow-hidden shadow-md shadow-slate-200 dark:shadow-none">
            <HeroCarousel />
        </section>

        {/* Pending Approval Alert */}
        {canApprove && pendingCount > 0 && (
             <div
                onClick={() => navigate('/user-approvals')}
                className="bg-warning-bg border border-warning-200 dark:border-warning-900/50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning-100 text-warning-700 flex items-center justify-center">
                        <span className="material-icons-round text-lg">person_add</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-warning-900 text-sm">Persetujuan Menunggu</h3>
                        <p className="text-xs text-warning-700 font-medium">
                            {pendingCount} user baru perlu disetujui
                        </p>
                    </div>
                </div>
                <span className="material-icons-round text-warning-400">chevron_right</span>
            </div>
        )}

        {/* 3. Key Metrics (Grid Layout) */}
        <section className="grid grid-cols-2 gap-4">
            <MetricCard
                label="Anggota Aktif"
                value={formatNumber(stats.members)}
                trend="+12%" // Mock trend for now
                trendUp={true}
            />
            <MetricCard
                label="Total Kegiatan"
                value={formatNumber(stats.activities)}
                trend="+5"
                trendUp={true}
            />

            {canViewFinance && (
                <div className="col-span-2 bg-primary-900 text-white rounded-2xl p-6 shadow-lg shadow-primary-900/20 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/finance')}>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <p className="text-primary-300 text-xs font-semibold uppercase tracking-wider mb-2">
                                Saldo Kas
                            </p>
                            <h3 className="text-3xl font-bold font-mono tracking-tight text-white">{formatCurrency(stats.balance)}</h3>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                            <span className="material-icons-round text-white">arrow_forward</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>
            )}
        </section>

        {/* 4. Recent Activity (Clean List) */}
         <section>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-primary-900 dark:text-white">Kegiatan Terbaru</h2>
                <Link to="/activities" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar snap-x">
                 {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                        <Link to={`/activities/${act.id}`} key={act.id} className="min-w-[280px] w-[280px] snap-center bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-card border border-border-light dark:border-border-dark flex flex-col group">
                            <div className="h-40 bg-primary-100 dark:bg-primary-800 relative overflow-hidden">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                                        <span className="material-icons-round text-4xl opacity-50">image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-primary-900 shadow-sm">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-primary-900 dark:text-white text-sm mb-1 line-clamp-1">{act.title}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-primary-500 mb-3">
                                     <span className="material-icons-round text-[14px]">location_on</span>
                                     <span className="truncate max-w-[180px]">{act.location || 'Lokasi belum diatur'}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="w-full text-center py-8 bg-white dark:bg-surface-dark rounded-xl border border-border-light border-dashed">
                        <p className="text-sm text-primary-400">Belum ada kegiatan.</p>
                    </div>
                )}
            </div>
         </section>

        {/* 5. Announcements (Structured List) */}
        <section className="pb-8">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-primary-900 dark:text-white">Pengumuman</h2>
                <Link to="/announcements" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">
                    Lihat Semua
                </Link>
            </div>
            <div className="space-y-3">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div
                            key={ann.id}
                            onClick={() => navigate(`/announcements/${ann.id}`)}
                            className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-border-light dark:border-border-dark flex gap-4 cursor-pointer hover:border-accent/30 transition-colors group"
                        >
                             <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-icons-round text-xl">campaign</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-primary-900 dark:text-white text-sm line-clamp-1">{ann.title}</h4>
                                    <span className="text-[10px] text-primary-400 font-medium whitespace-nowrap">{formatDate(ann.createdAt)}</span>
                                </div>
                                <p className="text-xs text-primary-500 dark:text-primary-400 line-clamp-2 leading-relaxed">{ann.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-8 bg-white dark:bg-surface-dark rounded-xl border border-border-light border-dashed">
                        <p className="text-sm text-primary-400">Belum ada pengumuman.</p>
                    </div>
                )}
            </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

// --- Sub-components ---

const MetricCard = ({ label, value, trend, trendUp }) => (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-card border border-border-light dark:border-border-dark flex flex-col justify-between h-28">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">{label}</p>
        <div className="mt-auto">
            <h3 className="text-2xl font-bold text-primary-900 dark:text-white tracking-tight">{value}</h3>
            {/* <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${trendUp ? 'text-success' : 'text-danger'}`}>
                <span className="material-icons-round text-xs">{trendUp ? 'trending_up' : 'trending_down'}</span>
                <span>{trend}</span>
            </div> */}
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen p-6 space-y-8 animate-pulse bg-background-light dark:bg-background-dark">
         <div className="flex justify-between items-center mt-4">
            <div className="space-y-3">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-48 w-full rounded-2xl shadow-sm" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
        </div>
    </div>
);

export default Dashboard;
