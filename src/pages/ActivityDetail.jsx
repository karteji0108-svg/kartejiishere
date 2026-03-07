import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris', 'content_creator'].includes(userRole);
  const canManageAttendance = ['super_admin', 'sekretaris'].includes(userRole);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const docRef = doc(db, 'activities', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setActivity({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Kegiatan tidak ditemukan");
          navigate('/activities');
        }

        if (canManageAttendance) {
            const attQ = query(collection(db, 'attendance'), where('activity_id', '==', id));
            const attSnap = await getDocs(attQ);
            setAttendance(attSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }

      } catch (error) {
        console.error("Error fetching activity detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id, navigate, canManage, canManageAttendance]);

  const handleDelete = async () => {
      if (window.confirm('Hapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.')) {
          setIsDeleting(true);
          try {
              await deleteDoc(doc(db, 'activities', id));
              toast.success("Kegiatan berhasil dihapus");
              navigate('/activities');
          } catch (error) {
              console.error("Error deleting activity:", error);
              toast.error("Gagal menghapus kegiatan");
              setIsDeleting(false);
          }
      }
  };

  const handleActivateAttendance = async () => {
      if (!navigator.geolocation) {
          toast.error("Geolocation tidak didukung oleh browser Anda.");
          return;
      }

      const toastId = toast.loading('Mendapatkan lokasi saat ini...');

      navigator.geolocation.getCurrentPosition(
          async (position) => {
              try {
                  const locationData = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      accuracy: position.coords.accuracy,
                      activeAt: new Date().toISOString()
                  };

                  await updateDoc(doc(db, 'activities', id), {
                      attendanceActive: true,
                      attendanceLocation: locationData
                  });

                  setActivity(prev => ({ ...prev, attendanceActive: true, attendanceLocation: locationData }));
                  toast.success("Absensi berhasil diaktifkan!", { id: toastId });
              } catch (error) {
                  console.error("Error activating attendance:", error);
                  toast.error("Gagal mengaktifkan absensi", { id: toastId });
              }
          },
          (error) => {
              console.error("Geolocation error:", error);
              toast.error("Gagal mendapatkan lokasi. Izinkan akses lokasi browser.", { id: toastId });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
  };

  const handleDeactivateAttendance = async () => {
       try {
            await updateDoc(doc(db, 'activities', id), {
                attendanceActive: false
            });
            setActivity(prev => ({ ...prev, attendanceActive: false }));
            toast.success("Absensi dinonaktifkan!");
        } catch (error) {
            console.error("Error deactivating attendance:", error);
            toast.error("Gagal menonaktifkan absensi");
        }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center shadow-sm">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-6 w-32 ml-4" />
        </div>
        <div className="max-w-2xl mx-auto px-6 py-6">
            <Skeleton className="h-64 w-full rounded-2xl mb-6" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!activity) return null;

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://karangtaruna.app';
  const attendanceUrl = `${appOrigin}/#/absen?act=${id}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(attendanceUrl)}&margin=10&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans animate-fade-in relative z-0">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                  <span className="material-icons-round text-xl">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">Detail Kegiatan</h1>
          </div>
          {canManage && (
              <div className="flex items-center gap-2">
                  <Link to={`/activities/edit/${id}`} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">
                      <span className="material-icons-round text-lg">edit</span>
                  </Link>
                  <button onClick={handleDelete} disabled={isDeleting} className="w-9 h-9 flex items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors disabled:opacity-50">
                      <span className="material-icons-round text-lg">delete</span>
                  </button>
              </div>
          )}
      </div>

      {/* Hero Image */}
      {activity.image && (
          <div className="w-full h-64 md:h-80 relative bg-slate-200 dark:bg-slate-800 animate-fade-in-down">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-white text-xs font-bold rounded-full mb-3 shadow-lg">
                       <span className="material-icons-round text-[14px]">event_available</span>
                       {formatDate(activity.date)}
                   </div>
                   <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md leading-tight">{activity.title}</h1>
              </div>
          </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-8 relative z-10 -mt-2">

          {/* Main Info */}
          {!activity.image && (
              <div className="animate-fade-in-down">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold rounded-full mb-3">
                       <span className="material-icons-round text-[14px]">event_available</span>
                       {formatDate(activity.date)}
                   </div>
                   <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">{activity.title}</h1>
              </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-fade-in-up">
              <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                      <span className="material-icons-round">place</span>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Lokasi Kegiatan</p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">{activity.location || 'Lokasi belum ditentukan'}</p>
                  </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-700 mb-6" />
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Deskripsi</p>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed text-sm">{activity.description}</p>
              </div>
          </div>

          {/* Attendance Management (Admin Only) */}
          {canManageAttendance && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                          <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                              <span className="material-icons-round text-cyan-500">how_to_reg</span> Sistem Absensi
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gunakan GPS untuk memverifikasi lokasi kehadiran peserta.</p>
                      </div>

                      {activity.attendanceActive ? (
                          <button onClick={handleDeactivateAttendance} className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
                              <span className="material-icons-round text-lg">stop_circle</span> Tutup Absensi
                          </button>
                      ) : (
                          <button onClick={handleActivateAttendance} className="bg-cyan-600 text-white hover:bg-cyan-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/30">
                              <span className="material-icons-round text-lg">play_circle</span> Aktifkan Absensi
                          </button>
                      )}
                  </div>

                  {activity.attendanceActive && (
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center border-b border-slate-200 dark:border-slate-700">
                          <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 mb-4 inline-block">
                              <img src={qrImageUrl} alt="QR Absensi" className="w-48 h-48 object-cover rounded-lg" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 text-center uppercase tracking-widest">
                              Minta Peserta Scan QR Ini
                          </p>
                          <p className="text-xs text-slate-500 text-center mt-2 max-w-sm">
                              Absensi hanya dapat dilakukan dalam radius ~200 meter dari lokasi panitia saat ini.
                          </p>
                      </div>
                  )}

                  <div className="p-0">
                      <div className="px-6 py-3 bg-slate-100/50 dark:bg-slate-700/30 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Daftar Kehadiran</h3>
                          <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-2 py-1 rounded-md">{attendance.length} Hadir</span>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                          {attendance.length > 0 ? (
                              attendance.map(record => (
                                  <div key={record.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                              <span className="material-icons-round text-[16px]">check</span>
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{record.member_name}</p>
                                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{record.member_id}</p>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                              {new Date(record.attendance_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                          <p className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-bold">Hadir</p>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="p-8 text-center text-slate-500">
                                  <p className="text-sm">Belum ada peserta yang absen.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default ActivityDetail;
