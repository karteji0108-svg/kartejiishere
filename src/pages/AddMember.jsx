import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

const AddMember = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Anggota');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = null;
      if (photo) {
        photoURL = await uploadToCloudinary(photo);
      }

      await addDoc(collection(db, 'users'), {
        fullName,
        role,
        phone,
        status,
        photoURL,
        createdAt: new Date().toISOString(),
        isManualEntry: true
      });

      toast.success("Anggota berhasil ditambahkan!");
      navigate('/members');
    } catch (error) {
      console.error("Error adding member: ", error);
      toast.error(`Gagal menambahkan anggota: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-bl from-blue-500/10 to-transparent z-0"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl z-0"></div>

      <header className="glass-header px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Anggota</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 animate-fade-in-up">
        <div className="glass-card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload - Centered */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-600 shadow-lg">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-icons-round text-gray-300 dark:text-gray-500 text-4xl">person_add</span>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer transform transition-transform hover:scale-110 active:scale-95">
                        <span className="material-icons-round text-sm">camera_alt</span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handlePhotoChange}
                            accept="image/*"
                        />
                    </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">Upload Foto Profil</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="label-primary">Nama Lengkap</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">badge</span>
                        <input
                            type="text"
                            className="input-primary pl-10"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nama Lengkap Anggota"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label-primary">Jabatan</label>
                        <div className="relative">
                             <select
                                className="input-primary pl-3 appearance-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Anggota">Anggota</option>
                                <option value="Ketua">Ketua</option>
                                <option value="Wakil Ketua">Wakil</option>
                                <option value="Sekretaris">Sekretaris</option>
                                <option value="Bendahara">Bendahara</option>
                            </select>
                             <span className="absolute right-3 top-3 text-gray-400 material-icons-round text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    <div>
                         <label className="label-primary">Status</label>
                        <div className="relative">
                            <select
                                className="input-primary pl-3 appearance-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Non-Aktif</option>
                            </select>
                            <span className="absolute right-3 top-3 text-gray-400 material-icons-round text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="label-primary">No. Telepon</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">phone</span>
                        <input
                            type="tel"
                            className="input-primary pl-10"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="08..."
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-6 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        Menyimpan...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">check</span>
                        Simpan Anggota
                    </>
                )}
            </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default AddMember;
