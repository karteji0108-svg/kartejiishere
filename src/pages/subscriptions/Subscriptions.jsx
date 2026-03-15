import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/Skeleton';
import { formatCurrency } from '../../utils/currency';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, hasRole } = useAuth();

  useEffect(() => {
    // This is just a basic implementation for example purposes
    const q = query(collection(db, 'subscriptions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubscriptions(subsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching subscriptions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-4"><Skeleton className="h-20 w-full mb-4" count={3} /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Iuran Anggota</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manajemen iuran bulanan anggota</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Daftar Iuran</h2>
        {subscriptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada data iuran.</p>
        ) : (
          <div className="space-y-4">
            {subscriptions.map(sub => (
              <div key={sub.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-semibold">{sub.memberId}</p>
                  <p className="text-sm text-gray-500">{sub.month} {sub.year}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(sub.amount || 0)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sub.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
