import KpiCard from "./KpiCard";

export default function KpiSection() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Key Performance Indicators
      </h2>

      <div
        className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
        "
      >
        <KpiCard title="Daily Ad Spend" value="Rp 3.421.033" color="red" />
        <KpiCard title="Revenue" value="Rp 3.114.000" color="green" />
        <KpiCard title="Deposit Rate" value="86.3%" color="purple" />
        <KpiCard title="Adspent - First Deposit" value="-Rp 307.033" color="orange" />
        <KpiCard title="New Registrations" value="73" color="yellow" />
        <KpiCard title="New Deposits" value="63" color="blue" />
      </div>
    </div>
  );
}
