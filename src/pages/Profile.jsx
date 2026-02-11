import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Edit States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFullName(data.fullName || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        let photoURL = profile?.photoURL;
        if (photo) {
            photoURL = await uploadToCloudinary(photo);
        }

        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            fullName,
            phone,
            address,
            photoURL
        });

        setProfile({
            ...profile,
            fullName,
            phone,
            address,
            photoURL
        });
        setIsEditing(false);
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Gagal memperbarui profil.");
    } finally {
        setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-screen flex flex-col relative">

        {/* Header/Cover */}
        <div className="h-40 bg-gradient-to-r from-primary to-blue-400 relative">
           <div className="absolute -bottom-10 left-6 group">
              <div className="relative">
                {preview || profile?.photoURL ? (
                    <img src={preview || profile?.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-md" />
                ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                        {getInitials(profile?.fullName || currentUser?.email)}
                    </div>
                )}

                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-white">camera_alt</span>
                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                    </label>
                )}
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-6 pb-24 flex-1 overflow-y-auto">
           <div className="flex justify-between items-start">
              <div className="flex-1">
                 {isEditing ? (
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-primary w-full"
                        placeholder="Nama Lengkap"
                    />
                 ) : (
                    <h1 className="text-2xl font-bold">{profile?.fullName || 'Pengguna'}</h1>
                 )}
                 <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.role || 'Anggota'} • {profile?.status || 'Active'}</p>
                 <p className="text-xs text-gray-400 mt-1">{currentUser?.email}</p>
              </div>

              {isEditing ? (
                  <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-500 text-sm font-semibold border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        className="text-primary text-sm font-semibold border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                      </button>
                  </div>
              ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary text-sm font-semibold border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
              )}
           </div>

           <div className="mt-8 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                 <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-gray-500">Informasi Pribadi</h3>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                       <span className="text-gray-500">Telepon</span>
                       {isEditing ? (
                           <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary w-32"
                                placeholder="08..."
                           />
                       ) : (
                           <span>{profile?.phone || '-'}</span>
                       )}
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                       <span className="text-gray-500">Alamat</span>
                       {isEditing ? (
                           <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="text-right bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary w-full max-w-[150px]"
                                placeholder="Alamat..."
                           />
                       ) : (
                           <span className="text-right max-w-[200px] truncate">{profile?.address || '-'}</span>
                       )}
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-500">Bergabung</span>
                       <span>{new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              {!isEditing && (
                <button
                    onClick={handleLogout}
                    className="w-full py-3 mt-6 text-red-600 font-semibold bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-icons">logout</span>
                    Keluar
                </button>
              )}
           </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;
