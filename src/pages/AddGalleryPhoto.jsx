import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AddGalleryPhoto = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState('');
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
    if (!image) {
        toast.error("Pilih foto terlebih dahulu!");
        return;
    }

    setUploading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk mengupload foto.");
      }

      const imageURL = await uploadToCloudinary(image);

      await addDoc(collection(db, 'gallery'), {
        imageURL,
        description,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email,
        status: 'active'
      });

      toast.success('Foto berhasil diupload!');
      navigate('/gallery');
    } catch (error) {
      console.error("Error uploading photo: ", error);
      toast.error(`Gagal upload foto: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-500/10 to-transparent z-0"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl z-0"></div>

      <header className="glass-header px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Upload Foto Galeri</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 animate-fade-in-up">
        <div className="glass-card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            <div>
                <label className="label-primary text-center block mb-4">Pilih Foto Dokumentasi</label>
                <div className={`relative border-2 border-dashed rounded-2xl overflow-hidden hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group h-80 flex flex-col items-center justify-center ${preview ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                                <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                                    <span className="material-icons-round">edit</span> Ganti Foto
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center animate-bounce">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 mb-4">
                                <span className="material-icons-round text-3xl">cloud_upload</span>
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Tap untuk Upload</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                                Support JPG, PNG. Maksimal 5MB.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="label-primary">Keterangan Foto</label>
                <div className="relative">
                    <textarea
                        className="input-primary p-3 h-24 resize-none"
                        placeholder="Tambahkan cerita di balik foto ini..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="btn-primary mt-4 flex items-center justify-center gap-2 shadow-indigo-500/30 bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700"
            >
                {uploading ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        Mengupload...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">upload_file</span>
                        Upload Foto
                    </>
                )}
            </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default AddGalleryPhoto;
