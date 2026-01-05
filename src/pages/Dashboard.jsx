export default function Dashboard() {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-4">
          <h1 className="text-lg md:text-2xl font-bold text-blue-400">
            WOWGROUP Daily Performance
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Monday, January 5, 2026
          </p>
        </div>
  
        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* KPI */}
          <KpiSection />
  
          {/* Business Metrics */}
          <BusinessMetrics />
  
          {/* Table */}
          <CampaignTable />
        </div>
      </div>
    );
  }
  