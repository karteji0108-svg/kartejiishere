import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Skeleton from '../components/Skeleton';
import { useRamadan } from '../context/RamadanContext';

const Finance = () => {
  const { isRamadan } = useRamadan();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'finance'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTransactions(data);

        // Calculate totals
        let inc = 0;
        let exp = 0;
        data.forEach(t => {
          if (t.type === 'income') inc += Number(t.amount);
          if (t.type === 'expense') exp += Number(t.amount);
        });
        setSummary({
          income: inc,
          expense: exp,
          balance: inc - exp
        });
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching finance data: ", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteDoc(doc(db, 'finance', id));
      } catch (error) {
        console.error("Error deleting transaction: ", error);
        alert("Gagal menghapus transaksi.");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`font-display min-h-screen pb-24 relative overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-500
      ${isRamadan ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100' : 'bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100'}`}>

      {/* Top Safe Area (Simulated for iOS) */}
      <div className="h-12 w-full sticky top-0 z-50 transition-colors duration-500 bg-inherit"></div>

      {/* Header Section */}
      <header className="px-5 pt-2 pb-6 flex items-center justify-between sticky top-12 z-40 bg-inherit transition-colors duration-300 animate-fade-in-down">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Keuangan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ringkasan Bendahara</p>
        </div>
        <div className="relative group">
          <button className="flex items-center space-x-2 bg-white dark:bg-neutral-surface-dark px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span>Semua Transaksi</span>
            <span className="material-icons text-base">expand_more</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 space-y-6">
        {/* Balance Card */}
        <section className={`relative overflow-hidden rounded-xl p-6 shadow-lg text-white animate-fade-in-up ${isRamadan ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-primary shadow-primary/30'}`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium opacity-90">Saldo Total</span>
              <span className="material-icons text-white/80">account_balance_wallet</span>
            </div>
            {loading ? (
                <Skeleton className="h-10 w-48 bg-white/30 mb-6" />
            ) : (
                <h2 className="text-3xl font-bold mb-6 tracking-tight">{formatCurrency(summary.balance)}</h2>
            )}
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-semibold tracking-wider">
                  <span className="material-icons text-sm">arrow_downward</span>
                  <span>Pemasukan</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-semibold text-white">{formatCurrency(summary.income)}</p>}
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-semibold tracking-wider">
                  <span className="material-icons text-sm">arrow_upward</span>
                  <span>Pengeluaran</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-semibold text-white">{formatCurrency(summary.expense)}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Chart Section Placeholder */}
        <section className="bg-white dark:bg-neutral-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Arus Kas</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded ${isRamadan ? 'text-emerald-600 bg-emerald-100' : 'text-primary bg-primary/10'}`}>Mingguan</span>
          </div>
          <div className="h-32 w-full flex items-end justify-between space-x-2 px-2">
             {/* Dummy Bars for Visual Consistency */}
             {[40, 25, 60, 85, 45, 30, 20].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm relative h-24 flex items-end justify-center overflow-hidden">
                        <div
                            className={`w-full transition-all duration-300 ${isRamadan ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{height: `${h}%`, opacity: i === 3 ? 1 : (i % 2 === 0 ? 0.6 : 0.4)}}
                        ></div>
                    </div>
                    <span className="text-[10px] text-gray-400">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
                </div>
             ))}
          </div>
        </section>

        {/* Transaction List */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Transaksi Terakhir</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
                <>
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </>
            ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500 text-sm animate-fade-in-up">Belum ada transaksi.</p>
            ) : (
                transactions.map((t, index) => (
                    <div key={t.id}
                         className="group relative flex items-center justify-between bg-white dark:bg-neutral-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.99] transition-transform animate-fade-in-up"
                         style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center space-x-4 flex-1">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center
                                ${t.type === 'income'
                                ? (isRamadan ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400')
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                <span className="material-icons text-xl">
                                    {t.type === 'income' ? 'volunteer_activism' : 'shopping_cart'}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{t.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)} • {t.category || 'Umum'}</p>
                            </div>
                        </div>
                        <div className="text-right ml-2 flex items-center gap-3">
                            <p className={`font-semibold text-sm ${t.type === 'income' ? (isRamadan ? 'text-emerald-600 dark:text-emerald-400' : 'text-green-600 dark:text-green-400') : 'text-red-600 dark:text-red-400'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                            </p>
                            {/* Delete Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                                title="Hapus Transaksi"
                            >
                                <span className="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Button (FAB) */}
      <Link to="/finance/add" className={`fixed right-5 bottom-24 z-30 h-14 w-14 text-white rounded-full shadow-lg flex items-center justify-center transition-colors transform hover:scale-105 active:scale-95 ${isRamadan ? 'bg-emerald-600 shadow-emerald-600/40 hover:bg-emerald-700' : 'bg-primary shadow-primary/40 hover:bg-primary-dark'}`}>
        <span className="material-icons text-2xl">add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default Finance;
