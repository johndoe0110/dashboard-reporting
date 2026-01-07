import { formatDateShort } from '../../utils/dateUtils';

export default function DatePicker({ date, onChange, onTodayClick, isToday }) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <input
        type="date"
        value={date.toISOString().split('T')[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="
          bg-zinc-900 
          border border-zinc-700 
          rounded-lg 
          px-2 md:px-3 
          py-1.5 md:py-2 
          text-xs md:text-sm 
          text-gray-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500/50
          w-full sm:w-auto
        "
      />
      <button
        onClick={onTodayClick}
        className={`
          px-2 md:px-3 
          py-1.5 md:py-2 
          rounded-lg 
          text-xs md:text-sm 
          font-medium
          transition-all
          whitespace-nowrap
          ${isToday 
            ? 'bg-blue-600 text-white' 
            : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700'
          }
        `}
      >
        Today
      </button>
    </div>
  );
}
