import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const Activities = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const canCreate = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator'].includes(userRole);

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


  const downloadCSV = () => {
  const navigate = useNavigate();
    if (activities.length === 0) return;

    const headers = ['Tanggal', 'Judul Kegiatan', 'Deskripsi', 'Lokasi'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    activities.forEach(act => {
        const date = act.date || '';
        const title = `"${(act.title || '').replace(/"/g, '""')}"`;
        const desc = `"${(act.description || '').replace(/"/g, '""')}"`;
        const loc = `"${(act.location || '').replace(/"/g, '""')}"`;

        csvRows.push([date, title, desc, loc].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Kegiatan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center border-b border-white/20 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-slate-600 dark:text-slate-300 transition-colors">
                  <span className="material-icons text-xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Kegiatan
              </h1>
          </div>
          <div className="flex gap-2 items-center">
              <button onClick={downloadCSV} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 flex items-center justify-center rounded-full shadow-sm transition-colors duration-200">
                  <span className="material-icons-round text-xl">download</span>
              </button>
              {canCreate && (
                <Link to="/activities/create" className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                    <span className="material-icons text-xl">add</span>
                </Link>
              )}
          </div>
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
                <div key={i} className="card p-4 flex gap-4 animate-pulse">
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
                <Link to={`/activities/${activity.id}`} key={activity.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700/50 group active:scale-[0.98] animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 h-40 sm:h-auto bg-slate-100 dark:bg-slate-700 relative overflow-hidden shrink-0">
                            {activity.image ? (
                                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <span className="material-icons-round text-4xl">event</span>
                                </div>
                            )}
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-white/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{new Date(activity.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{new Date(activity.date).getDate()}</span>
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-primary transition-colors line-clamp-2">{activity.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{activity.description}</p>

                            <div className="mt-auto flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                 <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                                     <span className="material-icons-round text-[12px] text-rose-500">place</span>
                                     <span className="truncate max-w-[150px]">{activity.location || 'Lokasi belum ditentukan'}</span>
                                 </span>
                            </div>
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
