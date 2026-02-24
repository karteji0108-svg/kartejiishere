import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const Gallery = () => {
  const { userRole } = useAuth();
    const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(photosData);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Gagal memuat galeri.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId, e) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;

    try {
      await deleteDoc(doc(db, 'gallery', photoId));
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success("Foto dihapus.");
      if (selectedPhoto?.id === photoId) setSelectedPhoto(null);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Gagal menghapus foto.");
    }
  };

  const canUpload = hasPermission(userRole, PERMISSIONS.MANAGE_GALLERY) ||
                    hasPermission(userRole, PERMISSIONS.MANAGE_ACTIVITIES) ||
                    userRole === 'anggota';

  const canDelete = hasPermission(userRole, PERMISSIONS.MANAGE_GALLERY) || userRole === 'super_admin';

  return (
    <div className={`app-container `}>

      {/* Header */}
      <header className="glass-header px-5 pb-4 flex items-center justify-between">
        <div>
            <h1 className="text-h2 text-slate-900 dark:text-white">Galeri</h1>
            <p className="text-caption">Dokumentasi Kegiatan</p>
        </div>
        {canUpload && (
            <Link to="/gallery/add" className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform text-primary">
                <span className="material-icons-round">add_a_photo</span>
            </Link>
        )}
      </header>

      <main className="main-content px-4 pt-4 pb-32">
        {loading ? (
            <div className="columns-2 gap-4 space-y-4">
                {[1,2,3,4,5,6].map(i => (
                    <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
                ))}
            </div>
        ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <span className="material-icons-round text-4xl text-slate-400">perm_media</span>
                </div>
                <h3 className="text-h3 text-slate-700 dark:text-slate-200">Belum ada foto</h3>
                <p className="text-body text-sm max-w-xs mb-6">
                    Dokumentasi kegiatan akan muncul di sini.
                </p>
                {canUpload && (
                    <Link to="/gallery/add" className="btn-primary flex items-center gap-2 w-auto px-6">
                        <span className="material-icons-round">add_a_photo</span>
                        Upload
                    </Link>
                )}
            </div>
        ) : (
            <div className="columns-2 gap-4 space-y-4">
                {photos.map(photo => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gray-100 dark:bg-slate-800"
                    >
                        <img
                            src={photo.imageURL}
                            alt={photo.description}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <p className="text-white text-xs line-clamp-2 font-medium">{photo.description}</p>
                            {canDelete && (
                                <button
                                    onClick={(e) => handleDelete(photo.id, e)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    <span className="material-icons-round text-xs">delete</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* FAB for Upload (Context-Aware) */}
      {canUpload && (
        <Link
            to="/gallery/add"
            className="fixed bottom-32 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
        >
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-fade-in"
            onClick={() => setSelectedPhoto(null)}
        >
            <div className="flex items-center justify-between p-4 z-10 pt-safe">
                <button onClick={() => setSelectedPhoto(null)} className="p-2 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-md transition-colors">
                    <span className="material-icons-round">close</span>
                </button>
                <div className="flex gap-2">
                    {canDelete && (
                        <button onClick={(e) => handleDelete(selectedPhoto.id, e)} className="p-2 text-red-400 hover:text-red-300 bg-white/10 rounded-full backdrop-blur-md transition-colors">
                            <span className="material-icons-round">delete</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                <img
                    src={selectedPhoto.imageURL}
                    alt={selectedPhoto.description}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white pb-safe" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                        {selectedPhoto.createdByName ? selectedPhoto.createdByName[0] : 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-bold leading-none">{selectedPhoto.createdByName || 'Pengguna'}</p>
                        <p className="text-[10px] opacity-60 leading-none mt-1">{new Date(selectedPhoto.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                    </div>
                </div>
                <p className="text-body text-white/90 leading-relaxed">
                    {selectedPhoto.description}
                </p>
            </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Gallery;
