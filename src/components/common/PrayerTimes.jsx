import React, { useState, useEffect } from 'react';
import { useRamadan } from '../../context/RamadanContext';
import { IMSAKIYAH_SEMARANG_2026 } from '../../constants/imsakiyah';

const PrayerTimes = () => {
  const { isRamadan } = useRamadan();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const locationName = 'Kota Semarang';

  // Simulation Helpers
  const getSimulatedDate = () => {
      const now = new Date();
      let anchorTimestamp = localStorage.getItem('imsakiyah_start_anchor');

      if (!anchorTimestamp) {
          anchorTimestamp = now.getTime().toString();
          localStorage.setItem('imsakiyah_start_anchor', anchorTimestamp);
      }

      const anchor = new Date(parseInt(anchorTimestamp, 10));
      // Calculate days passed since anchor
      const diffMs = now - anchor;
      const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Target start date: 2026-02-20
      const targetStart = new Date('2026-02-20T00:00:00');
      const simulatedDate = new Date(targetStart);
      simulatedDate.setDate(targetStart.getDate() + daysPassed);

      return simulatedDate;
  };

  useEffect(() => {
    if (!isRamadan) return;
    setLoading(true);

    const simulatedDate = getSimulatedDate();
    // Format to YYYY-MM-DD manually to avoid timezone issues or use ISO split
    // To be safe with local dates:
    const year = simulatedDate.getFullYear();
    const month = String(simulatedDate.getMonth() + 1).padStart(2, '0');
    const day = String(simulatedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const todaySchedule = IMSAKIYAH_SEMARANG_2026.find(s => s.date === dateString);

    if (todaySchedule) {
        setPrayerTimes(todaySchedule);
        calculateNextPrayer(todaySchedule);
    } else {
        // Fallback logic
        if (simulatedDate < new Date('2026-02-19')) {
             setPrayerTimes(IMSAKIYAH_SEMARANG_2026[0]);
             calculateNextPrayer(IMSAKIYAH_SEMARANG_2026[0]);
        } else {
             const last = IMSAKIYAH_SEMARANG_2026[IMSAKIYAH_SEMARANG_2026.length - 1];
             setPrayerTimes(last);
             calculateNextPrayer(last);
        }
    }
    setLoading(false);
  }, [isRamadan]);

  useEffect(() => {
      if (!prayerTimes) return;

      const interval = setInterval(() => {
          calculateNextPrayer(prayerTimes);
      }, 1000);

      return () => clearInterval(interval);
  }, [prayerTimes]);

  const calculateNextPrayer = (timings) => {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

      const prayers = [
          { name: 'Imsak', time: timings.Imsak },
          { name: 'Subuh', time: timings.Fajr },
          { name: 'Dzuhur', time: timings.Dhuhr },
          { name: 'Ashar', time: timings.Asr },
          { name: 'Maghrib', time: timings.Maghrib },
          { name: 'Isya', time: timings.Isha }
      ];

      let next = null;
      for (let p of prayers) {
          if (p.time > timeString) {
              next = p;
              break;
          }
      }

      if (!next) {
          next = { name: 'Imsak', time: timings.Imsak, isTomorrow: true };
      }

      setNextPrayer(next);

      const targetTime = new Date();
      const [h, m] = next.time.split(':');
      targetTime.setHours(h, m, 0);

      if (next.isTomorrow) {
          targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime - now;
      if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
      } else {
          setTimeLeft('Waktu Tiba!');
      }
  };

  if (!isRamadan) return null;

  return (
    <div className="glass-card p-4 mb-6 relative overflow-hidden animate-fade-in-up border-emerald-500/30">
        <div className="absolute top-0 right-0 p-3 opacity-20">
            <span className="material-icons text-6xl text-emerald-300">mosque</span>
        </div>

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-emerald-100 font-bold text-lg">Jadwal Imsyakiyah</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-emerald-200/70 text-xs flex items-center gap-1">
                            <span className="material-icons text-xs">location_on</span>
                            {locationName}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-emerald-200/80 uppercase tracking-wider mb-1">Menuju {nextPrayer?.name}</p>
                    <p className="text-xl font-bold text-white font-mono">{timeLeft}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-between gap-2 opacity-50">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 w-full bg-white/10 rounded-lg animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {[
                        { name: 'Imsak', time: prayerTimes?.Imsak },
                        { name: 'Subuh', time: prayerTimes?.Fajr },
                        { name: 'Dzuhur', time: prayerTimes?.Dhuhr },
                        { name: 'Ashar', time: prayerTimes?.Asr },
                        { name: 'Maghrib', time: prayerTimes?.Maghrib },
                        { name: 'Isya', time: prayerTimes?.Isha }
                    ].map((p, idx) => {
                        const isNext = nextPrayer?.name === p.name;
                        return (
                            <div key={idx} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isNext ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 border border-emerald-400' : 'bg-white/5 text-emerald-100/80 border border-white/5'}`}>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{p.name}</span>
                                <span className="font-semibold text-sm">{p.time}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};

export default PrayerTimes;
