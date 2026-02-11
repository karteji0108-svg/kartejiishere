import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';

const AddMember = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Anggota');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('active');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = null;
      if (photo) {
        photoURL = await uploadToCloudinary(photo);
      }

      // Note: This only creates the Firestore document for display in the member list.
      // It does NOT create a Firebase Auth user account. The user must register themselves
      // via the Registration page to actually log in.
      // Alternatively, an admin function (Cloud Function) would be needed to create Auth users.
      // For this frontend-only scope, we just add to the 'users' collection or a separate 'members' collection
      // if 'users' is strictly for auth. The prompt implies 'users' stores profile.
      // Let's assume we are adding to 'users' effectively pre-seeding or adding manual members.

      await addDoc(collection(db, 'users'), {
        fullName,
        role,
        phone,
        status,
        photoURL,
        createdAt: new Date().toISOString(),
        isManualEntry: true // Flag to distinguish from registered users if needed
      });

      navigate('/members');
    } catch (error) {
      console.error("Error adding member: ", error);
      alert("Gagal menambahkan anggota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-900 shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Tambah Anggota</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jabatan</label>
            <select
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Anggota">Anggota</option>
              <option value="Ketua">Ketua</option>
              <option value="Wakil Ketua">Wakil Ketua</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Bendahara">Bendahara</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. Telepon</label>
            <input
              type="tel"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Foto Profil</label>
            <input
              type="file"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Anggota'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddMember;
