/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount === 0) return 'Rp 0';
  // Format dengan titik sebagai thousand separator (format Indonesia)
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number as Rupiah with exactly 2 decimal places (e.g. "Rp1.234,00")
 * @param {number} amount - Amount to format
 * @returns {string} Formatted string like "Rp1.234,00"
 */
export function formatRpTwoDecimals(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return 'Rp0,00';
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${withDots},${decPart}`;
}

/**
 * Format number as Rupiah with dot decimal separator (e.g. "Rp65,065.12")
 * @param {number} amount
 * @returns {string}
 */
export function formatRpDecimal(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return 'Rp0.00';
  return (
    'Rp' +
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
