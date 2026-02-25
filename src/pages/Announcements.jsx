import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const Announcements = () => {
  const { userRole } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const canCreate = ['admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator', 'humas'].includes(userRole);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnnouncements(fetched);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center border-b border-white/20 dark:border-white/10 shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Pengumuman
          </h1>
          {canCreate && (
            <Link to="/announcements/create" className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                <span className="material-icons text-xl">add</span>
            </Link>
          )}
      </div>

      {/* List */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="card p-5 animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
             ))
        ) : announcements.length > 0 ? (
            announcements.map(ann => (
                <div key={ann.id} className="card p-5 relative overflow-hidden group hover:shadow-md transition-all duration-200">
                     <div className="flex items-start gap-4 z-10 relative">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                             <span className="material-icons text-2xl">campaign</span>
                        </div>
                        <div className="flex-1">
                             <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{ann.title}</h3>
                             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{ann.content}</p>
                             <p className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 inline-block px-2 py-1 rounded-md">
                                {formatDate(ann.createdAt?.toDate ? ann.createdAt.toDate() : ann.createdAt)}
                             </p>
                        </div>
                     </div>
                     {/* Decoration */}
                     <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-orange-500/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-colors"></div>
                </div>
            ))
        ) : (
             <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <span className="material-icons text-3xl">notifications_off</span>
                </div>
                <p className="text-gray-500 text-sm">Belum ada pengumuman.</p>
            </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Announcements;
