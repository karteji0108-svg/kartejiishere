import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Skeleton from '../components/common/Skeleton';

const Announcements = () => {
  const [notifications, setNotifications] = useState(true);
  const { isRamadan } = useRamadan();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      try {
        await deleteDoc(doc(db, 'announcements', id));
        fetchAnnouncements(); // Refresh list
      } catch (error) {
        console.error("Error deleting announcement: ", error);
        alert("Gagal menghapus pengumuman.");
      }
    }
  };

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'urgent':
      case 'penting':
        return 'bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/20';
      case 'activity':
      case 'kegiatan':
        return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20';
      case 'meeting':
      case 'rapat':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/20';
      default:
        return 'bg-primary/20 text-primary border border-primary/20'; // General/Umum
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`font-display h-screen flex flex-col overflow-hidden relative transition-colors duration-500
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Top Status Bar Simulation */}
      <div className="h-12 w-full shrink-0"></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* Header */}
        <header className="glass-header px-5 pt-4 pb-4 sticky top-0 z-40 animate-fade-in-down safe-area-top flex justify-between items-center">
            <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
              <span className="material-icons-round text-slate-600 dark:text-slate-300">arrow_back_ios_new</span>
            </Link>
            <h1 className="text-lg font-bold text-center flex-1 pr-8 text-slate-900 dark:text-white">
              Pengumuman {isRamadan && 'Ramadhan'}
            </h1>
        </header>

        {/* Content */}
        <div className="px-5 py-4 space-y-6">
          {/* Notification Settings Panel */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="pr-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Notifikasi</h2>
              <p className="text-xs opacity-70 mt-1">Dapatkan info terbaru langsung di HP Anda.</p>
            </div>
            {/* Toggle */}
            <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${notifications ? 'bg-primary' : 'bg-gray-400/50'}`}
            >
                <span className="sr-only">Toggle Notifications</span>
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
          </div>

          {/* Announcement List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider ml-1 opacity-70">Terbaru</h3>

            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-8 opacity-60">Belum ada pengumuman.</div>
            ) : (
                announcements.map((item, index) => (
                    <article key={item.id}
                        className="glass-card p-4 relative overflow-hidden animate-fade-in-up group hover:scale-[1.01] transition-transform"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >

                        {/* Delete Button */}
                        <button
                             onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                             className="absolute top-2 right-2 p-1.5 rounded-full bg-white/50 hover:bg-red-500/20 text-red-500 z-10 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                             title="Hapus Pengumuman"
                        >
                             <span className="material-icons-round text-sm">delete</span>
                        </button>

                        {item.imageURL && (
                            <div className="mb-3 h-32 rounded-lg overflow-hidden relative">
                                <img src={item.imageURL} alt="Announcement" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2 pr-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getBadgeColor(item.type)}`}>
                                {item.type || 'Umum'}
                            </span>
                            <span className="text-xs opacity-60 font-medium">{formatDate(item.createdAt)}</span>
                        </div>

                        <h3 className="text-base font-bold mb-1 leading-tight text-slate-900 dark:text-white">
                            {item.title}
                        </h3>

                        <p className="text-sm opacity-80 line-clamp-3 leading-relaxed">
                            {item.content}
                        </p>

                        <div className="mt-3 flex items-center text-xs font-bold text-primary cursor-pointer hover:underline">
                            Baca selengkapnya <span className="material-icons-round text-sm ml-1">arrow_forward</span>
                        </div>
                    </article>
                ))
            )}
          </div>

          {!loading && (
            <div className="py-6 text-center">
                <p className="text-xs opacity-50">Tidak ada pengumuman lainnya</p>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <Link to="/announcements/create" className="fixed bottom-24 right-5 z-40 bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-primary/40 transition-transform hover:scale-110 active:scale-95">
          <span className="material-icons-round text-2xl">add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default Announcements;
