import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { rpaRunAccountsAPI, rpaRunsAPI, profileAdAccountsAPI } from '../../services/api';

export default function RpaRunAccounts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [runs, setRuns] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [runAccRes, runsRes, adAccRes] = await Promise.all([
        rpaRunAccountsAPI.list(1, 99999),
        rpaRunsAPI.list(1, 99999),
        profileAdAccountsAPI.list(1, 99999),
      ]);
      setData(runAccRes?.data?.list || []);
      setRuns(runsRes?.data?.list || []);
      setAdAccounts(adAccRes?.data?.list || []);
    } catch (err) {
      setError(err.message || 'Failed to load RPA run accounts');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    item.rpa_run_id.toString().includes(searchTerm) ||
    item.ad_account_id.toString().includes(searchTerm) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">RPA Run Accounts</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage RPA run account records</p>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">RPA Run ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ad Account ID</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Started At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Finished At</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Rows Upserted</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm">{item.rpa_run_id}</td>
                    <td className="px-4 py-3 text-sm">{item.ad_account_id}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          item.status === 'running'
                            ? 'bg-blue-600/20 text-blue-400'
                            : item.status === 'finished'
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.started_at)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.finished_at)}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.rows_upserted}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
