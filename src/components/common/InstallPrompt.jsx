import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // If iOS and not in standalone mode (not installed yet)
    if (isIosDevice && !window.navigator.standalone) {
        // Show after a delay to not be annoying immediately
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
        // Android / Chrome standard way
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsVisible(false);
    } else {
        // Fallback or iOS: Show instructions
        setShowInstruction(true);
    }
  };

  const handleClose = () => {
      setIsVisible(false);
      setShowInstruction(false);
  };

  if (!isVisible && !showInstruction) return null;

  return (
    <>
        {/* Floating Banner */}
        {isVisible && !showInstruction && (
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 w-full max-w-sm px-4 animate-fade-in-up pb-4">
            <div className="p-3 rounded-2xl shadow-xl flex items-center justify-between border backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-white/20 dark:border-white/10 text-slate-900 dark:text-white">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                        <span className="material-icons-round text-primary">download</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Install Aplikasi</h4>
                        <p className="text-xs opacity-70">Akses lebih cepat & offline</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-icons-round text-lg opacity-50">close</span>
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-transform active:scale-95 bg-primary text-white"
                    >
                        {deferredPrompt ? 'Install' : 'Cara Install'}
                    </button>
                </div>
            </div>
            </div>
        )}

        {/* Instruction Modal (iOS / Manual Fallback) */}
        {showInstruction && (
            <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
                <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col bg-white dark:bg-slate-800 dark:text-white">

                    <button onClick={() => setShowInstruction(false)} className="absolute top-4 right-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full">
                        <span className="material-icons-round">close</span>
                    </button>

                    <h3 className="font-bold text-lg mb-4 text-center">Cara Install Aplikasi</h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                            <p className="text-sm leading-relaxed">
                                {isIOS
                                    ? <span>Tap tombol <strong>Share</strong> <span className="material-icons-round text-sm inline align-middle">ios_share</span> di bar bawah browser Safari.</span>
                                    : <span>Tap menu <strong>Titik Tiga</strong> <span className="material-icons-round text-sm inline align-middle">more_vert</span> di pojok kanan atas browser Chrome.</span>
                                }
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                            <p className="text-sm leading-relaxed">
                                {isIOS
                                    ? <span>Pilih opsi <strong>"Add to Home Screen"</strong> atau <strong>"Tambah ke Layar Utama"</strong>.</span>
                                    : <span>Pilih opsi <strong>"Install App"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</span>
                                }
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                            <p className="text-sm leading-relaxed">
                                Tap <strong>Add</strong> / <strong>Tambah</strong>. Aplikasi akan muncul di layar depan HP Anda.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowInstruction(false)}
                        className="mt-6 w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-transform active:scale-[0.98]"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        )}
    </>
  );
};

export default InstallPrompt;
