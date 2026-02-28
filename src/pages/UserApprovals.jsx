import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const UserApprovals = () => {
    const { currentUser, userRole, hasRole } = useAuth();
    const navigate = useNavigate();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    // Permission check
    const canApprove = hasRole('super_admin') || hasRole('ketua') || hasRole('wakil_ketua');

    useEffect(() => {
        // If not authorized, redirect will happen in protected route mostly, but safe guard here
        if (!loading && !canApprove) {
             // Let the component render first if loading
        }
    }, [canApprove, loading]);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            if (!canApprove) return;

            try {
                setLoading(true);
                // Try with ordering first (needs index)
                try {
                    const q = query(
                        collection(db, 'users'),
                        where('status', '==', 'pending'),
                        orderBy('createdAt', 'desc')
                    );
                    const snapshot = await getDocs(q);
                    const users = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPendingUsers(users);
                } catch (idxError) {
                    console.warn("Index missing for ordered query, falling back to client sort", idxError);
                    // Fallback: fetch all pending and sort client side
                    const q = query(
                        collection(db, 'users'),
                        where('status', '==', 'pending')
                    );
                    const snapshot = await getDocs(q);
                    const users = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    // Sort client side
                    users.sort((a, b) => {
                         const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                         const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                         return dateB - dateA;
                    });
                    setPendingUsers(users);
                }
            } catch (error) {
                console.error("Error fetching pending users:", error);
                toast.error("Gagal memuat data user pending.");
            } finally {
                setLoading(false);
            }
        };

        fetchPendingUsers();
    }, [canApprove]);

    const handleAction = async (userId, action) => {
        if (!window.confirm(`Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} user ini?`)) return;

        setProcessing(userId);
        try {
            const userRef = doc(db, 'users', userId);
            const newStatus = action === 'approve' ? 'active' : 'rejected';

            await updateDoc(userRef, {
                status: newStatus,
                updatedAt: new Date().toISOString(),
                approvedBy: currentUser.uid,
                approvedAt: new Date().toISOString()
            });

            toast.success(`User berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}`);

            // Remove from local list
            setPendingUsers(prev => prev.filter(user => user.id !== userId));

        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Gagal memproses user.");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-4">
                 <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!canApprove) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500">Anda tidak memiliki akses ke halaman ini.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-display">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-icons-round text-gray-600 dark:text-gray-300">arrow_back</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Persetujuan User</h1>
                </div>
                {pendingUsers.length > 0 && (
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold">
                        {pendingUsers.length} Pending
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                {pendingUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                            <span className="material-icons-round text-green-500 text-4xl">check_circle</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Semua Bersih!</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            Tidak ada user baru yang menunggu persetujuan saat ini.
                        </p>
                    </div>
                ) : (
                    pendingUsers.map(user => (
                        <div key={user.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4 animate-fade-in-up">
                            {/* User Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative group">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="material-icons-round">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{user.fullName || 'Tanpa Nama'}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5">
                                        <span className="material-icons-round text-[14px]">calendar_today</span>
                                        <span>Daftar: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => handleAction(user.id, 'reject')}
                                    disabled={processing === user.id}
                                    className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-200"
                                >
                                    {processing === user.id ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-icons-round text-lg">close</span>
                                            Tolak
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleAction(user.id, 'approve')}
                                    disabled={processing === user.id}
                                    className="flex-1 px-4 py-2.5 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-200"
                                >
                                    {processing === user.id ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-icons-round text-lg">check</span>
                                            Setujui
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserApprovals;
