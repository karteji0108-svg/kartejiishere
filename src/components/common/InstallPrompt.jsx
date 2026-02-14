import React, { useState, useEffect } from 'react';
import { useRamadan } from '../../context/RamadanContext';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isRamadan } = useRamadan();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
      setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 w-full max-w-sm px-4 animate-fade-in-up pb-4">
      <div className={`p-3 rounded-2xl shadow-xl flex items-center justify-between border backdrop-blur-md
          ${isRamadan
            ? 'bg-emerald-900/90 border-emerald-500/30 text-white'
            : 'bg-white/90 dark:bg-slate-800/90 border-white/20 dark:border-white/10 text-slate-900 dark:text-white'
          }`}>

          <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRamadan ? 'bg-white/10' : 'bg-primary/10'}`}>
                  <span className={`material-icons-round ${isRamadan ? 'text-ramadan-gold' : 'text-primary'}`}>download</span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-transform active:scale-95
                    ${isRamadan
                        ? 'bg-ramadan-gold text-emerald-900'
                        : 'bg-primary text-white'
                    }`}
              >
                  Install
              </button>
          </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
