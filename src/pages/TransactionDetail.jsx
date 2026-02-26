import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../constants/roles';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';
import { useRamadan } from '../context/RamadanContext';
import { getDownloadUrl } from '../utils/cloudinary';

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { isRamadan } = useRamadan();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_FINANCE);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const docRef = doc(db, 'finance', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Transaksi tidak ditemukan");
          navigate('/finance');
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error("Gagal memuat detail transaksi");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini permanen?")) return;
    try {
        await deleteDoc(doc(db, 'finance', id));
        toast.success("Transaksi dihapus");
        navigate('/finance');
    } catch (error) {
        toast.error("Gagal menghapus");
    }
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (isoString) => {
      if (!isoString) return '-';
      try {
          return new Date(isoString).toLocaleString('id-ID');
      } catch (e) { return '-'; }
  };

  if (loading) return (
      <div className="min-h-screen p-5 space-y-4 font-display">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
  );

  if (!transaction) return null;

  return (
    <div className={`min-h-screen font-display flex flex-col relative transition-colors duration-500 overflow-hidden
      ${isRamadan ? 'bg-ramadan text-white' : 'bg-glass-light dark:bg-glass-dark text-slate-800 dark:text-slate-100'}`}>

      {/* Decorative BG */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <header className="px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-slate-800 dark:text-white">
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold drop-shadow-sm">Detail Transaksi</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10 px-5 relative z-10 animate-fade-in-up">

          {/* Main Card */}
          <div className="glass-card p-6 mb-6 relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-3 px-4 rounded-bl-2xl text-xs font-bold uppercase tracking-wider
                  ${transaction.type === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </div>

              <div className="flex flex-col items-center text-center mt-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl shadow-lg
                      ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <span className="material-icons-round">
                          {transaction.type === 'income' ? 'volunteer_activism' : 'shopping_cart'}
                      </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">{formatCurrency(transaction.amount)}</h2>
                  <p className="text-sm opacity-70">{transaction.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                      <p className="text-xs uppercase font-bold opacity-50 mb-1">Tanggal</p>
                      <p className="font-medium text-sm">{formatDate(transaction.date)}</p>
                  </div>
                  <div>
                      <p className="text-xs uppercase font-bold opacity-50 mb-1">Kategori</p>
                      <p className="font-medium text-sm">{transaction.category || '-'}</p>
                  </div>
              </div>
              {transaction.sourceFund && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-xs uppercase font-bold opacity-50 mb-1 text-center">Sumber Dana</p>
                      <div className="flex items-center justify-center gap-2">
                          <span className="material-icons-round text-primary text-sm">account_balance_wallet</span>
                          <p className="font-bold text-sm">Kas {transaction.sourceFund}</p>
                      </div>
                  </div>
              )}
          </div>

          {/* Details & Receipt */}
          <div className="space-y-4">
              <div className="glass-card p-5">
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Informasi Tambahan</h3>

                  <div className="space-y-3">
                      <div>
                          <p className="text-xs opacity-50 mb-1">Dibuat Oleh</p>
                          <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                                  <span className="material-icons-round">person</span>
                              </div>
                              <span className="text-sm font-medium">{transaction.createdByName || 'Admin'}</span>
                          </div>
                      </div>
                      <div>
                          <p className="text-xs opacity-50 mb-1">Waktu Input</p>
                          <p className="text-sm">{formatDateTime(transaction.createdAt)}</p>
                      </div>
                      {transaction.updatedAt && (
                          <div>
                              <p className="text-xs opacity-50 mb-1">Terakhir Diedit</p>
                              <p className="text-sm">{formatDateTime(transaction.updatedAt)}</p>
                          </div>
                      )}
                  </div>
              </div>

              {transaction.receiptUrl && (
                  <div className="glass-card p-5">
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Bukti Struk</h3>
                      <div
                        className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group relative"
                        onClick={() => setShowReceiptModal(true)}
                      >
                          <img src={transaction.receiptUrl} alt="Receipt" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white flex items-center gap-2 font-medium">
                                  <span className="material-icons-round">zoom_in</span> Lihat Penuh
                              </span>
                          </div>
                      </div>
                  </div>
              )}
          </div>

          {/* Actions */}
          {canManage && (
              <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => navigate('/finance/edit/' + id, { state: { transaction } })}
                    className="py-3 rounded-xl font-bold bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                      <span className="material-icons-round text-sm">edit</span> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-3 rounded-xl font-bold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                      <span className="material-icons-round text-sm">delete</span> Hapus
                  </button>
              </div>
          )}
      </main>

      {/* Fullscreen Modal */}
      {showReceiptModal && (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowReceiptModal(false)}
        >
            <button className="absolute top-4 right-4 text-white p-2 z-50">
                <span className="material-icons-round text-3xl">close</span>
            </button>
            <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                <img
                    src={transaction.receiptUrl}
                    alt="Full Receipt"
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
                <a
                    href={getDownloadUrl(transaction.receiptUrl)}
                    download="bukti_struk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/90 text-slate-900 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
                >
                    <span className="material-icons-round text-base">download</span>
                    Download
                </a>
            </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
