/**
 * Format a Date object to Indonesian locale date string.
 * @param {Date|string} date - The date to format.
 * @returns {string} - Formatted date string (e.g., "Senin, 1 Januari 2024").
 */
export const formatDate = (date) => {
    if (!date) return '-';

    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
        date = date.toDate();
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Get relative time string (e.g., "2 days ago").
 * Simple implementation for now.
 * @param {Date|string} date
 */
export const formatRelativeTime = (date) => {
     if (!date) return '';
    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
        date = date.toDate();
    }
     const d = new Date(date);
     const now = new Date();
     const diffInSeconds = Math.floor((now - d) / 1000);

     if (diffInSeconds < 60) return 'Baru saja';
     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
     return formatDate(date);
}
