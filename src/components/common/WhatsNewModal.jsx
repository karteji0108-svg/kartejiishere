import React, { useState, useEffect } from 'react';

const CURRENT_VERSION = '4.5.0';

const WhatsNewModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastVersion = localStorage.getItem('app_version');
    if (lastVersion !== CURRENT_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('app_version', CURRENT_VERSION);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] bg-white dark:bg-slate-800 dark:text-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
                🎉 Apa yang Baru?
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/20">v{CURRENT_VERSION}</span>
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <span className="material-icons-round text-lg opacity-50">close</span>
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">

            {/* Dashboard Statistik */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                    <span className="material-icons-round">analytics</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Dashboard Statistik</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Pantau grafik keuangan, kegiatan, dan partisipasi anggota langsung dari beranda Anda.
                    </p>
                </div>
            </div>

            {/* Iuran & Keuangan */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0 text-green-600 dark:text-green-400">
                    <span className="material-icons-round">payments</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Sistem Iuran Anggota</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Manajemen iuran bulanan kini lebih mudah dengan indikator lunas/belum lunas otomatis.
                    </p>
                </div>
            </div>

            {/* QR Attendance */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">qr_code_scanner</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">QR Absensi Kegiatan</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Catat kehadiran anggota di kegiatan hanya dengan melakukan scan kode QR.
                    </p>
                </div>
            </div>

            {/* Notifications */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                    <span className="material-icons-round">notifications_active</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Sistem Notifikasi</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Dapatkan peringatan instan untuk pengumuman penting dan pembaruan kas organisasi.
                    </p>
                </div>
            </div>

        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <button
                onClick={handleClose}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-transform active:scale-[0.98]"
            >
                Mulai Jelajahi
            </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsNewModal;
