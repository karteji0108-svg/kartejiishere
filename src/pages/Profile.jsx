import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { formatDate } from '../utils/date';
import BottomNav from '../components/layout/BottomNav';

const Profile = () => {
  const { currentUser, logout, userRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
      phone: '',
      address: '',
      bio: '',
      displayName: '' // Allow editing display name if needed
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
          await updateDoc(docRef, {
              phone: formData.phone,
              address: formData.address,
              bio: formData.bio,
              displayName: formData.displayName
              // status: 'active' // Don't allow changing status here
          });
          setUserProfile(prev => ({ ...prev, ...formData }));
          setIsEditing(false);
      } catch (e) {
          console.error("Error updating profile", e);
          alert("Gagal menyimpan profil");
      } finally {
          setLoading(false);
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
    <div className="min-h-screen font-display flex flex-col bg-glass-light dark:bg-glass-dark">
      {/* Header Profile Section */}
      <div className="relative pb-10 rounded-b-[2.5rem] overflow-hidden bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100 shadow-xl z-10 transition-colors duration-500">

        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 opacity-50"></div>

        {/* Top Bar */}
        <div className="relative z-10 flex justify-between items-center px-6 py-4">
             <h1 className="text-lg font-bold">Profil Saya</h1>
             <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                <span className="material-icons text-primary dark:text-white">person</span>
             </div>
        </div>

        {/* Avatar & Name */}
        <div className="relative z-10 flex flex-col items-center mt-4">
            <div className="relative group cursor-pointer">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-400 shadow-xl overflow-hidden">
                    <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white">
                        {displayProfile.photoURL ? (
                            <img src={displayProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="material-icons text-5xl">person</span>
                            </div>
                        )}
                    </div>
                </div>
                 {/* Role Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {userRole?.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="mt-4 text-center px-6">
                {isEditing ? (
                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="text-center bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary outline-none font-bold text-xl w-full"
                        placeholder="Nama Lengkap"
                    />
                ) : (
                    <h2 className="text-2xl font-bold">{displayProfile.displayName || 'Tanpa Nama'}</h2>
                )}

                <p className="text-sm opacity-70 mt-1 font-medium">{displayProfile.email}</p>

                {/* Bio */}
                 <div className="mt-4 max-w-xs mx-auto">
                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full text-center bg-white/50 dark:bg-black/20 rounded-xl p-2 text-sm resize-none focus:ring-2 ring-primary/50 outline-none"
                            placeholder="Tulis bio singkat..."
                            rows="2"
                        />
                    ) : (
                         displayProfile.bio && <p className="text-sm italic opacity-80 line-clamp-2 max-w-[250px] mx-auto leading-relaxed">"{displayProfile.bio}"</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 -mt-6 pt-10 relative z-0">
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
                               <p className="font-medium text-sm">{displayProfile.phone || '-'}</p>
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
                               <p className="font-medium text-sm leading-relaxed">{displayProfile.address || '-'}</p>
                           )}
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                           <span className="material-icons text-lg">event_available</span>
                       </div>
                       <div className="flex-1">
                           <p className="text-[10px] opacity-60 uppercase font-bold mb-1">Bergabung Sejak</p>
                           <p className="font-medium text-sm">{formatDate(displayProfile.createdAt)}</p>
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
