import { calculatePrayerTimes } from './src/utils/prayer-calculation.js';

const date = new Date('2026-02-20T12:00:00'); // 20 Feb 2026
const lat = -6.9932; // Semarang approx
const lng = 110.4203;

const times = calculatePrayerTimes(date, lat, lng);
console.log('Calculated for Semarang 20 Feb 2026:', times);
