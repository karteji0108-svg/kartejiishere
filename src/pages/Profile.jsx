import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db, auth } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { formatDate } from '../utils/date';
import { uploadToCloudinary } from '../utils/cloudinary';
import BottomNav from '../components/layout/BottomNav';
import DigitalCard from '../components/members/DigitalCard';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { currentUser, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
      phone: '',
      address: '',
      bio: '',
      displayName: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserProfile(data);
                setFormData({
                    phone: data.phone || '',
                    address: data.address || '',
                    bio: data.bio || '',
                    displayName: data.displayName || currentUser.displayName || ''
                });
            }
        } catch (e) {
            console.error("Error fetching profile", e);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
      setLoading(true);
      try {
          const docRef = doc(db, 'users', currentUser.uid);

          // Update Firestore
          await updateDoc(docRef, {
              phone: formData.phone,
              address: formData.address,
              bio: formData.bio,
              displayName: formData.displayName
          });

          // Update Firebase Auth Profile (displayName)
          if (auth.currentUser && formData.displayName !== auth.currentUser.displayName) {
              await updateProfile(auth.currentUser, {
                  displayName: formData.displayName
              });
          }

          setUserProfile(prev => ({ ...prev, ...formData }));
          setIsEditing(false);
          toast.success('Profil berhasil diperbarui');
      } catch (e) {
          console.error("Error updating profile", e);
          toast.error("Gagal menyimpan profil");
      } finally {
          setLoading(false);
      }
  };

  const handlePhotoClick = () => {
      if (isEditing) {
          fileInputRef.current.click();
      }
  };

  const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingPhoto(true);
      try {
          // Upload to Cloudinary
          const photoURL = await uploadToCloudinary(file);

          // Update Firestore
          const docRef = doc(db, 'users', currentUser.uid);
          await updateDoc(docRef, { photoURL });

          // Update Firebase Auth Profile
          if (auth.currentUser) {
              await updateProfile(auth.currentUser, { photoURL });
          }

          // Update Local State
          setUserProfile(prev => ({ ...prev, photoURL }));
          toast.success('Foto profil berhasil diperbarui');

      } catch (error) {
          console.error("Error uploading photo:", error);
          toast.error("Gagal mengunggah foto");
      } finally {
          setUploadingPhoto(false);
      }
  };

  // Fallback display
  const displayProfile = userProfile || {
      displayName: currentUser?.displayName,
      email: currentUser?.email,
      photoURL: currentUser?.photoURL,
      role: 'anggota',
      createdAt: new Date()
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Profile Section */}
      <div className="relative pb-10 rounded-b-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-xl z-10 transition-colors duration-500">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>

        {/* Top Bar */}
        <div className="relative z-10 flex justify-between items-center px-6 py-6">
             <h1 className="text-xl font-bold tracking-tight">Profil Saya</h1>
             <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors">
                <span className="material-icons-round text-blue-600 dark:text-blue-400">person</span>
             </div>
        </div>

        {/* Avatar & Name */}
        <div className="relative z-10 flex flex-col items-center mt-4">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-2xl overflow-hidden relative">
                    <div className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 relative">
                        {uploadingPhoto ? (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                                 <span className="material-icons-round animate-spin text-white">refresh</span>
                             </div>
                        ) : null}

                        {displayProfile.photoURL ? (
                            <img src={displayProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                                <span className="material-icons-round text-6xl">person</span>
                            </div>
                        )}

                        {/* Edit Overlay */}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-icons-round text-white text-3xl">add_a_photo</span>
                            </div>
                        )}
                    </div>
                </div>
                 {/* Role Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                        {userRole?.replace('_', ' ')}
                    </span>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            <div className="mt-6 text-center px-6 w-full max-w-md">
                {isEditing ? (
                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none font-bold text-2xl w-full text-gray-900 dark:text-white transition-colors"
                        placeholder="Nama Lengkap"
                    />
                ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayProfile.displayName || 'Tanpa Nama'}</h2>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{displayProfile.email}</p>

                {/* Bio */}
                 <div className="mt-4 max-w-xs mx-auto">
                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full text-center bg-white dark:bg-gray-700/50 rounded-xl p-3 text-sm resize-none focus:ring-2 ring-blue-500/50 outline-none border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                            placeholder="Tulis bio singkat..."
                            rows="2"
                        />
                    ) : (
                         displayProfile.bio && <p className="text-sm italic text-gray-600 dark:text-gray-400 line-clamp-2 max-w-[250px] mx-auto leading-relaxed">"{displayProfile.bio}"</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 -mt-6 pt-10 relative z-0">
        <div className="px-5 space-y-5 max-w-lg mx-auto md:max-w-4xl">
            {/* Action Buttons */}
           <div className="flex gap-3">
              {isEditing ? (
                  <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3.5 rounded-xl font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl font-semibold bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        {loading && <span className="material-icons-round animate-spin text-sm">refresh</span>}
                        {loading ? 'Menyimpan...' : 'Simpan'}
                      </button>
                  </>
              ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3.5 rounded-xl font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-round text-gray-500 dark:text-gray-400">edit</span>
                    Edit Profil
                  </button>
              )}
           </div>

           <div className="space-y-4">
              {/* Contact Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2.5 mb-6">
                     <span className="material-icons-round text-blue-500 text-xl">contact_page</span>
                     <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Informasi Kontak</h3>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                           <span className="material-icons-round text-lg">phone_iphone</span>
                       </div>
                       <div className="flex-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                           <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1.5">Nomor Telepon</p>
                           {isEditing ? (
                               <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors dark:text-white"
                                    placeholder="08..."
                               />
                           ) : (
                               <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{displayProfile.phone || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                           <span className="material-icons-round text-lg">location_on</span>
                       </div>
                       <div className="flex-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                           <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1.5">Alamat Domisili</p>
                           {isEditing ? (
                               <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors dark:text-white"
                                    placeholder="Alamat Lengkap"
                                    rows="2"
                               />
                           ) : (
                               <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{displayProfile.address || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                           <span className="material-icons-round text-lg">event_available</span>
                       </div>
                       <div className="flex-1">
                           <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1.5">Bergabung Sejak</p>
                           <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{formatDate(displayProfile.createdAt)}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Settings Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2.5 mb-6">
                     <span className="material-icons-round text-gray-400 text-xl">settings</span>
                     <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Pengaturan Aplikasi</h3>
                 </div>

                 <div className="space-y-4">

                     {/* Dark Mode Toggle */}
                     <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                <span className="material-icons-round text-lg">dark_mode</span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Mode Gelap</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Tampilan nyaman untuk mata</p>
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
                    className="w-full py-4 mt-6 text-red-600 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 group border border-red-100 dark:border-red-900/20"
                >
                    <span className="material-icons-round group-hover:-translate-x-1 transition-transform">logout</span>
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
