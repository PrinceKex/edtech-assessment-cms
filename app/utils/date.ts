/**
 * Formats a date string or Date object into a human-readable format
 * @param date The date to format (string, number, or Date object)
 * @param options Intl.DateTimeFormatOptions to customize the output format
 * @returns Formatted date string
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
      
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Calculates the time difference between now and the given date
 * @param date The date to compare with current time
 * @returns A human-readable time difference (e.g., "2 hours ago", "3 days ago")
 */
export function timeAgo(date: string | number | Date): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : new Date(date);
      
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 
          ? `${interval} ${unit} ago` 
          : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'Some time ago';
  }
}

/**
 * Checks if a date is today
 * @param date The date to check
 * @returns True if the date is today, false otherwise
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the future
 * @param date The date to check
 * @returns True if the date is in the future, false otherwise
 */
export function isFuture(date: Date): boolean {
  return new Date(date) > new Date();
}

/**
 * Adds a specified number of days to a date
 * @param date The base date
 * @param days The number of days to add (can be negative to subtract)
 * @returns A new Date object with the added days
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Gets the start of the day (00:00:00) for a given date
 * @param date The date
 * @returns A new Date object at the start of the day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Gets the end of the day (23:59:59.999) for a given date
 * @param date The date
 * @returns A new Date object at the end of the day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
