import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { brandsAPI, brandDailyStatsAPI } from '../../services/api';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function BrandDailyStats() {
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoadingBrands(true);
      setError('');
      const res = await brandsAPI.list(1, 99999);
      setBrands(res?.data?.list || []);
    } catch (err) {
      setError(err.message || 'Failed to load brands');
      console.error('Error loading brands:', err);
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadStats = async () => {
    if (!selectedBrandId || !selectedDate) return;

    try {
      setLoadingStats(true);
      setError('');
      const res = await brandDailyStatsAPI.getWithAdSpend(Number(selectedBrandId), selectedDate);
      // Asumsi response: { data: { list: [...] } } atau { data: [...] }
      const raw = res?.data?.list || res?.data || [];
      setStats(raw ? raw : {});
    } catch (err) {
      setError(err.message || 'Failed to load brand daily stats');
      console.error('Error loading brand daily stats:', err);
      setStats([]);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStats();
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
      closeCreateModal();

      // Refresh list kalau filter cocok dengan yang baru dibuat
      if (
        String(payload.brand_id) === String(selectedBrandId) &&
        payload.date === selectedDate
      ) {
        await loadStats();
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create brand daily stat');
      console.error('Error creating daily stat:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const computedStats = useMemo(() => {
    if (!stats) return [];
  
    const statsArray = Array.isArray(stats) ? stats : [stats];
  
    return statsArray.map((item) => {
      const newReg = Number(item.new_registration_count) || 0;
      const newDepo = Number(item.new_deposit_count) || 0;
      const redepo = Number(item.redeposit_count) || 0;
      const totalNewDepoAmount = Number(item.total_new_deposit_amount) || 0;
      const totalAdSpent = Number(item.total_ad_spent ?? 0);
  
      const redepoTotalForm = redepo - newDepo;
      const firstDepoOrganic = redepoTotalForm * 0.03;
      const firstDepoAds = newDepo - firstDepoOrganic;
      const avgPerDepo = newDepo > 0 ? totalNewDepoAmount / newDepo : 0;
      const regPerDepoAdsPct = newReg > 0 ? (newDepo / newReg) * 100 : 0;
      const cpr = newReg > 0 ? totalAdSpent / newReg : 0;
      const cpd = newDepo > 0 ? totalAdSpent / newDepo : 0;
      const cpd3 = firstDepoAds > 0 ? totalAdSpent / firstDepoAds : 0;
      const roas = totalNewDepoAmount > 0 ? totalAdSpent / totalNewDepoAmount : 0;
  
      return {
        ...item,
        _redepoTotalForm: redepoTotalForm,
        _firstDepoOrganic: firstDepoOrganic,
        _firstDepoAds: firstDepoAds,
        _avgPerDepo: avgPerDepo,
        _regPerDepoAdsPct: regPerDepoAdsPct,
        _cpr: cpr,
        _cpd: cpd,
        _cpd3: cpd3,
        _roas: roas,
      };
    });
  }, [stats]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
          Brand Daily Stats
        </h1>
        <p className="text-sm sm:text-base text-gray-400 break-words">
          Dashboard & CRUD brand daily stats with ad spend
        </p>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/40 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 mb-6">
        <div className="p-4 border-b border-zinc-800">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  disabled={loadingBrands}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brand_name} (ID {brand.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-56">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-end">
              <Button
                type="submit"
                variant="primary"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                disabled={!selectedBrandId || !selectedDate || loadingStats}
              >
                {loadingStats ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Load Stats</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                onClick={openCreateModal}
              >
                <Plus className="w-4 h-4" />
                <span>New Daily Stat</span>
              </Button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-zinc-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">New Regis</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">New Depo : C</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Redepo (ops)</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Redepo Total Form</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  First Depo Organic (3%) : D
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  First Depo Ads (C - D)
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total Depo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total New Depo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Total Ad Spend</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">AVG/DEPO</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">%Reg/Depo Ads</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">CPR</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">CPD</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">CPD 3%</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {!selectedBrandId || !selectedDate ? (
                <tr>
                  <td colSpan="16" className="px-4 py-8 text-center text-gray-400">
                    Pilih brand dan tanggal lalu klik &quot;Load Stats&quot; untuk melihat data.
                  </td>
                </tr>
              ) : loadingStats ? (
                <tr>
                  <td colSpan="16" className="px-4 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : computedStats.length === 0 ? (
                <tr>
                  <td colSpan="16" className="px-4 py-8 text-center text-gray-400">
                    No data for selected brand and date
                  </td>
                </tr>
              ) : (
                computedStats.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      {item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.new_registration_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.new_deposit_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.redeposit_count}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item._redepoTotalForm.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item._firstDepoOrganic.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item._firstDepoAds.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Number(item.total_deposit_amount || 0))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Number(item.total_new_deposit_amount || 0))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(
                        Number(item.total_ad_spent ?? item.total_ad_spent_amount ?? 0)
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Math.round(item._avgPerDepo))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatPercentage(item._regPerDepoAdsPct, 2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Math.round(item._cpr))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Math.round(item._cpd))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(Math.round(item._cpd3))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item._roas ? item._roas.toFixed(2) : '0.00'}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brand
                  </label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, brand_id: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.brand_name} (ID {brand.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Registration Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.new_registration_count}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new_registration_count: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Deposit Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.new_deposit_count}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new_deposit_count: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Redeposit Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.redeposit_count}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        redeposit_count: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Deposit Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_deposit_amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        total_deposit_amount: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total New Deposit Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_new_deposit_amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        total_new_deposit_amount: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCreateModal}
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
                      Creating...
                    </>
                  ) : (
                    'Create'
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

