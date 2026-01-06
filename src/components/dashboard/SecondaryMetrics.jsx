import MetricCard from './MetricCard';

export default function SecondaryMetrics() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Secondary Metrics
      </h2>

      <div
        className="
          grid gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <MetricCard
          title="TOTAL DEPOSITS"
          value="Rp 309.294.000"
          color="green"
        />
        <MetricCard
          title="WITHDRAWALS"
          value="Rp 256.631.000"
          color="red"
        />
        <MetricCard
          title="AVG CPR"
          value="Rp 117.967"
          color="blue"
        />
      </div>
    </div>
  );
}
