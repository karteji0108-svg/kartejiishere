import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const AddInventory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    condition: 'Baik',
    location: '',
    qty: 1,
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'inventory'), {
        ...formData,
        qty: Number(formData.qty),
        createdAt: new Date().toISOString()
      });
      toast.success('Inventaris berhasil ditambahkan!');
      navigate('/inventory');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="glass-header px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-h2">Tambah Inventaris</h1>
      </header>

      <main className="main-content px-6 pt-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="label-primary">Nama Barang</label>
              <input
                type="text"
                className="input-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Tenda Pleton"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label-primary">Kondisi</label>
                    <select
                        className="input-primary"
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    >
                        <option value="Baik">Baik</option>
                        <option value="Perlu Servis">Perlu Servis</option>
                        <option value="Rusak">Rusak</option>
                        <option value="Hilang">Hilang</option>
                    </select>
                </div>
                <div>
                    <label className="label-primary">Jumlah</label>
                    <input
                        type="number"
                        className="input-primary"
                        value={formData.qty}
                        onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                        required
                    />
                </div>
            </div>

            <div>
              <label className="label-primary">Lokasi Penyimpanan</label>
              <input
                type="text"
                className="input-primary"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Gudang / Sekretariat"
              />
            </div>

            <div>
              <label className="label-primary">Keterangan</label>
              <textarea
                className="input-primary min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Catatan tambahan..."
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Menyimpan...' : 'Simpan Barang'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddInventory;
