import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Inventory = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daftar');

  // Empty Data
  const items = [];

  const getConditionColor = (cond) => {
      switch(cond) {
          case 'Baik': return 'bg-green-100 text-green-700';
          case 'Perlu Servis': return 'bg-orange-100 text-orange-700';
          case 'Rusak': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Inventaris</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['daftar', 'riwayat_pemakaian'].map(tab => (
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
        {activeTab === 'daftar' ? (
            <div className="space-y-4">
                {items.length === 0 && (
                    <div className="text-center py-12 opacity-50 flex flex-col items-center">
                        <span className="material-icons-round text-6xl mb-2 text-slate-300">inventory_2</span>
                        <p>Belum ada data inventaris.</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center py-12 opacity-50 flex flex-col items-center">
                <span className="material-icons-round text-6xl mb-2 text-slate-300">history</span>
                <p>Belum ada riwayat pemakaian.</p>
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
export default Inventory;
