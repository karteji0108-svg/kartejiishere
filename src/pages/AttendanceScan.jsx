import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AttendanceScan = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const nia = searchParams.get('nia');
    const uid = searchParams.get('uid'); // Primary key check if passed

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

    useEffect(() => {
        const verifyMember = async () => {
            if (!nia && !uid) {
                toast.error("Data scan tidak valid");
                setLoading(false);
                return;
            }

            try {
                let mData = null;
                // If UID is provided (which we do in DigitalCard), it's a direct lookup
                if (uid) {
                    const docSnap = await getDoc(doc(db, 'users', uid));
                    if (docSnap.exists()) {
                        mData = { id: docSnap.id, ...docSnap.data() };
                    }
                } else if (nia) {
                    // Fallback to NIA search
                    const q = query(collection(db, 'users'), where('nia', '==', nia));
                    const snap = await getDocs(q);
                    if (!snap.empty) {
                        mData = { id: snap.docs[0].id, ...snap.docs[0].data() };
                    }
                }

                if (!mData) {
                    toast.error("Anggota tidak ditemukan");
                    setLoading(false);
                    return;
                }

                setMemberData(mData);

                // Check if already checked in today
                const today = new Date().toISOString().split('T')[0];
                const attQ = query(
                    collection(db, 'absensi'),
                    where('uid', '==', mData.id),
                    where('tanggal', '==', today)
                );
                const attSnap = await getDocs(attQ);

                if (!attSnap.empty) {
                    setAlreadyCheckedIn(true);
                }

            } catch (error) {
                console.error("Error verifying scan:", error);
                toast.error("Gagal memverifikasi data");
            } finally {
                setLoading(false);
            }
        };

        verifyMember();
    }, [nia, uid]);

    const handleCheckIn = async () => {
        if (!memberData) return;
        setSubmitting(true);
        try {
            // Get IP Address
            let ipAddress = 'unknown';
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                ipAddress = ipData.ip;
            } catch (e) {
                console.warn("Failed to get IP");
            }

            // Get Location (Optional, won't block if denied)
            let location = 'unknown';
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
            } catch (e) {
                console.warn("Failed to get location");
            }

            const today = new Date().toISOString().split('T')[0];
            const time = new Date().toLocaleTimeString('id-ID');

            await addDoc(collection(db, 'absensi'), {
                uid: memberData.id,
                nia: nia || memberData.nia || memberData.memberId || 'UNKNOWN',
                nama: memberData.fullName || memberData.displayName,
                tanggal: today,
                waktu: time,
                ip_address: ipAddress,
                lokasi: location,
                created_at: serverTimestamp()
            });

            toast.success("Absensi berhasil dicatat!");
            setAlreadyCheckedIn(true);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error("Gagal mencatat absensi.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!memberData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <span className="material-icons-round text-red-500 text-6xl mb-4">error_outline</span>
                <h1 className="text-xl font-bold text-white mb-2">Data Tidak Ditemukan</h1>
                <p className="text-slate-400 text-sm mb-8">QR Code yang discan tidak valid atau anggota tidak terdaftar.</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    Kembali ke Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 relative overflow-hidden font-display">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-[#110505] via-slate-900 to-slate-950 z-0 opacity-50"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* Header */}
            <div className="relative z-10 flex items-center mb-8 pt-4">
                <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="ml-4 text-lg font-bold text-white tracking-widest uppercase">Validasi Absensi</h1>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">

                <div className="w-24 h-24 rounded-full bg-slate-800/80 backdrop-blur-xl border-4 border-slate-700 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6">
                    {memberData.photoURL ? (
                        <img src={memberData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <span className="material-icons-round text-4xl">person</span>
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-black text-white text-center mb-1">{memberData.fullName || memberData.displayName}</h2>
                <p className="text-cyan-400 font-mono tracking-widest text-sm mb-1">{nia || memberData.nia || memberData.memberId || 'NIA BELUM DIATUR'}</p>
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-10">
                    <p className="text-xs text-slate-300 uppercase font-bold tracking-wider">{memberData.role ? memberData.role.replace('_', ' ') : 'Anggota'}</p>
                </div>

                {/* Status Card */}
                <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

                    {alreadyCheckedIn ? (
                        <div>
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                                <span className="material-icons-round text-3xl">check_circle</span>
                            </div>
                            <h3 className="text-emerald-400 font-bold text-lg mb-1">SUDAH HADIR</h3>
                            <p className="text-slate-400 text-xs">Anda sudah tercatat hadir untuk hari ini.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                                <span className="material-icons-round text-3xl">fingerprint</span>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">SIAP ABSEN</h3>
                            <p className="text-slate-400 text-xs">Ketuk tombol di bawah untuk mencatat kehadiran Anda di sistem digital Karang Taruna.</p>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {!alreadyCheckedIn && (
                    <button
                        onClick={handleCheckIn}
                        disabled={submitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <>
                                <span className="material-icons-round">how_to_reg</span>
                                Hadir Sekarang
                            </>
                        )}
                    </button>
                )}

            </div>

            <p className="text-center text-[10px] text-slate-600 mt-8 relative z-10 tracking-widest uppercase">
                Secure Digital Validation System
            </p>
        </div>
    );
};

export default AttendanceScan;
