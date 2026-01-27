import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { rpaRunAccountsAPI, rpaRunsAPI, profileAdAccountsAPI } from '../../services/api';

export default function RpaRunAccounts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [runs, setRuns] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [formData, setFormData] = useState({
    rpa_run_id: '',
    ad_account_id: '',
    status: 'running',
    started_at: '',
    finished_at: '',
    rows_upserted: '',
    json_data: '{}',
    error_message: '',
    meta: '{}',
  });

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

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        rpa_run_id: item.rpa_run_id.toString(),
        ad_account_id: item.ad_account_id.toString(),
        status: item.status,
        started_at: item.started_at ? item.started_at.split('T')[0] + 'T' + item.started_at.split('T')[1].substring(0, 5) : '',
        finished_at: item.finished_at ? item.finished_at.split('T')[0] + 'T' + item.finished_at.split('T')[1].substring(0, 5) : '',
        rows_upserted: item.rows_upserted.toString(),
        json_data: item.json_data,
        error_message: item.error_message || '',
        meta: item.meta,
      });
    } else {
      setEditingItem(null);
      const now = new Date().toISOString().slice(0, 16);
      setFormData({
        rpa_run_id: '',
        ad_account_id: '',
        status: 'running',
        started_at: now,
        finished_at: '',
        rows_upserted: '0',
        json_data: '{}',
        error_message: '',
        meta: '{}',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    const now = new Date().toISOString().slice(0, 16);
    setFormData({
      rpa_run_id: '',
      ad_account_id: '',
      status: 'running',
      started_at: now,
      finished_at: '',
      rows_upserted: '0',
      json_data: '{}',
      error_message: '',
      meta: '{}',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        rpa_run_id: parseInt(formData.rpa_run_id),
        ad_account_id: parseInt(formData.ad_account_id),
        status: formData.status,
        started_at: formData.started_at,
        finished_at: formData.finished_at || null,
        rows_upserted: parseInt(formData.rows_upserted),
        json_data: formData.json_data,
        error_message: formData.error_message || null,
        meta: formData.meta,
      };

      if (editingItem) {
        await rpaRunAccountsAPI.update(editingItem.id, payload);
      } else {
        await rpaRunAccountsAPI.create(payload);
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save RPA run account');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this RPA run account?')) {
      return;
    }

    try {
      setError('');
      await rpaRunAccountsAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete RPA run account');
      console.error('Error deleting data:', err);
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
            <Button
              variant="primary"
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </Button>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          // className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition"
                          disabled
                          className="p-1.5 text-red-400/40 bg-red-500/10 rounded cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit RPA Run Account' : 'Create New RPA Run Account'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RPA Run
                  </label>
                  <select
                    value={formData.rpa_run_id}
                    onChange={(e) => setFormData({ ...formData, rpa_run_id: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">Select RPA Run</option>
                    {runs.map((run) => (
                      <option key={run.id} value={run.id}>
                        #{run.id} - Profile {run.profile_id} ({run.run_type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Account
                  </label>
                  <select
                    value={formData.ad_account_id}
                    onChange={(e) => setFormData({ ...formData, ad_account_id: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">Select Ad Account</option>
                    {adAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.ad_account_id} (Profile {acc.profile_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="running">Running</option>
                    <option value="finished">Finished</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rows Upserted
                  </label>
                  <input
                    type="number"
                    value={formData.rows_upserted}
                    onChange={(e) => setFormData({ ...formData, rows_upserted: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Started At
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.started_at}
                    onChange={(e) => setFormData({ ...formData, started_at: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Finished At
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.finished_at}
                    onChange={(e) => setFormData({ ...formData, finished_at: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Error Message
                </label>
                <input
                  type="text"
                  value={formData.error_message}
                  onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Leave empty if no error"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  JSON Data
                </label>
                <textarea
                  value={formData.json_data}
                  onChange={(e) => setFormData({ ...formData, json_data: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta
                </label>
                <textarea
                  value={formData.meta}
                  onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      {editingItem ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingItem ? 'Update' : 'Create'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
