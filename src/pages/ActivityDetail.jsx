import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRamadan } from '../context/RamadanContext';

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
    <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!activity) return (
    <div className="h-screen flex flex-col justify-center items-center bg-background-light dark:bg-background-dark text-slate-800 dark:text-white">
        <p>Kegiatan tidak ditemukan.</p>
        <Link to="/activities" className="mt-4 text-primary font-semibold">Kembali ke Kegiatan</Link>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 pb-20 transition-colors duration-500
       ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20' : ''}`}>

      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {activity.imageURL ? (
            <img src={activity.imageURL} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
            <div className={`w-full h-full flex items-center justify-center ${isRamadan ? 'bg-ramadan-primary' : 'bg-primary'}`}>
                <span className="material-icons text-6xl text-white opacity-50">event</span>
            </div>
        )}
        <Link to="/activities" className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-sm transition-colors">
          <span className="material-icons">arrow_back</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-5 -mt-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h1 className={`text-2xl font-bold mb-2 ${isRamadan ? 'text-ramadan-primary dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                    {activity.title}
                </h1>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-4">
                    <div className="flex items-center">
                        <span className="material-icons text-sm mr-1">calendar_today</span>
                        {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {activity.time && (
                        <div className="flex items-center">
                            <span className="material-icons text-sm mr-1">schedule</span>
                            {activity.time}
                        </div>
                    )}
                </div>
             </div>
             {/* Status Badge */}
             {activity.status && (
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                     activity.status === 'open'
                     ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                     : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                 }`}>
                     {activity.status}
                 </span>
             )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800 my-4" />

          {/* Details */}
          <div className="space-y-4">
             <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Lokasi</h3>
                <p className="text-slate-600 dark:text-slate-300 flex items-start">
                    <span className="material-icons text-sm mr-2 mt-0.5 text-primary">location_on</span>
                    {activity.location || 'Online / TBD'}
                </p>
             </div>

             <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Deskripsi</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {activity.description}
                </p>
             </div>

             {/* Additional Info / Organizer */}
             {activity.organizer && (
                 <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                         {activity.organizer.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                         <p className="text-xs text-slate-500">Diselenggarakan oleh</p>
                         <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.organizer}</p>
                     </div>
                 </div>
             )}
          </div>

          {/* Action Button */}
          {activity.status === 'open' && (
              <div className="mt-8">
                  <button className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-[0.98]
                      ${isRamadan ? 'bg-gradient-to-r from-ramadan-primary to-emerald-600 hover:to-emerald-700' : 'bg-primary hover:bg-blue-600'}`}>
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
