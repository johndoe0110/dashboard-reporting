/**
 * Format date to Indonesian format
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDateIndonesian(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
}

/**
 * Format date to MM/DD/YYYY
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDateShort(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Get WIB timezone date (UTC+7)
 * @param {Date} date - Date object
 * @returns {Date} Date in WIB timezone
 */
export function getWIBDate(date = new Date()) {
  // WIB is UTC+7
  const wibOffset = 7 * 60; // 7 hours in minutes
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const wibTime = new Date(utc + (wibOffset * 60000));
  return wibTime;
}

/**
 * Format time to HH:MM:SS AM/PM (WIB timezone)
 * @param {Date} date - Date object (will be converted to WIB)
 * @returns {string} Formatted time string with AM/PM
 */
export function formatTime(date) {
  const wibDate = getWIBDate(date);
  let hours = wibDate.getHours();
  const minutes = String(wibDate.getMinutes()).padStart(2, '0');
  const seconds = String(wibDate.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  hours = String(hours).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Check if date is today
 * @param {Date} date - Date object
 * @returns {boolean}
 */
export function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
