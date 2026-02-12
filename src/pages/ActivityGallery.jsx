import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const ActivityGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      // 1. Fetch from 'gallery' collection
      const qGallery = query(collection(db, 'gallery'), orderBy('date', 'desc'));
      const gallerySnap = await getDocs(qGallery);
      const galleryData = gallerySnap.docs.map(doc => ({
        id: doc.id,
        source: 'gallery',
        ...doc.data()
      }));

      // 2. Fetch from 'activities' collection
      const qActivities = query(collection(db, 'activities'), orderBy('date', 'desc'));
      const activitySnap = await getDocs(qActivities);
      const activityData = [];
      activitySnap.forEach((doc) => {
         const d = doc.data();
         if (d.imageURL) {
           activityData.push({
             id: doc.id,
             source: 'activity',
             url: d.imageURL, // Normalize to url
             imageURL: d.imageURL,
             title: d.title,
             date: d.date
           });
         }
      });

      // Merge and Sort
      const combined = [...galleryData, ...activityData].sort((a, b) => new Date(b.date) - new Date(a.date));

      // Normalize URL property
      const finalData = combined.map(item => ({
          ...item,
          url: item.imageURL || item.url // Ensure 'url' property exists
      }));

      setImages(finalData);
    } catch (error) {
      console.error("Error fetching gallery: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, source) => {
      if (source !== 'gallery') {
          alert("Foto dari kegiatan hanya bisa dihapus dengan menghapus kegiatannya.");
          return;
      }

      if (window.confirm("Hapus foto ini dari galeri?")) {
          try {
              await deleteDoc(doc(db, 'gallery', id));
              fetchGallery();
          } catch (error) {
              console.error("Error deleting photo: ", error);
              alert("Gagal menghapus foto");
          }
      }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen pb-24 relative">
       <header className="bg-white dark:bg-slate-900 px-5 pt-12 pb-4 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Galeri Kegiatan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dokumentasi Karang Taruna</p>
       </header>

       <main className="p-4 grid grid-cols-2 gap-4">
          {loading ? (
             <div className="col-span-2 flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : images.length === 0 ? (
             <div className="col-span-2 text-center py-10 text-gray-500">
                Belum ada foto dokumentasi.
             </div>
          ) : (
             images.map((img) => (
                <div key={`${img.source}-${img.id}`} className="relative rounded-xl overflow-hidden aspect-square group shadow-sm hover:shadow-md transition-all">
                   <img src={img.url} alt={img.title} className="w-full h-full object-cover" />

                   {/* Delete Button for Gallery Source */}
                   {img.source === 'gallery' && (
                       <button
                           onClick={(e) => { e.preventDefault(); handleDelete(img.id, img.source); }}
                           className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                       >
                           <span className="material-icons text-sm">delete</span>
                       </button>
                   )}

                   {/* Info Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none">
                      <p className="text-white text-xs font-semibold line-clamp-2">{img.title}</p>
                      <p className="text-white/80 text-[10px]">{new Date(img.date).toLocaleDateString()}</p>
                      {img.source === 'activity' && (
                          <span className="text-[9px] bg-primary/80 text-white px-1.5 py-0.5 rounded w-fit mt-1">Kegiatan</span>
                      )}
                   </div>
                </div>
             ))
          )}
       </main>

       {/* FAB for Adding Photo */}
       <Link to="/gallery/add" className="fixed right-5 bottom-24 z-30 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary-dark transition-colors transform hover:scale-105 active:scale-95">
          <span className="material-icons text-2xl">add_a_photo</span>
       </Link>

       <BottomNav />
    </div>
  );
};

export default ActivityGallery;
