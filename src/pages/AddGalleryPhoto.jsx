import React, { useState, useRef } from 'react';
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
  const [progress, setProgress] = useState(0); // Simulated progress
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
  };

  const processFile = (file) => {
      if (file.type.startsWith('image/')) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      } else {
          toast.error("Mohon upload file gambar.");
      }
  };

  const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
          processFile(file);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
        toast.error("Pilih foto terlebih dahulu!");
        return;
    }

    setUploading(true);

    // Simulate progress
    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
            }
            return prev + 10;
        });
    }, 200);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk mengupload foto.");
      }

      const imageURL = await uploadToCloudinary(image);
      setProgress(100);

      await addDoc(collection(db, 'gallery'), {
        imageURL,
        description,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email,
        status: 'active'
      });

      toast.success('Foto berhasil diupload!');
      setTimeout(() => navigate('/gallery'), 500);
    } catch (error) {
      console.error("Error uploading photo: ", error);
      toast.error(`Gagal upload foto: ${error.message}`);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-500">

      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-black/50 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Upload Foto Galeri</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 animate-fade-in-up">
        <div className="card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Area */}
            <div>
                <label className="label-primary text-center block mb-4">Pilih Foto Dokumentasi</label>
                <div
                    className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all cursor-pointer group h-80 flex flex-col items-center justify-center
                        ${isDragging ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/30 dark:border-white/10 hover:bg-white/10 dark:hover:bg-black/10'}
                        ${preview ? 'border-primary' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                                <span className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full pointer-events-none">
                                    <span className="material-icons-round">edit</span> Ganti Foto
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center animate-bounce">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-primary text-white' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500'}`}>
                                <span className="material-icons-round text-3xl">cloud_upload</span>
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                                {isDragging ? 'Lepaskan Foto' : 'Tap atau Drop Foto'}
                            </h3>
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
                        className="input-field p-3 h-24 resize-none w-full"
                        placeholder="Tambahkan cerita di balik foto ini..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            <button
                type="submit"
                disabled={uploading}
                className="btn-primary mt-4 flex items-center justify-center gap-2 shadow-indigo-500/30 bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-700 disabled:opacity-80"
            >
                {uploading ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        Mengupload {progress}%...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">upload_file</span>
                        Upload Sekarang
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
