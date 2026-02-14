import React, { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import { useRamadan } from '../context/RamadanContext';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const { isRamadan } = useRamadan();

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'finance'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(data);

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

    } catch (error) {
      console.error("Error fetching finance data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteDoc(doc(db, 'finance', id));
        setTransactions(transactions.filter(t => t.id !== id));
        fetchFinance();
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

  const getBarClass = (index) => {
      if (index === 3) return isRamadan ? 'bg-ramadan-gold' : 'bg-primary';
      if (index % 2 === 0) return isRamadan ? 'bg-ramadan-gold/60' : 'bg-primary/60';
      return isRamadan ? 'bg-ramadan-gold/40' : 'bg-primary/40';
  };

  return (
    <div className={`font-display min-h-screen pb-24 relative overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-500
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Top Safe Area */}
      <div className="h-12 w-full shrink-0"></div>

      {/* Header */}
      <header className="glass-header px-5 pt-2 pb-6 flex items-center justify-between sticky top-12 z-40 animate-fade-in-down safe-area-top">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Keuangan</h1>
          <p className="text-sm opacity-70">Ringkasan Bendahara</p>
        </div>
        <div className="relative group">
          <button className="flex items-center space-x-2 glass-card px-3 py-1.5 !rounded-full !p-2 text-sm font-medium hover:bg-white/40 dark:hover:bg-black/40 transition-colors">
            <span>Semua Transaksi</span>
            <span className="material-icons-round text-base">expand_more</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 space-y-6">
        {/* Balance Card */}
        <section className={`relative overflow-hidden rounded-xl p-6 shadow-xl text-white animate-fade-in-up border border-white/10
            ${isRamadan ? 'bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-emerald-900/30' : 'bg-gradient-to-br from-primary to-blue-600 shadow-primary/30'}`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">Saldo Total</span>
              <span className="material-icons-round text-white/80">account_balance_wallet</span>
            </div>
            {loading ? (
                <Skeleton className="h-10 w-48 bg-white/30 mb-6" />
            ) : (
                <h2 className="text-3xl font-bold mb-6 tracking-tight">{formatCurrency(summary.balance)}</h2>
            )}
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-bold tracking-wider">
                  <span className="material-icons-round text-sm">arrow_downward</span>
                  <span>Pemasukan</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-semibold text-white">{formatCurrency(summary.income)}</p>}
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-bold tracking-wider">
                  <span className="material-icons-round text-sm">arrow_upward</span>
                  <span>Pengeluaran</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-semibold text-white">{formatCurrency(summary.expense)}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Chart */}
        <section className="glass-card p-5 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Arus Kas</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isRamadan ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'}`}>Mingguan</span>
          </div>
          <div className="h-32 w-full flex items-end justify-between space-x-2 px-2">
             {[40, 25, 60, 85, 45, 30, 20].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                    <div className="w-full bg-slate-100/50 dark:bg-slate-700/50 rounded-t-sm relative h-24 flex items-end justify-center overflow-hidden">
                        <div
                            className={`w-full ${getBarClass(i)} transition-all duration-500 ease-out`}
                            style={{height: `${h}%`}}
                        ></div>
                    </div>
                    <span className="text-[10px] opacity-60">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</span>
                </div>
             ))}
          </div>
        </section>

        {/* Transaction List */}
        <section>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Transaksi Terakhir</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            ) : transactions.length === 0 ? (
                <p className="text-center opacity-60 text-sm animate-fade-in-up py-4">Belum ada transaksi.</p>
            ) : (
                transactions.map((t, index) => (
                    <div key={t.id}
                         className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform animate-fade-in-up group"
                         style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center space-x-4 flex-1">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-md
                                ${t.type === 'income'
                                ? 'bg-green-100/80 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                                : 'bg-red-100/80 dark:bg-red-900/50 text-red-600 dark:text-red-400'}`}>
                                <span className="material-icons-round text-xl">
                                    {t.type === 'income' ? 'volunteer_activism' : 'shopping_cart'}
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{t.title}</p>
                                <p className="text-xs opacity-60">{formatDate(t.date)} • {t.category || 'Umum'}</p>
                            </div>
                        </div>
                        <div className="text-right ml-2 flex items-center gap-3">
                            <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                                className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Hapus Transaksi"
                            >
                                <span className="material-icons-round text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                ))
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link to="/finance/add" className="fixed right-5 bottom-24 z-30 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95">
        <span className="material-icons-round text-2xl">add</span>
      </Link>

      <BottomNav />
    </div>
  );
};

export default Finance;
