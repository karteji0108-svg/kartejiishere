import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk menambah transaksi.");
      }

      const transactionData = {
        title,
        amount: Number(amount),
        type,
        category,
        date,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        uid: currentUser.uid, // Added for potential security rule requirements
        createdByName: currentUser.displayName || currentUser.email
      };

      await addDoc(collection(db, 'finance'), transactionData);
      toast.success('Transaksi berhasil disimpan!');
      navigate('/finance');
    } catch (error) {
      console.error("Error adding transaction: ", error);
      toast.error(`Gagal menambahkan transaksi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col">
      <header className="bg-white dark:bg-slate-900 shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10 animate-fade-in-down">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Catat Transaksi</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Selection */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
             <button
               type="button"
               onClick={() => setType('income')}
               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
             >
               Pemasukan
             </button>
             <button
               type="button"
               onClick={() => setType('expense')}
               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
             >
               Pengeluaran
             </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Judul Transaksi</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Iuran Bulanan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
            <input
              type="number"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Pilih Kategori</option>
              {type === 'income' ? (
                  <>
                    <option value="Iuran">Iuran Anggota</option>
                    <option value="Donasi">Donasi</option>
                    <option value="Usaha">Dana Usaha</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
              ) : (
                  <>
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Perlengkapan">Perlengkapan</option>
                    <option value="Transport">Transportasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98] ${type === 'income' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-red-500 hover:bg-red-600 shadow-red-500/30'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddTransaction;
