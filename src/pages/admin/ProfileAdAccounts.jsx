import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
// ========== API IMPORTS (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
// import { profileAdAccountsAPI } from '../../services/api';

// ========== DUMMY DATA (CURRENTLY ACTIVE) ==========
const initialDummyData = [
  {
    id: 2,
    profile_id: 1,
    facebook_account_id: 1,
    ad_account_id: 'ad-acc-123',
    account_name: 'Ad Account',
    currency: 'USD',
    timezone: 'UTC',
    is_active: 1,
    created_at: '2026-01-17T11:09:25.000Z',
  },
];

export default function ProfileAdAccounts() {
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
    account_name: '',
    currency: 'USD',
    timezone: 'UTC',
    is_active: 1,
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
      const response = await profileAdAccountsAPI.list();
      setData(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load profile ad accounts');
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
        account_name: item.account_name,
        currency: item.currency,
        timezone: item.timezone,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        profile_id: '',
        facebook_account_id: '',
        ad_account_id: '',
        account_name: '',
        currency: 'USD',
        timezone: 'UTC',
        is_active: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      profile_id: '',
      facebook_account_id: '',
      ad_account_id: '',
      account_name: '',
      currency: 'USD',
      timezone: 'UTC',
      is_active: 1,
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
              account_name: formData.account_name,
              currency: formData.currency,
              timezone: formData.timezone,
              is_active: parseInt(formData.is_active),
            }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        profile_id: parseInt(formData.profile_id),
        facebook_account_id: parseInt(formData.facebook_account_id),
        ad_account_id: formData.ad_account_id,
        account_name: formData.account_name,
        currency: formData.currency,
        timezone: formData.timezone,
        is_active: parseInt(formData.is_active),
        created_at: new Date().toISOString(),
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
        account_name: formData.account_name,
        currency: formData.currency,
        timezone: formData.timezone,
        is_active: parseInt(formData.is_active),
      };

      if (editingItem) {
        await profileAdAccountsAPI.update(editingItem.id, payload);
      } else {
        await profileAdAccountsAPI.create(payload);
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save profile ad account');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };
  */

  // ========== DUMMY DELETE (CURRENTLY ACTIVE) ==========
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this profile ad account?')) {
      return;
    }
    setData(data.filter(item => item.id !== id));
  };

  // ========== API DELETE (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
  /*
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile ad account?')) {
      return;
    }

    try {
      setError('');
      await profileAdAccountsAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete profile ad account');
      console.error('Error deleting data:', err);
    }
  };
  */

  const filteredData = data.filter(item =>
    item.ad_account_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.profile_id.toString().includes(searchTerm) ||
    item.facebook_account_id.toString().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  const currencies = ['USD', 'IDR', 'EUR', 'GBP', 'JPY', 'CNY'];
  const timezones = ['UTC', 'Asia/Jakarta', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Profile Ad Accounts</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage profile ad account configurations</p>
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
                placeholder="Search accounts..."
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
              <span>Add Account</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Profile ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">FB Account ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ad Account ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Account Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Currency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Timezone</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
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
                    No accounts found
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
                    <td className="px-4 py-3 text-sm">{item.account_name}</td>
                    <td className="px-4 py-3 text-sm">{item.currency}</td>
                    <td className="px-4 py-3 text-sm">{item.timezone}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.is_active === 1
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {item.is_active === 1 ? 'Active' : 'Inactive'}
                      </span>
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
              {editingItem ? 'Edit Profile Ad Account' : 'Create New Profile Ad Account'}
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
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
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
