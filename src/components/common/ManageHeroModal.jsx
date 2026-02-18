import React, { useState, useRef } from 'react';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadToCloudinary } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const ManageHeroModal = ({ slides, onClose }) => {
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
        toast.error("Gagal menghapus slide");
      }
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
      const imageURL = await uploadToCloudinary(newSlide.image);

      await addDoc(collection(db, 'hero_slides'), {
        image: imageURL,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        ctaText: newSlide.ctaText,
        ctaLink: newSlide.ctaLink,
        createdAt: new Date().toISOString()
      });

      toast.success('Slide berhasil ditambahkan');
      setNewSlide({ title: '', subtitle: '', ctaText: '', ctaLink: '', image: null });
      setPreview(null);
      setActiveTab('list');
    } catch (error) {
      console.error("Error uploading slide:", error);
      toast.error("Gagal menambahkan slide");
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
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            onClick={() => setActiveTab('list')}
          >
            Daftar Slide ({slides.length})
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'add' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            onClick={() => setActiveTab('add')}
          >
            Tambah Baru
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {slides.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Belum ada slide. Tambahkan sekarang!</p>
              ) : (
                slides.map((slide) => (
                  <div key={slide.id} className="flex gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700/30">
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
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                  value={newSlide.title}
                  onChange={e => setNewSlide({...newSlide, title: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Sub Judul (Opsional)"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                  value={newSlide.subtitle}
                  onChange={e => setNewSlide({...newSlide, subtitle: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Teks Tombol (CTA)"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    value={newSlide.ctaText}
                    onChange={e => setNewSlide({...newSlide, ctaText: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Link Tujuan (ex: /members)"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    value={newSlide.ctaLink}
                    onChange={e => setNewSlide({...newSlide, ctaLink: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full btn-primary py-3 flex justify-center items-center gap-2"
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
