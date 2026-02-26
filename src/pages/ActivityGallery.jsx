import React, { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const ActivityGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const gallerySnap = await getDocs(qGallery);
      const galleryData = gallerySnap.docs.map(doc => ({
        id: doc.id,
        source: 'gallery',
        ...doc.data(),
        url: doc.data().imageURL // Normalize
      }));

      const qActivities = query(collection(db, 'activities'), orderBy('date', 'desc'));
      const activitySnap = await getDocs(qActivities);
      const activityData = [];
      activitySnap.forEach((doc) => {
         const d = doc.data();
         if (d.imageURL) {
           activityData.push({
             id: doc.id,
             source: 'activity',
             url: d.imageURL,
             title: d.title,
             date: d.date,
             createdAt: d.createdAt
           });
         }
      });

      // Merge and Sort
      const combined = [...galleryData, ...activityData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setImages(combined);

    } catch (error) {
      console.error("Error fetching gallery: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, source, e) => {
      e.stopPropagation();
      e.preventDefault();

      if (source === 'activity') {
          toast.error("Foto kegiatan hanya bisa dihapus lewat menu Kegiatan.");
          return;
      }

      if (window.confirm("Hapus foto ini dari galeri?")) {
          try {
              await deleteDoc(doc(db, 'gallery', id));
              setImages(images.filter(img => img.id !== id));
              toast.success("Foto berhasil dihapus.");
          } catch (error) {
              console.error("Error deleting photo: ", error);
              toast.error("Gagal menghapus foto");
          }
      }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen pb-24 relative overflow-x-hidden">
       {/* Background */}
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-500/5 to-transparent z-0"></div>

       <header className="glass-header px-5 py-4 sticky top-0 z-40 flex items-center justify-between safe-area-top animate-fade-in-down">
          <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Galeri Kegiatan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dokumentasi Karang Taruna</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-icons-round">filter_list</span>
          </button>
       </header>

       <main className="p-4 relative z-10">
          {loading ? (
             <div className="columns-2 gap-4 space-y-4">
               <Skeleton className="h-40 w-full rounded-2xl" />
               <Skeleton className="h-64 w-full rounded-2xl" />
               <Skeleton className="h-48 w-full rounded-2xl" />
               <Skeleton className="h-56 w-full rounded-2xl" />
             </div>
          ) : images.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <span className="material-icons-round text-4xl text-gray-300 dark:text-gray-600">collections</span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Foto</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Dokumentasi kegiatan akan muncul di sini. Tambahkan foto baru sekarang!
                </p>
             </div>
          ) : (
             /* Masonry Layout using columns */
             <div className="columns-2 gap-4 space-y-4">
                 {images.map((img, index) => (
                    <div key={`${img.source}-${img.id}`}
                         className="break-inside-avoid relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer animate-fade-in-up bg-gray-200 dark:bg-slate-800"
                         style={{ animationDelay: `${index * 50}ms` }}
                         onClick={() => img.source === 'activity' ? navigate(`/activities/${img.id}`) : null}
                    >
                       <img
                           src={img.url}
                           alt={img.title || 'Galeri'}
                           loading="lazy"
                           className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                       />

                       {/* Overlay Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <p className="text-white text-sm font-bold line-clamp-2 leading-tight">{img.title || 'Dokumentasi'}</p>
                          <div className="flex items-center justify-between mt-1">
                              <span className="text-white/80 text-[10px] font-medium backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded-full">
                                  {new Date(img.date || img.createdAt).toLocaleDateString()}
                              </span>
                              {img.source === 'activity' && (
                                  <span className="material-icons-round text-white/80 text-sm">arrow_forward</span>
                              )}
                          </div>
                       </div>

                       {/* Delete Button (Only for direct gallery uploads) */}
                       {img.source === 'gallery' && (
                           <button
                               onClick={(e) => handleDelete(img.id, img.source, e)}
                               className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-red-500 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                           >
                               <span className="material-icons-round text-base">delete</span>
                           </button>
                       )}

                       {/* Source Badge */}
                       <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md border border-white/10">
                           <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                               {img.source === 'activity' ? 'Event' : 'Galeri'}
                           </span>
                       </div>
                    </div>
                 ))}
             </div>
          )}
       </main>

       {/* FAB */}
       <Link to="/gallery/add" className="fixed right-5 bottom-24 z-30 h-14 w-14 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all active:scale-95">
          <span className="material-icons-round text-2xl">add_photo_alternate</span>
       </Link>

       <BottomNav />
    </div>
  );
};

export default ActivityGallery;
