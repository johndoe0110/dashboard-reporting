import MetricCard from './MetricCard';

export default function BusinessMetrics() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Business Metrics
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
        <MetricCard
          title="DP GOAL PROGRESS"
          value="2778 / 5000"
          color="orange"
          description="2222 remaining"
          progress={{
            current: 2778,
            total: 5000,
            remaining: 2222,
          }}
          showWarning={true}
        />
        <MetricCard
          title="COST PER REGISTRATION"
          value="Rp 46.863"
          color="blue"
          description="Acquisition Efficiency"
        />
        <MetricCard
          title="COST PER DEPOSIT"
          value="Rp 54.302"
          color="blue"
          description="Based on 63 deposits"
        />
        <MetricCard
          title="ROAS"
          value="0.91x"
          color="orange"
          description="Return on Ad Spend"
          showWarning={true}
        />
        <MetricCard
          title="ACTIVE PLAYERS"
          value="2,981"
          color="green"
          description="Current Active Users"
        />
        <MetricCard
          title="ADS LEADS"
          value="29"
          color="purple"
          description="Facebook + TikTok Leads"
        />
      </div>
    </div>
  );
}
