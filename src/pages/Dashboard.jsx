import { useDatePicker } from '../hooks/useDatePicker';
import Header from '../components/dashboard/Header';
import RoasAlert from '../components/dashboard/RoasAlert';
import KpiSection from '../components/dashboard/KpiSection';
import BusinessMetrics from '../components/dashboard/BusinessMetrics';
import SecondaryMetrics from '../components/dashboard/SecondaryMetrics';
import CampaignTable from '../components/dashboard/CampaignTable';

export default function Dashboard() {
  const { selectedDate, setSelectedDate, wgToday, isToday } = useDatePicker();

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Header 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        wgToday={wgToday}
        isToday={isToday}
      />

      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* ROAS Alert */}
        <RoasAlert currentRoas={0.91} targetRoas={2.0} />

        {/* KPI Section */}
        <KpiSection />

        {/* Business Metrics */}
        <BusinessMetrics />

        {/* Secondary Metrics */}
        <SecondaryMetrics />

        {/* Campaign Tables */}
        <CampaignTable selectedDate={selectedDate} />
      </div>
    </div>
  );
}
