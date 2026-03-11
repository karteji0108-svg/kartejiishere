import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/Skeleton';
import { exportToCSV } from '../../utils/csv';

export default function Reports() {
  const { hasRole } = useAuth();

  if (!hasRole(['super_admin', 'ketua', 'bendahara', 'sekretaris'])) {
    return <div className="p-8 text-center text-gray-500">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  const handleExport = (type) => {
    // Implement specific export logic based on type (finance, members, activities)
    // For now, this is a placeholder
    const mockData = [{ id: 1, name: "Sample", value: 100 }];
    exportToCSV(mockData, `${type}-report`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Laporan Organisasi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Unduh dan lihat laporan keseluruhan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">Laporan Keuangan</h3>
          <p className="text-gray-500 mb-6">Ringkasan kas, iuran, dan riwayat transaksi.</p>
          <button onClick={() => handleExport('finance')} className="btn-primary w-full py-2 rounded-xl">Unduh CSV</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">Laporan Kegiatan</h3>
          <p className="text-gray-500 mb-6">Data pelaksanaan program kerja dan absensi.</p>
          <button onClick={() => handleExport('activities')} className="btn-primary w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 border-blue-600">Unduh CSV</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">Laporan Anggota</h3>
          <p className="text-gray-500 mb-6">Statistik keaktifan dan data pengurus.</p>
          <button onClick={() => handleExport('members')} className="btn-primary w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 border-amber-500 text-gray-900">Unduh CSV</button>
        </div>
      </div>
    </div>
  );
}
