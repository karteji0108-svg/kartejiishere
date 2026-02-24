import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import Skeleton from '../components/common/Skeleton';

const Correspondence = () => {
    const { userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('surat_masuk');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const DRIVE_LINK = "https://drive.google.com/drive/u/0/folders/1Ufy-BLck2pHqFkhpnPMaTIlRpcXcqolx";
  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_CORRESPONDENCE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'correspondence'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
      } catch (error) {
        console.error("Error fetching correspondence:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) return <div className="space-y-3"><Skeleton className="h-20 w-full rounded-2xl"/><Skeleton className="h-20 w-full rounded-2xl"/></div>;

    switch (activeTab) {
      case 'surat_masuk':
      case 'surat_keluar':
        const type = activeTab === 'surat_masuk' ? 'surat_masuk' : 'surat_keluar'; // Fixed type matching
        const filtered = data.filter(l => l.type === type);
        return (
          <div className="space-y-3">
            {filtered.map(l => (
              <div key={l.id} className="glass-card p-4 flex gap-4 items-start group hover:bg-white/40 dark:hover:bg-black/30 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type === 'surat_masuk' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                  <span className="material-icons-round">{type === 'surat_masuk' ? 'move_to_inbox' : 'outbox'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono opacity-60 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{l.no}</span>
                    <span className="text-[10px] opacity-60">{l.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">{l.title}</h4>
                  <p className="text-sm opacity-70 truncate">{type === 'surat_masuk' ? `Dari: ${l.sender}` : `Kpd: ${l.receiver}`}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
                <div className="text-center py-12 opacity-50 flex flex-col items-center">
                    <span className="material-icons-round text-6xl mb-2 text-slate-300">mail_outline</span>
                    <p>Belum ada data.</p>
                </div>
            )}
          </div>
        );
      case 'arsip':
        const archives = data.filter(l => l.type === 'arsip');
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
    <div className={`app-container `}>
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Surat & Adm</h1>
        </div>
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

      {canManage && (
        <Link to="/correspondence/add" className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      <BottomNav />
    </div>
  );
};
export default Correspondence;
