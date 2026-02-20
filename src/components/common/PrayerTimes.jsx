import React, { useState, useEffect } from 'react';
import { useRamadan } from '../../context/RamadanContext';

const PrayerTimes = () => {
  const { isRamadan } = useRamadan();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Menunggu Lokasi...');
  const [locationDenied, setLocationDenied] = useState(false);

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

    const fetchCityName = async (lat, long) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`);
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.county || data.address.state || 'Lokasi Terdeteksi';
                const sub = data.address.suburb ? `${data.address.suburb}, ` : '';
                setLocationName(`${sub}${city}`);
            }
        } catch (error) {
            console.error("Error fetching city name:", error);
            setLocationName('Lokasi Terdeteksi');
        }
    };

    const getTimes = async (lat, long) => {
        setLoading(true);
        try {
            const simulatedDate = getSimulatedDate();
            // Use local noon of the simulated date to avoid timezone issues
            simulatedDate.setHours(12, 0, 0, 0);
            const timestamp = Math.floor(simulatedDate.getTime() / 1000);

            // Method 20 is Kemenag RI
            const response = await fetch(`https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${long}&method=20`);

            const data = await response.json();
            if (data.code === 200) {
                setPrayerTimes(data.data.timings);
                calculateNextPrayer(data.data.timings);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    setLocationDenied(false);
                    fetchCityName(lat, long);
                    getTimes(lat, long);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationDenied(true);
                    setLocationName('Jakarta (Default)');
                    // Fallback to Jakarta
                    getTimes(-6.2088, 106.8456);
                }
            );
        } else {
             setLocationDenied(true);
             setLocationName('Jakarta (Default)');
             getTimes(-6.2088, 106.8456);
        }
    };

    getLocation();
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

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
              window.location.reload();
          },
          (error) => {
              alert("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.");
          }
      );
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
                        {locationDenied && (
                             <button
                                onClick={handleRequestLocation}
                                className="bg-emerald-600/50 hover:bg-emerald-600 text-[10px] text-white px-2 py-0.5 rounded border border-emerald-400/50 transition-colors"
                             >
                                Aktifkan Lokasi
                             </button>
                        )}
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
