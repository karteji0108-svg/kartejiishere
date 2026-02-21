import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import Skeleton from '../components/common/Skeleton';

const Partners = () => {
    const { userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daftar_mitra');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_PARTNERS);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'partners'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPartners(docs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`app-container `}>
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Kemitraan</h1>
        </div>
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
        {loading ? <div className="space-y-4"><Skeleton className="h-20 w-full rounded-2xl"/><Skeleton className="h-20 w-full rounded-2xl"/></div> :
         activeTab === 'daftar_mitra' ? (
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
                                {p.contact && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">call</span> {p.contact}</span>}
                                {p.email && <span className="flex items-center gap-1"><span className="material-icons-round text-[10px]">email</span> {p.email}</span>}
                            </div>
                        </div>
                    </div>
                ))}
                {partners.length === 0 && (
                    <div className="text-center py-12 opacity-50 flex flex-col items-center">
                        <span className="material-icons-round text-6xl mb-2 text-slate-300">handshake</span>
                        <p>Belum ada data mitra.</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center py-12 opacity-50 flex flex-col items-center">
                <span className="material-icons-round text-6xl mb-2 text-slate-300">history_edu</span>
                <p>Belum ada riwayat kerjasama.</p>
            </div>
        )}
      </main>

      {canManage && (
        <Link to="/partners/add" className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      <BottomNav />
    </div>
  );
};
export default Partners;
