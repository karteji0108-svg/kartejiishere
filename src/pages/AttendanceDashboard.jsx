import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';
import toast from 'react-hot-toast';

const AttendanceDashboard = () => {
    const { userRole } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalMembers, setTotalMembers] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    const canViewAll = ['super_admin', 'admin', 'ketua', 'wakil_ketua', 'sekretaris'].includes(userRole);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                // Fetch Total Members
                const usersSnap = await getDocs(collection(db, 'users'));
                setTotalMembers(usersSnap.size);

                // Fetch Attendance Records
                let attQ;
                if (filterDate) {
                    attQ = query(collection(db, 'absensi'), where('tanggal', '==', filterDate), orderBy('created_at', 'desc'));
                } else {
                    attQ = query(collection(db, 'absensi'), orderBy('created_at', 'desc'));
                }

                const snap = await getDocs(attQ);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecords(data);

                // Count Today's Attendance
                const today = new Date().toISOString().split('T')[0];
                if (filterDate === today) {
                    setTodayCount(data.length);
                } else {
                    const todayQ = query(collection(db, 'absensi'), where('tanggal', '==', today));
                    const todaySnap = await getDocs(todayQ);
                    setTodayCount(todaySnap.size);
                }

            } catch (error) {
                console.error("Error fetching attendance:", error);
                toast.error("Gagal memuat data absensi");
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [filterDate]);

    const handleExport = () => {
        if (records.length === 0) return;
        const headers = ['Tanggal', 'Waktu', 'Nama', 'NIA', 'IP Address', 'Lokasi'];
        const csvRows = [headers.join(',')];

        records.forEach(r => {
            csvRows.push([
                r.tanggal,
                r.waktu,
                `"${r.nama || '-'}"`,
                `"${r.nia || '-'}"`,
                r.ip_address || '-',
                `"${r.lokasi || '-'}"`
            ].join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Laporan_Absensi_${filterDate || 'Semua'}.csv`;
        link.click();
    };

    if (!canViewAll) {
        return <div className="p-6 text-center text-slate-500">Akses Ditolak</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 font-sans">
            <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-icons-round text-cyan-500">how_to_reg</span> Absensi QR
                </h1>
                <button onClick={handleExport} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="material-icons-round text-lg">download</span>
                    <span className="hidden sm:inline">Export CSV</span>
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2">Total Anggota</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalMembers}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full"></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2 text-cyan-500">Hadir Hari Ini</p>
                        <h3 className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{todayCount}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm col-span-2 md:col-span-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-2">Filter Tanggal</p>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Riwayat Absensi</h2>
                        <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{records.length} Data</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold">
                                <tr>
                                    <th className="px-6 py-3">Nama Anggota</th>
                                    <th className="px-6 py-3">Waktu Kehadiran</th>
                                    <th className="px-6 py-3">NIA</th>
                                    <th className="px-6 py-3">IP & Lokasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            <div className="animate-pulse flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-cyan-500 animate-spin mb-2"></div>
                                                Memuat data...
                                            </div>
                                        </td>
                                    </tr>
                                ) : records.length > 0 ? (
                                    records.map(record => (
                                        <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                {record.nama || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">{record.waktu}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{record.tanggal}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-cyan-600 dark:text-cyan-400 text-xs">
                                                {record.nia || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs max-w-[200px]">
                                                    <span className="truncate" title={record.ip_address}><span className="material-icons-round text-[10px] mr-1">wifi</span>{record.ip_address || '-'}</span>
                                                    <span className="truncate text-slate-400" title={record.lokasi}><span className="material-icons-round text-[10px] mr-1">place</span>{record.lokasi || '-'}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            <span className="material-icons-round text-4xl mb-2 text-slate-300 dark:text-slate-600">history_toggle_off</span>
                                            <p className="text-sm font-medium">Belum ada data absensi untuk tanggal ini.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <BottomNav />
        </div>
    );
};

export default AttendanceDashboard;
