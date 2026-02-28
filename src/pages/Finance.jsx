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

  if (!canView) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32 font-display relative z-0">

      {/* Playful Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-300/20 dark:bg-emerald-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-float -z-10"></div>
      <div className="absolute top-[10%] left-[-10%] w-72 h-72 bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl animate-float -z-10" style={{animationDelay: '2s'}}></div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b-2 border-border-light dark:border-border-dark px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="text-3xl">💰</span> Kas Kita
          </h1>
          {canManage && (
            <Link to="/finance/add" className="bg-gradient-to-r from-success to-emerald-400 hover:scale-110 text-white w-12 h-12 flex items-center justify-center rounded-[1rem] shadow-lg shadow-success/30 transition-all ease-bouncy active:scale-95 border-2 border-white/20">
                <span className="material-icons-round text-2xl">add</span>
            </Link>
          )}
      </div>

      <div className="px-6 py-8 space-y-8">

        {/* Summary Grid - Vibrant & Chunky */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Balance */}
            <div className="bg-white dark:bg-surface-dark rounded-[2rem] p-6 border-2 border-primary shadow-card relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-bouncy"></div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
                        <span className="material-icons-round text-sm">account_balance</span>
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Kas</p>
                </div>
                {loading ? <Skeleton className="h-10 w-48 rounded-xl" /> : (
                    <h2 className="text-4xl font-black text-primary-900 dark:text-white tracking-tighter">
                        {formatCurrency(summary.balance)}
                    </h2>
                )}
            </div>

            {/* Rincian Kas */}
            {Object.keys(summary.sources || {}).length > 0 && (
                <div className="md:col-span-3 mt-2">
                    <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Rincian Saldo</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                        {Object.entries(summary.sources).map(([source, amount]) => (
                            <div key={source} className="snap-start min-w-[140px] bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 border-2 border-border-light dark:border-border-dark shadow-sm shrink-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-icons-round text-[14px]">account_balance_wallet</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider truncate">{source}</p>
                                </div>
                                <h4 className={`text-lg font-black tracking-tight ${amount < 0 ? 'text-danger' : 'text-gray-900 dark:text-white'}`}>
                                    {formatCurrency(amount)}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Income & Expense Row */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                {/* Income */}
                <div className="bg-success-bg dark:bg-success-900/20 rounded-[1.5rem] p-5 border-2 border-success/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform ease-bouncy">
                    <div className="w-10 h-10 bg-white dark:bg-success-900 rounded-[1rem] flex items-center justify-center text-success mb-3 shadow-sm">
                        <span className="material-icons-round text-xl">arrow_downward</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-success-700 dark:text-success-400 uppercase tracking-wide mb-1">Masuk</p>
                        {loading ? <Skeleton className="h-6 w-full rounded" /> : (
                            <h3 className="text-lg font-black text-success-800 dark:text-success-300 tracking-tight line-clamp-1">
                                {formatCurrency(summary.income)}
                            </h3>
                        )}
                    </div>
                </div>

                {/* Expense */}
                <div className="bg-danger-bg dark:bg-danger-900/20 rounded-[1.5rem] p-5 border-2 border-danger/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform ease-bouncy">
                    <div className="w-10 h-10 bg-white dark:bg-danger-900 rounded-[1rem] flex items-center justify-center text-danger mb-3 shadow-sm">
                        <span className="material-icons-round text-xl">arrow_upward</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-danger-700 dark:text-danger-400 uppercase tracking-wide mb-1">Keluar</p>
                        {loading ? <Skeleton className="h-6 w-full rounded" /> : (
                            <h3 className="text-lg font-black text-danger-800 dark:text-danger-300 tracking-tight line-clamp-1">
                                {formatCurrency(summary.expense)}
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Transactions List (Reverting slightly from table to bubbly list for mobile-first playful feel) */}
        <div>
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-xl text-gray-900 dark:text-white">Catatan Jajan</h3>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full">50 Terakhir</span>
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1,2,3,4].map(i => (
                        <div key={i} className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 border-2 border-border-light flex items-center gap-4 animate-pulse">
                            <Skeleton className="w-12 h-12 rounded-[1rem]" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2 rounded" />
                                <Skeleton className="h-3 w-1/4 rounded" />
                            </div>
                            <Skeleton className="h-6 w-24 rounded" />
                        </div>
                    ))
                ) : transactions.length > 0 ? (
                    transactions.map((trx) => (
                        <Link
                            to={`/finance/${trx.id}`}
                            key={trx.id}
                            className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 border-2 border-border-light dark:border-border-dark flex items-center gap-4 group hover:border-primary-200 hover:shadow-md transition-all duration-300 ease-bouncy active:scale-[0.98]"
                        >
                            <div className={`w-14 h-14 rounded-[1rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ease-bouncy ${trx.type === 'income' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                                <span className="material-icons-round text-2xl">{trx.type === 'income' ? 'add_circle' : 'remove_circle'}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-extrabold text-gray-900 dark:text-white text-base truncate mb-1">{trx.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                        {formatDate(trx.date)}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 capitalize">
                                        • {trx.category}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className={`font-black text-base ${trx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                    {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-[2rem] border-2 border-border-light border-dashed">
                        <span className="text-4xl mb-3 block">💸</span>
                        <p className="text-sm font-bold text-gray-500">Belum ada catatan.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default Finance;
