import { Wallet, ArrowDownCircle, BarChart3 } from 'lucide-react';
import MetricCard from './MetricCard';

export default function SecondaryMetrics() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Secondary Metrics
      </h2>

      <div
        className="
          grid gap-2 md:gap-3
          grid-cols-3
        "
      >
        <MetricCard
          title="TOTAL DEPOSITS"
          value="Rp 309.294.000"
          color="green"
          icon={Wallet}
        />
        <MetricCard
          title="WITHDRAWALS"
          value="Rp 256.631.000"
          color="red"
          icon={ArrowDownCircle}
        />
        <MetricCard
          title="AVG CPR"
          value="Rp 117.967"
          color="blue"
          icon={BarChart3}
        />
      </div>
    </div>
  );
}
