import { useDateTime } from '../../hooks/useDateTime';
import { formatDateIndonesian } from '../../utils/dateUtils';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';

export default function Header({ selectedDate, setSelectedDate, wgToday, isToday }) {
  const { time } = useDateTime();

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export dashboard');
  };

  const handleSendTelegram = () => {
    // TODO: Implement Telegram send functionality
    console.log('Send to Telegram');
  };

  const handleDesktop = () => {
    // TODO: Implement desktop view functionality
    console.log('Desktop view');
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 border-b border-zinc-800">
      {/* Row 1: Title and Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
        <h1 className="text-base md:text-lg lg:text-2xl font-bold text-blue-400 truncate">
          WowGroup Daily Performance
        </h1>
        <div className="flex gap-1 md:gap-1.5 lg:gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handleDesktop}
            className="text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 md:py-1.5 whitespace-nowrap"
          >
            Desktop
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSendTelegram}
            className="text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 md:py-1.5 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Send to Telegram</span>
            <span className="sm:hidden">Telegram</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="text-[9px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 md:px-3 py-1 md:py-1.5 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Export Dashboard</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Row 2: Live Time and Date Picker */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
            Live Time:
          </p>
          <span className="text-xs md:text-sm bg-green-600/20 text-green-400 px-2 py-0.5 rounded whitespace-nowrap">
            {time}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
          <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap hidden sm:inline">Select Date:</span>
          <DatePicker
            date={selectedDate}
            onChange={setSelectedDate}
            onTodayClick={wgToday}
            isToday={isToday}
          />
        </div>
      </div>
    </div>
  );
}
