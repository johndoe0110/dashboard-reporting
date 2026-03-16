import { useMemo, useState } from 'react';
import { useDatePicker } from '../hooks/useDatePicker';
import Header from '../components/dashboard/Header';
import RoasAlert from '../components/dashboard/RoasAlert';
import KpiSection from '../components/dashboard/KpiSection';
import BusinessMetrics from '../components/dashboard/BusinessMetrics';
import SecondaryMetrics from '../components/dashboard/SecondaryMetrics';
import CampaignTable from '../components/dashboard/CampaignTable';
import AdSpendCards from '../components/dashboard/AdSpendCards';
import { brandDailyStatsAPI, brandsAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';

function computeMetricsFromData(row) {
  if (!row) {
    return {
      totalAdSpent: 0,
      totalDiffAdSpent: 0,
      totalDailyAdSpend: 0,
      newRegistrations: 0,
      newDeposits: 0,
      redepositCount: 0,
      totalDeposits: 0,
      revenue: 0,
      redepoTotalForm: 0,
      firstDepoOrganic: 0,
      firstDepoAds: 0,
      avgPerDepo: 0,
      regPerDepoAdsPct: 0,
      cpr: 0,
      cpd: 0,
      cpd3: 0,
      roas: 0,
    };
  }

  const newReg = Number(row.new_registration_count) || 0;
  const newDepo = Number(row.new_deposit_count) || 0;
  const redepo = Number(row.redeposit_count) || 0;
  const totalNewDepoAmount = Number(row.total_new_deposit_amount) || 0;
  const totalAdSpent = Number(row.total_ad_spent ?? 0);
  const totalDiffAdSpent = Number(row.total_diff_ad_spent ?? 0);

  const redepoTotalForm = redepo - newDepo;
  const firstDepoOrganic = redepoTotalForm * 0.03;
  const firstDepoAds = newDepo - firstDepoOrganic;
  const avgPerDepo = newDepo > 0 ? totalNewDepoAmount / newDepo : 0;
  const regPerDepoAdsPct = newReg > 0 ? (newDepo / newReg) * 100 : 0;
  const cpr = newReg > 0 ? totalAdSpent / newReg : 0;
  const cpd = newDepo > 0 ? totalAdSpent / newDepo : 0;
  const cpd3 = firstDepoAds > 0 ? totalAdSpent / firstDepoAds : 0;
  const roas = totalNewDepoAmount > 0 ? totalAdSpent / totalNewDepoAmount : 0;

  return {
    totalAdSpent,
    totalDiffAdSpent,
    totalDailyAdSpend: totalAdSpent + totalDiffAdSpent,
    newRegistrations: newReg,
    newDeposits: newDepo,
    redepositCount: redepo,
    totalDeposits: Number(row.total_deposit_amount) || 0,
    revenue: totalNewDepoAmount,
    redepoTotalForm,
    firstDepoOrganic,
    firstDepoAds,
    avgPerDepo,
    regPerDepoAdsPct,
    cpr,
    cpd,
    cpd3,
    roas,
  };
}

export default function Dashboard() {
  const { selectedDate, setSelectedDate, wgToday, isToday } = useDatePicker(null);
  const [selectedBrandId, setSelectedBrandId] = useState('');

  const dateStr = useMemo(() => {
    if (!selectedDate) return '';
    const d = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
    return d.toISOString().split('T')[0];
  }, [selectedDate]);

  const hasFilters = !!selectedBrandId && !!dateStr;
  const brandIdNum = selectedBrandId ? Number(selectedBrandId) : undefined;

  const { data: brandsRes } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.list(1, 99999),
  });

  const { data: withAdSpendRes, isLoading: loadingWithAdSpend } = useQuery({
    queryKey: ['brand-daily-stats-with-ad-spend', brandIdNum, dateStr],
    queryFn: () => brandDailyStatsAPI.getWithAdSpend(brandIdNum, dateStr),
    enabled: hasFilters,
  });

  const brands = brandsRes?.data?.list ?? [];
  // API returns a single object in `data`
  const apiData = withAdSpendRes?.data ?? null;

  // Normalize both naming variants just in case
  const totalAdSpend = apiData?.total_ad_spent ?? apiData?.totalAdSpent ?? apiData?.total_ad_spend ?? 0;
  const totalDiffAdSpent = apiData?.total_diff_ad_spent ?? apiData?.totalDiffAdSpent ?? 0;
  const totalDailyAdSpend = Number(totalAdSpend) + Number(totalDiffAdSpent);

  const summary = useMemo(() => computeMetricsFromData(apiData), [apiData]);

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedBrandId={selectedBrandId}
        setSelectedBrandId={setSelectedBrandId}
        brands={brands}
        wgToday={wgToday}
        isToday={isToday}
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {!hasFilters ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12 text-center">
            <p className="text-gray-400 text-sm md:text-base">
              Pilih <strong className="text-gray-300">brand</strong> dan <strong className="text-gray-300">tanggal</strong> untuk menampilkan data.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Gunakan dropdown Brand dan Date di atas.
            </p>
          </div>
        ) : (
          <>
            <RoasAlert
              currentRoas={summary?.roas ?? 0.91}
              targetRoas={2.0}
            />

            <AdSpendCards
              totalDailyAdSpend={totalDailyAdSpend}
              dailyAdSpend={Number(totalAdSpend)}
              differenceDailyAdSpent={Number(totalDiffAdSpent)}
              loading={loadingWithAdSpend}
            />

            <KpiSection summary={summary} loading={loadingWithAdSpend} />

            <BusinessMetrics summary={summary} loading={loadingWithAdSpend} />

            <SecondaryMetrics />

            <CampaignTable selectedDate={selectedDate} />
          </>
        )}
      </div>
    </div>
  );
}
