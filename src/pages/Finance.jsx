import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import BottomNav from '../components/layout/BottomNav';
import Skeleton from '../components/common/Skeleton';

const Finance = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0, sources: {} });
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
        const q = query(collection(db, 'finance'), orderBy('date', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);

        // Calculate Summary
        const allQ = query(collection(db, 'finance'));
        const allSnap = await getDocs(allQ);
        let inc = 0, exp = 0;
        let sources = {};
        allSnap.forEach(doc => {
            const d = doc.data();
            const amt = typeof d.amount === 'string' ? parseFloat(d.amount.replace(/[^\d.-]/g, '')) : d.amount;
            if (d.type === 'income') {
                inc += amt;
                if (d.category) {
                    sources[d.category] = (sources[d.category] || 0) + amt;
                }
            } else if (d.type === 'expense') {
                exp += amt;
                if (d.sourceFund) {
                    sources[d.sourceFund] = (sources[d.sourceFund] || 0) - amt;
                }
            }
        });
        setSummary({
            income: inc,
            expense: exp,
            balance: inc - exp,
            sources: sources
        });

      } catch (err) {
        console.error("Error fetching finance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, navigate, canView]);


  const handleDownload = () => {
    if (transactions.length === 0) return;
    const headers = ['Tanggal', 'Judul', 'Tipe', 'Kategori', 'Sumber Dana', 'Jumlah'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date ? new Date(t.date).toLocaleDateString('id-ID') : '',
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.type,
        t.category || '',
        t.sourceFund || '',
        typeof t.amount === 'string' ? t.amount.replace(/[^\d.-]/g, '') : t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-32 font-sans relative z-0">

      {/* Header - Enterprise Grade */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
<button onClick={() => navigate(-1)} className="mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              <span className="material-icons-round text-xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span className="material-icons-round text-primary text-2xl">account_balance</span> Kas & Keuangan
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 flex items-center justify-center rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium gap-2">
                <span className="material-icons-round text-lg">download</span> <span className="hidden sm:inline">Download</span>
            </button>
          {canManage && (
            <Link to="/finance/add" className="bg-primary hover:bg-primary-700 text-white px-4 py-2 flex items-center justify-center rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium gap-2">
                <span className="material-icons-round text-lg">add</span> Tambah
            </Link>
          )}
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Top Summary Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-2xl">account_balance_wallet</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Saldo Kas</p>
                    {loading ? <Skeleton className="h-8 w-40 mt-1" /> : (
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(summary.balance)}
                        </h2>
                    )}
                </div>
            </div>

            <div className="flex gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="material-icons-round text-[14px] text-emerald-500">trending_up</span> Pemasukan
                    </p>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(summary.income)}
                        </h3>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="material-icons-round text-[14px] text-rose-500">trending_down</span> Pengeluaran
                    </p>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                            {formatCurrency(summary.expense)}
                        </h3>
                    )}
                </div>
            </div>
        </div>

        {/* Rincian Kas Grid (Structured per source) */}
        {Object.keys(summary.sources || {}).length > 0 && (
            <div>
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <span className="material-icons-round text-[18px]">pie_chart</span> Rincian per Sumber Dana
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(summary.sources).map(([source, amount]) => (
                        <div key={source} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 truncate" title={source}>{source}</p>
                            <h4 className={`text-base font-bold ${amount < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                                {formatCurrency(amount)}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Transactions Table/List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-icons-round text-[18px]">list_alt</span> Riwayat Transaksi
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">50 Terakhir</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {loading ? (
                    [1,2,3,4,5].map(i => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                            <Skeleton className="h-5 w-24" />
                        </div>
                    ))
                ) : transactions.length > 0 ? (
                    transactions.map((trx) => (
                        <Link
                            to={`/finance/${trx.id}`}
                            key={trx.id}
                            className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${trx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                <span className="material-icons-round text-xl">{trx.type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{trx.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {formatDate(trx.date)}
                                    </span>
                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                                        {trx.category}
                                    </span>
                                    {trx.sourceFund && (
                                        <React.Fragment>
                                            <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                                                Kas {trx.sourceFund}
                                            </span>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className={`font-semibold text-sm ${trx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                    {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                                </p>
                            </div>
                            <div className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-icons-round text-lg">chevron_right</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <span className="material-icons-round text-4xl text-slate-300 dark:text-slate-600 mb-2">receipt_long</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada transaksi yang dicatat.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
