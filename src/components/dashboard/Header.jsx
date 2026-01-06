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
    <div className="px-4 md:px-6 lg:px-8 py-4 border-b border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Title and Date */}
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-blue-400">
            WOWGROUP Daily Performance
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
            <p className="text-xs md:text-sm text-gray-400">
              {formatDateIndonesian(selectedDate)}
            </p>
            <span className="hidden sm:inline text-gray-600">•</span>
            <p className="text-xs md:text-sm text-gray-500">
              Live Time: 
              <span className="ml-2 bg-green-600/20 text-green-400">{time}</span>
            </p>
          </div>
        </div>

        {/* Right: Date Picker and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <DatePicker
            date={selectedDate}
            onChange={setSelectedDate}
            onTodayClick={wgToday}
            isToday={isToday}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleDesktop}
              className="text-xs px-3 py-1.5"
            >
              Desktop
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSendTelegram}
              className="text-xs px-3 py-1.5"
            >
              Send to Telegram
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="text-xs px-3 py-1.5"
            >
              Export Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
