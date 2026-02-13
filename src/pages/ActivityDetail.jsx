import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useRamadan } from '../context/RamadanContext';
import Skeleton from '../components/Skeleton';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <Skeleton className="h-96 w-full rounded-none" />
        <div className="max-w-3xl mx-auto px-5 -mt-24 relative z-10">
            <div className="glass-card rounded-3xl p-8 h-96">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <div className="grid grid-cols-2 gap-4">
                     <Skeleton className="h-24 w-full rounded-2xl" />
                     <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
  );

  if (!activity) return (
    <div className="h-screen flex flex-col justify-center items-center bg-background-light dark:bg-background-dark text-slate-800 dark:text-white p-5 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="material-icons-round text-4xl text-gray-400">event_busy</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Kegiatan Tidak Ditemukan</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
            Mungkin kegiatan ini telah dihapus atau link yang Anda tuju salah.
        </p>
        <button
            onClick={() => navigate('/activities')}
            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform active:scale-95"
        >
            Kembali ke Kegiatan
        </button>
    </div>
  );

  return (
    <div className={`min-h-screen font-display text-slate-800 dark:text-slate-100 pb-safe transition-colors duration-500
       ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-background-light dark:bg-background-dark'}`}>

      {/* Hero Image Section */}
      <div className="relative h-[450px] w-full overflow-hidden group">
        {activity.imageURL ? (
            <img
                src={activity.imageURL}
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
        ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center ${isRamadan ? 'bg-gradient-to-br from-emerald-600 to-teal-800' : 'bg-gradient-to-br from-primary to-blue-700'}`}>
                <span className="material-icons-round text-9xl text-white/20 mb-4">event</span>
                <span className="text-white/40 text-lg font-medium tracking-widest uppercase">No Image Available</span>
            </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Navigation Bar (Absolute) */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center safe-area-top z-20">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10"
            >
                <span className="material-icons-round">arrow_back</span>
            </button>
            <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10">
                    <span className="material-icons-round">share</span>
                </button>
                <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10">
                    <span className="material-icons-round">favorite_border</span>
                </button>
            </div>
        </div>

        {/* Hero Content (Title & Badge) */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-24 z-10">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-3 animate-fade-in-up">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border border-white/20 text-white ${
                        activity.status === 'open' ? 'bg-green-500/80' : 'bg-gray-500/80'
                    }`}>
                        {activity.status === 'open' ? 'Open Registration' : 'Closed'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/20 backdrop-blur-md border border-white/20 text-white">
                        {activity.category || 'Event'}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-md animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    {activity.title}
                </h1>
                <div className="flex items-center text-white/90 text-sm gap-4 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    <div className="flex items-center gap-1.5">
                        <span className="material-icons-round text-base">calendar_month</span>
                        {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Card - Overlapping Hero */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 pb-24 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <div className="glass-card rounded-3xl p-6 md:p-8">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0">
                        <span className="material-icons-round">schedule</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-0.5">Waktu</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.time || 'TBA'}</p>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                        <span className="material-icons-round">place</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-0.5">Lokasi</p>
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{activity.location || 'Online'}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Deskripsi Kegiatan
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {activity.description}
                </p>
            </div>

            {/* Map / Additional Info Placeholder */}
            {activity.location && (
                <div className="mb-8 rounded-2xl overflow-hidden h-40 bg-gray-200 dark:bg-slate-800 relative group cursor-pointer">
                    {/* Fake Map Visual */}
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-6.200000,106.816666&zoom=13&size=600x300&sensor=false')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <span className="material-icons-round text-red-500">map</span>
                            <span className="font-medium text-sm text-slate-800 dark:text-white">Lihat di Peta</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Organizer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        KT
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Diselenggarakan oleh</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Karang Taruna</p>
                    </div>
                </div>
                {activity.status === 'open' && (
                    <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all transform active:scale-95">
                        Daftar
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
