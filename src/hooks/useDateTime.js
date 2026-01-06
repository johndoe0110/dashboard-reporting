import { useState, useEffect } from 'react';
import { formatTime } from '../utils/dateUtils';

/**
 * Custom hook untuk live time
 */
export function useDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    date: currentTime,
    time: formatTime(currentTime),
  };
}
