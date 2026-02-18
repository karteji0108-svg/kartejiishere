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
  const [selectedReceipt, setSelectedReceipt] = useState(null); // For modal
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
        // Robust number parsing
        let amount = t.amount;
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
        }

        const numAmount = Number(amount) || 0;

        if (t.type === 'income') inc += numAmount;
        if (t.type === 'expense') exp += numAmount;
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
        fetchFinance(); // Re-fetch to update summary
      } catch (error) {
        console.error("Error deleting transaction: ", error);
        alert("Gagal menghapus transaksi.");
      }
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
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
                transactions.map((t, index) => {
                    // Robust handling for display per transaction item too
                    let amt = t.amount;
                    if (typeof amt === 'string') {
                        amt = parseFloat(amt.replace(/\./g, '').replace(',', '.'));
                    }
                    const displayAmt = Number(amt) || 0;

                    return (
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
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{t.title}</p>
                                        {t.receiptUrl && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedReceipt(t.receiptUrl); }}
                                                className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-1.5 py-0.5 rounded text-primary flex items-center gap-0.5 transition-colors"
                                                title="Lihat Struk"
                                            >
                                                <span className="material-icons-round text-[10px]">receipt</span>
                                                Struk
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs opacity-60">{formatDate(t.date)} • {t.category || 'Umum'}</p>
                                </div>
                            </div>
                            <div className="text-right ml-2 flex items-center gap-3">
                                <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(displayAmt)}
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
                    );
                })
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link to="/finance/add" className="fixed right-5 bottom-24 z-30 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:bg-primary-dark transition-transform hover:scale-105 active:scale-95">
        <span className="material-icons-round text-2xl">add</span>
      </Link>

      <BottomNav />

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedReceipt(null)}
        >
            <div className="relative max-w-lg w-full max-h-[90vh]">
                <button
                    onClick={() => setSelectedReceipt(null)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                    <span className="material-icons-round text-3xl">close</span>
                </button>
                <img
                    src={selectedReceipt}
                    alt="Bukti Struk"
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
