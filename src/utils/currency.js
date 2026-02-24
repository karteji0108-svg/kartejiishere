/**
 * Format a number to IDR currency string.
 * @param {number|string} amount - The amount to format.
 * @returns {string} - Formatted currency string (e.g., "Rp 1.500.000").
 */
export const formatCurrency = (amount) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

/**
 * Format a number with thousands separators.
 * @param {number|string} number - The number to format.
 * @returns {string} - Formatted number string (e.g., "1.500").
 */
export const formatNumber = (number) => {
    const num = parseFloat(number);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
};
