import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
// ========== API IMPORTS ==========
import { profilesAPI } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Profiles() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    adspower_profile_id: '',
    fb_user_id: '',
    fb_email: '',
    fb_username: '',
    fb_password_encrypted: '',
    fb_status: 'active',
  });

  const {
    data: profilesResponse,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => profilesAPI.list(1, 99999),
  });

  const data = profilesResponse?.data?.list || [];
  const displayError = error || (queryError ? (queryError.message || 'Failed to load profiles') : '');

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        adspower_profile_id: item.adspower_profile_id,
        fb_user_id: item.fb_user_id,
        fb_email: item.fb_email,
        fb_username: item.fb_username,
        fb_password_encrypted: item.fb_password_encrypted,
        fb_status: item.fb_status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        adspower_profile_id: '',
        fb_user_id: '',
        fb_email: '',
        fb_username: '',
        fb_password_encrypted: '',
        fb_status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      adspower_profile_id: '',
      fb_user_id: '',
      fb_email: '',
      fb_username: '',
      fb_password_encrypted: '',
      fb_status: 'active',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        adspower_profile_id: formData.adspower_profile_id,
        fb_user_id: formData.fb_user_id,
        fb_email: formData.fb_email,
        fb_username: formData.fb_username,
        fb_password_encrypted: formData.fb_password_encrypted,
        fb_status: formData.fb_status,
      };

      if (editingItem) {
        await profilesAPI.update(editingItem.id, payload);
      } else {
        await profilesAPI.create(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save profile');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      setError('');
      await profilesAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (err) {
      setError(err.message || 'Failed to delete profile');
      console.error('Error deleting data:', err);
    }
  };

  const filteredData = data.filter(item =>
    item.fb_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fb_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fb_user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.adspower_profile_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Profiles</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage profiles and Facebook credentials</p>
        {displayError && (
          <div className="mt-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
            <p className="text-red-400 text-sm">{displayError}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 sm:flex-initial w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email/username/user id..."
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
              <span>Add Profile</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">AdsPower Profile ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">FB User ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Password</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Updated At</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-8 text-center text-gray-400">
                    No profiles found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-mono text-xs">{item.adspower_profile_id}</td>
                    <td className="px-4 py-3 text-sm">{item.fb_user_id}</td>
                    <td className="px-4 py-3 text-sm">{item.fb_email}</td>
                    <td className="px-4 py-3 text-sm">{item.fb_username}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {showPassword[item.id] ? item.fb_password_encrypted : '••••••••'}
                        </span>
                        <button
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              [item.id]: !showPassword[item.id],
                            })
                          }
                          className="text-gray-400 hover:text-gray-300"
                          type="button"
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
                        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          item.fb_status === 'active'
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {item.fb_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(item.updated_at)}</td>
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
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Profile' : 'Create New Profile'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  AdsPower Profile ID
                </label>
                <input
                  type="text"
                  value={formData.adspower_profile_id}
                  onChange={(e) => setFormData({ ...formData, adspower_profile_id: e.target.value })}
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
                  value={formData.fb_status}
                  onChange={(e) => setFormData({ ...formData, fb_status: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
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
