import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const ActivityGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        // Fetch from 'gallery' collection or 'activities' where imageURL exists
        // Let's assume a dedicated gallery collection or using activity images
        // For now, let's fetch from 'activities' to reuse images
        const q = query(collection(db, 'activities'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
           const d = doc.data();
           if (d.imageURL) {
             data.push({
               id: doc.id,
               url: d.imageURL,
               title: d.title,
               date: d.date
             });
           }
        });
        setImages(data);
      } catch (error) {
        console.error("Error fetching gallery: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen pb-24">
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
                <div key={img.id} className="relative rounded-xl overflow-hidden aspect-square group shadow-sm hover:shadow-md transition-all">
                   <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-semibold line-clamp-2">{img.title}</p>
                      <p className="text-white/80 text-[10px]">{new Date(img.date).toLocaleDateString()}</p>
                   </div>
                </div>
             ))
          )}
       </main>

       <BottomNav />
    </div>
  );
};

export default ActivityGallery;
