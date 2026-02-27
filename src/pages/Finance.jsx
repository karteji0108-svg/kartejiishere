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
        const q = query(collection(db, 'finance'), orderBy('date', 'desc'), limit(50)); // Increased limit for table view
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);

        // Calculate Summary (Client-side for now, consider server-side aggregations for scale)
        const allQ = query(collection(db, 'finance'));
        const allSnap = await getDocs(allQ);
        let inc = 0, exp = 0;
        allSnap.forEach(doc => {
            const d = doc.data();
            const amt = typeof d.amount === 'string' ? parseFloat(d.amount.replace(/[^\d.-]/g, '')) : d.amount;
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24 font-display">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold text-primary-900 dark:text-white tracking-tight">
              Laporan Keuangan
          </h1>
          {canManage && (
            <Link to="/finance/add" className="bg-primary hover:bg-primary-800 text-white w-9 h-9 flex items-center justify-center rounded-lg shadow-sm transition-colors">
                <span className="material-icons-round text-lg">add</span>
            </Link>
          )}
      </div>

      <div className="px-6 py-6 space-y-8">

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Balance */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">Total Saldo</p>
                {loading ? <Skeleton className="h-8 w-32 rounded" /> : (
                    <h2 className="text-2xl font-bold font-mono text-primary-900 dark:text-white tracking-tight">
                        {formatCurrency(summary.balance)}
                    </h2>
                )}
            </div>

            {/* Income */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm flex justify-between items-end">
                <div>
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">Pemasukan</p>
                    {loading ? <Skeleton className="h-6 w-24 rounded" /> : (
                        <h3 className="text-xl font-bold font-mono text-success tracking-tight">
                            {formatCurrency(summary.income)}
                        </h3>
                    )}
                </div>
                <div className="w-8 h-8 bg-success-bg rounded-lg flex items-center justify-center text-success">
                    <span className="material-icons-round text-lg">arrow_downward</span>
                </div>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm flex justify-between items-end">
                <div>
                    <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-1">Pengeluaran</p>
                    {loading ? <Skeleton className="h-6 w-24 rounded" /> : (
                        <h3 className="text-xl font-bold font-mono text-danger tracking-tight">
                            {formatCurrency(summary.expense)}
                        </h3>
                    )}
                </div>
                <div className="w-8 h-8 bg-danger-bg rounded-lg flex items-center justify-center text-danger">
                    <span className="material-icons-round text-lg">arrow_upward</span>
                </div>
            </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="font-bold text-sm text-primary-900 dark:text-white">Riwayat Transaksi</h3>
                <span className="text-xs text-primary-500 font-medium">50 Terakhir</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-primary-500 font-semibold border-b border-border-light dark:border-border-dark">
                        <tr>
                            <th className="px-6 py-3 whitespace-nowrap">Tanggal</th>
                            <th className="px-6 py-3 whitespace-nowrap">Keterangan</th>
                            <th className="px-6 py-3 whitespace-nowrap">Kategori</th>
                            <th className="px-6 py-3 text-right whitespace-nowrap">Jumlah</th>
                            <th className="px-6 py-3 text-center whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                        {loading ? (
                            [1,2,3,4,5].map(i => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 rounded" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-48 rounded" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 rounded" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24 rounded ml-auto" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-8 rounded mx-auto" /></td>
                                </tr>
                            ))
                        ) : transactions.length > 0 ? (
                            transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-default">
                                    <td className="px-6 py-4 whitespace-nowrap text-primary-600 dark:text-primary-300 font-mono text-xs">
                                        {formatDate(trx.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-primary-900 dark:text-white truncate max-w-[200px]">{trx.title}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize border ${trx.type === 'income' ? 'bg-success-bg text-success border-success/20' : 'bg-danger-bg text-danger border-danger/20'}`}>
                                            {trx.category || (trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-bold ${trx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                        {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Link to={`/finance/${trx.id}`} className="text-accent hover:text-accent-hover font-medium text-xs">
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-primary-400">
                                    Tidak ada data transaksi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Finance;
