import React, { useState, useEffect, useMemo } from 'react';
import BottomNav from '../components/BottomNav';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

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

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const nameMatch = member.fullName?.toLowerCase().includes(search.toLowerCase()) || false;
      const roleMatch = member.role?.toLowerCase().includes(search.toLowerCase()) || false;

      if (!nameMatch && !roleMatch) return false;

      if (filter === 'Semua') return true;
      if (filter === 'Pengurus Inti') return ['ketua', 'wakil ketua', 'sekretaris', 'bendahara'].includes(member.role?.toLowerCase());
      if (filter === 'Anggota Aktif') return member.status === 'active';

      return true;
    });
  }, [members, search, filter]);

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'ketua': return 'bg-primary/10 text-primary';
      case 'sekretaris': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'bendahara': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white h-screen flex flex-col overflow-hidden relative">
      {/* Top Status Bar Simulation (iOS) */}
      <div className="h-12 w-full bg-white dark:bg-gray-900 flex items-center justify-between px-6 text-xs font-medium z-50 sticky top-0 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <span className="w-12 text-center">9:41</span>
        <div className="flex space-x-2 items-center">
          <span className="material-icons text-[16px]">signal_cellular_alt</span>
          <span className="material-icons text-[16px]">wifi</span>
          <span className="material-icons text-[16px] rotate-180">battery_full</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* Header Section */}
        <header className="bg-white dark:bg-gray-900 px-5 pt-4 pb-4 sticky top-0 z-40 shadow-sm animate-fade-in-down">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Daftar Anggota</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
              <span className="material-icons">filter_list</span>
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-xl">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Cari nama atau jabatan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Quick Filter Chips */}
          <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar">
            {['Semua', 'Pengurus Inti', 'Anggota Aktif'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
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
             <>
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
             </>
          ) : filteredMembers.length === 0 ? (
             <div className="text-center py-10 text-gray-500 animate-fade-in-up">
                Tidak ada anggota ditemukan.
             </div>
          ) : (
            filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className={`group relative bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer animate-fade-in-up ${member.status === 'inactive' ? 'opacity-75' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {member.photoURL ? (
                      <img
                        alt={`Portrait of ${member.fullName}`}
                        className={`h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm ${member.status === 'inactive' ? 'grayscale' : ''}`}
                        src={member.photoURL}
                      />
                    ) : (
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-2 border-white dark:border-gray-800 shadow-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300`}>
                          {getInitials(member.fullName)}
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{member.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                        {member.role || 'Anggota'}
                      </span>
                      {member.phone && <span className="text-xs text-gray-500 dark:text-gray-400">{member.phone}</span>}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-primary transition-colors p-2 -mr-2">
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            ))
          )}
          {/* Spacing for last item if list is long */}
          <div className="h-24"></div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link to="/members/add" className="fixed right-5 bottom-24 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40">
        <span className="material-icons">add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default MemberList;
