import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
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
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setFullName(data.fullName || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
            }
        } catch(e) {
            console.error(e);
        } finally {
            setDataLoading(false);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil keluar.");
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
      toast.error("Gagal keluar.");
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
        toast.success("Profil diperbarui.");
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Gagal memperbarui profil.");
    } finally {
        setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  if (dataLoading) {
      return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-6">
            <Skeleton className="w-full max-w-md h-40 rounded-b-3xl" />
            <Skeleton className="w-24 h-24 rounded-full -mt-12 border-4 border-white dark:border-slate-900" />
            <Skeleton className="h-8 w-48 mt-4 rounded-lg" />
            <Skeleton className="h-4 w-32 mt-2 rounded-lg" />
            <Skeleton className="w-full max-w-md h-64 mt-8 rounded-xl" />
            <BottomNav />
        </div>
      );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl min-h-screen flex flex-col relative pb-safe">

        {/* Header/Cover with Modern Gradient */}
        <div className="h-48 bg-gradient-to-br from-primary via-blue-500 to-indigo-600 relative rounded-b-[2rem] shadow-lg animate-fade-in-down">
           {/* Glass overlay effect */}
           <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-b-[2rem]"></div>

           <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 group">
              <div className="relative">
                {preview || profile?.photoURL ? (
                    <img
                        src={preview || profile?.photoURL}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-[5px] border-white dark:border-slate-900 object-cover shadow-xl transition-transform hover:scale-105"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full border-[5px] border-white dark:border-slate-900 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl font-bold text-slate-500 shadow-xl">
                        {getInitials(profile?.fullName || currentUser?.email)}
                    </div>
                )}

                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="material-icons text-white text-2xl">camera_alt</span>
                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                    </label>
                )}
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-6 pb-24 flex-1 animate-fade-in-up">
           <div className="text-center mb-8">
               {isEditing ? (
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b-2 border-primary/50 focus:border-primary focus:outline-none text-center w-full pb-1"
                        placeholder="Nama Lengkap"
                    />
               ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{profile?.fullName || 'Pengguna'}</h1>
               )}
               <p className="text-sm font-medium text-primary mt-1">{profile?.role || 'Anggota'} • {profile?.status || 'Active'}</p>
               <p className="text-xs text-gray-400 mt-1">{currentUser?.email}</p>
           </div>

           {/* Action Buttons */}
           <div className="flex justify-center gap-3 mb-8">
              {isEditing ? (
                  <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-full font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-full font-medium text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                        disabled={loading}
                      >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                      </button>
                  </>
              ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-full font-medium text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                  >
                    Edit Profil
                  </button>
              )}
           </div>

           <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <h3 className="font-semibold mb-4 text-xs uppercase tracking-wider text-gray-400">Informasi Kontak</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                           <span className="material-icons text-sm">phone</span>
                       </div>
                       <div className="flex-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                           <p className="text-xs text-gray-400 mb-0.5">Telepon</p>
                           {isEditing ? (
                               <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-transparent border-none p-0 focus:ring-0 w-full font-medium text-slate-800 dark:text-white"
                                    placeholder="08..."
                               />
                           ) : (
                               <p className="font-medium text-slate-800 dark:text-white">{profile?.phone || '-'}</p>
                           )}
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                           <span className="material-icons text-sm">home</span>
                       </div>
                       <div className="flex-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                           <p className="text-xs text-gray-400 mb-0.5">Alamat</p>
                           {isEditing ? (
                               <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="bg-transparent border-none p-0 focus:ring-0 w-full font-medium text-slate-800 dark:text-white"
                                    placeholder="Alamat Lengkap"
                               />
                           ) : (
                               <p className="font-medium text-slate-800 dark:text-white truncate">{profile?.address || '-'}</p>
                           )}
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                           <span className="material-icons text-sm">calendar_today</span>
                       </div>
                       <div className="flex-1">
                           <p className="text-xs text-gray-400 mb-0.5">Bergabung Sejak</p>
                           <p className="font-medium text-slate-800 dark:text-white">{new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {!isEditing && (
                <button
                    onClick={handleLogout}
                    className="w-full py-4 mt-6 text-red-600 font-semibold bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 group"
                >
                    <span className="material-icons group-hover:-translate-x-1 transition-transform">logout</span>
                    Keluar Aplikasi
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
