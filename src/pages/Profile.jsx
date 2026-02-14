import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRamadan } from '../context/RamadanContext';
import { useTheme } from '../context/ThemeContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';
import BottomNav from '../components/layout/BottomNav';
import Skeleton from '../components/common/Skeleton';

const Profile = () => {
  const { currentUser, logout, userRole } = useAuth();
  const { isRamadan, toggleRamadan } = useRamadan();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      displayName: '',
      phone: '',
      address: '',
      bio: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        if (currentUser) {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                    setFormData({
                        displayName: docSnap.data().displayName || currentUser.displayName || '',
                        phone: docSnap.data().phone || '',
                        address: docSnap.data().address || '',
                        bio: docSnap.data().bio || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Gagal memuat profil.");
            } finally {
                setLoading(false);
            }
        }
    };
    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingPhoto(true);
      try {
          const photoURL = await uploadToCloudinary(file);
          await updateDoc(doc(db, 'users', currentUser.uid), { photoURL });
          // Update local state is tricky without reload or auth update,
          // but we can update profile state to reflect immediately in UI if we used that
          setProfile(prev => ({ ...prev, photoURL }));
          toast.success("Foto profil diperbarui!");
          // Reload to update Auth Context (optional, but good for consistency)
          window.location.reload();
      } catch (error) {
          console.error("Error uploading photo:", error);
          toast.error("Gagal upload foto.");
      } finally {
          setUploadingPhoto(false);
      }
  };

  const handleSave = async () => {
      setLoading(true);
      try {
          await updateDoc(doc(db, 'users', currentUser.uid), {
              displayName: formData.displayName,
              phone: formData.phone,
              address: formData.address,
              bio: formData.bio
          });
          setProfile(prev => ({ ...prev, ...formData }));
          setIsEditing(false);
          toast.success("Profil berhasil disimpan.");
      } catch (error) {
          console.error("Error updating profile:", error);
          toast.error("Gagal menyimpan profil.");
      } finally {
          setLoading(false);
      }
  };

  const handleLogout = async () => {
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        try {
            await logout();
            toast.success("Berhasil keluar.");
        } catch (error) {
            toast.error("Gagal logout.");
        }
      }
  };

  if (loading && !profile) {
      return (
        <div className={`min-h-screen font-display flex flex-col ${isRamadan ? 'bg-ramadan' : 'bg-glass-light dark:bg-glass-dark'}`}>
            <div className="p-5 space-y-4">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-60 w-full rounded-xl" />
            </div>
            <BottomNav />
        </div>
      );
  }

  return (
    <div className={`min-h-screen font-display flex flex-col relative transition-colors duration-500 overflow-hidden
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-0"></div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative z-10">

        {/* Header Profile */}
        <div className="pt-safe px-5 pb-6 text-center relative">
            <div className="relative inline-block mb-4 group">
                <div className="w-28 h-28 rounded-full p-1 glass-card flex items-center justify-center relative overflow-hidden">
                    <img
                        src={profile?.photoURL || currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName}&background=random`}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                    />
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <label className="cursor-pointer flex flex-col items-center text-white text-xs">
                                <span className="material-icons text-xl mb-1">camera_alt</span>
                                Ubah Foto
                                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                            </label>
                        </div>
                    )}
                    {uploadingPhoto && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="material-icons animate-spin text-white">refresh</span>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
                     <span className="material-icons text-sm">edit</span>
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-3 max-w-xs mx-auto">
                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="glass-input text-center text-lg font-bold w-full"
                        placeholder="Nama Lengkap"
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="glass-input text-center text-sm w-full h-20 resize-none"
                        placeholder="Tulis bio singkat..."
                    />
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-1">{profile?.displayName || currentUser?.displayName}</h2>
                    <p className="text-sm opacity-80 mb-2">{profile?.email || currentUser?.email}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-md">
                        {userRole?.replace('_', ' ')}
                    </span>
                    {profile?.bio && <p className="mt-4 text-sm opacity-90 max-w-xs mx-auto leading-relaxed">"{profile.bio}"</p>}
                </>
            )}
        </div>

        <div className="px-5 space-y-4">
            {/* Action Buttons */}
           <div className="flex gap-3">
              {isEditing ? (
                  <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 rounded-xl font-semibold glass-card hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                      >
                        {loading && <span className="material-icons animate-spin text-sm">refresh</span>}
                        {loading ? 'Menyimpan...' : 'Simpan'}
                      </button>
                  </>
              ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 rounded-xl font-semibold bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">edit</span>
                    Edit Profil
                  </button>
              )}
           </div>

           <div className="space-y-4">
              {/* Contact Info Card */}
              <div className="glass-card p-5">
                 <div className="flex items-center gap-2 mb-4">
                     <span className="material-icons text-gray-400 text-lg">contact_page</span>
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400">Informasi Kontak</h3>
                 </div>

                 <div className="space-y-5">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                           <span className="material-icons text-lg">phone_iphone</span>
                       </div>
                       <div className="flex-1 border-b border-white/10 pb-3">
                           <p className="text-[10px] opacity-60 uppercase font-bold mb-1">Nomor Telepon</p>
                           {isEditing ? (
                               <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="glass-input py-2 text-sm w-full"
                                    placeholder="08..."
                               />
                           ) : (
                               <p className="font-medium text-sm">{profile?.phone || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                           <span className="material-icons text-lg">location_on</span>
                       </div>
                       <div className="flex-1 border-b border-white/10 pb-3">
                           <p className="text-[10px] opacity-60 uppercase font-bold mb-1">Alamat Domisili</p>
                           {isEditing ? (
                               <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="glass-input py-2 text-sm w-full resize-none"
                                    placeholder="Alamat Lengkap"
                                    rows="2"
                               />
                           ) : (
                               <p className="font-medium text-sm leading-relaxed">{profile?.address || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                           <span className="material-icons text-lg">event_available</span>
                       </div>
                       <div className="flex-1">
                           <p className="text-[10px] opacity-60 uppercase font-bold mb-1">Bergabung Sejak</p>
                           <p className="font-medium text-sm">{new Date(profile?.createdAt?.toDate() || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Settings Card */}
              <div className="glass-card p-5">
                 <div className="flex items-center gap-2 mb-4">
                     <span className="material-icons text-gray-400 text-lg">settings</span>
                     <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-400">Pengaturan Aplikasi</h3>
                 </div>

                 <div className="space-y-4">
                     {/* Ramadan Toggle */}
                     <div className="flex items-center justify-between py-2 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRamadan ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                <span className="material-icons text-lg">{isRamadan ? 'nights_stay' : 'wb_sunny'}</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Mode Ramadan</p>
                                <p className="text-xs opacity-60">Tampilkan jadwal sholat & tema khusus</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isRamadan}
                                onChange={toggleRamadan}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                        </label>
                     </div>

                     {/* Dark Mode Toggle */}
                     <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-slate-100 text-slate-500'}`}>
                                <span className="material-icons text-lg">dark_mode</span>
                            </div>
                            <div>
                                <p className="font-medium text-sm">Mode Gelap</p>
                                <p className="text-xs opacity-60">Tampilan nyaman untuk mata</p>
                            </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={theme === 'dark'}
                                onChange={toggleTheme}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                     </div>
                 </div>
              </div>

              {/* Logout Button */}
              {!isEditing && (
                <button
                    onClick={handleLogout}
                    className="w-full py-4 mt-6 text-red-600 font-semibold bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 group border border-red-500/20"
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
