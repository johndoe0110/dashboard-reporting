import { formatDateShort } from '../../utils/dateUtils';

export default function DatePicker({ date, onChange, onTodayClick, isToday }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date.toISOString().split('T')[0]}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="
          bg-zinc-900 
          border border-zinc-700 
          rounded-lg 
          px-3 py-2 
          text-sm text-gray-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500/50
        "
      />
      <button
        onClick={onTodayClick}
        className={`
          px-3 py-2 
          rounded-lg 
          text-sm font-medium
          transition-all
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
