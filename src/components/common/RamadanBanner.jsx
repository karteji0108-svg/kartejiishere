import React from 'react';
import { useRamadan } from '../../context/RamadanContext';

const RamadanBanner = () => {
  const { showBanner, isRamadan, closeBanner, deactivateRamadan } = useRamadan();

  // Only show if Ramadan is active and banner should be shown
  if (!isRamadan || !showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-gradient-to-br from-ramadan-primary to-ramadan-bg text-white rounded-2xl p-6 shadow-2xl max-w-sm w-full relative overflow-hidden border border-ramadan-gold/30">

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ramadan-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-ramadan-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-4xl">🌙</span>
            </div>

            <h2 className="text-xl font-bold mb-2 text-white drop-shadow-md">
                TEMA RAMADHAN AKTIF
            </h2>

            <p className="text-sm text-emerald-100 mb-6 px-2">
                Menyambut bulan suci, tampilan aplikasi telah disesuaikan dengan suasana Ramadhan.
            </p>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() => closeBanner(false)}
                    className="w-full py-3 px-4 bg-white text-emerald-900 font-bold rounded-xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all"
                >
                    OK
                </button>

                <button
                    onClick={() => closeBanner(true)}
                    className="w-full py-3 px-4 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 active:scale-95 transition-all"
                >
                    Jangan tampilkan lagi
                </button>

                <button
                    onClick={deactivateRamadan}
                    className="text-xs text-emerald-200/80 hover:text-white mt-2 underline decoration-emerald-200/50"
                >
                    Matikan Tema Ramadhan
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanBanner;
