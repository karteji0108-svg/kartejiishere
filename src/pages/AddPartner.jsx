import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const AddPartner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Sponsor',
    contact: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'partners'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success('Mitra berhasil ditambahkan!');
      navigate('/partners');
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
        <h1 className="text-h2">Tambah Mitra</h1>
      </header>

      <main className="main-content px-6 pt-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="label-primary">Nama Mitra</label>
              <input
                type="text"
                className="input-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Instansi / Toko / Perorangan"
                required
              />
            </div>

            <div>
                <label className="label-primary">Tipe</label>
                <select
                    className="input-primary"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                    <option value="Sponsor">Sponsor</option>
                    <option value="Instansi">Instansi Pemerintah</option>
                    <option value="Organisasi">Organisasi Lain</option>
                    <option value="Donatur">Donatur</option>
                </select>
            </div>

            <div>
              <label className="label-primary">Kontak (HP/WA)</label>
              <input
                type="tel"
                className="input-primary"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="08..."
              />
            </div>

            <div>
              <label className="label-primary">Email</label>
              <input
                type="email"
                className="input-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="label-primary">Alamat</label>
              <textarea
                className="input-primary min-h-[80px]"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Alamat lengkap..."
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Menyimpan...' : 'Simpan Mitra'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddPartner;
