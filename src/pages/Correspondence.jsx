import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useRamadan } from '../context/RamadanContext';

const Correspondence = () => {
  const { isRamadan } = useRamadan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('surat_masuk');

  const DRIVE_LINK = "https://drive.google.com/drive/u/0/folders/1Ufy-BLck2pHqFkhpnPMaTIlRpcXcqolx";

  // Empty Data
  const letters = [];
  const archives = [];

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
                {/* Item content would go here */}
              </div>
            ))}
            {filtered.length === 0 && (
                <div className="text-center py-12 opacity-50 flex flex-col items-center">
                    <span className="material-icons-round text-6xl mb-2 text-slate-300">mail_outline</span>
                    <p>Belum ada surat {type === 'in' ? 'masuk' : 'keluar'}.</p>
                </div>
            )}
          </div>
        );
      case 'arsip':
        return (
          <div className="grid grid-cols-2 gap-3">
            {archives.length === 0 && (
                <div className="col-span-2 text-center py-12 opacity-50 flex flex-col items-center">
                    <span className="material-icons-round text-6xl mb-2 text-slate-300">folder_open</span>
                    <p>Belum ada arsip dokumen.</p>
                </div>
            )}
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
        {/* Drive Link Button - Prominent */}
        <a
            href={DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-4 mb-4 flex items-center justify-between group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-l-4 border-blue-500"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <span className="material-icons-round">add_to_drive</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Google Drive Arsip</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Simpan & Akses Dokumen</p>
                </div>
            </div>
            <span className="material-icons-round text-slate-400 group-hover:text-blue-500">open_in_new</span>
        </a>

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
