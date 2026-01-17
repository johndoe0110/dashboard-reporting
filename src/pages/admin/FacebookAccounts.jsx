import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
// ========== API IMPORTS (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
// import { facebookAccountsAPI } from '../../services/api';

// ========== DUMMY DATA (CURRENTLY ACTIVE) ==========
const initialDummyData = [
  {
    id: 1,
    profile_id: 1,
    fb_user_id: '123456789',
    fb_email: 'user@example.com',
    fb_username: 'fbuser',
    fb_password_encrypted: 'encryptedpass',
    is_active: 1,
    last_login_at: '2025-12-21T12:00:00.000Z',
    created_at: '2026-01-07T14:31:29.000Z',
  },
];

export default function FacebookAccounts() {
  const [data, setData] = useState(initialDummyData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    profile_id: '',
    fb_user_id: '',
    fb_email: '',
    fb_username: '',
    fb_password_encrypted: '',
    is_active: 1,
    last_login_at: '',
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
      const response = await facebookAccountsAPI.list();
      setData(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load Facebook accounts');
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
        fb_user_id: item.fb_user_id,
        fb_email: item.fb_email,
        fb_username: item.fb_username,
        fb_password_encrypted: item.fb_password_encrypted,
        is_active: item.is_active,
      });
    } else {
      setEditingItem(null);
      setFormData({
        profile_id: '',
        fb_user_id: '',
        fb_email: '',
        fb_username: '',
        fb_password_encrypted: '',
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
      fb_user_id: '',
      fb_email: '',
      fb_username: '',
      fb_password_encrypted: '',
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
              ...formData,
              profile_id: parseInt(formData.profile_id),
              is_active: parseInt(formData.is_active),
              updated_at: new Date().toISOString(),
            }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        profile_id: parseInt(formData.profile_id),
        is_active: parseInt(formData.is_active),
        last_login_at: null,
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
        fb_user_id: formData.fb_user_id,
        fb_email: formData.fb_email,
        fb_username: formData.fb_username,
        fb_password_encrypted: formData.fb_password_encrypted,
        is_active: parseInt(formData.is_active),
      };

      if (formData.last_login_at) {
        payload.last_login_at = formData.last_login_at;
      }

      if (editingItem) {
        await facebookAccountsAPI.update(editingItem.id, payload);
      } else {
        await facebookAccountsAPI.create(payload);
      }

      await loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save Facebook account');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };
  */

  // ========== DUMMY DELETE (CURRENTLY ACTIVE) ==========
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this Facebook account?')) {
      return;
    }
    setData(data.filter(item => item.id !== id));
  };

  // ========== API DELETE (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
  /*
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Facebook account?')) {
      return;
    }

    try {
      setError('');
      await facebookAccountsAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete Facebook account');
      console.error('Error deleting data:', err);
    }
  };
  */

  const filteredData = data.filter(item =>
    item.fb_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fb_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fb_user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Facebook Accounts</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage Facebook accounts and their credentials</p>
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
                <th className="px-4 py-3 text-left text-sm font-semibold">FB User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Password</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Last Login</th>
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
                    <td className="px-4 py-3 text-sm">{item.fb_user_id}</td>
                    <td className="px-4 py-3 text-sm">{item.fb_email}</td>
                    <td className="px-4 py-3 text-sm">{item.fb_username}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {showPassword[item.id] 
                            ? item.fb_password_encrypted 
                            : '••••••••'}
                        </span>
                        <button
                          onClick={() => setShowPassword({
                            ...showPassword,
                            [item.id]: !showPassword[item.id]
                          })}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          {showPassword[item.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
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
                    <td className="px-4 py-3 text-sm">{formatDate(item.last_login_at)}</td>
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
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Facebook Account' : 'Create New Facebook Account'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  FB User ID
                </label>
                <input
                  type="text"
                  value={formData.fb_user_id}
                  onChange={(e) => setFormData({ ...formData, fb_user_id: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.fb_email}
                  onChange={(e) => setFormData({ ...formData, fb_email: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.fb_username}
                  onChange={(e) => setFormData({ ...formData, fb_username: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password (Encrypted)
                </label>
                <input
                  type="text"
                  value={formData.fb_password_encrypted}
                  onChange={(e) => setFormData({ ...formData, fb_password_encrypted: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
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
