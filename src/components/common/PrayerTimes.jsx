import React, { useState, useEffect } from 'react';

const PrayerTimes = () => {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState({ lat: -6.2088, lng: 106.8456, name: 'Jakarta' }); // Default Jakarta
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hardcoded date for simulation: 20 Feb 2026 (2 Ramadhan 1447H)
    const SIMULATED_DATE = '20-02-2026';
    const SIMULATED_DATE_OBJ = new Date('2026-02-20T00:00:00');

    // Fetch Prayer Times for the specific date
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            try {
                setLoading(true);
                // Use geolocation if available, else default
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            setLocation(prev => ({ ...prev, lat: latitude, lng: longitude, name: 'Lokasi Anda' }));
                            await fetchData(latitude, longitude);
                        },
                        async () => {
                            // Fallback to Jakarta if permission denied
                            await fetchData(location.lat, location.lng);
                        }
                    );
                } else {
                    await fetchData(location.lat, location.lng);
                }
            } catch (err) {
                console.error("Error fetching prayer times:", err);
                setError("Gagal memuat jadwal sholat.");
                setLoading(false);
            }
        };

        const fetchData = async (lat, lng) => {
            try {
                // API call for specific date: 20-02-2026
                const response = await fetch(`https://api.aladhan.com/v1/timings/${SIMULATED_DATE}?latitude=${lat}&longitude=${lng}&method=20`); // method 20 = Kemenag RI (usually) or similar
                const data = await response.json();

                if (data.code === 200) {
                    setPrayerTimes(data.data.timings);
                } else {
                    setError("Data tidak tersedia");
                }
            } catch (err) {
                setError("Koneksi error");
            } finally {
                setLoading(false);
            }
        };

        fetchPrayerTimes();
    }, []);

    // Timer Logic: Simulate current time but on the target date
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            // Construct simulated time: Target Date + Current Hours/Minutes/Seconds
            const simulatedNow = new Date(
                SIMULATED_DATE_OBJ.getFullYear(),
                SIMULATED_DATE_OBJ.getMonth(),
                SIMULATED_DATE_OBJ.getDate(),
                now.getHours(),
                now.getMinutes(),
                now.getSeconds()
            );
            setCurrentTime(simulatedNow);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate Next Prayer
    useEffect(() => {
        if (!prayerTimes) return;

        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const prayerNames = { 'Fajr': 'Subuh', 'Dhuhr': 'Dzuhur', 'Asr': 'Ashar', 'Maghrib': 'Maghrib', 'Isha': 'Isya' };

        let upcoming = null;
        let minDiff = Infinity;

        // We compare against simulated currentTime
        const nowMs = currentTime.getTime();

        for (const prayer of prayers) {
            const timeStr = prayerTimes[prayer];
            const [hours, minutes] = timeStr.split(':').map(Number);

            const prayerDate = new Date(
                SIMULATED_DATE_OBJ.getFullYear(),
                SIMULATED_DATE_OBJ.getMonth(),
                SIMULATED_DATE_OBJ.getDate(),
                hours,
                minutes,
                0
            );

            let diff = prayerDate.getTime() - nowMs;

            // If diff is negative, it means this prayer has passed for today
            if (diff < 0) {
                // Check if it's Isha and we are past it, next is Fajr tomorrow?
                // For simplicity, let's just show "Besok" or handle the wrap around logic if needed.
                // But request says "sesuaikan hari ini 2 ramadhan", so maybe just loop within the day?
                continue;
            }

            if (diff < minDiff) {
                minDiff = diff;
                upcoming = {
                    key: prayer,
                    name: prayerNames[prayer],
                    time: timeStr,
                    diff: diff
                };
            }
        }

        // If no upcoming prayer today (after Isha), show Fajr for tomorrow (approx)
        if (!upcoming && prayerTimes['Fajr']) {
             // For simulation simplicity, we just say "Subuh (Besok)"
             // Or we could fetch next day data.
             upcoming = {
                 key: 'Fajr',
                 name: 'Subuh',
                 time: prayerTimes['Fajr'],
                 diff: (24 * 60 * 60 * 1000) - (nowMs - new Date(SIMULATED_DATE_OBJ).setHours(0,0,0,0)) // Rough approx
             };
        }

        setNextPrayer(upcoming);

        if (upcoming) {
            const hours = Math.floor(upcoming.diff / (1000 * 60 * 60));
            const minutes = Math.floor((upcoming.diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((upcoming.diff % (1000 * 60)) / 1000);
            setTimeRemaining(`-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }

    }, [currentTime, prayerTimes]);

    if (loading) return <div className="p-4 bg-white/50 animate-pulse rounded-xl h-32"></div>;
    if (error) return null; // Hide on error

    const prayersList = [
        { key: 'Imsak', label: 'Imsak', time: prayerTimes?.Imsak },
        { key: 'Fajr', label: 'Subuh', time: prayerTimes?.Fajr },
        { key: 'Dhuhr', label: 'Dzuhur', time: prayerTimes?.Dhuhr },
        { key: 'Asr', label: 'Ashar', time: prayerTimes?.Asr },
        { key: 'Maghrib', label: 'Maghrib', time: prayerTimes?.Maghrib },
        { key: 'Isha', label: 'Isya', time: prayerTimes?.Isha },
    ];

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left: Next Prayer Countdown */}
                <div className="text-center md:text-left">
                    <p className="text-indigo-100 text-sm mb-1">
                        {nextPrayer ? `Menuju ${nextPrayer.name}` : 'Jadwal Sholat'}
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight mb-1 font-mono">
                        {timeRemaining || currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </h2>
                    <p className="text-xs text-indigo-200 flex items-center justify-center md:justify-start gap-1">
                        <span className="material-icons text-[14px]">location_on</span>
                        {location.name} &bull; 2 Ramadhan 1447H
                    </p>
                </div>

                {/* Right: Schedule Grid */}
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {prayersList.map((p) => {
                        const isNext = nextPrayer?.key === p.key;
                        return (
                            <div
                                key={p.key}
                                className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl transition-all ${isNext ? 'bg-white/20 backdrop-blur-md shadow-inner scale-105 ring-1 ring-white/30' : 'hover:bg-white/10'}`}
                            >
                                <span className="text-[10px] text-indigo-100 uppercase tracking-wider font-semibold">{p.label}</span>
                                <span className="text-sm font-bold mt-1">{p.time}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PrayerTimes;
