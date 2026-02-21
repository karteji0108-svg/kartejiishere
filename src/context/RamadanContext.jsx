import React, { createContext, useContext, useState } from 'react';

const RamadanContext = createContext();

export const RamadanProvider = ({ children }) => {
  // Permanently disable Ramadan features
  const isRamadan = false;
  const showBanner = false;

  const toggleRamadan = () => {}; // No-op
  const deactivateRamadan = () => {}; // No-op
  const closeBanner = () => {}; // No-op

  return (
    <RamadanContext.Provider value={{ isRamadan, showBanner, toggleRamadan, deactivateRamadan, closeBanner }}>
      {children}
    </RamadanContext.Provider>
  );
};

export const useRamadan = () => useContext(RamadanContext);
