import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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

      toast.success('Pengumuman berhasil dibuat!');
      navigate('/announcements');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error(`Gagal membuat pengumuman: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-bl from-orange-500/10 to-transparent z-0"></div>
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl z-0"></div>

      {/* Header */}
      <header className="glass-header px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Buat Pengumuman</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 pb-24 animate-fade-in-up">
        <div className="glass-card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="label-primary">Judul Pengumuman</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">campaign</span>
                    <input
                        type="text"
                        className="input-primary pl-10"
                        placeholder="Contoh: Rapat Bulanan"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Type */}
            <div>
                <label className="label-primary">Jenis</label>
                <div className="relative">
                     <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">category</span>
                     <select
                        className="input-primary pl-10 appearance-none"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Penting">Penting</option>
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Rapat">Rapat</option>
                        <option value="Umum">Umum</option>
                    </select>
                    <span className="absolute right-3 top-3 text-gray-400 material-icons-round text-lg pointer-events-none">expand_more</span>
                </div>
            </div>

            {/* Content */}
            <div>
                <label className="label-primary">Isi Pengumuman</label>
                <div className="relative">
                    <textarea
                        className="input-primary p-3 h-32 resize-none"
                        placeholder="Tulis detail pengumuman..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="label-primary">Gambar / Poster</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group h-48">
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {preview ? (
                        <div className="w-full h-full relative">
                             <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                 <span className="text-white font-medium flex items-center gap-2">
                                     <span className="material-icons-round">edit</span> Ubah Gambar
                                 </span>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <span className="material-icons-round text-gray-400 text-4xl mb-2 group-hover:text-primary transition-colors">add_photo_alternate</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Klik untuk upload gambar
                            </p>
                        </div>
                    )}
                </div>
                {preview && (
                    <button
                        type="button"
                        onClick={() => { setImage(null); setPreview(null); }}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                        <span className="material-icons-round text-sm">delete</span> Hapus Gambar
                    </button>
                )}
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="btn-primary mt-4 flex items-center justify-center gap-2 shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-red-500"
            >
                {uploading ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        Mengirim...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">send</span>
                        Kirim Pengumuman
                    </>
                )}
            </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default CreateAnnouncement;
