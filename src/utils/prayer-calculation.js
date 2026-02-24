// src/utils/prayer-calculation.js

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function dsin(d) { return Math.sin(d * D2R); }
function dcos(d) { return Math.cos(d * D2R); }
function dtan(d) { return Math.tan(d * D2R); }
function darccos(x) { return Math.acos(x) * R2D; }
function darccot(x) { return Math.atan(1 / x) * R2D; }
function darctan(x) { return Math.atan(x) * R2D; }

function fixHour(a) {
    a = a - 24.0 * Math.floor(a / 24.0);
    return a < 0 ? a + 24.0 : a;
}

function julian(year, month, day) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = 357.529 + 0.98560028 * D;
    const q = 280.459 + 0.98564736 * D;
    const L = q + 1.915 * dsin(g) + 0.020 * dsin(2 * g);

    const R = 1.00014 - 0.01671 * dcos(g) - 0.00014 * dcos(2 * g);
    const e = 23.439 - 0.00000036 * D;

    let RA = Math.atan2(dcos(e) * dsin(L), dcos(L)) * R2D;
    RA = fixHour(RA / 15);

    const decl = Math.asin(dsin(e) * dsin(L)) * R2D;
    const eqt = q/15 - RA;

    return { decl, eqt };
}

function computeTime(G, decl, lat) {
    // G is depression angle
    const D = -dsin(G) - dsin(lat) * dsin(decl);
    const N = dcos(lat) * dcos(decl);
    const V = D / N;
    if (Math.abs(V) > 1) return V > 0 ? 0 : 24;
    return darccos(V) / 15;
}

function computeAsr(factor, decl, lat) {
    // shadow factor (1 for Shafi'i)
    // A = arccot(factor + tan(abs(lat - decl)))
    const A = darccot(factor + Math.abs(dtan(lat - decl)));
    // Hour Angle H = arccos( (sin(A) - sin(lat)sin(decl)) / (cos(lat)cos(decl)) )
    const D = dsin(A) - dsin(lat) * dsin(decl);
    const N = dcos(lat) * dcos(decl);
    const V = D / N;
    if (Math.abs(V) > 1) return V > 0 ? 0 : 24;
    return darccos(V) / 15;
}

export function calculatePrayerTimes(date, lat, lng) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const timezone = -date.getTimezoneOffset() / 60; // Local timezone offset in hours

    const jd = julian(year, month, day) - (lng / (15 * 24));
    const { decl, eqt } = sunPosition(jd);

    const noon = fixHour(12 - lng / 15 - eqt + timezone);

    // Kemenag Parameters
    const fajrAngle = 20;
    const ishaAngle = 18;
    const maghribDepression = 0.8333; // Sunset (0.833 refraction)

    // Calculate raw times relative to noon
    const tFajr = computeTime(fajrAngle, decl, lat);
    const tSunrise = computeTime(0.8333, decl, lat);
    const tMaghrib = computeTime(maghribDepression, decl, lat);
    const tIsha = computeTime(ishaAngle, decl, lat);
    const tAsr = computeAsr(1, decl, lat); // Shafi'i

    const result = {
        Fajr: noon - tFajr,
        Sunrise: noon - tSunrise,
        Dhuhr: noon + (2/60), // Kemenag: Zenith + 2 mins
        Asr: noon + tAsr,
        Maghrib: noon + tMaghrib,
        Isha: noon + tIsha
    };

    // Imsak: Fajr - 10 mins
    result.Imsak = result.Fajr - (10/60);

    // Format output HH:MM
    const formatted = {};
    for (const [key, val] of Object.entries(result)) {
        if (isNaN(val)) {
            formatted[key] = "--:--";
            continue;
        }
        let hours = Math.floor(val);
        let minutes = Math.floor((val - hours) * 60);
        let seconds = Math.round(((val - hours) * 60 - minutes) * 60);

        // Rounding
        if (seconds >= 30) minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
        hours = hours % 24;

        formatted[key] = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    return formatted;
}
