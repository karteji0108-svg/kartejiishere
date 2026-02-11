import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
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

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-screen flex flex-col relative">

        {/* Header/Cover */}
        <div className="h-40 bg-gradient-to-r from-primary to-blue-400 relative">
           <div className="absolute -bottom-10 left-6">
              {profile?.photoURL ? (
                 <img src={profile.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-md" />
              ) : (
                 <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                    {getInitials(profile?.fullName || currentUser?.email)}
                 </div>
              )}
           </div>
        </div>

        {/* Content */}
        <div className="pt-14 px-6 pb-24 flex-1 overflow-y-auto">
           <div className="flex justify-between items-start">
              <div>
                 <h1 className="text-2xl font-bold">{profile?.fullName || 'Pengguna'}</h1>
                 <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.role || 'Anggota'} • {profile?.status || 'Active'}</p>
                 <p className="text-xs text-gray-400 mt-1">{currentUser?.email}</p>
              </div>
              <button className="text-primary text-sm font-semibold border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                 Edit
              </button>
           </div>

           <div className="mt-8 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                 <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-gray-500">Informasi Pribadi</h3>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                       <span className="text-gray-500">Telepon</span>
                       <span>{profile?.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                       <span className="text-gray-500">Alamat</span>
                       <span className="text-right max-w-[200px] truncate">{profile?.address || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-500">Bergabung</span>
                       <span>{new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                 </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 mt-6 text-red-600 font-semibold bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                 <span className="material-icons">logout</span>
                 Keluar
              </button>
           </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;
