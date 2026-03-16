import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { brandsAPI } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Brands() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brand_name: '',
  });

  const {
    data: brandsResponse,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.list(1, 99999),
  });

  const data = brandsResponse?.data?.list || [];

  if (queryError && !error) {
    // Sync query error into local error state for existing UI
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setError(queryError.message || 'Failed to load brands');
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        brand_name: item.brand_name,
      });
    } else {
      setEditingItem(null);
      setFormData({
        brand_name: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      brand_name: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        brand_name: formData.brand_name,
      };

      const mutationFn = editingItem
        ? () => brandsAPI.update(editingItem.id, payload)
        : () => brandsAPI.create(payload);

      await mutationFn();
      await queryClient.invalidateQueries({ queryKey: ['brands'] });
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to save brand');
      console.error('Error saving data:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) {
      return;
    }

    try {
      setError('');
      await brandsAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['brands'] });
    } catch (err) {
      setError(err.message || 'Failed to delete brand');
      console.error('Error deleting data:', err);
    }
  };

  const filteredData = data.filter((item) =>
    item.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">Brands</h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">Manage brands</p>
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
                placeholder="Search brands..."
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
              <span>Add Brand</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[600px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Brand Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Updated At</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                    No brands found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm">{item.brand_name}</td>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Brand' : 'Create New Brand'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

