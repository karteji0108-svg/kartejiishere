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

            {/* UI Redesign */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                    <span className="material-icons-round">update</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Versi 3.0.0 Telah Rilis!</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Kami telah melakukan banyak perbaikan bug, pengoptimalan kinerja aplikasi, dan peningkatan pengalaman pengguna.
                    </p>
                </div>
            </div>

            {/* Platform Adaptive */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">file_download</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Fitur Download Laporan</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Kini Anda dapat mengunduh laporan Keuangan dan daftar Anggota langsung ke dalam format CSV.
                    </p>
                </div>
            </div>

            {/* New Modules */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                    <span className="material-icons-round">image</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Galeri Terbaru di Dashboard</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Lihat foto-foto kegiatan terbaru langsung dari halaman Dashboard utama Anda.
                    </p>
                </div>
            </div>

            {/* Content Creator */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shrink-0 text-pink-600 dark:text-pink-400">
                    <span className="material-icons-round">navigation</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Navigasi Lebih Mudah</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Tombol kembali telah ditambahkan di setiap halaman untuk mempermudah Anda berpindah halaman.
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