import { useState } from 'react';
import { isToday } from '../utils/dateUtils';

/**
 * Custom hook untuk date picker
 */
export function useDatePicker(initialDate = new Date()) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const wgToday = () => {
    setSelectedDate(new Date());
  };

  const changeDate = (date) => {
    setSelectedDate(date);
  };

  return {
    selectedDate,
    setSelectedDate: changeDate,
    wgToday,
    isToday: isToday(selectedDate),
  };
}
