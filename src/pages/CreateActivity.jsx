import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateActivity = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.display_name) {
                            const parts = data.display_name.split(',');
                            const simpleAddress = parts.slice(0, 3).join(',');
                            setLocation(simpleAddress);
                        } else {
                            setLocation(`${latitude}, ${longitude}`);
                        }
                    })
                    .catch(() => {
                        setLocation(`${latitude}, ${longitude}`);
                    })
                    .finally(() => {
                        setLocationLoading(false);
                    });
            },
            (error) => {
                console.error(error);
                toast.error("Gagal mengambil lokasi. Pastikan GPS aktif.");
                setLocationLoading(false);
            }
        );
    } else {
        toast.error("Geolocation tidak didukung oleh browser ini.");
        setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
          throw new Error("Anda harus login untuk membuat kegiatan.");
      }

      let imageURL = null;
      if (image) {
        imageURL = await uploadToCloudinary(image);
      }

      await addDoc(collection(db, 'activities'), {
        title,
        description,
        date,
        time,
        location,
        imageURL,
        status: 'open',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || currentUser.email
      });

      toast.success('Kegiatan berhasil dibuat!');
      navigate('/activities');
    } catch (error) {
      console.error("Error adding activity: ", error);
      toast.error(`Gagal membuat kegiatan: ${error.message}`);
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
        <h1 className="text-lg font-bold">Buat Kegiatan Baru</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full pb-24 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
            <input
              type="text"
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 h-24 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
                <label className="block text-sm font-medium mb-1">Jam</label>
                <input
                type="time"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <div className="flex gap-2">
                <input
                type="text"
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 p-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Nama tempat / Alamat"
                required
                />
                <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center min-w-[50px] active:scale-95 transform"
                    title="Ambil Lokasi Saat Ini"
                >
                    {locationLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    ) : (
                        <span className="material-icons text-primary">my_location</span>
                    )}
                </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Poster Kegiatan</label>
            <input
              type="file"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Memproses...' : 'Buat Kegiatan'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateActivity;
