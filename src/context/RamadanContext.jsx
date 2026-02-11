import React, { createContext, useContext, useState, useEffect } from 'react';

const RamadanContext = createContext();

export const RamadanProvider = ({ children }) => {
  const [isRamadan, setIsRamadan] = useState(false);
  // Manual override for testing
  const [manualOverride, setManualOverride] = useState(null);

  useEffect(() => {
    const checkRamadan = () => {
      if (manualOverride !== null) {
        setIsRamadan(manualOverride);
        return;
      }

      const now = new Date();
      const currentYear = now.getFullYear();

      // Ramadan 2026 dates: Feb 18 - March 20/21
      // For testing purposes, we can also check if we are in 2026
      // But user prompt says "Starts 18 Feb 2026".
      // If we are testing *now* (2025), we won't see it unless we fake the date or use override.

      const ramadanStart = new Date('2026-02-18T00:00:00');
      const ramadanEnd = new Date('2026-03-21T23:59:59'); // Covering Eid

      if (now >= ramadanStart && now <= ramadanEnd) {
        setIsRamadan(true);
      } else {
        setIsRamadan(false);
      }
    };

    checkRamadan();
    // Check every minute just in case (overkill but fine)
    const interval = setInterval(checkRamadan, 60000);
    return () => clearInterval(interval);
  }, [manualOverride]);

  const toggleRamadan = () => {
    setManualOverride(prev => {
      if (prev === null) return !isRamadan; // If auto was false, toggle to true
      return !prev;
    });
  };

  return (
    <RamadanContext.Provider value={{ isRamadan, toggleRamadan }}>
      {children}
      {/* Debug Toggle - Hidden in production ideally, but useful for this task */}
      <div className="fixed bottom-4 left-4 z-50 opacity-50 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleRamadan}
          className="bg-emerald-600 text-white px-2 py-1 rounded text-xs shadow-lg"
          title="Toggle Ramadan Mode (Debug)"
        >
          {isRamadan ? '🌙 ON' : '🌙 OFF'}
        </button>
      </div>
    </RamadanContext.Provider>
  );
};

export const useRamadan = () => useContext(RamadanContext);
