import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from '../utils/cloudinary';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateActivity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
        const fetchActivity = async () => {
            try {
                const docRef = doc(db, 'activities', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setDescription(data.description);
                    setDate(data.date);
                    setTime(data.time);
                    setLocation(data.location);
                    setCurrentImageURL(data.imageURL);
                } else {
                    toast.error("Kegiatan tidak ditemukan");
                    navigate('/activities');
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
                toast.error("Gagal memuat data kegiatan");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchActivity();
    }
  }, [id, navigate]);

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    if (data && data.display_name) {
                        const parts = data.display_name.split(',');
                        // Take first 3 parts for a concise address
                        const simpleAddress = parts.slice(0, 3).join(', ');
                        setLocation(simpleAddress);
                    } else {
                        setLocation(`${latitude}, ${longitude}`);
                    }
                } catch (error) {
                    setLocation(`${latitude}, ${longitude}`);
                } finally {
                    setLocationLoading(false);
                }
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

      let imageURL = currentImageURL;
      if (image) {
        imageURL = await uploadToCloudinary(image);
      }

      const activityData = {
        title,
        description,
        date,
        time,
        location,
        imageURL,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
      };

      if (id) {
          // Update existing activity
          const docRef = doc(db, 'activities', id);
          await updateDoc(docRef, activityData);
          toast.success('Kegiatan berhasil diperbarui!');
          navigate(`/activities/${id}`);
      } else {
          // Create new activity
          await addDoc(collection(db, 'activities'), {
            ...activityData,
            status: 'open',
            createdAt: new Date().toISOString(),
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || currentUser.email
          });
          toast.success('Kegiatan berhasil dibuat!');
          navigate('/activities');
      }

    } catch (error) {
      console.error("Error saving activity: ", error);
      toast.error(`Gagal menyimpan kegiatan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return (
          <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-purple-500/10 to-transparent z-0"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl z-0"></div>

      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons-round text-primary">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{id ? 'Edit Kegiatan' : 'Buat Kegiatan'}</h1>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full relative z-10 pb-24 animate-fade-in-up">
        <div className="card rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="label-primary">Judul Kegiatan</label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">event_note</span>
                    <input
                        type="text"
                        className="input-primary pl-10"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nama Acara"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="label-primary">Deskripsi</label>
                <div className="relative">
                     <textarea
                        className="input-primary p-3 h-32 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Jelaskan detail kegiatan..."
                        required
                    ></textarea>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label-primary">Tanggal</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="input-primary"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="label-primary">Waktu</label>
                    <div className="relative">
                        <input
                            type="time"
                            className="input-primary"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="label-primary">Lokasi</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-3 text-gray-400 material-icons-round text-lg">place</span>
                        <input
                            type="text"
                            className="input-primary pl-10"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Alamat / Tempat"
                            required
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors flex items-center justify-center min-w-[52px] active:scale-95 border border-primary/20"
                        title="Gunakan Lokasi Saat Ini"
                    >
                        {locationLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                        ) : (
                            <span className="material-icons-round text-primary">my_location</span>
                        )}
                    </button>
                </div>
            </div>

            <div>
                <label className="label-primary">Poster / Banner</label>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                    />
                    <div className="flex flex-col items-center">
                        <span className="material-icons-round text-gray-400 text-3xl mb-2 group-hover:text-primary transition-colors">cloud_upload</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {image ? image.name : (currentImageURL ? "Ganti Gambar (Opsional)" : "Klik untuk upload gambar")}
                        </p>
                    </div>
                </div>
                {currentImageURL && !image && (
                    <div className="mt-2 relative rounded-xl overflow-hidden h-32 w-full">
                        <img src={currentImageURL} alt="Current" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs">Gambar Saat Ini</div>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-4 flex items-center justify-center gap-2 shadow-purple-500/20 bg-gradient-to-r from-primary to-blue-600"
            >
                {loading ? (
                    <>
                        <span className="material-icons-round animate-spin text-lg">refresh</span>
                        Memproses...
                    </>
                ) : (
                    <>
                        <span className="material-icons-round text-lg">{id ? 'save' : 'add_circle'}</span>
                        {id ? 'Simpan Perubahan' : 'Buat Kegiatan'}
                    </>
                )}
            </button>
            </form>
        </div>
      </main>
    </div>
  );
};

export default CreateActivity;
