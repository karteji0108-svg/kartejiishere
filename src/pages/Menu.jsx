import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { userRole } = useAuth();


  const sections = [
    {
      title: "Utama",
      items: [
        { to: '/activities', icon: 'event', label: 'Kegiatan', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
        { to: '/gallery', icon: 'photo_library', label: 'Galeri', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/30' },
        { to: '/members', icon: 'groups', label: 'Anggota', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { to: '/kartu-anggota', icon: 'badge', label: 'Kartu Anggota', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },

      ]
    },
    {
      title: "Administrasi",
      items: [
        { to: '/correspondence', icon: 'folder_shared', label: 'Surat & Adm', desc: 'Arsip & Dokumen', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
        { to: '/inventory', icon: 'inventory_2', label: 'Inventaris', desc: 'Aset Organisasi', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                { to: '/absensi', icon: 'history_toggle_off', label: 'Riwayat Absensi', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30', allowed: ['super_admin', 'sekretaris', 'admin'] },
        { to: '/scan-barcode', icon: 'qr_code_scanner', label: 'Scan Barcode', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', allowed: ['super_admin', 'sekretaris', 'admin'] },


        { to: '/partners', icon: 'handshake', label: 'Kemitraan', desc: 'Sponsor & Relasi', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
      ]
    },
    {
      title: "Lainnya",
      items: [
        { to: '/social-media', icon: 'public', label: 'Sosial Media', desc: 'Instagram & TikTok', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
        { to: '/profile', icon: 'settings', label: 'Pengaturan', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
      ]
    }
  ];

  return (
    <div className={`app-container `}>
      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 pt-safe pb-4 sticky top-0 z-20">
        <h1 className="text-h2 text-slate-900 dark:text-white">Menu</h1>
        <p className="text-caption">Pusat Navigasi</p>
      </header>

      <main className="main-content px-6 pt-6 pb-32 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-1">{section.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {section.items.filter(item => !item.allowed || (userRole && item.allowed.includes(userRole))).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`card p-5 flex flex-col justify-center items-start gap-3 hover:scale-[1.02] active:scale-95 transition-all group ${section.items.length === 1 && section.title !== 'Lainnya' ? 'col-span-2 flex-row items-center !justify-start' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} group-hover:shadow-lg transition-shadow`}>
                    <span className="material-icons-round text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-800 dark:text-white block">{item.label}</span>
                    {item.desc && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.desc}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Menu;
