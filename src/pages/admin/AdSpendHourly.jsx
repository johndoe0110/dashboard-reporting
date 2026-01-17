import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
// ========== API IMPORTS (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
// import { adSpendHourlyAPI } from '../../services/api';

// ========== DUMMY DATA (CURRENTLY ACTIVE) ==========
const initialDummyData = [
  {
    id: 3,
    profile_id: 1,
    facebook_account_id: 1,
    ad_account_id: 'ad-acc-123',
    spend_date: '2025-12-21T00:00:00.000Z',
    spend_hour: 12,
    spend_amount: 100.5,
    time_range_start: '2025-12-21T00:00:00.000Z',
    time_range_end: '2025-12-21T00:00:00.000Z',
    raw_response: '{}',
    created_at: '2026-01-07T14:31:55.000Z',
    updated_at: '2026-01-07T14:31:55.000Z',
  },
];

export default function AdSpendHourly() {
  const [data, setData] = useState(initialDummyData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    profile_id: '',
    facebook_account_id: '',
    ad_account_id: '',
    spend_date: '',
    spend_hour: '',
    spend_amount: '',
    time_range_start: '',
    time_range_end: '',
    raw_response: '{}',
  });

  // ========== DUMMY LOAD DATA (CURRENTLY ACTIVE) ==========
  const loadData = () => {
    setLoading(false);
    // Dummy data already loaded in initial state
  };

  // ========== API LOAD DATA (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
  /*
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adSpendHourlyAPI.list();
      setData(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load ad spend records');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        profile_id: item.profile_id.toString(),
        facebook_account_id: item.facebook_account_id.toString(),
        ad_account_id: item.ad_account_id,
        spend_date: item.spend_date.split('T')[0],
        spend_hour: item.spend_hour.toString(),
        spend_amount: item.spend_amount.toString(),
        time_range_start: item.time_range_start.split('T')[0],
        time_range_end: item.time_range_end.split('T')[0],
        raw_response: item.raw_response,
      });
    } else {
      setEditingItem(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        profile_id: '',
        facebook_account_id: '',
        ad_account_id: '',
        spend_date: today,
        spend_hour: '',
        spend_amount: '',
        time_range_start: today,
        time_range_end: today,
        raw_response: '{}',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      profile_id: '',
      facebook_account_id: '',
      ad_account_id: '',
      spend_date: today,
      spend_hour: '',
      spend_amount: '',
      time_range_start: today,
      time_range_end: today,
      raw_response: '{}',
    });
  };

  // ========== DUMMY SUBMIT (CURRENTLY ACTIVE) ==========
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (editingItem) {
      setData(data.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              profile_id: parseInt(formData.profile_id),
              facebook_account_id: parseInt(formData.facebook_account_id),
              ad_account_id: formData.ad_account_id,
              spend_date: new Date(formData.spend_date).toISOString(),
              spend_hour: parseInt(formData.spend_hour),
              spend_amount: parseFloat(formData.spend_amount),
              time_range_start: new Date(formData.time_range_start).toISOString(),
              time_range_end: new Date(formData.time_range_end).toISOString(),
              raw_response: formData.raw_response,
              updated_at: new Date().toISOString(),
            }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        profile_id: parseInt(formData.profile_id),
        facebook_account_id: parseInt(formData.facebook_account_id),
        ad_account_id: formData.ad_account_id,
        spend_date: new Date(formData.spend_date).toISOString(),
        spend_hour: parseInt(formData.spend_hour),
        spend_amount: parseFloat(formData.spend_amount),
        time_range_start: new Date(formData.time_range_start).toISOString(),
        time_range_end: new Date(formData.time_range_end).toISOString(),
        raw_response: formData.raw_response,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setData([...data, newItem]);
    }
    
    setSubmitting(false);
    handleCloseModal();
  };

  // ========== API SUBMIT (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        profile_id: parseInt(formData.profile_id),
        facebook_account_id: parseInt(formData.facebook_account_id),
        ad_account_id: formData.ad_account_id,
        spend_date: formData.spend_date,
        spend_hour: parseInt(formData.spend_hour),
        spend_amount: parseFloat(formData.spend_amount),
        time_range_start: formData.time_range_start,
        time_range_end: formData.time_range_end,
        raw_response: formData.raw_response,
      };

      if (editingItem) {
        await adSpendHourlyAPI.update(editingItem.id, payload);
      } else {
        await adSpendHourlyAPI.create(payload);
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save ad spend record');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };
  */

  // ========== DUMMY DELETE (CURRENTLY ACTIVE) ==========
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this ad spend record?')) {
      return;
    }
    setData(data.filter(item => item.id !== id));
  };

  // ========== API DELETE (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
  /*
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad spend record?')) {
      return;
    }

    try {
      setError('');
      await adSpendHourlyAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete ad spend record');
      console.error('Error deleting data:', err);
    }
  };
  */

  const filteredData = data.filter(item =>
    item.ad_account_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.profile_id.toString().includes(searchTerm) ||
    item.facebook_account_id.toString().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Ad Spend Hourly</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage hourly ad spend records</p>
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
          <table className="w-full min-w-[900px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Profile ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">FB Account ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ad Account ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Spend Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Hour</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Time Range</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
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
                    <td className="px-4 py-3 text-sm">{item.profile_id}</td>
                    <td className="px-4 py-3 text-sm">{item.facebook_account_id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-xs">{item.ad_account_id}</td>
                    <td className="px-4 py-3 text-sm">{formatDateOnly(item.spend_date)}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.spend_hour}:00</td>
                    <td className="px-4 py-3 text-sm text-right">
                      Rp {item.spend_amount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-xs">
                      {formatDateOnly(item.time_range_start)} - {formatDateOnly(item.time_range_end)}
                    </td>
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
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition"
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
              {editingItem ? 'Edit Ad Spend Record' : 'Create New Ad Spend Record'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile ID
                  </label>
                  <input
                    type="number"
                    value={formData.profile_id}
                    onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Facebook Account ID
                  </label>
                  <input
                    type="number"
                    value={formData.facebook_account_id}
                    onChange={(e) => setFormData({ ...formData, facebook_account_id: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Account ID
                  </label>
                  <input
                    type="text"
                    value={formData.ad_account_id}
                    onChange={(e) => setFormData({ ...formData, ad_account_id: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spend Date
                  </label>
                  <input
                    type="date"
                    value={formData.spend_date}
                    onChange={(e) => setFormData({ ...formData, spend_date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spend Hour (0-23)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.spend_hour}
                    onChange={(e) => setFormData({ ...formData, spend_hour: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spend Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.spend_amount}
                    onChange={(e) => setFormData({ ...formData, spend_amount: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Range Start
                  </label>
                  <input
                    type="date"
                    value={formData.time_range_start}
                    onChange={(e) => setFormData({ ...formData, time_range_start: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Range End
                  </label>
                  <input
                    type="date"
                    value={formData.time_range_end}
                    onChange={(e) => setFormData({ ...formData, time_range_end: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Raw Response (JSON)
                </label>
                <textarea
                  value={formData.raw_response}
                  onChange={(e) => setFormData({ ...formData, raw_response: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
                  rows="4"
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
