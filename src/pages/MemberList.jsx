import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const MemberList = () => {
  const { userRole } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const canManage = ['admin', 'ketua', 'wakil_ketua', 'sekretaris', 'super_admin'].includes(userRole);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, 'users'), where('status', '==', 'active'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Client-side sort
        fetched.sort((a, b) => (a.fullName || a.displayName || '').localeCompare(b.fullName || b.displayName || ''));
        setMembers(fetched);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return members.filter(member => {
       const name = member.fullName || member.displayName || '';
       const email = member.email || '';
       return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
    });
  }, [members, search]);

  return (
    <div className="min-h-screen bg-glass-light dark:bg-glass-dark pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 glass-header px-6 py-4 flex justify-between items-center border-b border-white/20 dark:border-white/10 shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Anggota
          </h1>
          {canManage && (
            <Link to="/members/add" className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                <span className="material-icons text-xl">person_add</span>
            </Link>
          )}
      </div>

       {/* Search */}
       <div className="px-6 py-4">
        <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
                type="text"
                placeholder="Cari anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm backdrop-blur-sm transition-all"
            />
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-3">
         {loading ? (
             [1,2,3,4,5].map(i => (
                 <div key={i} className="glass-card p-3 flex items-center gap-4 animate-pulse">
                     <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                     <div className="flex-1 space-y-2">
                         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                     </div>
                 </div>
             ))
         ) : filteredMembers.length > 0 ? (
             filteredMembers.map(member => (
                 <Link to={`/members/${member.id}`} key={member.id} className="glass-card p-3 flex items-center gap-4 group active:scale-[0.99] transition-transform hover:bg-white/60 dark:hover:bg-black/40">
                     <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden shrink-0 border border-indigo-200 dark:border-indigo-800">
                         {member.photoURL ? (
                             <img src={member.photoURL} alt={member.fullName} className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-indigo-400">
                                 <span className="material-icons">person</span>
                             </div>
                         )}
                     </div>
                     <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">{member.fullName || member.displayName || 'Tanpa Nama'}</h3>
                         <p className="text-xs text-slate-500 truncate">{member.email}</p>
                         <div className="flex gap-2 mt-1">
                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize border border-slate-200 dark:border-slate-700">
                                 {member.role?.replace('_', ' ') || 'Anggota'}
                             </span>
                         </div>
                     </div>
                     <span className="material-icons text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                 </Link>
             ))
         ) : (
             <div className="text-center py-12">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                     <span className="material-icons text-3xl">person_off</span>
                 </div>
                 <p className="text-gray-500 text-sm">Tidak ada anggota ditemukan.</p>
             </div>
         )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MemberList;
