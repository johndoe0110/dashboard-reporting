export default function Alert({ type = 'warning', title, message, className = '' }) {
  const styles = {
    warning: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/40',
      text: 'text-red-400',
      icon: '❌',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      icon: 'ℹ️',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/40',
      text: 'text-green-400',
      icon: '✅',
    },
  };

  const style = styles[type] || styles.warning;

  return (
    <div
      className={`
        ${style.bg}
        ${style.border}
        border rounded-lg
        px-4 py-3
        ${className}
      `}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg">{style.icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${style.text} text-sm`}>{title}</h3>
          {message && (
            <p className={`${style.text} text-xs mt-1 opacity-90`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
