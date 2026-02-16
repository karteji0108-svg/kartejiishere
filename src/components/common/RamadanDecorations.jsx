import React from 'react';
import { useRamadan } from '../../context/RamadanContext';

const RamadanDecorations = () => {
  const { isRamadan } = useRamadan();

  if (!isRamadan) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Crescent Moon (Top Right Corner) */}
      <div className="absolute top-8 right-4 w-16 h-16 opacity-20">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-ramadan-gold">
           <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
        </svg>
      </div>

      {/* Bottom Pattern (Subtle) */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-ramadan-primary via-ramadan-gold to-ramadan-primary opacity-50"></div>
    </div>
  );
};

export default RamadanDecorations;
