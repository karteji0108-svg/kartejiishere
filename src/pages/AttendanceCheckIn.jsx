import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Haversine formula to calculate distance in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const AttendanceCheckIn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();

    const activityId = searchParams.get('act');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activity, setActivity] = useState(null);
    const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

    useEffect(() => {
        const verifyActivity = async () => {
            if (!activityId) {
                toast.error("Kode kegiatan tidak valid");
                navigate('/activities');
                return;
            }

            try {
                // Fetch Activity
                const docSnap = await getDoc(doc(db, 'activities', activityId));
                if (!docSnap.exists()) {
                    toast.error("Kegiatan tidak ditemukan");
                    navigate('/activities');
                    return;
                }

                const actData = { id: docSnap.id, ...docSnap.data() };

                if (!actData.attendanceActive || !actData.attendanceLocation) {
                    toast.error("Absensi untuk kegiatan ini belum/tidak aktif.");
                    navigate(`/activities/${activityId}`);
                    return;
                }

                setActivity(actData);

                // Check if already checked in
                if (currentUser?.uid) {
                    const attQ = query(
                        collection(db, 'attendance'),
                        where('activity_id', '==', activityId),
                        where('member_id', '==', currentUser.uid)
                    );
                    const attSnap = await getDocs(attQ);

                    if (!attSnap.empty) {
                        setAlreadyCheckedIn(true);
                    }
                }

            } catch (error) {
                console.error("Error verifying activity:", error);
                toast.error("Terjadi kesalahan sistem");
            } finally {
                setLoading(false);
            }
        };

        verifyActivity();
    }, [activityId, navigate, currentUser]);

    const handleCheckIn = async () => {
        if (!currentUser || !activity) return;

        if (!navigator.geolocation) {
            toast.error("GPS tidak didukung di perangkat ini.");
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading('Memverifikasi lokasi Anda...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    const adminLat = activity.attendanceLocation.latitude;
                    const adminLon = activity.attendanceLocation.longitude;

                    // Calculate distance
                    const distance = getDistanceFromLatLonInM(adminLat, adminLon, userLat, userLon);

                    // Allow within 200 meters (tune as necessary)
                    if (distance > 200) {
                        toast.error(`Anda terlalu jauh dari lokasi kegiatan. Jarak: ${Math.round(distance)}m (Maks: 200m)`, { id: toastId });
                        setSubmitting(false);
                        return;
                    }

                    // Get user details
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    // Save Attendance
                    await addDoc(collection(db, 'attendance'), {
                        member_id: currentUser.uid,
                        member_name: userData.fullName || currentUser.displayName || 'Anggota',
                        member_role: userRole || 'anggota',
                        activity_id: activity.id,
                        activity_title: activity.title,
                        attendance_time: new Date().toISOString(),
                        attendance_location: `${userLat}, ${userLon}`,
                        attendance_status: 'Hadir',
                        distance_meters: Math.round(distance),
                        created_at: serverTimestamp()
                    });

                    toast.success("Berhasil! Kehadiran Anda telah dicatat.", { id: toastId });
                    setAlreadyCheckedIn(true);

                } catch (error) {
                    console.error("Check-in error:", error);
                    toast.error("Gagal mencatat absensi", { id: toastId });
                } finally {
                    setSubmitting(false);
                }
            },
            (error) => {
                console.error("Location error:", error);
                toast.error("Gagal mendapatkan lokasi. Pastikan GPS aktif dan diizinkan.", { id: toastId });
                setSubmitting(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
                <p className="text-cyan-400 font-bold uppercase tracking-widest text-sm">Menghubungkan Server...</p>
            </div>
        );
    }

    if (!activity) return null;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 relative overflow-hidden font-display animate-fade-in text-white">

            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#110505] via-slate-900 to-slate-950 z-0 opacity-50"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="relative z-10 flex items-center mb-8 pt-4">
                <button onClick={() => navigate(`/activities/${activityId}`)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="ml-4 text-sm font-bold tracking-widest uppercase text-cyan-400">Verifikasi Absensi</h1>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">

                <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

                    <h2 className="text-2xl font-black mb-2 text-white leading-tight">{activity.title}</h2>
                    <p className="text-sm text-slate-400 mb-6 flex items-center justify-center gap-1">
                        <span className="material-icons-round text-[16px]">place</span>
                        {activity.location || 'Lokasi kegiatan'}
                    </p>

                    {alreadyCheckedIn ? (
                        <div className="py-4">
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                                <span className="material-icons-round text-4xl">check_circle</span>
                            </div>
                            <h3 className="text-emerald-400 font-bold text-xl mb-1 uppercase tracking-wider">Hadir</h3>
                            <p className="text-slate-400 text-sm">Kehadiran Anda telah dicatat oleh sistem.</p>
                        </div>
                    ) : (
                        <div className="py-4">
                            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50 relative">
                                <span className="material-icons-round text-4xl relative z-10">fingerprint</span>
                                {/* Radar pulse effect */}
                                <div className="absolute inset-0 border border-blue-400 rounded-full animate-[ping_2s_ease-out_infinite] opacity-50"></div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-widest">Konfirmasi Kehadiran</h3>
                            <p className="text-slate-400 text-xs px-4">
                                Sistem akan meminta akses GPS untuk memverifikasi lokasi Anda berada di tempat kegiatan.
                            </p>
                        </div>
                    )}
                </div>

                {!alreadyCheckedIn && (
                    <button
                        onClick={handleCheckIn}
                        disabled={submitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <>
                                <span className="material-icons-round">gps_fixed</span>
                                Verifikasi & Absen
                            </>
                        )}
                    </button>
                )}
            </div>

            <p className="text-center text-[10px] text-slate-600 mt-8 relative z-10 tracking-widest uppercase">
                Secure Location-Based Validation
            </p>
        </div>
    );
};

export default AttendanceCheckIn;
