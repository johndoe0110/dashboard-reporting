import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import Button from '../../components/common/Button';

// Mock data untuk campaigns
const initialCampaigns = [
  {
    id: 1,
    name: '24NOV_GTT_BAJU31',
    platform: 'TikTok',
    adAccount: 'GTT-18',
    budget: 1000000,
    spent: 571920,
    status: 'Active',
    createdAt: '2024-11-24',
  },
  {
    id: 2,
    name: '24NOV_GTT_BAJU32',
    platform: 'TikTok',
    adAccount: 'GTT-02',
    budget: 1000000,
    spent: 860167,
    status: 'Active',
    createdAt: '2024-11-24',
  },
  {
    id: 3,
    name: '24NOV_FB_CAMPAIGN01',
    platform: 'Facebook',
    adAccount: 'FB-01',
    budget: 2000000,
    spent: 1200000,
    status: 'Off',
    createdAt: '2024-11-20',
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'TikTok',
    adAccount: '',
    budget: '',
    status: 'Active',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenModal = (campaign = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        platform: campaign.platform,
        adAccount: campaign.adAccount,
        budget: campaign.budget.toString(),
        status: campaign.status,
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        name: '',
        platform: 'TikTok',
        adAccount: '',
        budget: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
    setFormData({
      name: '',
      platform: 'TikTok',
      adAccount: '',
      budget: '',
      status: 'Active',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCampaign) {
      // Update existing campaign
      setCampaigns(campaigns.map(c => 
        c.id === editingCampaign.id 
          ? {
              ...c,
              ...formData,
              budget: parseInt(formData.budget),
              spent: c.spent, // Keep existing spent
            }
          : c
      ));
    } else {
      // Create new campaign
      const newCampaign = {
        id: Date.now(),
        ...formData,
        budget: parseInt(formData.budget),
        spent: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCampaigns([...campaigns, newCampaign]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.adAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-blue-400">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Welcome back, {user?.name || user?.username}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  Rp {totalBudget.toLocaleString('id-ID')}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  Rp {totalSpent.toLocaleString('id-ID')}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Campaigns</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {activeCampaigns}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Campaigns Management</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                      w-full sm:w-64
                      pl-10 pr-4
                      py-2
                      bg-zinc-800
                      border border-zinc-700
                      rounded-lg
                      text-sm text-gray-200
                      placeholder-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500/50
                    "
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Campaign</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[700px]">
              <thead className="bg-zinc-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Platform</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ad Account</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Budget</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold">Spent</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">{campaign.name}</td>
                      <td className="px-4 py-3 text-sm">{campaign.platform}</td>
                      <td className="px-4 py-3 text-sm">{campaign.adAccount}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        Rp {campaign.budget.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        Rp {campaign.spent.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            campaign.status === 'Active'
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-red-600/20 text-red-400'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(campaign)}
                            className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
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
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ad Account
                </label>
                <input
                  type="text"
                  value={formData.adAccount}
                  onChange={(e) => setFormData({ ...formData, adAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget (IDR)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                  min="0"
                />
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
                  <option value="Active">Active</option>
                  <option value="Off">Off</option>
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
                >
                  {editingCampaign ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
