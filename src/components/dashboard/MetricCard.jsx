import { colorMap } from '../../constants/colors';

export default function MetricCard({ 
  title, 
  value, 
  color, 
  description,
  progress,
  showWarning = false,
  icon: Icon,
  className = ''
}) {
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
        relative
        ${className}
      `}
    >
      {Icon && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4">
          <Icon className={`${c.text} w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 opacity-80`} />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 pr-7 md:pr-8">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <p className="text-[10px] md:text-[11px] lg:text-xs text-gray-300 truncate flex-1">
              {title}
            </p>
            {showWarning && (
              <span className="text-orange-400 text-xs md:text-sm">⚠️</span>
            )}
          </div>

          <p className={`text-sm md:text-lg lg:text-xl font-bold ${c.text} leading-tight`}>
            {value}
          </p>

          {description && (
            <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-400 mt-1 md:mt-1.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-2 md:mt-3">
          <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-400 mb-1">
            <span>{progress.current} / {progress.total}</span>
            <span className="hidden sm:inline">{progress.remaining} remaining</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 md:h-2">
            <div
              className={`h-1.5 md:h-2 rounded-full ${c.bg.replace('/10', '')} ${c.border.replace('/40', '')}`}
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
