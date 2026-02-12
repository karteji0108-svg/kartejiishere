import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useRamadan } from '../context/RamadanContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const Announcements = () => {
  const [notifications, setNotifications] = useState(true);
  const { isRamadan } = useRamadan();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAnnouncements();
  }, []);

  const getBadgeColor = (type) => {
    if (isRamadan) return 'bg-ramadan-gold text-white';

    switch (type?.toLowerCase()) {
      case 'urgent':
      case 'penting':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'activity':
      case 'kegiatan':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'meeting':
      case 'rapat':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-primary text-white'; // General/Umum
    }
  };

  const getBorderColor = (type) => {
    if (isRamadan) return 'border-l-ramadan-gold';

    switch (type?.toLowerCase()) {
      case 'urgent':
      case 'penting':
        return 'border-l-red-500';
      default:
        return 'border-l-primary'; // Default border color
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
    <div className={`font-display text-gray-900 dark:text-gray-100 min-h-screen flex justify-center transition-colors duration-500
      ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-background-light dark:bg-background-dark'}`}>
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-transparent min-h-screen shadow-2xl relative flex flex-col">
        {/* Header / Navigation Bar */}
        <header className={`sticky top-0 z-30 shadow-sm safe-area-top px-4 pb-3 transition-colors
          ${isRamadan ? 'bg-emerald-50/90 dark:bg-emerald-900/90 backdrop-blur-md border-b border-ramadan-gold/20' : 'bg-surface-light dark:bg-surface-dark'}`}>
          <div className="flex items-center justify-between pt-3">
            <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="material-icons-round text-gray-600 dark:text-gray-300">arrow_back_ios_new</span>
            </button>
            <h1 className={`text-lg font-bold text-center flex-1 pr-8 ${isRamadan ? 'text-ramadan-primary dark:text-emerald-400' : ''}`}>
              Pengumuman {isRamadan && 'Ramadhan'}
            </h1>
            {/* Placeholder for balance layout */}
            <div className="w-2"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6 pb-24">
          {/* Notification Settings Panel */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="pr-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Notifikasi</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dapatkan info terbaru langsung di HP Anda.</p>
            </div>
            {/* iOS Style Toggle (React Implementation) */}
            <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
                <span className="sr-only">Toggle Notifications</span>
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${notifications ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
          </div>

          {/* Announcement List (Feed) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Terbaru</h3>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada pengumuman.</div>
            ) : (
                announcements.map((item) => (
                    <article key={item.id} className={`group rounded-xl p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden
                        ${isRamadan ? 'bg-white dark:bg-slate-800 ring-1 ring-ramadan-gold/20' : 'bg-surface-light dark:bg-surface-dark'}
                        ${getBorderColor(item.type)}`}>

                        {item.imageURL && (
                            <div className="mb-3 h-32 rounded-lg overflow-hidden relative">
                                <img src={item.imageURL} alt="Announcement" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${getBadgeColor(item.type)}`}>
                            {item.type || 'Umum'}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{formatDate(item.createdAt)}</span>
                        </div>
                        <h3 className={`text-base font-bold mb-1 leading-tight transition-colors ${isRamadan ? 'text-ramadan-primary dark:text-emerald-400' : 'text-gray-900 dark:text-white group-hover:text-primary'}`}>
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                            {item.content}
                        </p>
                        <div className={`mt-3 flex items-center text-xs font-medium cursor-pointer ${isRamadan ? 'text-ramadan-accent' : 'text-primary'}`}>
                            Baca selengkapnya <span className="material-icons-round text-sm ml-1">arrow_forward</span>
                        </div>
                    </article>
                ))
            )}
          </div>

          {/* End of List Indicator */}
          {!loading && (
            <div className="py-6 text-center">
                <p className="text-xs text-gray-400">Tidak ada pengumuman lainnya</p>
            </div>
          )}
        </main>

        {/* Floating Action Button (FAB) */}
        <Link to="/announcements/create" className="absolute bottom-24 right-4 z-40 bg-primary hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-95">
          <span className="material-icons-round text-2xl">add</span>
        </Link>

        <BottomNav />
      </div>
    </div>
  );
};

export default Announcements;
