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
    const TARGET_DATE_STR = '20-02-2026'; // DD-MM-YYYY for API
    const TARGET_YEAR = 2026;
    const TARGET_MONTH = 1; // Month is 0-indexed in JS Date (0 = Jan, 1 = Feb)
    const TARGET_DAY = 20;

    // Fetch Prayer Times for the specific date
    useEffect(() => {
        let isMounted = true;

        const fetchPrayerTimes = async () => {
            try {
                if (isMounted) setLoading(true);

                let lat = location.lat;
                let lng = location.lng;

                // Try to get real location first
                if (navigator.geolocation) {
                    try {
                        const position = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        if (position && position.coords) {
                            lat = position.coords.latitude;
                            lng = position.coords.longitude;
                            if (isMounted) setLocation(prev => ({ ...prev, lat, lng, name: 'Lokasi Anda' }));
                        }
                    } catch (e) {
                        // Permission denied or timeout, stick to default
                        console.log("Geolocation fallback to default");
                    }
                }

                // API call for specific date: 20-02-2026
                const response = await fetch(`https://api.aladhan.com/v1/timings/${TARGET_DATE_STR}?latitude=${lat}&longitude=${lng}&method=20`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (isMounted) {
                    if (data.code === 200 && data.data && data.data.timings) {
                        setPrayerTimes(data.data.timings);
                        setError(null);
                    } else {
                        console.error("API Error or Invalid Data", data);
                        setError("Data tidak tersedia");
                    }
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                if (isMounted) setError("Koneksi error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchPrayerTimes();

        return () => { isMounted = false; };
    }, []); // Run once on mount

    // Timer Logic: Sync with Real Time but set Date to Target
    useEffect(() => {
        const updateTime = () => {
            try {
                const now = new Date();
                // Construct simulated time: Target Date + Current Real Hours/Minutes/Seconds
                const simulatedNow = new Date(
                    TARGET_YEAR,
                    TARGET_MONTH,
                    TARGET_DAY,
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds()
                );
                setCurrentTime(simulatedNow);
            } catch (e) {
                console.error("Timer Error", e);
            }
        };

        updateTime(); // Initial call
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate Next Prayer
    useEffect(() => {
        if (!prayerTimes) return;

        try {
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const prayerNames = { 'Fajr': 'Subuh', 'Dhuhr': 'Dzuhur', 'Asr': 'Ashar', 'Maghrib': 'Maghrib', 'Isha': 'Isya' };

            let upcoming = null;
            let minDiff = Infinity;

            const nowMs = currentTime.getTime();

            for (const prayer of prayers) {
                const timeStr = prayerTimes[prayer];
                if (!timeStr) continue;

                const parts = timeStr.split(':');
                if (parts.length < 2) continue;

                const hours = parseInt(parts[0], 10);
                const minutes = parseInt(parts[1], 10);

                if (isNaN(hours) || isNaN(minutes)) continue;

                const prayerDate = new Date(
                    TARGET_YEAR,
                    TARGET_MONTH,
                    TARGET_DAY,
                    hours,
                    minutes,
                    0
                );

                let diff = prayerDate.getTime() - nowMs;

                // If diff is negative, it means this prayer has passed for today
                if (diff < 0) {
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

            // Handle Case: All prayers for today passed (Next is Fajr tomorrow)
            if (!upcoming && prayerTimes['Fajr']) {
                 const timeStr = prayerTimes['Fajr'];
                 if (timeStr) {
                     const parts = timeStr.split(':');
                     if (parts.length >= 2) {
                         const hours = parseInt(parts[0], 10);
                         const minutes = parseInt(parts[1], 10);

                         if (!isNaN(hours) && !isNaN(minutes)) {
                             // Tomorrow: Target Day + 1
                             const nextFajrDate = new Date(
                                TARGET_YEAR,
                                TARGET_MONTH,
                                TARGET_DAY + 1,
                                hours,
                                minutes,
                                0
                             );

                             const diff = nextFajrDate.getTime() - nowMs;

                             upcoming = {
                                 key: 'Fajr',
                                 name: 'Subuh (Besok)',
                                 time: timeStr,
                                 diff: diff
                             };
                         }
                     }
                 }
            }

            setNextPrayer(upcoming);

            if (upcoming) {
                const hours = Math.floor(upcoming.diff / (1000 * 60 * 60));
                const minutes = Math.floor((upcoming.diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((upcoming.diff % (1000 * 60)) / 1000);

                // Safety check for negative/NaN
                const h = isNaN(hours) ? 0 : hours;
                const m = isNaN(minutes) ? 0 : minutes;
                const s = isNaN(seconds) ? 0 : seconds;

                setTimeRemaining(`-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            } else {
                setTimeRemaining('');
            }
        } catch (e) {
            console.error("Calculation Error", e);
        }

    }, [currentTime, prayerTimes]);

    if (loading) return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 animate-pulse h-40">
             <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
             <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
             <div className="flex gap-2 mt-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>)}
             </div>
        </div>
    );

    if (error) return null;

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
                    <p className="text-indigo-100 text-sm mb-1 font-medium">
                        {nextPrayer ? `Menuju ${nextPrayer.name}` : 'Jadwal Sholat'}
                    </p>
                    <h2 className="text-4xl font-bold tracking-tight mb-1 font-mono">
                        {timeRemaining || currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </h2>
                    <p className="text-xs text-indigo-200 flex items-center justify-center md:justify-start gap-1">
                        <span className="material-icons text-[14px]">location_on</span>
                        {location.name} &bull; 2 Ramadhan 1447H
                    </p>
                </div>

                {/* Right: Schedule Grid */}
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar justify-center md:justify-end">
                    {prayersList.map((p) => {
                        if (!p.time) return null;
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
