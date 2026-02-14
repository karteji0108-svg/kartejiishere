import React, { createContext, useContext, useState, useEffect } from 'react';

const RamadanContext = createContext();

export const RamadanProvider = ({ children }) => {
  const [isRamadan, setIsRamadan] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Manual override for testing or user preference ("Matikan")
  const [manualOverride, setManualOverride] = useState(() => {
    // Check if user has permanently disabled it
    const stored = localStorage.getItem('ramadan_disabled');
    return stored === 'true' ? false : null;
  });

  useEffect(() => {
    const checkRamadan = () => {
      // If user manually turned it off, respect that
      if (manualOverride === false) {
        setIsRamadan(false);
        return;
      }

      // If user manually forced it on (debug), respect that
      if (manualOverride === true) {
        setIsRamadan(true);
        return;
      }

      const now = new Date();

      // Ramadan Auto-Activation: Feb 18, 2026, 15:00 Local Time
      const activationDate = new Date('2026-02-18T15:00:00');

      // End date (approximate based on 30 days)
      const endDate = new Date('2026-03-21T23:59:59');

      if (now >= activationDate && now <= endDate) {
        setIsRamadan(true);

        // Check if banner should be shown (isFirstTimeRamadan)
        const bannerShown = localStorage.getItem('ramadan_banner_shown');
        if (!bannerShown) {
            setShowBanner(true);
        }
      } else {
        setIsRamadan(false);
      }
    };

    checkRamadan();
    const interval = setInterval(checkRamadan, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [manualOverride]);

  const toggleRamadan = () => {
    // Debug toggle
    setManualOverride(prev => {
      if (prev === true) return false;
      if (prev === false) return null; // Reset to auto
      return true;
    });
  };

  const deactivateRamadan = () => {
      setManualOverride(false);
      localStorage.setItem('ramadan_disabled', 'true');
      setIsRamadan(false);
      setShowBanner(false);
  };

  const closeBanner = (dontShowAgain = false) => {
      setShowBanner(false);
      if (dontShowAgain) {
          localStorage.setItem('ramadan_banner_shown', 'true');
      }
  };

  return (
    <RamadanContext.Provider value={{ isRamadan, showBanner, toggleRamadan, deactivateRamadan, closeBanner }}>
      {children}
      {/* Debug Toggle - Visible only in Dev */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-20 left-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
            <button
            onClick={toggleRamadan}
            className="bg-emerald-600 text-white px-2 py-1 rounded text-xs shadow-lg"
            title="Toggle Ramadan Mode (Debug)"
            >
            {isRamadan ? '🌙 ON' : '🌙 OFF'} {manualOverride !== null ? '(Manual)' : '(Auto)'}
            </button>
        </div>
      )}
    </RamadanContext.Provider>
  );
};

export const useRamadan = () => useContext(RamadanContext);
