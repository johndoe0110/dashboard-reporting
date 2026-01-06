import { formatCurrency } from '../../utils/formatters';

const mockTikTokCampaigns = [
  {
    id: 1,
    name: '24NOV_GTT_BAJU31',
    adAccount: 'GTT-18',
    status: 'Active',
    budget: 1000000,
    spent: 571920,
    cpr: 114384,
    leads: 5,
  },
  {
    id: 2,
    name: '24NOV_GTT_BAJU32',
    adAccount: 'GTT-02',
    status: 'Active',
    budget: 1000000,
    spent: 860167,
    cpr: 215042,
    leads: 4,
  },
  {
    id: 3,
    name: '24NOV_GTT_BAJU36',
    adAccount: 'GTT-23',
    status: 'Active',
    budget: 1000000,
    spent: 827638,
    cpr: 63664,
    leads: 13,
  },
  {
    id: 4,
    name: '24NOV_GTT_BAJU38',
    adAccount: 'GTT-19',
    status: 'Off',
    budget: 1000000,
    spent: 1354,
    cpr: 0,
    leads: 0,
  },
  {
    id: 5,
    name: '24NOV_GTT_BAJU31',
    adAccount: 'GTT-18',
    status: 'Off',
    budget: 1000000,
    spent: 0,
    cpr: 0,
    leads: 0,
  },
  {
    id: 6,
    name: '24NOV_GTT_BAJU33',
    adAccount: 'GTT-19',
    status: 'Off',
    budget: 1000000,
    spent: 575318,
    cpr: 191773,
    leads: 3,
  },
  {
    id: 7,
    name: '24NOV_GTT_BAJU30',
    adAccount: 'GTT-02',
    status: 'Off',
    budget: 1000000,
    spent: 574151,
    cpr: 287076,
    leads: 2,
  },
  {
    id: 8,
    name: '24NOV_GTT_BAJU35',
    adAccount: 'GTT-18',
    status: 'Off',
    budget: 1000000,
    spent: 10485,
    cpr: 5243,
    leads: 2,
  },
];

function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        isActive
          ? 'bg-green-600/20 text-green-400'
          : 'bg-red-600/20 text-red-400'
      }`}
    >
      {status}
    </span>
  );
}

function CampaignTableSection({ title, campaigns, date }) {
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <div className="px-4 py-8 text-center text-gray-400 text-sm">
          No {title.toLowerCase()} found for {date}
        </div>
      </div>
    );
  }

  const activeCount = campaigns.filter((c) => c.status === 'Active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const avgCpr = totalLeads > 0 ? totalSpent / totalLeads : 0;
  const uniqueAccounts = new Set(campaigns.map((c) => c.adAccount)).size;
  const todayBudget = 5000000;
  const budgetLeft = todayBudget - totalSpent;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-xs">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">Campaign Name</th>
              <th className="px-3 py-2 text-left">Ad Account</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-right">Budget (IDR)</th>
              <th className="px-3 py-2 text-right">Spent (IDR)</th>
              <th className="px-3 py-2 text-right">CPR (IDR)</th>
              <th className="px-3 py-2 text-right">Leads</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-3 py-2 text-gray-300">{campaign.name}</td>
                <td className="px-3 py-2 text-gray-400">{campaign.adAccount}</td>
                <td className="px-3 py-2 text-center">
                  <StatusBadge status={campaign.status} />
                </td>
                <td className="px-3 py-2 text-right text-gray-300">
                  {formatCurrency(campaign.budget)}
                </td>
                <td className="px-3 py-2 text-right text-gray-300">
                  {formatCurrency(campaign.spent)}
                </td>
              <td className="px-3 py-2 text-right text-gray-300">
                {campaign.cpr > 0 ? formatCurrency(campaign.cpr) : 'Rp 0'}
              </td>
                <td className="px-3 py-2 text-right text-gray-300">
                  {campaign.leads}
                </td>
              </tr>
            ))}

            {/* Summary Row */}
            <tr className="bg-zinc-800/50 font-semibold">
              <td className="px-3 py-2 text-gray-200">
                TOTAL ({campaigns.length} campaigns, {activeCount} Active, {campaigns.length - activeCount} Off)
              </td>
              <td className="px-3 py-2 text-gray-400">
                {uniqueAccounts} Accounts
              </td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2 text-right text-gray-200">
                {formatCurrency(totalBudget)}
              </td>
              <td className="px-3 py-2 text-right text-gray-200">
                {formatCurrency(totalSpent)}
              </td>
              <td className="px-3 py-2 text-right text-gray-200">
                {formatCurrency(avgCpr)}
              </td>
              <td className="px-3 py-2 text-right text-gray-200">
                {totalLeads}
              </td>
            </tr>

            {/* Today Budget Row */}
            <tr className="bg-zinc-800/30">
              <td className="px-3 py-2 text-gray-300 font-medium">TODAY BUDGET</td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2 text-right text-gray-300">
                {formatCurrency(todayBudget)}
              </td>
              <td className="px-3 py-2 text-right text-gray-300">
                {formatCurrency(budgetLeft)} (Left)
              </td>
              <td className="px-3 py-2"></td>
              <td className="px-3 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CampaignTable({ selectedDate = new Date() }) {
  const dateStr = new Date(selectedDate).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      <CampaignTableSection
        title="Facebook Campaigns"
        campaigns={[]}
        date={dateStr}
      />
      <CampaignTableSection
        title="TikTok Campaigns"
        campaigns={mockTikTokCampaigns}
        date={dateStr}
      />
    </div>
  );
}
