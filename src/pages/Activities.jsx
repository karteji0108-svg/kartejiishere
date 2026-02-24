import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const Activities = () => {
  const { userRole } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const canCreate = ['admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator'].includes(userRole);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const q = query(collection(db, 'activities'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedActivities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    const searchLower = search.toLowerCase();
    return activities.filter(activity =>
      activity.title.toLowerCase().includes(searchLower) ||
      activity.description.toLowerCase().includes(searchLower) ||
      activity.location?.toLowerCase().includes(searchLower)
    );
  }, [activities, search]);

  return (
    <div className="min-h-screen bg-glass-light dark:bg-glass-dark pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 glass-header px-6 py-4 flex justify-between items-center border-b border-white/20 dark:border-white/10 shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Kegiatan
          </h1>
          {canCreate && (
            <Link to="/activities/create" className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                <span className="material-icons text-xl">add</span>
            </Link>
          )}
      </div>

      {/* Search & Filters */}
      <div className="px-6 py-4">
        <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
                type="text"
                placeholder="Cari kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm backdrop-blur-sm transition-all"
            />
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-4">
        {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="glass-card p-4 flex gap-4 animate-pulse">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                    </div>
                </div>
             ))
        ) : filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
                <Link to={`/activities/${activity.id}`} key={activity.id} className="glass-card p-3 flex gap-4 group active:scale-[0.99] transition-all duration-200 hover:shadow-md">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 relative">
                        {activity.image ? (
                            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-icons text-3xl">image</span>
                            </div>
                        )}
                        <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            {formatDate(activity.date)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 text-sm mb-1 group-hover:text-primary transition-colors">{activity.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{activity.description}</p>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                             <span className="material-icons text-[12px]">location_on</span>
                             <span className="truncate">{activity.location || 'Lokasi belum ditentukan'}</span>
                        </div>
                    </div>
                </Link>
            ))
        ) : (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <span className="material-icons text-3xl">event_busy</span>
                </div>
                <p className="text-gray-500 text-sm">Tidak ada kegiatan ditemukan</p>
            </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Activities;
