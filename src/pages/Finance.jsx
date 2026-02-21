import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../utils/currency';
import { formatDate } from '../utils/date';
import BottomNav from '../components/layout/BottomNav';
import Skeleton from '../components/common/Skeleton';

const Finance = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);

  // Updated Roles
  const canManage = ['super_admin', 'bendahara'].includes(userRole);
  const canView = ['super_admin', 'bendahara', 'ketua', 'wakil_ketua'].includes(userRole);

  useEffect(() => {
    if (!canView) {
        navigate('/dashboard');
        return;
    }

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'finance'), orderBy('date', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);

        // Calculate Summary
        const allQ = query(collection(db, 'finance'));
        const allSnap = await getDocs(allQ);
        let inc = 0, exp = 0;
        allSnap.forEach(doc => {
            const d = doc.data();
            const amt = parseFloat(d.amount);
            if (d.type === 'income') inc += amt;
            else if (d.type === 'expense') exp += amt;
        });
        setSummary({
            income: inc,
            expense: exp,
            balance: inc - exp
        });

      } catch (err) {
        console.error("Error fetching finance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, navigate, canView]);

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-glass-light dark:bg-glass-dark pb-24 font-display">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-header px-6 py-4 flex justify-between items-center border-b border-white/20 dark:border-white/10 shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Keuangan
          </h1>
          {canManage && (
            <Link to="/finance/add" className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
                <span className="material-icons text-xl">add</span>
            </Link>
          )}
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/30 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

             <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium mb-1">Saldo Kas Saat Ini</p>
                {loading ? (
                    <div className="h-10 w-48 bg-white/20 rounded animate-pulse"></div>
                ) : (
                    <h2 className="text-3xl font-bold font-mono tracking-tight">{formatCurrency(summary.balance)}</h2>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                        <div className="flex items-center gap-1 text-emerald-300 text-xs mb-1">
                            <span className="material-icons text-sm">arrow_downward</span>
                            Pemasukan
                        </div>
                        <p className="font-semibold">{loading ? '...' : formatCurrency(summary.income)}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                        <div className="flex items-center gap-1 text-red-300 text-xs mb-1">
                            <span className="material-icons text-sm">arrow_upward</span>
                            Pengeluaran
                        </div>
                        <p className="font-semibold">{loading ? '...' : formatCurrency(summary.expense)}</p>
                    </div>
                </div>
             </div>
        </div>

        {/* Recent Transactions */}
        <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">Transaksi Terakhir</h3>
            <div className="space-y-3">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="glass-card p-4 animate-pulse flex justify-between items-center">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/3 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/4 rounded"></div>
                        </div>
                    ))
                ) : transactions.length > 0 ? (
                    transactions.map(trx => (
                        <Link to={`/finance/${trx.id}`} key={trx.id} className="glass-card p-4 flex justify-between items-center group active:scale-[0.99] transition-transform">
                             <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    <span className="material-icons">{trx.type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{trx.title}</p>
                                    <p className="text-xs text-slate-500">{formatDate(trx.date)}</p>
                                </div>
                             </div>
                             <span className={`font-mono font-bold text-sm ${trx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                             </span>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">Belum ada transaksi.</div>
                )}
            </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Finance;
