import React from 'react';
import { useRamadan } from '../../context/RamadanContext';

const RamadanDecorations = () => {
  const { isRamadan } = useRamadan();

  if (!isRamadan) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Top Left Lantern */}
      <div className="absolute -top-10 left-4 w-16 h-32 animate-swing origin-top">
        <div className="w-1 h-16 bg-ramadan-gold mx-auto"></div>
        <div className="w-12 h-16 bg-ramadan-primary rounded-lg border-2 border-ramadan-gold flex items-center justify-center shadow-lg shadow-ramadan-gold/50 mx-auto relative">
           <div className="w-8 h-12 bg-white/20 rounded-md"></div>
           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-ramadan-gold rounded-full"></div>
        </div>
      </div>

      {/* Top Right Lantern (Smaller) */}
      <div className="absolute -top-5 right-8 w-12 h-24 animate-swing-slow origin-top">
        <div className="w-0.5 h-10 bg-ramadan-gold mx-auto"></div>
        <div className="w-8 h-12 bg-ramadan-accent rounded-lg border border-ramadan-gold flex items-center justify-center shadow-md shadow-ramadan-gold/30 mx-auto relative">
           <div className="w-4 h-8 bg-white/10 rounded-sm"></div>
           <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-ramadan-gold rounded-full"></div>
        </div>
      </div>

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
