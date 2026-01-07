import { 
  Target, 
  Calculator, 
  CreditCard, 
  TrendingUp, 
  Users, 
  UserCheck 
} from 'lucide-react';
import MetricCard from './MetricCard';

export default function BusinessMetrics() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Business Metrics
      </h2>

      <div
        className="
          grid gap-2 md:gap-3
          grid-cols-3
          md:grid-cols-4
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
          icon={Target}
        />
        <MetricCard
          title="COST PER REGISTRATION"
          value="Rp 46.863"
          color="blue"
          description="Acquisition Efficiency"
          icon={Calculator}
        />
        <MetricCard
          title="COST PER DEPOSIT"
          value="Rp 54.302"
          color="blue"
          description="Based on 63 deposits"
          icon={CreditCard}
        />
        <MetricCard
          title="ROAS"
          value="0.91x"
          color="orange"
          description="Return on Ad Spend"
          showWarning={true}
          icon={TrendingUp}
        />
        <MetricCard
          title="ACTIVE PLAYERS"
          value="2,981"
          color="green"
          description="Current Active Users"
          icon={Users}
        />
        <MetricCard
          title="ADS LEADS"
          value="29"
          color="purple"
          description="Facebook + TikTok Leads"
          icon={UserCheck}
        />
      </div>
    </div>
  );
}
