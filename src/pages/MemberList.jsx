import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const MemberList = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const canManage = ['admin', 'ketua', 'wakil_ketua', 'sekretaris', 'super_admin'].includes(userRole);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch all users to include legacy users (no status field)
        // We cannot use where('status', '==', 'active') because it excludes missing status
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);

        const fetched = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Normalize status: treat missing as 'active' (legacy)
          const status = data.status || 'active';
          return {
            id: doc.id,
            ...data,
            status: status
          };
        })
        .filter(user => user.status === 'active'); // Only show active users

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


  const downloadCSV = () => {
    if (members.length === 0) return;

    const headers = ['Nama Lengkap', 'Email', 'Role', 'Status'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    members.forEach(member => {
        const name = `"${(member.fullName || member.displayName || '').replace(/"/g, '""')}"`;
        const email = `"${(member.email || '').replace(/"/g, '""')}"`;
        const role = member.role || 'anggota';
        const status = member.status || 'active';

        csvRows.push([name, email, role, status].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Data_Anggota_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return members.filter(member => {
       const name = member.fullName || member.displayName || '';
       const email = member.email || '';
       return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
    });
  }, [members, search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-display">
       {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center shadow-sm transition-colors">
          <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <span className="material-icons-round text-xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Anggota
              </h1>
          </div>
          <div className="flex gap-2">
              <button onClick={downloadCSV} className="bg-white dark:bg-gray-800 text-primary border border-primary/20 hover:bg-primary/5 w-9 h-9 flex items-center justify-center rounded-full shadow-sm transition-colors">
                  <span className="material-icons-round text-lg">download</span>
              </button>
              {canManage && (
                <Link to="/members/add" className="bg-primary text-white w-9 h-9 flex items-center justify-center rounded-full shadow-lg shadow-primary/30 hover:scale-110 transition-transform active:scale-95">
                    <span className="material-icons-round text-lg">person_add</span>
                </Link>
              )}
          </div>
      </div>

       {/* Search */}
       <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 sticky top-[73px] z-30">
        <div className="relative group">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            <input
                type="text"
                placeholder="Cari anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm shadow-sm transition-all text-gray-900 dark:text-white placeholder-gray-400"
            />
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-3">
         {loading ? (
             [1,2,3,4,5].map(i => (
                 <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 animate-pulse border border-gray-100 dark:border-gray-700">
                     <Skeleton className="w-12 h-12 rounded-full" />
                     <div className="flex-1 space-y-2">
                         <Skeleton className="h-4 w-1/2 rounded" />
                         <Skeleton className="h-3 w-1/3 rounded" />
                     </div>
                 </div>
             ))
         ) : filteredMembers.length > 0 ? (
             filteredMembers.map(member => (
                 <Link to={`/members/${member.id}`} key={member.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 group active:scale-[0.98] transition-all shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30">
                     <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden shrink-0 border border-indigo-100 dark:border-indigo-800/50 relative">
                         {member.photoURL ? (
                             <img src={member.photoURL} alt={member.fullName} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center text-indigo-300 dark:text-indigo-400">
                                 <span className="material-icons-round">person</span>
                             </div>
                         )}
                     </div>
                     <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm mb-0.5 group-hover:text-primary transition-colors">{member.fullName || member.displayName || 'Tanpa Nama'}</h3>
                         <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                         <div className="flex gap-2 mt-1.5">
                             <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium capitalize tracking-wide">
                                 {member.role?.replace('_', ' ') || 'Anggota'}
                             </span>
                         </div>
                     </div>
                     <span className="material-icons-round text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary transition-colors -mr-1">chevron_right</span>
                 </Link>
             ))
         ) : (
             <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                     <span className="material-icons-round text-3xl">person_off</span>
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tidak ada anggota ditemukan.</p>
             </div>
         )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MemberList;
