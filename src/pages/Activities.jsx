import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useRamadan } from '../context/RamadanContext';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Skeleton from '../components/Skeleton';
import { formatMonthYear, getDayOfMonth, formatMonthShort } from '../utils/date';

const Activities = () => {
  const { isRamadan } = useRamadan();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'activities'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const activityData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(activityData);
    } catch (error) {
      console.error("Error fetching activities: ", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
      try {
        await deleteDoc(doc(db, 'activities', id));
        fetchActivities(); // Refresh list
      } catch (error) {
        console.error("Error deleting activity: ", error);
        alert("Gagal menghapus kegiatan.");
      }
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title?.toLowerCase().includes(search.toLowerCase()) ||
    activity.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`font-display min-h-screen flex flex-col items-center justify-center transition-colors duration-500 relative
      ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-100' : 'bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100'}`}>
      {/* Mobile Container */}
      <div className="w-full max-w-md h-screen bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className={`px-5 pt-12 pb-4 sticky top-0 z-20 border-b flex justify-between items-center transition-colors animate-fade-in-down
          ${isRamadan ? 'bg-emerald-50/90 dark:bg-emerald-900/90 border-ramadan-gold/20 backdrop-blur-md' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${isRamadan ? 'text-ramadan-primary dark:text-white' : 'text-slate-900 dark:text-white'}`}>
              Kegiatan {isRamadan && 'Ramadhan'}
            </h1>
            <p className={`text-sm ${isRamadan ? 'text-ramadan-accent' : 'text-slate-500 dark:text-slate-400'}`}>
              Agenda Karang Taruna
            </p>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
            <span className="material-icons">filter_list</span>
          </button>
        </header>

        {/* Main Content: Activity List */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24 space-y-5">
          {/* Search Bar */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <span className="material-icons text-xl">search</span>
            </span>
            <input
              className="w-full py-2.5 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Cari kegiatan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
             <>
               <Skeleton className="h-32 w-full rounded-xl" />
               <Skeleton className="h-32 w-full rounded-xl" />
             </>
          ) : filteredActivities.length === 0 ? (
             <div className="text-center py-10 text-gray-500 animate-fade-in-up">
                Tidak ada kegiatan ditemukan.
             </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={activity.id}>
                 {/* Show Month Header */}
                 {(index === 0 || formatMonthYear(activity.date) !== formatMonthYear(filteredActivities[index-1].date)) && (
                    <div className="flex items-center space-x-2 pb-1 pt-2 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <span className="material-icons text-primary text-sm">event</span>
                      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {formatMonthYear(activity.date)}
                      </h2>
                    </div>
                 )}

                 {/* Activity Card */}
                 <div className={`group rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 mt-3 relative animate-fade-in-up
                    ${isRamadan ? 'bg-white dark:bg-slate-800 border-ramadan-gold/30 ring-1 ring-ramadan-gold/20' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                    style={{ animationDelay: `${index * 50 + 50}ms` }}
                 >

                    {/* Delete Button (Absolute) */}
                    <button
                         onClick={(e) => { e.preventDefault(); handleDelete(activity.id); }}
                         className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-red-500 dark:bg-black/20 dark:hover:bg-red-900/30 z-20 transition-colors shadow-sm"
                         title="Hapus Kegiatan"
                    >
                         <span className="material-icons text-sm">delete</span>
                    </button>

                    {/* Image Section */}
                    {activity.imageURL ? (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          alt={activity.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          src={activity.imageURL}
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex flex-col items-center shadow-sm">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{formatMonthShort(activity.date)}</span>
                          <span className={`text-xl font-bold leading-none ${isRamadan ? 'text-ramadan-primary' : 'text-primary'}`}>{getDayOfMonth(activity.date)}</span>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {isRamadan && activity.isRamadanEvent && (
                            <span className="bg-ramadan-gold text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                              Special
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                         <div className="w-24 bg-primary/10 dark:bg-primary/20 flex flex-col items-center justify-center p-2 border-r border-slate-100 dark:border-slate-700 shrink-0">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{formatMonthShort(activity.date)}</span>
                            <span className="text-2xl font-bold text-primary">{getDayOfMonth(activity.date)}</span>
                         </div>
                         <div className="p-3 flex-1 flex flex-col justify-between">
                             <div className="pr-8">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                    {activity.title}
                                  </h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                  {activity.description}
                                </p>
                             </div>
                             <Link to={`/activities/${activity.id}`} className={`text-primary text-xs font-semibold hover:text-blue-600 transition-colors flex items-center`}>
                                Detail
                                <span className="material-icons text-sm ml-0.5">chevron_right</span>
                             </Link>
                         </div>
                      </div>
                    )}

                    {/* Content Section for Image Card */}
                    {activity.imageURL && (
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2 pr-8">
                           <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                             {activity.title}
                           </h3>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-4 space-x-3">
                           {activity.time && (
                             <div className="flex items-center">
                               <span className="material-icons text-sm mr-1">schedule</span>
                               {activity.time}
                             </div>
                           )}
                           {activity.location && (
                             <div className="flex items-center">
                               <span className="material-icons text-sm mr-1">place</span>
                               {activity.location}
                             </div>
                           )}
                        </div>
                        <Link to={`/activities/${activity.id}`} className={`w-full py-2.5 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm
                           ${isRamadan ? 'bg-ramadan-primary hover:bg-emerald-600' : 'bg-primary hover:bg-blue-600'}`}>
                           <span>Lihat Detail</span>
                           <span className="material-icons text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    )}
                 </div>
              </div>
            ))
          )}

          {/* End of list placeholder */}
          <div className="text-center py-6">
            <p className="text-xs text-slate-400">Anda telah mencapai akhir daftar.</p>
          </div>
        </main>

        {/* FAB for Adding Activity */}
        <Link to="/activities/create" className="fixed right-5 bottom-24 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40">
            <span className="material-icons">add</span>
        </Link>

        <BottomNav />
      </div>
    </div>
  );
};

export default Activities;
