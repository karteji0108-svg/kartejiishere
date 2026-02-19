import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Inventory = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daftar');

  const items = [
    { id: 1, name: 'Tenda Pleton', condition: 'Baik', location: 'Gudang Desa', qty: 2 },
    { id: 2, name: 'Sound System', condition: 'Perlu Servis', location: 'Sekretariat', qty: 1 },
    { id: 3, name: 'Kursi Plastik', condition: 'Baik', location: 'Gudang Desa', qty: 50 },
  ];

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
                {items.map(item => (
                    <div key={item.id} className="glass-card p-4 flex justify-between items-center group hover:scale-[1.01] transition-transform">
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                            <p className="text-xs opacity-70 mb-2">Lokasi: {item.location}</p>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${getConditionColor(item.condition)}`}>
                                {item.condition}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold block">{item.qty}</span>
                            <span className="text-[10px] opacity-60">Unit</span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 opacity-50">
                <span className="material-icons-round text-4xl mb-2">history</span>
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
