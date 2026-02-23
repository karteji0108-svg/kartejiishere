import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ManageHeroModal = ({ slides, onClose }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Local state for reordering
  const [localSlides, setLocalSlides] = useState([]);

  useEffect(() => {
    // Sort slides by order if available, otherwise by createdAt
    const sortedSlides = [...slides].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
    setLocalSlides(sortedSlides);
  }, [slides]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewSlide({ ...newSlide, image: file });
        setPreview(URL.createObjectURL(file));
      } else {
        toast.error("Mohon upload file gambar.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus slide ini?')) {
      try {
        await deleteDoc(doc(db, 'hero_slides', id));
        toast.success('Slide dihapus');
      } catch (error) {
        console.error("Error deleting slide:", error);
        toast.error("Gagal menghapus slide: " + error.message);
      }
    }
  };

  const moveSlide = async (index, direction) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= localSlides.length) return;

      const updatedSlides = [...localSlides];
      const [movedSlide] = updatedSlides.splice(index, 1);
      updatedSlides.splice(newIndex, 0, movedSlide);

      setLocalSlides(updatedSlides);

      // Update order in Firestore
      try {
          const batch = writeBatch(db);
          updatedSlides.forEach((slide, idx) => {
              const slideRef = doc(db, 'hero_slides', slide.id);
              batch.update(slideRef, { order: idx });
          });
          await batch.commit();
      } catch (error) {
          console.error("Error updating order:", error);
          toast.error("Gagal menyimpan urutan");
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSlide.image) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      console.log("Starting slide upload...");
      const imageURL = await uploadToCloudinary(newSlide.image);
      console.log("Image uploaded to Cloudinary:", imageURL);

      // Determine new order (last + 1)
      const maxOrder = localSlides.length > 0
        ? Math.max(...localSlides.map(s => s.order || 0))
        : -1;

      await addDoc(collection(db, 'hero_slides'), {
        image: imageURL,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        ctaText: newSlide.ctaText,
        ctaLink: newSlide.ctaLink,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.uid || 'unknown',
        createdByName: currentUser?.displayName || currentUser?.email || 'Admin'
      });
      console.log("Slide saved to Firestore");

      toast.success('Slide berhasil ditambahkan');
      setNewSlide({ title: '', subtitle: '', ctaText: '', ctaLink: '', image: null });
      setPreview(null);
      setActiveTab('list');
    } catch (error) {
      console.error("Error uploading slide:", error);
      toast.error(`Gagal menambahkan slide: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Kelola Hero Banner</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            onClick={() => setActiveTab('list')}
          >
            Daftar Slide ({slides.length})
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'add' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            onClick={() => setActiveTab('add')}
          >
            Tambah Baru
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {localSlides.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Belum ada slide. Tambahkan sekarang!</p>
              ) : (
                localSlides.map((slide, index) => (
                  <div key={slide.id} className="flex gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/30 items-center">

                    {/* Reorder Controls */}
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => moveSlide(index, -1)}
                            disabled={index === 0}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
                        >
                            <span className="material-icons-round text-lg">keyboard_arrow_up</span>
                        </button>
                        <button
                            onClick={() => moveSlide(index, 1)}
                            disabled={index === localSlides.length - 1}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
                        >
                            <span className="material-icons-round text-lg">keyboard_arrow_down</span>
                        </button>
                    </div>

                    <img src={slide.image} alt={slide.title} className="w-24 h-16 object-cover rounded-lg bg-gray-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{slide.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{slide.subtitle}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg self-center transition-colors"
                      title="Hapus"
                    >
                      <span className="material-icons-round">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                {preview ? (
                  <img src={preview} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                ) : (
                  <div className="py-8 text-gray-500">
                    <span className="material-icons-round text-4xl mb-2">add_photo_alternate</span>
                    <p className="text-sm">Klik untuk upload gambar (16:9)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Judul Utama"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                  value={newSlide.title}
                  onChange={e => setNewSlide({...newSlide, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Sub Judul (Opsional)"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                  value={newSlide.subtitle}
                  onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Teks Tombol (CTA)"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                    value={newSlide.ctaText}
                    onChange={e => setNewSlide({...newSlide, ctaText: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Link Tujuan (ex: /members)"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                    value={newSlide.ctaLink}
                    onChange={e => setNewSlide({...newSlide, ctaLink: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="material-icons-round animate-spin">refresh</span> Menyimpan...
                  </>
                ) : (
                  <>Simpan Slide</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHeroModal;
