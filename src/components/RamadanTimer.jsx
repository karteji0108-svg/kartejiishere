import React, { useState, useEffect } from 'react';
import { useRamadan } from '../context/RamadanContext';

const RamadanTimer = () => {
  const { isRamadan } = useRamadan();
  // Moving state here to prevent Dashboard re-renders
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [nextPrayer, setNextPrayer] = useState('Maghrib');

  useEffect(() => {
    if (!isRamadan) return;

    const calculateTimeLeft = () => {
        const now = new Date();
        const maghrib = new Date();
        maghrib.setHours(18, 0, 0, 0); // 18:00 Maghrib

        if (now > maghrib) {
           // Count to next day Maghrib
           maghrib.setDate(maghrib.getDate() + 1);
        }

        const diff = maghrib - now;
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Initial update
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isRamadan]);

  if (!isRamadan) return null;

  return (
    <div className="flex flex-col items-center justify-center py-2 animate-fade-in-down mb-6">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-ramadan-gold/30 rounded-2xl px-6 py-3 shadow-lg shadow-ramadan-gold/10 flex items-center gap-4">
        <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium mb-0.5">Menuju {nextPrayer}</p>
            <h2 className="text-2xl font-mono font-bold text-ramadan-primary dark:text-ramadan-gold tabular-nums tracking-tight">
                {timeLeft}
            </h2>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex flex-col items-center justify-center">
            <span className="material-icons-round text-ramadan-gold text-xl animate-pulse-slow">mosque</span>
        </div>
      </div>
    </div>
  );
};

export default RamadanTimer;
