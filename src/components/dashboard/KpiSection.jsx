import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  UserPlus, 
  Wallet 
} from 'lucide-react';
import KpiCard from './KpiCard';

export default function KpiSection() {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Key Performance Indicators
      </h2>

      <div
        className="
          grid gap-2 md:gap-3
          grid-cols-3
          md:grid-cols-4
          xl:grid-cols-6
        "
      >
        <KpiCard 
          title="DAILY AD SPEND" 
          value="Rp 3.421.033" 
          color="red"
          description="Marketing Investment (Facebook + TikTok)"
          icon={DollarSign}
        />
        <KpiCard 
          title="REVENUE" 
          value="Rp 3.114.000" 
          color="green"
          description="Amount of First Deposit"
          icon={TrendingUp}
        />
        <KpiCard 
          title="DEPOSIT RATE" 
          value="86.3%" 
          color="purple"
          description="63 deposits / 73 registrations"
          icon={Percent}
        />
        <KpiCard 
          title="ADSPENT - FIRST DEPO" 
          value="-Rp 307.033" 
          color="red"
          description="Loss Today"
          icon={TrendingUp}
        />
        <KpiCard 
          title="NEW REGISTRATIONS" 
          value="73" 
          color="orange"
          description="New Account Sign-ups"
          icon={UserPlus}
        />
        <KpiCard 
          title="NEW DEPOSITS" 
          value="63" 
          color="purple"
          description="Deposit Transactions"
          icon={Wallet}
        />
      </div>
    </div>
  );
}
