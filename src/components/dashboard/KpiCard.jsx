import { colorMap } from '../../constants/colors';

export default function KpiCard({ title, value, color, description, icon: Icon }) {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`
        rounded-xl
        p-2.5 md:p-3 lg:p-4
        border ${c.border}
        ${c.bg}
        backdrop-blur
        transition
        active:scale-95
        relative
      `}
    >
      {Icon && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4">
          <Icon className={`${c.text} w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 opacity-80`} />
        </div>
      )}
      
      <p className="text-[10px] md:text-[11px] lg:text-xs text-gray-300 truncate pr-7 md:pr-8 mb-1.5 md:mb-2">
        {title}
      </p>

      <p className={`text-sm md:text-lg lg:text-xl font-bold ${c.text} leading-tight`}>
        {value}
      </p>

      {description && (
        <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-400 mt-1 md:mt-1.5 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
}
