import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Correspondence = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('surat_masuk');

  // Mock Data
  const letters = [
    { id: 1, type: 'in', no: '001/KT/I/2024', title: 'Undangan Rapat Desa', sender: 'Kepala Desa', date: '2024-02-10', status: 'read' },
    { id: 2, type: 'in', no: '002/KT/I/2024', title: 'Proposal Sponsor', sender: 'PT. Maju Jaya', date: '2024-02-12', status: 'unread' },
    { id: 3, type: 'out', no: '001/KT-OUT/I/2024', title: 'Permohonan Izin Kegiatan', receiver: 'Polsek', date: '2024-02-15', status: 'sent' },
  ];

  const archives = [
    { id: 1, title: 'LPJ Agustusan 2023', category: 'LPJ', date: '2023-09-01' },
    { id: 2, title: 'SK Pengurus 2024', category: 'SK', date: '2024-01-01' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'surat_masuk':
      case 'surat_keluar':
        const type = activeTab === 'surat_masuk' ? 'in' : 'out';
        const filtered = letters.filter(l => l.type === type);
        return (
          <div className="space-y-3">
            {filtered.map(l => (
              <div key={l.id} className="glass-card p-4 flex gap-4 items-start group hover:bg-white/40 dark:hover:bg-black/30 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type === 'in' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  <span className="material-icons-round">{type === 'in' ? 'move_to_inbox' : 'outbox'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono opacity-60 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{l.no}</span>
                    <span className="text-[10px] opacity-60">{l.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{l.title}</h4>
                  <p className="text-sm opacity-70 truncate">{type === 'in' ? `Dari: ${l.sender}` : `Kpd: ${l.receiver}`}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-center opacity-50 py-10">Belum ada surat.</p>}
          </div>
        );
      case 'arsip':
        return (
          <div className="grid grid-cols-2 gap-3">
            {archives.map(a => (
              <div key={a.id} className="glass-card p-4 flex flex-col gap-2 hover:bg-white/40 dark:hover:bg-black/30">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <span className="material-icons-round">description</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm truncate">{a.title}</h4>
                  <p className="text-xs opacity-60">{a.category} • {a.date}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Surat & Adm</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['surat_masuk', 'surat_keluar', 'arsip'].map(tab => (
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
        {renderContent()}
      </main>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-icons-round text-2xl">add</span>
      </button>

      <BottomNav />
    </div>
  );
};
export default Correspondence;
