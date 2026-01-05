const colorMap = {
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/40",
      text: "text-red-400",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/40",
      text: "text-green-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/40",
      text: "text-purple-400",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/40",
      text: "text-orange-400",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/40",
      text: "text-yellow-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      text: "text-blue-400",
    },
  };
  
  export default function KpiCard({ title, value, color }) {
    const c = colorMap[color];
  
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
      </div>
    );
  }
  