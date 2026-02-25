import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import Skeleton from '../components/common/Skeleton';

const Inventory = () => {
    const { userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daftar');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_INVENTORY);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(docs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getConditionColor = (cond) => {
      switch(cond) {
          case 'Baik': return 'bg-green-100 text-green-700';
          case 'Perlu Servis': return 'bg-orange-100 text-orange-700';
          case 'Rusak': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className={`app-container `}>
      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-h2">Inventaris</h1>
        </div>
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
        {loading ? <div className="space-y-4"><Skeleton className="h-24 w-full rounded-2xl"/><Skeleton className="h-24 w-full rounded-2xl"/></div> :
         activeTab === 'daftar' ? (
            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.id} className="card p-4 flex justify-between items-center group hover:scale-[1.01] transition-transform">
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

      {canManage && (
        <Link to="/inventory/add" className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      <BottomNav />
    </div>
  );
};
export default Inventory;
