import React, { useState, useEffect } from 'react';

const CURRENT_VERSION = '2.0.0';

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
                    <span className="material-icons-round">palette</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Tampilan Baru & Modern</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Desain lebih bersih, navigasi lebih mudah, dan tampilan layar penuh (Edge-to-Edge) yang memanjakan mata.
                    </p>
                </div>
            </div>

            {/* Platform Adaptive */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">smartphone</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">iOS & Android Friendly</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Aplikasi kini menyesuaikan gaya visual HP Anda. Terasa lebih native dan nyaman digunakan.
                    </p>
                </div>
            </div>

            {/* New Modules */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                    <span className="material-icons-round">widgets</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Fitur Organisasi Lengkap</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Kelola Surat, Inventaris Barang, dan Data Mitra (Sponsor/Desa) langsung dari Menu aplikasi.
                    </p>
                </div>
            </div>

            {/* Content Creator */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shrink-0 text-pink-600 dark:text-pink-400">
                    <span className="material-icons-round">video_camera_front</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Role Content Creator</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Peran khusus untuk tim dokumentasi dan media sosial organisasi (Maksimal 4 orang).
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
