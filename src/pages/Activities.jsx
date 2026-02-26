import React, { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import { useRamadan } from '../context/RamadanContext';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isRamadan } = useRamadan();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'activities'), orderBy('date', 'desc')); // Most recent first
        const querySnapshot = await getDocs(q);
        const activityData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActivities(activityData);
      } catch (error) {
        console.error("Error fetching activities: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity =>
    activity.title?.toLowerCase().includes(search.toLowerCase()) ||
    activity.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getMonthName = (dateString) => {
    const options = { month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getDay = (dateString) => {
    return new Date(dateString).getDate();
  };

  const getMonthShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { month: 'short' });
  };

  return (
    <div className={`font-display h-screen flex flex-col overflow-hidden relative transition-colors duration-500
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Top Status Bar Simulation */}
      <div className="h-12 w-full shrink-0"></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* Header */}
        <header className="glass-header px-5 pt-4 pb-4 sticky top-0 z-40 animate-fade-in-down safe-area-top">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Kegiatan {isRamadan && 'Ramadhan'}
                </h1>
                <p className="text-sm opacity-70">Agenda Karang Taruna</p>
            </div>
            <button className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors text-primary">
              <span className="material-icons-round">filter_list</span>
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="glass-input w-full pl-10 pr-3 py-3"
              placeholder="Cari kegiatan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Activity List */}
        <div className="px-5 py-4 space-y-6">
          {loading ? (
             <div className="space-y-4">
               <Skeleton className="h-40 w-full rounded-2xl" />
               <Skeleton className="h-40 w-full rounded-2xl" />
             </div>
          ) : filteredActivities.length === 0 ? (
             <div className="text-center py-10 text-gray-500 animate-fade-in-up">
                <div className="w-20 h-20 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <span className="material-icons-round text-4xl text-slate-400">event_busy</span>
                </div>
                Tidak ada kegiatan ditemukan.
             </div>
          ) : (
            filteredActivities.map((activity, index) => {
              const showMonthHeader = index === 0 || getMonthName(activity.date) !== getMonthName(filteredActivities[index-1].date);

              return (
              <div key={activity.id}>
                 {/* Month Header */}
                 {showMonthHeader && (
                    <div className="flex items-center space-x-2 pb-2 pt-2 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <span className="material-icons-round text-primary text-sm">event</span>
                      <h2 className="text-xs font-bold uppercase tracking-wider opacity-70">
                        {getMonthName(activity.date)}
                      </h2>
                    </div>
                 )}

                 {/* Activity Card */}
                 <Link to={`/activities/${activity.id}`}>
                    <div className="glass-card overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative animate-fade-in-up group p-0"
                        style={{ animationDelay: `${index * 50 + 50}ms` }}
                    >
                        {activity.imageURL ? (
                        <div className="relative h-48 overflow-hidden">
                            <img
                                alt={activity.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                src={activity.imageURL}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                            {/* Date Badge */}
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex flex-col items-center shadow-lg">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{getMonthShort(activity.date)}</span>
                                <span className="text-xl font-bold leading-none text-primary">{getDay(activity.date)}</span>
                            </div>

                            {/* Text Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <h3 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-md">
                                    {activity.title}
                                </h3>
                                <div className="flex items-center text-xs text-white/80 space-x-3">
                                    {activity.time && (
                                        <div className="flex items-center bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            <span className="material-icons-round text-sm mr-1">schedule</span>
                                            {activity.time}
                                        </div>
                                    )}
                                    {activity.location && (
                                        <div className="flex items-center bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                            <span className="material-icons-round text-sm mr-1">place</span>
                                            <span className="truncate max-w-[150px]">{activity.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ) : (
                        <div className="flex p-4">
                            <div className="w-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center p-2 border border-primary/20 shrink-0 mr-4">
                                <span className="text-[10px] font-bold opacity-70 uppercase">{getMonthShort(activity.date)}</span>
                                <span className="text-2xl font-bold text-primary">{getDay(activity.date)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate">
                                    {activity.title}
                                </h3>
                                <p className="text-sm opacity-70 line-clamp-2">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                        )}
                    </div>
                 </Link>
              </div>
            )})
          )}

          <div className="h-24"></div>
        </div>
      </main>

      {/* FAB for Adding Activity */}
      <Link to="/activities/create" className="fixed right-5 bottom-24 bg-primary hover:bg-primary-dark text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40">
        <span className="material-icons-round text-2xl">add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default Activities;
