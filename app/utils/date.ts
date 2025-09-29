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

/**
 * Gets the relative time until a due date
 * @param dueDate The due date to check
 * @returns An object with status and formatted string
 */
export function getDueDateStatus(dueDate: Date | string): { status: 'past' | 'upcoming' | 'future'; text: string } {
  const now = new Date();
  const due = typeof dueDate === 'string' ? new Date(dueDate) : new Date(dueDate);
  
  if (isNaN(due.getTime())) {
    return { status: 'future', text: 'No due date' };
  }
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffTime < 0) {
    return { 
      status: 'past', 
      text: `Past due ${formatDate(due, { month: 'short', day: 'numeric' })}`
    };
  } else if (diffDays <= 7) {
    return { 
      status: 'upcoming', 
      text: `in ${diffDays} day${diffDays !== 1 ? 's' : ''}` 
    };
  } else {
    return { 
      status: 'future',
      text: formatDate(due, { month: 'short', day: 'numeric' })
    };
  }
}

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param date The date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return 'Unknown time';
  }
  
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  
  const intervals: Array<{
    seconds: number;
    text: string | ((sec: number) => string);
  }> = [
    { seconds: 60, text: 'less than a minute ago' },
    { 
      seconds: 3600, 
      text: (sec: number) => `${Math.floor(sec / 60)} minutes ago` 
    },
    { 
      seconds: 86400, 
      text: (sec: number) => {
        const hours = Math.floor(sec / 3600);
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      }
    },
    { 
      seconds: 604800, 
      text: (sec: number) => {
        const days = Math.floor(sec / 86400);
        return days === 1 ? 'yesterday' : `${days} days ago`;
      }
    },
    { 
      seconds: 2592000, 
      text: (sec: number) => {
        const weeks = Math.floor(sec / 604800);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
      }
    },
    { 
      seconds: 31536000, 
      text: (sec: number) => {
        const months = Math.floor(sec / 2592000);
        return months <= 1 ? '1 month ago' : `${months} months ago`;
      }
    },
    { 
      seconds: Infinity, 
      text: (sec: number) => {
        const years = Math.floor(sec / 31536000);
        return years <= 1 ? '1 year ago' : `${years} years ago`;
      }
    }
  ];

  for (const interval of intervals) {
    if (seconds < interval.seconds) {
      return typeof interval.text === 'function' 
        ? interval.text(seconds) 
        : interval.text;
    }
  }
  
  return formatDate(dateObj);
}
