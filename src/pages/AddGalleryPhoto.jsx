import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';

const AddGalleryPhoto = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
        alert("Pilih gambar terlebih dahulu");
        return;
    }
    setUploading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk mengupload foto.");
      }

      const imageURL = await uploadToCloudinary(image);
      await addDoc(collection(db, 'gallery'), {
        title,
        imageURL,
        date,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email
      });
      navigate('/gallery');
    } catch (error) {
      console.error("Error adding photo: ", error);
      alert(`Gagal mengupload foto: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-900 shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Upload Foto Galeri</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Foto</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              placeholder="Contoh: Kerja Bakti"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gambar</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 relative overflow-hidden">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="material-icons text-gray-400 mb-2 text-4xl">add_photo_alternate</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Klik untuk upload gambar
                            </p>
                        </div>
                    )}
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Mengupload...' : 'Upload Foto'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddGalleryPhoto;
