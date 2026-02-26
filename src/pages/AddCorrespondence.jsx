import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

const AddCorrespondence = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'surat_masuk', // surat_masuk, surat_keluar, arsip
    no: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    sender: '', // for masuk
    receiver: '', // for keluar
    description: '',
    category: 'Umum', // for arsip
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let fileUrl = null;
      if (file) {
        fileUrl = await uploadToCloudinary(file);
      }

      await addDoc(collection(db, 'correspondence'), {
        ...formData,
        fileUrl,
        createdAt: new Date().toISOString()
      });

      toast.success('Data berhasil disimpan!');
      navigate('/correspondence');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-h2">Tambah Surat/Arsip</h1>
      </header>

      <main className="main-content px-6 pt-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-4">
            <div>
              <label className="label-primary">Jenis Dokumen</label>
              <select
                className="input-primary"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="surat_masuk">Surat Masuk</option>
                <option value="surat_keluar">Surat Keluar</option>
                <option value="arsip">Arsip Dokumen</option>
              </select>
            </div>

            {formData.type !== 'arsip' && (
                <div>
                <label className="label-primary">Nomor Surat</label>
                <input
                    type="text"
                    className="input-primary"
                    value={formData.no}
                    onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                    placeholder="Contoh: 001/KT/I/2024"
                    required
                />
                </div>
            )}

            <div>
              <label className="label-primary">Judul / Perihal</label>
              <input
                type="text"
                className="input-primary"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul dokumen..."
                required
              />
            </div>

            <div>
              <label className="label-primary">Tanggal</label>
              <input
                type="date"
                className="input-primary"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {formData.type === 'surat_masuk' && (
                <div>
                <label className="label-primary">Pengirim</label>
                <input
                    type="text"
                    className="input-primary"
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    placeholder="Dari siapa..."
                />
                </div>
            )}

            {formData.type === 'surat_keluar' && (
                <div>
                <label className="label-primary">Penerima</label>
                <input
                    type="text"
                    className="input-primary"
                    value={formData.receiver}
                    onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                    placeholder="Kepada siapa..."
                />
                </div>
            )}

            {formData.type === 'arsip' && (
                <div>
                <label className="label-primary">Kategori</label>
                <select
                    className="input-primary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    <option value="Umum">Umum</option>
                    <option value="Proposal">Proposal</option>
                    <option value="LPJ">LPJ</option>
                    <option value="SK">SK</option>
                    <option value="Notulen">Notulen</option>
                </select>
                </div>
            )}

            <div>
                <label className="label-primary">Upload File (Foto/PDF)</label>
                <input
                    type="file"
                    className="input-primary"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddCorrespondence;
