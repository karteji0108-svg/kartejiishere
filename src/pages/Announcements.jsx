import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';
import toast from 'react-hot-toast';

const Announcements = () => {
  const { userRole } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const canManage = ['admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator', 'humas', 'super_admin'].includes(userRole);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

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

  const handleDelete = async (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
          try {
              await deleteDoc(doc(db, 'announcements', id));
              toast.success("Pengumuman berhasil dihapus");
              setAnnouncements(prev => prev.filter(ann => ann.id !== id));
          } catch (error) {
              console.error("Error deleting announcement:", error);
              toast.error("Gagal menghapus pengumuman");
          }
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Info Terkini
          </h1>
          {canManage && (
            <Link to="/announcements/create" className="bg-primary text-white w-9 h-9 flex items-center justify-center rounded-full shadow-lg shadow-primary/30 hover:scale-110 transition-transform active:scale-95">
                <span className="material-icons-round text-lg">add</span>
            </Link>
          )}
      </div>

      {/* List */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 animate-pulse space-y-3 border border-gray-100 dark:border-gray-700">
                    <Skeleton className="h-4 w-1/3 rounded" />
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                </div>
             ))
        ) : announcements.length > 0 ? (
            announcements.map(ann => (
                <div
                    key={ann.id}
                    onClick={() => navigate(`/announcements/${ann.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-[0.99]"
                >
                     <div className="flex items-start gap-4 z-10 relative">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center shrink-0">
                             <span className="material-icons-round text-2xl">campaign</span>
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start mb-1">
                                 <h3 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">{ann.title}</h3>
                                 {canManage && (
                                     <div className="flex gap-1 -mr-2 -mt-1">
                                         <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/announcements/edit/${ann.id}`);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                                         >
                                             <span className="material-icons-round text-sm">edit</span>
                                         </button>
                                         <button
                                            onClick={(e) => handleDelete(e, ann.id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                                         >
                                             <span className="material-icons-round text-sm">delete</span>
                                         </button>
                                     </div>
                                 )}
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-2">{ann.content}</p>
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-lg">
                                    <span className="material-icons-round text-[14px]">calendar_today</span>
                                    {formatDate(ann.createdAt?.toDate ? ann.createdAt.toDate() : ann.createdAt)}
                                 </div>
                                 <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                                     {ann.type || 'Info'}
                                 </span>
                             </div>
                        </div>
                     </div>
                </div>
            ))
        ) : (
             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <span className="material-icons-round text-3xl">notifications_off</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Belum ada pengumuman.</p>
            </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Announcements;
