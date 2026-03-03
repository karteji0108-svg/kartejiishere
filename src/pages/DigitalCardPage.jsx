import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import DigitalCard from '../components/members/DigitalCard';
import BottomNav from '../components/layout/BottomNav';

const DigitalCardPage = () => {
    const { currentUser, userRole } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser?.uid) return;
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center pb-24">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans flex flex-col items-center">

            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-center items-center sticky top-0 z-40 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-cyan-500">badge</span> Kartu Digital
                </h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 py-8">
                <div className="mb-8 text-center animate-fade-in-down">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Identitas Resmi</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[280px] mx-auto">Tunjukkan kartu ini saat kegiatan untuk verifikasi dan absensi.</p>
                </div>

                <div className="animate-fade-in-up w-full">
                    <DigitalCard member={{...profile, photoURL: profile?.photoURL || currentUser?.photoURL, role: userRole}} />
                </div>

                <div className="mt-10 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-100 dark:border-cyan-800 flex items-start gap-3 w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <span className="material-icons-round text-cyan-600 dark:text-cyan-400 mt-0.5">info</span>
                    <div>
                        <h4 className="text-sm font-bold text-cyan-800 dark:text-cyan-300">Sistem Absensi Terintegrasi</h4>
                        <p className="text-xs text-cyan-600 dark:text-cyan-400/80 mt-1 leading-relaxed">
                            QR Code pada kartu ini digunakan untuk absensi kehadiran di setiap kegiatan Karang Taruna. Pastikan status keanggotaan Anda aktif.
                        </p>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default DigitalCardPage;
