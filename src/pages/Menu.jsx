import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Menu = () => {
  const { isRamadan } = useRamadan();

  const menuItems = [
    { to: '/activities', icon: 'event', label: 'Kegiatan', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { to: '/gallery', icon: 'photo_library', label: 'Galeri', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
    { to: '/correspondence', icon: 'mark_email_unread', label: 'Surat & Adm', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { to: '/inventory', icon: 'inventory_2', label: 'Inventaris', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { to: '/partners', icon: 'handshake', label: 'Kemitraan', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
    { to: '/members', icon: 'groups', label: 'Anggota', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  ];

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <header className="glass-header px-6 pt-4 pb-4">
        <h1 className="text-h1 text-slate-900 dark:text-white">Menu</h1>
        <p className="text-caption">Akses fitur lainnya</p>
      </header>

      <main className="main-content px-6 pt-6 pb-32">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:scale-[1.02] transition-transform aspect-square">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                <span className="material-icons-round text-3xl">{item.icon}</span>
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Menu;
