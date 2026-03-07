import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import DigitalCard from '../components/members/DigitalCard';
import BottomNav from '../components/layout/BottomNav';

const DigitalCardPage = () => {
    const { currentUser, userRole } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser?.uid) return;
            try {
                // Fetch Profile
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                let userData = {};
                if (docSnap.exists()) {
                    userData = { id: docSnap.id, ...docSnap.data() };
                }

                // Get User Index for NIA Generation (Order by createdAt)
                try {
                    const usersQ = query(collection(db, 'users'), orderBy('createdAt', 'asc'));
                    const usersSnap = await getDocs(usersQ);
                    let index = 1;
                    usersSnap.forEach(uDoc => {
                        if (uDoc.id === currentUser.uid) {
                            userData.memberIndex = index;
                        }
                        index++;
                    });
                } catch(e) {
                    console.warn("Could not fetch user index", e);
                }

                setProfile(userData);

                // Fetch Attendance History
                const attQ = query(
                    collection(db, 'attendance'),
                    where('member_id', '==', currentUser.uid),
                    orderBy('attendance_time', 'desc')
                );
                const attSnap = await getDocs(attQ);
                setAttendanceHistory(attSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center pb-24">
                <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans animate-fade-in">

            <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-center items-center sticky top-0 z-40 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-cyan-500">badge</span> Kartu Anggota
                </h1>
            </div>

            <div className="max-w-md mx-auto px-6 py-8">
                <div className="mb-8 text-center animate-fade-in-down">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Identitas Resmi</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tunjukkan kartu ini untuk verifikasi keanggotaan.</p>
                </div>

                <div className="animate-fade-in-up w-full">
                    <DigitalCard member={{...profile, photoURL: profile?.photoURL || currentUser?.photoURL, role: userRole}} />
                </div>

                {/* Attendance History */}
                <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Riwayat Absensi</h3>
                        <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{attendanceHistory.length} Total</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {attendanceHistory.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {attendanceHistory.map(record => (
                                    <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                <span className="material-icons-round text-xl">how_to_reg</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{record.activity_title || 'Kegiatan'}</h4>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                                    {new Date(record.attendance_time).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                            {record.attendance_status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-icons-round text-4xl mb-2 text-slate-300 dark:text-slate-600">history_toggle_off</span>
                                <p className="text-sm font-medium">Belum ada riwayat absensi.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default DigitalCardPage;
