import { colorMap } from '../../constants/colors';

export default function KpiCard({ title, value, color, description }) {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`
        rounded-xl
        p-3 md:p-4
        border ${c.border}
        ${c.bg}
        backdrop-blur
        transition
        active:scale-95
      `}
    >
      <p className="text-[11px] md:text-xs text-gray-300 truncate">
        {title}
      </p>

      <p className={`mt-1 text-lg md:text-xl font-bold ${c.text}`}>
        {value}
      </p>

      {description && (
        <p className="text-[10px] md:text-xs text-gray-400 mt-1.5">
          {description}
        </p>
      )}
    </div>
  );
}
