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
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display pb-36">

      {/* Dynamic Background Blob */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary-100 to-accent-light dark:from-primary-900/30 dark:to-accent-900/10 rounded-b-[3rem] -z-10 overflow-hidden">
         <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
         <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-accent-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* 1. Header (Playful & Greeting) */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center z-10 relative">
        <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-3 shadow-sm border border-white/40">
                 <span className="text-xl">👋</span>
                 <p className="text-xs font-extrabold text-primary-700 dark:text-primary-300 uppercase tracking-widest">Halo, {displayName.split(' ')[0]}!</p>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                Siap beraktivitas <br/> hari ini?
            </h1>
        </div>
        <Link to="/profile" className="relative group shrink-0 self-start mt-2">
            <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white dark:border-surface-dark shadow-xl transition-transform group-hover:scale-110 ease-bouncy duration-300">
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                        <span className="material-icons-round text-2xl">face</span>
                    </div>
                )}
            </div>
        </Link>
      </header>

      <div className="px-6 space-y-8 relative z-10">

        {/* 2. Hero Section (Softer rounded corners) */}
        <section className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white/50 dark:border-surface-dark/50">
            <HeroCarousel />
        </section>

        {/* Pending Approval Alert - Vibrant */}
        {canApprove && pendingCount > 0 && (
             <div
                onClick={() => navigate('/user-approvals')}
                className="bg-gradient-to-r from-warning to-accent rounded-3xl p-5 shadow-lg shadow-warning/30 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform ease-bouncy text-white"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                        <span className="material-icons-round text-2xl">waving_hand</span>
                    </div>
                    <div>
                        <h3 className="font-black text-lg leading-tight text-white">{pendingCount} Anggota Baru</h3>
                        <p className="text-sm font-semibold text-warning-bg">Menunggu persetujuanmu!</p>
                    </div>
                </div>
                <div className="w-8 h-8 bg-white text-warning rounded-full flex items-center justify-center shadow-md">
                    <span className="material-icons-round text-sm font-bold">arrow_forward</span>
                </div>
            </div>
        )}

        {/* 3. Key Metrics (Squircle/Pill Layout) */}
        <section className="grid grid-cols-2 gap-4">
            <MetricCard
                label="Anggota"
                value={formatNumber(stats.members)}
                icon="groups"
                color="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
            />
            <MetricCard
                label="Kegiatan"
                value={formatNumber(stats.activities)}
                icon="local_fire_department"
                color="bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
            />

            {canViewFinance && (
                <div className="col-span-2 bg-primary rounded-[2rem] p-6 shadow-xl shadow-primary/30 relative overflow-hidden group cursor-pointer border-4 border-primary-800" onClick={() => navigate('/finance')}>
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-primary-800 px-3 py-1 rounded-full mb-3">
                                <span className="material-icons-round text-success text-sm">savings</span>
                                <p className="text-primary-200 text-xs font-bold uppercase tracking-wider">
                                    Kas Kita
                                </p>
                            </div>
                            <h3 className="text-3xl font-black font-mono tracking-tighter text-white">{formatCurrency(stats.balance)}</h3>
                        </div>
                        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-bouncy text-white border-2 border-white/20">
                            <span className="material-icons-round text-3xl">account_balance_wallet</span>
                        </div>
                    </div>
                    {/* Bubbly background decors */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-600/50 rounded-full blur-xl pointer-events-none"></div>
                </div>
            )}
        </section>

        {/* 4. Recent Activity (Playful Cards) */}
         <section>
             <div className="flex justify-between items-end mb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Keseruan Terbaru</h2>
                <Link to="/activities" className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-primary-100 transition-colors">
                    Lihat Semua
                </Link>
            </div>

            <div className="flex overflow-x-auto gap-5 pb-6 -mx-6 px-6 no-scrollbar snap-x">
                 {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                        <Link to={`/activities/${act.id}`} key={act.id} className="min-w-[260px] w-[260px] snap-center bg-white dark:bg-surface-dark rounded-[2rem] overflow-hidden shadow-card border-2 border-border-light dark:border-border-dark flex flex-col group hover:-translate-y-2 transition-all duration-300 ease-bouncy">
                            <div className="h-44 relative overflow-hidden bg-gray-100 dark:bg-gray-800 p-2">
                                {act.image ? (
                                    <img src={act.image} alt={act.title} className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full rounded-[1.5rem] bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-300">
                                        <span className="material-icons-round text-5xl opacity-50">celebration</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-primary-900 dark:text-primary-100 shadow-sm border border-white/20">
                                    {formatDate(act.date)}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h4 className="font-extrabold text-gray-900 dark:text-white text-base mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{act.title}</h4>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3 mt-auto">
                                     <span className="material-icons-round text-[16px] text-accent">place</span>
                                     <span className="truncate max-w-[180px]">{act.location || 'Lokasi rahasia!'}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="w-full text-center py-10 bg-white dark:bg-surface-dark rounded-[2rem] border-2 border-border-light border-dashed">
                        <span className="text-4xl mb-2 block">😴</span>
                        <p className="text-sm font-bold text-gray-500">Belum ada keseruan nih.</p>
                    </div>
                )}
            </div>
         </section>

        {/* 5. Announcements (Bubbly List) */}
        <section className="pb-8">
             <div className="flex justify-between items-end mb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Kabar Angin</h2>
                <Link to="/announcements" className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors">
                    Semua Info
                </Link>
            </div>
            <div className="space-y-4">
                {announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div
                            key={ann.id}
                            onClick={() => navigate(`/announcements/${ann.id}`)}
                            className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 shadow-sm border-2 border-border-light dark:border-border-dark flex gap-4 cursor-pointer hover:border-accent hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-bouncy group"
                        >
                             <div className="w-14 h-14 rounded-[1rem] bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300 shadow-md">
                                <span className="material-icons-round text-2xl">campaign</span>
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <h4 className="font-extrabold text-gray-900 dark:text-white text-base line-clamp-1 mb-1">{ann.title}</h4>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-medium text-gray-500 line-clamp-1 pr-2">{ann.content}</p>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md whitespace-nowrap">{formatDate(ann.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-10 bg-white dark:bg-surface-dark rounded-[2rem] border-2 border-border-light border-dashed">
                        <span className="text-4xl mb-2 block">🍃</span>
                        <p className="text-sm font-bold text-gray-500">Sepi kabar angin hari ini.</p>
                    </div>
                )}
            </div>
        </section>
      </div>

    </div>
  );
};

// --- Sub-components ---

const MetricCard = ({ label, value, icon, color }) => (
    <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-5 shadow-card border-2 border-border-light dark:border-border-dark flex flex-col justify-between h-36 group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-bouncy">
        <div className="flex justify-between items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-inner group-hover:scale-110 transition-transform`}>
                <span className="material-icons-round text-2xl">{icon}</span>
            </div>
        </div>
        <div className="mt-auto">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">{label}</p>
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen p-6 space-y-8 animate-pulse bg-background-light dark:bg-background-dark">
         <div className="flex justify-between items-center mt-6">
            <div className="space-y-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="h-56 w-full rounded-[2.5rem] shadow-sm" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-36 w-full rounded-[2rem]" />
            <Skeleton className="h-36 w-full rounded-[2rem]" />
        </div>
    </div>
);

export default Dashboard;
