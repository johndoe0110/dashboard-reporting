import {
  DollarSign,
  TrendingUp,
  Percent,
  UserPlus,
  Wallet,
  ArrowDownCircle,
  Calculator,
} from 'lucide-react';
import KpiCard from './KpiCard';
import { formatCurrency, formatRpTwoDecimals, formatRpDecimal, formatPercentage } from '../../utils/formatters';

export default function KpiSection({ summary, loading }) {
  const s = summary || {};
  const dailyAdSpend = s.totalAdSpent ?? 0;
  const totalDailyAdSpend = s.totalDailyAdSpend ?? 0;
  const diffDailyAdSpend = s.totalDiffAdSpent ?? 0;
  const newReg = s.newRegistrations ?? 0;
  const newDepo = s.newDeposits ?? 0;
  const redepo = s.redepositCount ?? 0;
  const totalDepo = s.totalDeposits ?? 0;
  const totalNewDepoAmount = s.totalNewDepoAmount ?? 0;

  const redepoTotalForm = s.redepoTotalForm ?? 0;
  const firstDepoOrganic = s.firstDepoOrganic ?? 0;
  const firstDepoAds = s.firstDepoAds ?? 0;
  const avgPerDepo = s.avgPerDepo ?? 0;
  const regPerDepoAdsPct = s.regPerDepoAdsPct ?? 0;
  const cpr = s.cpr ?? 0;
  const cpd = s.cpd ?? 0;
  const cpd3 = s.cpd3 ?? 0;
  const roas = s.roas ?? 0;

  const valText = (n) => (loading ? '...' : formatCurrency(n));

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Key Performance Indicators
      </h2>

      <div
        className="
          grid gap-2 md:gap-3
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4
        "
      >
        {/* 1. Total Daily Ad Spend */}
        <KpiCard
          title="TOTAL DAILY AD SPEND"
          value={loading ? '...' : formatRpTwoDecimals(totalDailyAdSpend)}
          color="red"
          description="Total Ad Spend + Diff Ad Spend"
          icon={DollarSign}
        />
        {/* 2. Daily Ad Spend */}
        <KpiCard
          title="DAILY AD SPEND"
          value={loading ? '...' : formatRpTwoDecimals(dailyAdSpend)}
          color="blue"
          description="Total Spending"
          icon={TrendingUp}
        />
        {/* 3. Difference Daily Ad Spent */}
        <KpiCard
          title="DIFFERENCE DAILY AD SPENT"
          value={loading ? '...' : formatRpTwoDecimals(diffDailyAdSpend)}
          color="purple"
          description="Total Diff Ad Spending"
          icon={ArrowDownCircle}
        />
        {/* 4. New Regis */}
        <KpiCard
          title="NEW REGIS"
          value={loading ? '...' : String(newReg)}
          color="green"
          description="New Member Registration"
          icon={UserPlus}
        />
        {/* 5. First Depo : C */}
        <KpiCard
          title="FIRST DEPO : C"
          value={loading ? '...' : String(newDepo)}
          color="purple"
          description="New Deposit Member"
          icon={Wallet}
        />
        {/* 6. Redepo */}
        <KpiCard
          title="REDEPO"
          value={loading ? '...' : String(redepo)}
          color="red"
          description="Member Re-deposit"
          icon={TrendingUp}
        />
        {/* 7. Total Deposit */}
        <KpiCard
          title="TOTAL DEPO"
          value={valText(totalDepo)}
          color="orange"
          description="Total Deposit"
          icon={Wallet}
        />
        {/* 8. Total New Depo */}
        <KpiCard
          title="TOTAL NEW DEPO"
          value={valText(totalNewDepoAmount)}
          color="purple"
          description="Total New Deposit"
          icon={Wallet}
        />
        {/* 9. Redepo Total Form */}
        <KpiCard
          title="REDEPO TOTAL FORM"
          value={loading ? '...' : redepoTotalForm.toFixed(2)}
          color="blue"
          description="Re-deposit - New Deposit Member"
          icon={ArrowDownCircle}
        />
        {/* 10. First Depo Organic (3%) : D */}
        <KpiCard
          title="FIRST DEPO ORGANIC (3%) : D"
          value={loading ? '...' : firstDepoOrganic.toFixed(2)}
          color="green"
          description="3% * Redepo Total Form"
          icon={Percent}
        />
        {/* 11. First Depo Ads (C - D) */}
        <KpiCard
          title="FIRST DEPO ADS (C - D)"
          value={loading ? '...' : firstDepoAds.toFixed(2)}
          color="orange"
          description="Total New Deposit - FIRST DEPO ORGANIC (3%) : D"
          icon={TrendingUp}
        />
        {/* 12. AVG/DEPO */}
        <KpiCard
          title="AVG/DEPO"
          value={loading ? '...' : formatRpDecimal(avgPerDepo)}
          color="blue"
          description="Total New Deposit / new_deposit_count"
          icon={Calculator}
        />
        {/* 13. %Reg/Depo Ads */}
        <KpiCard
          title="%REG/DEPO ADS"
          value={loading ? '...' : formatPercentage(regPerDepoAdsPct, 2)}
          color="purple"
          description="(New Depo / New Regis) * 100"
          icon={Percent}
        />
        {/* 14. CPR */}
        <KpiCard
          title="COST PER REGISTRATION"
          value={loading ? '...' : formatRpDecimal(cpr)}
          color="green"
          description="Total Ad Spending / New Regis"
          icon={Calculator}
        />
        {/* 15. CPD */}
        <KpiCard
          title="COST PER DEPO"
          value={loading ? '...' : formatRpDecimal(cpd)}
          color="green"
          description="Total Ad Spending / New Depo"
          icon={Calculator}
        />
        {/* 16. CPD 3% */}
        <KpiCard
          title="COST PER DEPO (CUT 3%)"
          value={loading ? '...' : formatRpDecimal(cpd3)}
          color="green"
          description="Total Ad Spending / First Depo Ads"
          icon={Calculator}
        />
        {/* 17. ROAS */}
        <KpiCard
          title="ROAS"
          value={loading ? '...' : `${Number(roas).toFixed(2)}x`}
          color="orange"
          description="Total Ad Spending / Total New Depo"
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
