import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const location = useLocation();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [sourceFund, setSourceFund] = useState(''); // New field for expenses
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const isEditMode = !!id;

  // Format currency for display (1.000.000)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchTransaction = async () => {
        if (isEditMode) {
            setLoading(true);
            try {
                // Check if state was passed via navigation (faster)
                if (location.state && location.state.transaction) {
                    const t = location.state.transaction;
                    setTitle(t.title);
                    setAmount(t.amount);
                    setDisplayAmount(formatNumber(t.amount));
                    setType(t.type);
                    setCategory(t.category);
                    setSourceFund(t.sourceFund || '');
                    setDate(t.date);
                    setReceiptPreview(t.receiptUrl);
                } else {
                    // Fetch from Firestore
                    const docRef = doc(db, 'finance', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const t = docSnap.data();
                        setTitle(t.title);
                        setAmount(t.amount);
                        setDisplayAmount(formatNumber(t.amount));
                        setType(t.type);
                        setCategory(t.category);
                        setSourceFund(t.sourceFund || '');
                        setDate(t.date);
                        setReceiptPreview(t.receiptUrl);
                    } else {
                        toast.error("Transaksi tidak ditemukan");
                        navigate('/finance');
                    }
                }
            } catch (error) {
                console.error("Error fetching transaction:", error);
                toast.error("Gagal memuat data transaksi");
            } finally {
                setLoading(false);
            }
        }
    };
    fetchTransaction();
  }, [id, isEditMode, location.state, navigate]);

  const handleAmountChange = (e) => {
    // Remove non-numeric chars
    const rawValue = e.target.value.replace(/\D/g, '');

    if (rawValue === '') {
        setAmount('');
        setDisplayAmount('');
        return;
    }

    const numericValue = parseInt(rawValue, 10);
    setAmount(numericValue);
    setDisplayAmount(formatNumber(numericValue));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setReceiptImage(file);
        setReceiptPreview(URL.createObjectURL(file));
      } else {
        toast.error("Mohon upload file gambar.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk menambah transaksi.");
      }

      // Ensure amount is a valid number
      if (!amount || isNaN(amount)) {
          throw new Error("Jumlah tidak valid.");
      }

      let receiptUrl = receiptPreview; // Default to existing URL in edit mode

      // If new image selected, upload it
      if (receiptImage) {
        setUploading(true);
        try {
           receiptUrl = await uploadToCloudinary(receiptImage);
        } catch (uploadError) {
           console.error("Image upload failed:", uploadError);
           toast.error("Gagal mengupload struk, tetapi data akan tetap disimpan.");
        } finally {
           setUploading(false);
        }
      }

      const transactionData = {
        title,
        amount: Number(amount),
        type,
        category,
        sourceFund: type === 'expense' ? sourceFund : null, // Store sourceFund only for expenses
        date,
        receiptUrl: receiptUrl || null,
        updatedAt: new Date().toISOString(),
        status: 'completed'
      };

      if (isEditMode) {
          await updateDoc(doc(db, 'finance', id), transactionData);
          toast.success('Transaksi berhasil diperbarui!');
      } else {
          // New Transaction specific fields
          transactionData.createdAt = new Date().toISOString();
          transactionData.createdBy = currentUser.uid;
          transactionData.uid = currentUser.uid; // Legacy support
          transactionData.user_id = currentUser.uid; // Legacy support
          transactionData.createdByName = currentUser.displayName || currentUser.email;

          await addDoc(collection(db, 'finance'), transactionData);
          toast.success('Transaksi berhasil disimpan!');
      }

      navigate('/finance');
    } catch (error) {
      console.error("Error saving transaction: ", error);
      toast.error(`Gagal menyimpan transaksi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0"></div>

      <header className="glass-header px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{isEditMode ? 'Edit Transaksi' : 'Catat Transaksi'}</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 animate-fade-in-up">
        <div className="glass-card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="flex bg-gray-100 dark:bg-slate-700/50 p-1.5 rounded-xl">
                <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${type === 'income' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-600'}`}
                >
                <span className="material-icons-round text-sm">arrow_downward</span>
                Pemasukan
                </button>
                <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-600'}`}
                >
                <span className="material-icons-round text-sm">arrow_upward</span>
                Pengeluaran
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="label-primary">Judul Transaksi</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">edit_note</span>
                        <input
                            type="text"
                            className="input-primary pl-10"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Iuran Bulanan"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label-primary">Jumlah (Rp)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">attach_money</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="input-primary pl-10 text-lg font-semibold tracking-wide"
                            value={displayAmount}
                            onChange={handleAmountChange}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label-primary">Kategori</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">category</span>
                        <select
                            className="input-primary pl-10 appearance-none"
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
                        <span className="absolute right-3 top-3 text-gray-400 material-icons-round text-lg pointer-events-none">expand_more</span>
                    </div>
                </div>

                {/* Source Fund Selection (Only for Expense) */}
                {type === 'expense' && (
                    <div>
                        <label className="label-primary">Ambil dari Sumber Dana?</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">account_balance_wallet</span>
                            <select
                                className="input-primary pl-10 appearance-none"
                                value={sourceFund}
                                onChange={(e) => setSourceFund(e.target.value)}
                                required
                            >
                                <option value="">Pilih Sumber Dana</option>
                                <option value="Iuran">Kas Iuran</option>
                                <option value="Donasi">Kas Donasi</option>
                                <option value="Usaha">Kas Usaha</option>
                                <option value="Lainnya">Kas Lainnya</option>
                            </select>
                            <span className="absolute right-3 top-3 text-gray-400 material-icons-round text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>
                )}

                <div>
                    <label className="label-primary">Tanggal</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">calendar_today</span>
                        <input
                            type="date"
                            className="input-primary pl-10"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Receipt Upload */}
                <div>
                    <label className="label-primary">Bukti Struk (Opsional)</label>
                    <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {receiptPreview ? (
                            <div className="relative">
                                <img src={receiptPreview} alt="Receipt Preview" className="h-40 w-full object-contain rounded-lg" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setReceiptImage(null); setReceiptPreview(null); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                >
                                    <span className="material-icons-round text-sm">close</span>
                                </button>
                            </div>
                        ) : (
                            <div className="py-4 text-gray-500">
                                <span className="material-icons-round text-3xl mb-1">receipt_long</span>
                                <p className="text-xs">Klik untuk upload foto struk</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || uploading}
                className={`w-full py-4 text-white font-bold rounded-xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${type === 'income' ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/30' : 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30'} ${loading || uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {(loading || uploading) ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        {uploading ? 'Mengupload Struk...' : 'Menyimpan...'}
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">save</span>
                        {isEditMode ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                    </>
                )}
            </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default AddTransaction;
