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
      // In a real app, implement pagination with startAfter
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
    e.stopPropagation(); // Prevent opening the modal
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
                    // Allow members to upload if desired, or restrict
                    userRole === 'anggota'; // Assuming members can upload for now based on prompt context "Tambah Foto (jika diizinkan)"

  const canDelete = hasPermission(userRole, PERMISSIONS.MANAGE_GALLERY) || userRole === 'super_admin';

  return (
    <div className="bg-glass-light dark:bg-glass-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative transition-colors duration-500">

      {/* Header */}
      <header className="glass-header px-5 py-4 flex items-center justify-between sticky top-0 z-30 safe-area-top">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Galeri Kegiatan</h1>
        {canUpload && (
            <Link to="/gallery/add" className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <span className="material-icons-round">add_a_photo</span>
            </Link>
        )}
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto no-scrollbar">
        {loading ? (
            <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4,5,6].map(i => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
            </div>
        ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <span className="material-icons-round text-4xl text-slate-400">perm_media</span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Belum ada foto</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                    Dokumentasi kegiatan akan muncul di sini.
                </p>
                {canUpload && (
                    <Link to="/gallery/add" className="btn-primary flex items-center gap-2">
                        <span className="material-icons-round">add_a_photo</span>
                        Tambah Foto
                    </Link>
                )}
            </div>
        ) : (
            <div className="columns-2 gap-3 space-y-3">
                {photos.map(photo => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                        <img
                            src={photo.imageURL}
                            alt={photo.description}
                            className="w-full h-auto object-cover bg-gray-100 dark:bg-slate-800"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
                            {canDelete && (
                                <button
                                    onClick={(e) => handleDelete(photo.id, e)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    <span className="material-icons-round text-sm">delete</span>
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
            className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all"
        >
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col safe-area-top safe-area-bottom animate-fade-in-up">
            <div className="flex items-center justify-between p-4 z-10">
                <button onClick={() => setSelectedPhoto(null)} className="p-2 text-white/80 hover:text-white bg-white/10 rounded-full backdrop-blur-md">
                    <span className="material-icons-round">close</span>
                </button>
                {canDelete && (
                    <button onClick={(e) => handleDelete(selectedPhoto.id, e)} className="p-2 text-red-400 hover:text-red-300 bg-white/10 rounded-full backdrop-blur-md">
                        <span className="material-icons-round">delete</span>
                    </button>
                )}
            </div>

            <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                <img
                    src={selectedPhoto.imageURL}
                    alt={selectedPhoto.description}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
            </div>

            <div className="p-5 bg-black/40 backdrop-blur-md text-white">
                <p className="text-sm font-light opacity-80 mb-2">
                    Diupload oleh {selectedPhoto.createdByName || 'Pengguna'} • {new Date(selectedPhoto.createdAt).toLocaleDateString('id-ID')}
                </p>
                <p className="text-base font-medium leading-relaxed">
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
