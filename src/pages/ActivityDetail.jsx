import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRamadan } from '../context/RamadanContext';
import Skeleton from '../components/Skeleton';

const ActivityDetail = () => {
  const { id } = useParams();
  const { isRamadan } = useRamadan();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'activities', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setActivity({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
        <Skeleton className="h-80 w-full rounded-none" />
        <div className="max-w-3xl mx-auto px-5 -mt-16 relative z-10">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 h-96">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    </div>
  );

  if (!activity) return (
    <div className="h-screen flex flex-col justify-center items-center bg-background-light dark:bg-background-dark text-slate-800 dark:text-white">
        <p className="text-lg font-medium">Kegiatan tidak ditemukan.</p>
        <Link to="/activities" className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors">
            Kembali ke Kegiatan
        </Link>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 pb-20 transition-colors duration-500
       ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20' : ''}`}>

      {/* Hero Image */}
      <div className="relative h-80 w-full overflow-hidden group">
        {activity.imageURL ? (
            <img
                src={activity.imageURL}
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        ) : (
            <div className={`w-full h-full flex items-center justify-center ${isRamadan ? 'bg-gradient-to-br from-ramadan-primary to-emerald-800' : 'bg-gradient-to-br from-primary to-blue-600'}`}>
                <span className="material-icons text-8xl text-white/30">event</span>
            </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Back Button */}
        <Link to="/activities" className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-105">
          <span className="material-icons">arrow_back</span>
        </Link>
      </div>

      {/* Content Card */}
      <div className="max-w-3xl mx-auto px-5 -mt-12 relative z-10 animate-fade-in-up">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 border border-white/20">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h1 className={`text-2xl md:text-3xl font-bold mb-3 leading-tight ${isRamadan ? 'text-ramadan-primary dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {activity.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        <span className="material-icons text-sm mr-1.5 text-primary">calendar_today</span>
                        {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {activity.time && (
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                            <span className="material-icons text-sm mr-1.5 text-primary">schedule</span>
                            {activity.time}
                        </div>
                    )}
                </div>
             </div>
             {/* Status Badge */}
             {activity.status && (
                 <span className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                     activity.status === 'open'
                     ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                     : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                 }`}>
                     {activity.status}
                 </span>
             )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800 mb-6" />

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-6">
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">Deskripsi</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                        {activity.description}
                    </p>
                 </div>
             </div>

             <div className="space-y-6">
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">Lokasi</h3>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                            <span className="material-icons text-sm text-red-500">location_on</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                            {activity.location || 'Online / TBD'}
                        </p>
                    </div>
                 </div>

                 {activity.organizer && (
                     <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">Penyelenggara</h3>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {activity.organizer.substring(0,2).toUpperCase()}
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.organizer}</p>
                        </div>
                     </div>
                 )}
             </div>
          </div>

          {/* Sticky Action Button for Mobile / Standard for Desktop */}
          {activity.status === 'open' && (
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                      ${isRamadan ? 'bg-gradient-to-r from-ramadan-primary to-emerald-600 hover:to-emerald-700' : 'bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700'}`}>
                      <span className="material-icons">how_to_reg</span>
                      Daftar Sekarang
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
