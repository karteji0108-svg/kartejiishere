import React, { useState, useEffect } from 'react';
import { useRamadan } from '../../context/RamadanContext';

const CURRENT_VERSION = '1.5.0';

const WhatsNewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isRamadan } = useRamadan();

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
      <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]
        ${isRamadan ? 'bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border border-emerald-500/30' : 'bg-white dark:bg-slate-800 dark:text-white'}`}>

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

            {/* Ramadan */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                    <span className="material-icons-round">mosque</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Spesial Ramadan</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Jadwal imsyakiyah akurat sesuai lokasi GPS & nama daerah Anda. Tema visual baru yang lebih segar.
                    </p>
                </div>
            </div>

            {/* Install */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">download</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Install Aplikasi</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Tambahkan ke Layar Utama (Home Screen) lebih mudah dengan tombol install otomatis.
                    </p>
                </div>
            </div>

            {/* Profil */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                    <span className="material-icons-round">person</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Perbaikan Profil</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Login otomatis saat buka aplikasi & perbaikan bug saat mengubah foto profil.
                    </p>
                </div>
            </div>

            {/* Keuangan */}
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                    <span className="material-icons-round">account_balance_wallet</span>
                </div>
                <div>
                    <h3 className="font-bold text-sm mb-1">Update Keuangan</h3>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Input uang lebih mudah dengan format ribuan otomatis. Tampilan lebih bersih tanpa chart.
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
                Keren, Lanjutkan!
            </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsNewModal;
