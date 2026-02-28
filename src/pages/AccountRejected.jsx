import React from 'react';
import { useAuth } from '../context/AuthContext';

const AccountRejected = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-round text-red-500 text-4xl">block</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Akun Ditolak
                </h1>

                <p className="text-gray-500 dark:text-gray-400">
                    Maaf, pendaftaran akun Anda telah ditolak oleh Admin.
                    Silakan hubungi pengurus jika Anda merasa ini adalah kesalahan.
                </p>

                <div className="pt-4">
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors w-full"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountRejected;
