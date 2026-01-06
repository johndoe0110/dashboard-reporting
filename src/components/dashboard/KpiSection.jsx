import KpiCard from './KpiCard';

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
        <KpiCard 
          title="DAILY AD SPEND" 
          value="Rp 3.421.033" 
          color="red"
          description="Marketing Investment (Facebook + TikTok)"
        />
        <KpiCard 
          title="REVENUE" 
          value="Rp 3.114.000" 
          color="green"
          description="Amount of First Deposit"
        />
        <KpiCard 
          title="DEPOSIT RATE" 
          value="86.3%" 
          color="purple"
          description="63 deposits / 73 registrations"
        />
        <KpiCard 
          title="ADSPENT - FIRST D..." 
          value="-Rp 307.033" 
          color="red"
          description="Loss Today"
        />
        <KpiCard 
          title="NEW REGISTRATIONS" 
          value="73" 
          color="orange"
          description="New Account Sign-ups"
        />
        <KpiCard 
          title="NEW DEPOSITS" 
          value="63" 
          color="purple"
          description="Deposit Transactions"
        />
      </div>
    </div>
  );
}
