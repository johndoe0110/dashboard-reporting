import KpiCard from "./components/KpiCard";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold text-blue-400">
          WOWGROUP Daily Performance
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Monday, January 5, 2026
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* KPI Section */}
        <div>
          <p className="text-sm text-gray-300 mb-2">
            Key Performance Indicators
          </p>

          <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
            <KpiCard title="Daily Ad Spend" value="Rp 3.421.033" color="red" />
            <KpiCard title="Revenue" value="Rp 3.114.000" color="green" />
            <KpiCard title="Deposit Rate" value="86.3%" color="purple" />
            <KpiCard title="Adspent - First Deposit" value="-Rp 307.033" color="orange" />
            <KpiCard title="New Registrations" value="73" color="yellow" />
            <KpiCard title="New Deposits" value="63" color="blue" />
          </div>
          
        </div>
      </div>
    </div>
  );
}