import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Penting');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk membuat pengumuman.");
      }

      let imageURL = null;
      if (image) {
        imageURL = await uploadToCloudinary(image);
      }

      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        type,
        imageURL,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email
      });

      navigate('/announcements');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(`Gagal membuat pengumuman: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Buat Pengumuman</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Judul</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary p-3"
              placeholder="Contoh: Rapat Bulanan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Jenis</label>
            <select
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary p-3"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Penting">Penting</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Rapat">Rapat</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Isi Pengumuman</label>
            <textarea
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary p-3 h-32"
              placeholder="Tulis detail pengumuman..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Gambar (Opsional)</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative overflow-hidden">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="material-icons text-gray-400 mb-2">cloud_upload</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Klik untuk upload gambar
                            </p>
                        </div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
            </div>
            {preview && (
                <button
                    type="button"
                    onClick={() => { setImage(null); setPreview(null); }}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                    Hapus Gambar
                </button>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Mengirim...' : 'Kirim Pengumuman'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateAnnouncement;
