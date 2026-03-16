import { useState } from 'react';
import { isToday } from '../utils/dateUtils';

/**
 * Custom hook untuk date picker
 * @param {Date|null} initialDate - initial date; null = no date selected (empty)
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
    isToday: selectedDate ? isToday(selectedDate) : false,
  };
}
