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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-32 font-sans relative z-0">

      {/* 1. Header (Clean & Professional) */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Welcome back,</p>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {displayName}
            </h1>
        </div>
        <Link to="/profile" className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:ring-2 hover:ring-accent-light transition-all duration-200">
                {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <span className="material-icons-round text-lg">person</span>
                    </div>
                )}
            </div>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6 relative z-10">

        {/* Pending Approval Alert - Enterprise Style */}
        {canApprove && pendingCount > 0 && (
             <div
                onClick={() => navigate('/user-approvals')}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            >
                <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                    <span className="material-icons-round text-[20px]">how_to_reg</span>
                    <div>
                        <h3 className="font-semibold text-sm">Review Required: {pendingCount} New Members</h3>
                        <p className="text-xs text-amber-700 dark:text-amber-400/80">Action needed to approve pending registrations.</p>
                    </div>
                </div>
                <span className="material-icons-round text-amber-500 text-lg">chevron_right</span>
            </div>
        )}

        {/* 2. Hero Section (Clean rounded corners) */}
        <section className="rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <HeroCarousel />
        </section>

        {/* 3. Key Metrics Grid (Enterprise Cards) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
                label="Total Members"
                value={formatNumber(stats.members)}
                icon="groups"
            />
            <MetricCard
                label="Total Activities"
                value={formatNumber(stats.activities)}
                icon="event_note"
            />

            {canViewFinance && (
                <div
                    className="col-span-2 bg-white dark:bg-slate-800 rounded-lg p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    onClick={() => navigate('/finance')}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-emerald-500 text-lg">account_balance</span>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Finance Balance</p>
                        </div>
                        <span className="material-icons-round text-slate-400 text-sm">open_in_new</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(stats.balance)}</h3>
                    </div>
                </div>
            )}
        </section>

        {/* 4. Recent Activity & Announcements Section (Grid for larger screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity (List View instead of playful cards) */}
             <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[400px]">
                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[18px] text-accent">local_activity</span> Recent Activities
                    </h2>
                    <Link to="/activities" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                        View All
                    </Link>
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                     {recentActivities.length > 0 ? (
                        recentActivities.map((act) => (
                            <Link to={`/activities/${act.id}`} key={act.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                <div className="w-16 h-16 rounded-md bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                    {act.image ? (
                                        <img src={act.image} alt={act.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-2xl">image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1 group-hover:text-accent transition-colors">{act.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><span className="material-icons-round text-[12px]">calendar_today</span> {formatDate(act.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                                        <span className="flex items-center gap-1"><span className="material-icons-round text-[12px]">place</span> {act.location || '-'}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                            <span className="material-icons-round text-3xl mb-2 text-slate-300">history_toggle_off</span>
                            <p className="text-sm font-medium">No recent activities found.</p>
                        </div>
                    )}
                </div>
             </section>

            {/* 5. Announcements (Structured List) */}
            <section className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[400px]">
                 <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="material-icons-round text-[18px] text-amber-500">campaign</span> Internal Announcements
                    </h2>
                    <Link to="/announcements" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
                        View All
                    </Link>
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                    {announcements.length > 0 ? (
                        announcements.map((ann) => (
                            <div
                                key={ann.id}
                                onClick={() => navigate(`/announcements/${ann.id}`)}
                                className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-1 gap-2">
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1 group-hover:text-accent transition-colors">{ann.title}</h4>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded whitespace-nowrap">{formatDate(ann.createdAt)}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
                            <span className="material-icons-round text-3xl mb-2 text-slate-300">notifications_none</span>
                            <p className="text-sm font-medium">No new announcements.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

// --- Sub-components ---

const MetricCard = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-28 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="material-icons-round text-[18px]">{icon}</span>
            <p className="text-[10px] font-medium uppercase tracking-wider truncate">{label}</p>
        </div>
        <div className="mt-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
    </div>
);

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-32">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
            <div className="space-y-1">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-6 w-32 rounded" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg col-span-2" />
            </div>
        </div>
    </div>
);

export default Dashboard;
