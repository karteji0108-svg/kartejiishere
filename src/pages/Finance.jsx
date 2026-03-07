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


  const downloadCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Tanggal', 'Kategori', 'Judul', 'Jenis', 'Sumber/Tujuan Dana', 'Nominal', 'Keterangan'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    transactions.forEach(trx => {
        const date = new Date(trx.date).toLocaleDateString('id-ID');
        const category = trx.category || '';
        const title = `"${(trx.title || '').replace(/"/g, '""')}"`;
        const type = trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
        const sourceFund = trx.sourceFund || '';
        const amount = typeof trx.amount === 'string' ? parseFloat(trx.amount.replace(/[^\d.-]/g, '')) : (trx.amount || 0);
        const desc = `"${(trx.description || '').replace(/"/g, '""')}"`;

        csvRows.push([date, category, title, type, sourceFund, amount, desc].join(','));
    });

    // Add Summary Row
    csvRows.push('');
    csvRows.push(`"Total Pemasukan",${summary.income}`);
    csvRows.push(`"Total Pengeluaran",${summary.expense}`);
    csvRows.push(`"Saldo Akhir",${summary.balance}`);

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-32 font-sans relative z-0">

      {/* Header - Enterprise Grade */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                  <span className="material-icons-round text-xl">arrow_back</span>
              </button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <span className="material-icons-round text-primary text-2xl">account_balance</span> Kas & Keuangan
              </h1>
          </div>
          <div className="flex gap-2">
              <button onClick={downloadCSV} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 flex items-center justify-center rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium gap-2">
                  <span className="material-icons-round text-lg">download</span> <span className="hidden sm:inline">Laporan</span>
              </button>
              {canManage && (
                <Link to="/finance/add" className="bg-primary hover:bg-primary-700 text-white px-3 py-2 flex items-center justify-center rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium gap-2">
                    <span className="material-icons-round text-lg">add</span> <span className="hidden sm:inline">Tambah</span>
                </Link>
              )}
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Top Summary Widget - Enhanced */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                        <span className="material-icons-round text-3xl">account_balance_wallet</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Saldo Kas</p>
                        {loading ? <Skeleton className="h-8 w-40" /> : (
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {formatCurrency(summary.balance)}
                            </h2>
                        )}
                    </div>
                </div>

                <div className="flex gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <span className="material-icons-round text-[14px] text-emerald-500">trending_up</span> Pemasukan
                        </p>
                        {loading ? <Skeleton className="h-6 w-24" /> : (
                            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(summary.income)}
                            </h3>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <span className="material-icons-round text-[14px] text-rose-500">trending_down</span> Pengeluaran
                        </p>
                        {loading ? <Skeleton className="h-6 w-24" /> : (
                            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                {formatCurrency(summary.expense)}
                            </h3>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Bar Chart */}
            {!loading && summary.income + summary.expense > 0 && (
                <div className="w-full mt-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1 px-1">
                        <span>Pemasukan ({Math.round((summary.income / (summary.income + summary.expense)) * 100)}%)</span>
                        <span>Pengeluaran ({Math.round((summary.expense / (summary.income + summary.expense)) * 100)}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${(summary.income / (summary.income + summary.expense)) * 100}%` }}
                        ></div>
                        <div
                            className="h-full bg-rose-500"
                            style={{ width: `${(summary.expense / (summary.income + summary.expense)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
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
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-primary transition-colors">{trx.title}</h4>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                                        {formatDate(trx.date)}
                                    </span>
                                    <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded capitalize">
                                        {trx.category}
                                    </span>
                                    {trx.sourceFund && (
                                        <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded capitalize flex items-center gap-0.5">
                                            <span className="material-icons-round text-[10px]">account_balance</span> Kas {trx.sourceFund}
                                        </span>
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
