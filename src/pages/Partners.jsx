import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Partners = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daftar_mitra');

  const partners = [
    { id: 1, name: 'Pemerintah Desa', type: 'Instansi', contact: '081234567890', email: 'desa@mail.com' },
    { id: 2, name: 'Toko Bangunan Sejahtera', type: 'Sponsor', contact: '081987654321', email: '-' },
    { id: 3, name: 'Karang Taruna Kecamatan', type: 'Organisasi', contact: '-', email: 'kt_kec@mail.com' },
  ];

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Kemitraan</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['daftar_mitra', 'riwayat_kerjasama'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                        activeTab === tab
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white/40 dark:bg-black/40 text-slate-600 dark:text-slate-300'
                    }`}
                >
                    {tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
            ))}
        </div>
      </header>

      <main className="main-content px-6 pt-6 pb-24">
        {activeTab === 'daftar_mitra' ? (
            <div className="space-y-4">
                {partners.map(p => (
                    <div key={p.id} className="glass-card p-5 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                        <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 font-bold text-xl">
                            {p.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                            <span className="text-[10px] uppercase font-bold bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {p.type}
                            </span>
                            <div className="flex gap-3 mt-2 text-xs opacity-70">
                                {p.contact !== '-' && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">call</span> {p.contact}</span>}
                                {p.email !== '-' && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">email</span> {p.email}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 opacity-50">
                <span className="material-icons-round text-4xl mb-2">handshake</span>
                <p>Belum ada riwayat kerjasama.</p>
            </div>
        )}
      </main>

      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-icons-round text-2xl">add</span>
      </button>

      <BottomNav />
    </div>
  );
};
export default Partners;
