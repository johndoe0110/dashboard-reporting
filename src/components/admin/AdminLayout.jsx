import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import Sidebar from './Sidebar';
import Button from '../common/Button';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen bg-black text-gray-200 flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900/50 flex-shrink-0 z-20">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 pl-12 lg:pl-0">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-blue-400 truncate">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                  Welcome back, {user?.name || user?.username}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={handleDashboard}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Daily Performance</span>
                </Button>
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
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
