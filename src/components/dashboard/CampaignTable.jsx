import { useQuery } from '@tanstack/react-query';
import { adSpendHourlyAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export default function CampaignTable({ brandId, spendDate, enabled }) {
  const hasFilters = !!brandId && !!spendDate && !!enabled;

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['ad-spend-hourly-dashboard', brandId, spendDate],
    queryFn: () =>
      adSpendHourlyAPI.listNoThrow(1, 99999, {
        brand_id: brandId,
        spend_date: spendDate,
      }),
    enabled: hasFilters,
  });

  const envelope = res ?? null;
  const isOk = envelope?.success === true && envelope?.code === 200;
  const rows = isOk ? (envelope?.data?.list ?? []) : [];

  if (!enabled) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center text-gray-400 text-sm">
        Pilih brand & tanggal lalu klik Load untuk melihat Ad Spend Hourly.
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-red-800 p-4 text-center text-red-400 text-sm">
        {error.message || 'Gagal memuat Ad Spend Hourly.'}
      </div>
    );
  }

  if (envelope && !isOk) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center text-gray-400 text-sm">
        {envelope.message || 'Data Ad Spend Hourly tidak tersedia.'}
      </div>
    );
  }

  if (!isLoading && rows.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center text-gray-400 text-sm">
        Tidak ada data Ad Spend Hourly untuk tanggal tersebut.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-gray-200">Ad Spend Hourly</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-xs">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Ad Account ID</th>
              <th className="px-3 py-2 text-left">Spend Date</th>
              <th className="px-3 py-2 text-center">Hour</th>
              <th className="px-3 py-2 text-right">Spend Amount</th>
              <th className="px-3 py-2 text-right">Diff Spend</th>
              <th className="px-3 py-2 text-right">Impression</th>
              <th className="px-3 py-2 text-left">Raw Response Diff</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-3 py-2 text-gray-300">{item.id}</td>
                  <td className="px-3 py-2 text-gray-300 font-mono">{item.ad_account_id}</td>
                  <td className="px-3 py-2 text-gray-300">
                    {item.spend_date
                      ? new Date(item.spend_date).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-300">
                    {item.spend_hour}:00
                  </td>
                  <td className="px-3 py-2 text-right text-gray-300">
                    {formatCurrency(Number(item.spend_amount || 0))}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-300">
                    {formatCurrency(Number(item.diff_spend_amount || 0))}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-300">
                    {item.impression != null ? Number(item.impression).toLocaleString('id-ID') : '-'}
                  </td>
                  <td
                    className="px-3 py-2 text-gray-500 max-w-[260px] truncate"
                    title={item.raw_response_diff != null ? String(item.raw_response_diff) : ''}
                  >
                    {item.raw_response_diff != null ? String(item.raw_response_diff) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
