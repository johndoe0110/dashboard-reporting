import { colorMap } from '../../constants/colors';

export default function MetricCard({ 
  title, 
  value, 
  color, 
  description,
  progress,
  showWarning = false,
  className = ''
}) {
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
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] md:text-xs text-gray-300 truncate">
              {title}
            </p>
            {showWarning && (
              <span className="text-orange-400 text-sm">⚠️</span>
            )}
          </div>

          <p className={`mt-1 text-lg md:text-xl font-bold ${c.text}`}>
            {value}
          </p>

          {description && (
            <p className="text-[10px] md:text-xs text-gray-400 mt-1.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{progress.current} / {progress.total}</span>
            <span>{progress.remaining} remaining</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${c.bg.replace('/10', '')} ${c.border.replace('/40', '')}`}
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
