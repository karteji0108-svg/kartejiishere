import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Profile = () => {
  const { currentUser, logout, userRole } = useAuth();
  const { isRamadan, setIsRamadan } = useRamadan();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  // Edit States
  const [formData, setFormData] = useState({
      fullName: '',
      phone: '',
      address: ''
  });
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
                setFormData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    address: data.address || ''
                });
            }
        } catch(e) {
            console.error(e);
            toast.error("Gagal memuat profil");
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

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
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
            ...formData,
            photoURL
        });

        setProfile({
            ...profile,
            ...formData,
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
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-6 relative">
            <Skeleton className="w-full max-w-md h-48 rounded-b-3xl absolute top-0" />
            <div className="z-10 flex flex-col items-center w-full mt-24">
                <Skeleton className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900" />
                <Skeleton className="h-8 w-48 mt-4 rounded-lg" />
                <Skeleton className="h-4 w-32 mt-2 rounded-lg" />
                <Skeleton className="w-full max-w-sm h-64 mt-8 rounded-xl" />
            </div>
            <BottomNav />
        </div>
      );
  }

  return (
    <div className={`font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center overflow-x-hidden transition-colors duration-500
        ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-background-light dark:bg-background-dark'}`}>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl min-h-screen flex flex-col relative pb-safe">

        {/* Header/Cover */}
        <div className={`h-48 relative rounded-b-[2.5rem] shadow-lg animate-fade-in-down transition-colors duration-500
            ${isRamadan ? 'bg-gradient-to-br from-emerald-600 via-teal-500 to-green-600' : 'bg-gradient-to-br from-primary via-blue-500 to-indigo-600'}`}>

           {/* Pattern Overlay */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

           <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 group">
              <div className="relative">
                {preview || profile?.photoURL ? (
                    <img
                        src={preview || profile?.photoURL}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-[6px] border-white dark:border-slate-900 object-cover shadow-2xl transition-transform hover:scale-105"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full border-[6px] border-white dark:border-slate-900 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl font-bold text-slate-500 shadow-2xl">
                        {getInitials(profile?.fullName || currentUser?.email)}
                    </div>
                )}

                {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                        <span className="material-icons text-white text-3xl drop-shadow-lg">camera_alt</span>
                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                    </label>
                )}
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-6 pb-24 flex-1 animate-fade-in-up">
           <div className="text-center mb-6">
               {isEditing ? (
                   <div className="flex flex-col items-center gap-2">
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="text-xl font-bold bg-transparent border-b-2 border-primary/50 focus:border-primary focus:outline-none text-center w-full pb-1 text-slate-900 dark:text-white"
                            placeholder="Nama Lengkap"
                        />
                   </div>
               ) : (
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{profile?.fullName || 'Pengguna'}</h1>
               )}

               <div className="flex items-center justify-center gap-2 mt-2">
                   <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                       userRole === 'super_admin'
                       ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                       : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                   }`}>
                       {userRole === 'super_admin' ? 'Super Admin' : profile?.role || 'Member'}
                   </span>
                   <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                       {profile?.status || 'Active'}
                   </span>
               </div>
               <p className="text-xs text-gray-400 mt-2">{currentUser?.email}</p>
           </div>

           {/* Action Buttons */}
           <div className="flex justify-center gap-3 mb-8">
              {isEditing ? (
                  <>
                      <button
                        onClick={() => { setIsEditing(false); setPreview(null); }}
                        className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
                        disabled={loading}
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 text-sm flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading && <span className="material-icons animate-spin text-sm">refresh</span>}
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                  </>
              ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 text-sm flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">edit</span>
                    Edit Profil
                  </button>
              )}
           </div>

           <div className="space-y-4">
              {/* Contact Info Card */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <div className="flex items-center gap-2 mb-4">
                     <span className="material-icons text-gray-400 text-lg">contact_page</span>
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400">Informasi Kontak</h3>
                 </div>

                 <div className="space-y-5">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
                           <span className="material-icons text-lg">phone_iphone</span>
                       </div>
                       <div className="flex-1 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                           <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Nomor Telepon</p>
                           {isEditing ? (
                               <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm w-full font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="08..."
                               />
                           ) : (
                               <p className="font-medium text-slate-800 dark:text-white text-sm">{profile?.phone || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shrink-0">
                           <span className="material-icons text-lg">location_on</span>
                       </div>
                       <div className="flex-1 border-b border-slate-50 dark:border-slate-700/50 pb-3">
                           <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Alamat Domisili</p>
                           {isEditing ? (
                               <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm w-full font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                    placeholder="Alamat Lengkap"
                                    rows="2"
                               />
                           ) : (
                               <p className="font-medium text-slate-800 dark:text-white text-sm leading-relaxed">{profile?.address || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shrink-0">
                           <span className="material-icons text-lg">event_available</span>
                       </div>
                       <div className="flex-1">
                           <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Bergabung Sejak</p>
                           <p className="font-medium text-slate-800 dark:text-white text-sm">{new Date(profile?.createdAt || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Settings Card */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <div className="flex items-center gap-2 mb-4">
                     <span className="material-icons text-gray-400 text-lg">settings</span>
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400">Pengaturan Aplikasi</h3>
                 </div>

                 <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRamadan ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            <span className="material-icons text-lg">{isRamadan ? 'nights_stay' : 'wb_sunny'}</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">Mode Ramadan</p>
                            <p className="text-xs text-slate-500">Tampilkan jadwal sholat & tema khusus</p>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isRamadan}
                            onChange={() => setIsRamadan(!isRamadan)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                    </label>
                 </div>
              </div>

              {/* Logout Button */}
              {!isEditing && (
                <button
                    onClick={handleLogout}
                    className="w-full py-4 mt-6 text-red-600 font-semibold bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                >
                    <span className="material-icons group-hover:-translate-x-1 transition-transform">logout</span>
                    Keluar Aplikasi
                </button>
              )}

              <div className="h-8"></div>
           </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;
