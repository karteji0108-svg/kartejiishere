import React, { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import { useRamadan } from '../context/RamadanContext';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import { getDownloadUrl } from '../utils/cloudinary';

const Finance = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryStats, setCategoryStats] = useState({ income: {}, expense: {} });
  const [fundStats, setFundStats] = useState({});
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { isRamadan } = useRamadan();

  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_FINANCE);

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
      const funds = { 'Iuran': 0, 'Donasi': 0, 'Usaha': 0, 'Lainnya': 0 };

      data.forEach(t => {
        let amount = t.amount;
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
        }

        const numAmount = Number(amount) || 0;
        const category = t.category || 'Lainnya';

        if (t.type === 'income') {
            inc += numAmount;
            if (funds[category] !== undefined) funds[category] += numAmount;
            else funds[category] = (funds[category] || 0) + numAmount;
        }
        if (t.type === 'expense') {
            exp += numAmount;
            const source = t.sourceFund;
            if (source && funds[source] !== undefined) funds[source] -= numAmount;
            else funds['Lainnya'] = (funds['Lainnya'] || 0) - numAmount;
        }
      });

      setSummary({ income: inc, expense: exp, balance: inc - exp });
      setFundStats(funds);

    } catch (error) {
      console.error("Error fetching finance data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canManage) return;
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

  const handleEdit = (transaction) => {
      navigate('/finance/edit/' + transaction.id, { state: { transaction } });
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
    <div className={`app-container ${isRamadan ? 'bg-ramadan' : ''}`}>

      {/* Header */}
      <header className="glass-header px-6 pt-safe pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-h2 text-slate-900 dark:text-white">Keuangan</h1>
              <p className="text-caption">Ringkasan Bendahara</p>
            </div>
            {/* Added min-w-0 to prevent overflow in restricted width scenarios */}
            <div className="flex gap-2 min-w-0">
               {/* Simplified button for cleaner look */}
               <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-primary">
                   <span className="material-icons-round">print</span>
               </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content px-6 pt-6 pb-32">
        {/* Balance Card - Fix Overflow */}
        <section className={`relative overflow-hidden rounded-[32px] p-6 shadow-xl text-white mb-6
            ${isRamadan ? 'bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-emerald-900/30' : 'bg-gradient-to-br from-primary to-blue-600 shadow-primary/30'}`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">Saldo Total</span>
              <span className="material-icons-round text-white/80">account_balance_wallet</span>
            </div>
            {loading ? (
                <Skeleton className="h-10 w-48 bg-white/30 mb-6" />
            ) : (
                // Added truncate and responsive text size to fix offside
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight truncate">
                    {formatCurrency(summary.balance)}
                </h2>
            )}
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div className="min-w-0"> {/* Prevent flex child overflow */}
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-bold tracking-wider">
                  <span className="material-icons-round text-sm">arrow_downward</span>
                  <span>Masuk</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-bold text-white truncate">{formatCurrency(summary.income)}</p>}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1 mb-1 text-white/80 text-xs uppercase font-bold tracking-wider">
                  <span className="material-icons-round text-sm">arrow_upward</span>
                  <span>Keluar</span>
                </div>
                {loading ? <Skeleton className="h-6 w-24 bg-white/30" /> : <p className="text-lg font-bold text-white truncate">{formatCurrency(summary.expense)}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Transaction List */}
        <section>
          <h3 className="text-h3 text-slate-900 dark:text-white mb-4">Transaksi Terakhir</h3>
          <div className="space-y-3">
            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
            ) : transactions.length === 0 ? (
                <p className="text-center opacity-60 text-sm py-10">Belum ada transaksi.</p>
            ) : (
                transactions.map((t, index) => {
                    let amt = t.amount;
                    if (typeof amt === 'string') {
                        amt = parseFloat(amt.replace(/\./g, '').replace(',', '.'));
                    }
                    const displayAmt = Number(amt) || 0;

                    return (
                        <div key={t.id}
                             onClick={() => navigate('/finance/' + t.id)}
                             className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer group"
                        >
                            <div className="flex items-center space-x-4 flex-1 min-w-0"> {/* min-w-0 prevents text overflow */}
                                <div className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center
                                    ${t.type === 'income'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                    <span className="material-icons-round text-xl">
                                        {t.type === 'income' ? 'arrow_downward' : 'arrow_upward'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate pr-2">{t.title}</p>
                                    <p className="text-xs opacity-60 truncate">
                                        {formatDate(t.date)} • {t.category || 'Umum'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(displayAmt)}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
          </div>
        </section>
      </main>

      {/* FAB */}
      {canManage && (
        <Link to="/finance/add" className="fixed bottom-32 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
            <span className="material-icons-round text-2xl">add</span>
        </Link>
      )}

      <BottomNav />
    </div>
  );
};

export default Finance;
