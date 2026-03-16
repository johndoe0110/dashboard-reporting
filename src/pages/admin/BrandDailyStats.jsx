import { useState } from 'react';
import { Plus, Loader2, Edit, Trash2, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import { brandsAPI, brandDailyStatsAPI } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatCurrency, formatRpTwoDecimals } from '../../utils/formatters';

export default function BrandDailyStats() {
  const queryClient = useQueryClient();
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [formData, setFormData] = useState({
    brand_id: '',
    date: new Date().toISOString().split('T')[0],
    new_registration_count: '',
    new_deposit_count: '',
    redeposit_count: '',
    total_deposit_amount: '',
    total_new_deposit_amount: '',
  });

  const { data: brandsRes } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsAPI.list(1, 99999),
  });

  const { data: listRes, isLoading: loadingListQuery } = useQuery({
    queryKey: ['brand-daily-stats-list'],
    queryFn: () => brandDailyStatsAPI.list(1, 99999),
  });

  const { data: detailRes, isLoading: loadingDetail } = useQuery({
    queryKey: ['brand-daily-stats-detail', detailId],
    queryFn: () => brandDailyStatsAPI.getDetail(detailId),
    enabled: !!detailId,
  });

  const brandsFromQuery = brandsRes?.data?.list || [];
  const fullList = listRes?.data?.list || [];
  const detail = detailRes?.data;

  const filteredList = fullList.filter((row) => {
    if (selectedBrandId && String(row.brand_id) !== String(selectedBrandId)) return false;
    if (selectedDate && row.date) {
      const rowDate = row.date.split('T')[0];
      if (rowDate !== selectedDate) return false;
    }
    return true;
  });

  const loadStats = () => {
    setList(filteredList);
  };

  const openCreateModal = () => {
    setCreateError('');
    setIsModalOpen(true);
    setFormData({
      brand_id: '',
      date: new Date().toISOString().split('T')[0],
      new_registration_count: '',
      new_deposit_count: '',
      redeposit_count: '',
      total_deposit_amount: '',
      total_new_deposit_amount: '',
    });
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    setSubmitting(false);
    setCreateError('');
  };

  const openDetail = (id) => {
    setDetailId(id);
    setDetailModalOpen(true);
  };

  const closeDetail = () => {
    setDetailModalOpen(false);
    setDetailId(null);
  };

  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const startEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      brand_id: String(item.brand_id ?? ''),
      date: (item.date || '').split('T')[0],
      new_registration_count: String(item.new_registration_count ?? ''),
      new_deposit_count: String(item.new_deposit_count ?? ''),
      redeposit_count: String(item.redeposit_count ?? ''),
      total_deposit_amount: String(item.total_deposit_amount ?? ''),
      total_new_deposit_amount: String(item.total_new_deposit_amount ?? ''),
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCreateError('');

    try {
      const payload = {
        brand_id: Number(formData.brand_id),
        date: formData.date,
        new_registration_count: Number(formData.new_registration_count),
        new_deposit_count: Number(formData.new_deposit_count),
        redeposit_count: Number(formData.redeposit_count),
        total_deposit_amount: Number(formData.total_deposit_amount),
        total_new_deposit_amount: Number(formData.total_new_deposit_amount),
      };

      await brandDailyStatsAPI.create(payload);
      await queryClient.invalidateQueries({ queryKey: ['brand-daily-stats-list'] });
      closeCreateModal();
    } catch (err) {
      setCreateError(err.message || 'Failed to create brand daily stat');
      console.error('Error creating daily stat:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        brand_id: Number(editFormData.brand_id),
        date: editFormData.date,
        new_registration_count: Number(editFormData.new_registration_count),
        new_deposit_count: Number(editFormData.new_deposit_count),
        redeposit_count: Number(editFormData.redeposit_count),
        total_deposit_amount: Number(editFormData.total_deposit_amount),
        total_new_deposit_amount: Number(editFormData.total_new_deposit_amount),
      };

      await brandDailyStatsAPI.update(editingItem.id, payload);
      await queryClient.invalidateQueries({ queryKey: ['brand-daily-stats-list'] });
      await queryClient.invalidateQueries({ queryKey: ['brand-daily-stats-detail', editingItem.id] });
      setEditingItem(null);
      setEditFormData(null);
      if (detailId === editingItem.id) closeDetail();
    } catch (err) {
      setError(err.message || 'Failed to update');
      console.error('Error updating:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      setError('');
      await brandDailyStatsAPI.delete(id);
      await queryClient.invalidateQueries({ queryKey: ['brand-daily-stats-list'] });
      if (detailId === id) closeDetail();
    } catch (err) {
      setError(err.message || 'Failed to delete');
      console.error('Error deleting:', err);
    }
  };

  const getBrandName = (brandId) => {
    const b = brandsFromQuery.find((x) => x.id === brandId);
    return b ? b.brand_name : brandId ?? '-';
  };

  const loading = loadingListQuery;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
          Brand Daily Stats
        </h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">
          CRUD brand daily stats (list & detail). No CPR/CPD calculations.
        </p>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
        <div className="p-4 border-b border-zinc-800">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Brand</option>
                  {brandsFromQuery.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brand_name} (ID {brand.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-56">
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
              <Button type="button" variant="outline" className="flex items-center justify-center gap-2" onClick={openCreateModal}>
                <Plus className="w-4 h-4" />
                <span>New Daily Stat</span>
              </Button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[900px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Brand</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">New Regis</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">New Depo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Redepo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total Depo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total New Depo</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-400">
                    No data. Use Filter or create a new daily stat.
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr key={row.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      {row.date ? new Date(row.date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">{getBrandName(row.brand_id)}</td>
                    <td className="px-4 py-3 text-sm text-center">{row.new_registration_count}</td>
                    <td className="px-4 py-3 text-sm text-center">{row.new_deposit_count}</td>
                    <td className="px-4 py-3 text-sm text-center">{row.redeposit_count}</td>
                    <td className="px-4 py-3 text-sm text-center">{formatCurrency(Number(row.total_deposit_amount || 0))}</td>
                    <td className="px-4 py-3 text-sm text-center">{formatCurrency(Number(row.total_new_deposit_amount || 0))}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetail(row.id)} className="p-1.5 text-gray-400 hover:bg-zinc-700 rounded" title="Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => startEdit(row)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded" title="Delete">
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Brand Daily Stat</h3>
            {createError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                <p className="text-red-400 text-sm">{createError}</p>
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brandsFromQuery.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.brand_name} (ID {brand.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Registration Count</label>
                  <input type="number" min="0" value={formData.new_registration_count} onChange={(e) => setFormData((prev) => ({ ...prev, new_registration_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Deposit Count</label>
                  <input type="number" min="0" value={formData.new_deposit_count} onChange={(e) => setFormData((prev) => ({ ...prev, new_deposit_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Redeposit Count</label>
                  <input type="number" min="0" value={formData.redeposit_count} onChange={(e) => setFormData((prev) => ({ ...prev, redeposit_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Deposit Amount</label>
                  <input type="number" min="0" step="0.01" value={formData.total_deposit_amount} onChange={(e) => setFormData((prev) => ({ ...prev, total_deposit_amount: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total New Deposit Amount</label>
                  <input type="number" min="0" step="0.01" value={formData.total_new_deposit_amount} onChange={(e) => setFormData((prev) => ({ ...prev, total_new_deposit_amount: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeCreateModal} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Creating...</> : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Detail Brand Daily Stat</h3>
            {loadingDetail ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : detail ? (
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-400">ID:</span> {detail.id}</p>
                <p><span className="text-gray-400">Date:</span> {detail.date ? new Date(detail.date).toLocaleDateString('id-ID') : '-'}</p>
                <p><span className="text-gray-400">Brand:</span> {getBrandName(detail.brand_id)}</p>
                <p><span className="text-gray-400">New Regis:</span> {detail.new_registration_count}</p>
                <p><span className="text-gray-400">New Depo:</span> {detail.new_deposit_count}</p>
                <p><span className="text-gray-400">Redepo:</span> {detail.redeposit_count}</p>
                <p><span className="text-gray-400">Total Depo:</span> {formatCurrency(Number(detail.total_deposit_amount || 0))}</p>
                <p><span className="text-gray-400">Total New Depo:</span> {formatCurrency(Number(detail.total_new_deposit_amount || 0))}</p>
              </div>
            ) : null}
            <div className="flex gap-3 mt-6">
              {detail && <Button type="button" variant="outline" onClick={() => { startEdit(detail); closeDetail(); }}>Edit</Button>}
              <Button type="button" variant="outline" onClick={closeDetail} className="flex-1">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Brand Daily Stat</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                  <select value={editFormData.brand_id} onChange={(e) => setEditFormData((prev) => ({ ...prev, brand_id: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required>
                    <option value="">Select Brand</option>
                    {brandsFromQuery.map((brand) => <option key={brand.id} value={brand.id}>{brand.brand_name} (ID {brand.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input type="date" value={editFormData.date} onChange={(e) => setEditFormData((prev) => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Registration Count</label>
                  <input type="number" min="0" value={editFormData.new_registration_count} onChange={(e) => setEditFormData((prev) => ({ ...prev, new_registration_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Deposit Count</label>
                  <input type="number" min="0" value={editFormData.new_deposit_count} onChange={(e) => setEditFormData((prev) => ({ ...prev, new_deposit_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Redeposit Count</label>
                  <input type="number" min="0" value={editFormData.redeposit_count} onChange={(e) => setEditFormData((prev) => ({ ...prev, redeposit_count: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Deposit Amount</label>
                  <input type="number" min="0" step="0.01" value={editFormData.total_deposit_amount} onChange={(e) => setEditFormData((prev) => ({ ...prev, total_deposit_amount: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total New Deposit Amount</label>
                  <input type="number" min="0" step="0.01" value={editFormData.total_new_deposit_amount} onChange={(e) => setEditFormData((prev) => ({ ...prev, total_new_deposit_amount: e.target.value }))} className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" required />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setEditingItem(null); setEditFormData(null); }} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Updating...</> : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
