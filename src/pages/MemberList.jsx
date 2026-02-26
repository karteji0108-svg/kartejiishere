import React, { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import { useRamadan } from '../context/RamadanContext';

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const { isRamadan } = useRamadan();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'users');
        const querySnapshot = await getDocs(q);
        const memberData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(memberData);
      } catch (error) {
        console.error("Error fetching members: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const nameMatch = (member.fullName || member.displayName)?.toLowerCase().includes(search.toLowerCase()) || false;
    const roleMatch = member.role?.toLowerCase().includes(search.toLowerCase()) || false;

    if (!nameMatch && !roleMatch) return false;

    if (filter === 'Semua') return true;
    if (filter === 'Pengurus Inti') return ['ketua', 'wakil_ketua', 'sekretaris', 'bendahara'].includes(member.role?.toLowerCase());
    if (filter === 'Anggota Aktif') return true; // Simplified for now

    return true;
  });

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'ketua': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'wakil_ketua': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'sekretaris': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'bendahara': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'super_admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className={`font-display h-screen flex flex-col overflow-hidden relative transition-colors duration-500
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Top Status Bar Simulation (iOS) */}
      <div className="h-12 w-full shrink-0"></div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* Header Section */}
        <header className="glass-header px-5 pt-4 pb-4 sticky top-0 z-40 animate-fade-in-down safe-area-top">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Anggota</h1>
            <button className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition-colors text-primary">
              <span className="material-icons-round">filter_list</span>
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="glass-input w-full pl-10 pr-3 py-3"
              placeholder="Cari nama atau jabatan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Quick Filter Chips */}
          <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {['Semua', 'Pengurus Inti', 'Anggota Aktif'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Member List */}
        <div className="px-5 py-4 space-y-3">
          {loading ? (
             <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
             </div>
          ) : filteredMembers.length === 0 ? (
             <div className="text-center py-10 text-gray-500 animate-fade-in-up">
                <div className="w-20 h-20 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <span className="material-icons-round text-4xl text-slate-400">group_off</span>
                </div>
                Tidak ada anggota ditemukan.
             </div>
          ) : (
            filteredMembers.map((member, index) => (
              <div
                key={member.id}
                onClick={() => navigate('/members/' + member.id)}
                className="glass-card p-4 flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer animate-fade-in-up group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {member.photoURL ? (
                      <img
                        alt={`Portrait of ${member.fullName || member.displayName || 'Anggota'}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-white/50 dark:border-white/10 shadow-sm"
                        src={member.photoURL}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-2 border-white/50 dark:border-white/10 shadow-sm bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                          {getInitials(member.fullName || member.displayName)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-800 bg-emerald-500"></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{member.fullName || member.displayName || 'Anggota'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getRoleColor(member.role)}`}>
                        {member.role?.replace('_', ' ') || 'Anggota'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/20 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <span className="material-icons-round text-lg">chevron_right</span>
                </button>
              </div>
            ))
          )}

          <div className="h-24"></div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link to="/members/add" className="fixed right-5 bottom-24 bg-primary hover:bg-primary-dark text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40">
        <span className="material-icons-round text-2xl">person_add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default MemberList;
