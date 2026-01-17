import { NavLink } from 'react-router-dom';
import { 
  Facebook, 
  User, 
  TrendingUp,
  Menu,
  X,
  PlayCircle,
  Settings,
  CreditCard,
  UserCircle
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    path: '/admin/facebook-accounts',
    label: 'Facebook Accounts',
    icon: Facebook,
  },
  {
    path: '/admin/profiles',
    label: 'AdsPower Profiles',
    icon: User,
  },
  {
    path: '/admin/ad-spend-hourly',
    label: 'Ad Spend Hourly',
    icon: TrendingUp,
  },
  {
    path: '/admin/rpa-run-accounts',
    label: 'RPA Run Accounts',
    icon: PlayCircle,
  },
  {
    path: '/admin/rpa-runs',
    label: 'RPA Runs',
    icon: Settings,
  },
  {
    path: '/admin/profile-ad-accounts',
    label: 'Profile Ad Accounts',
    icon: CreditCard,
  },
  {
    path: '/admin/profile',
    label: 'Profile',
    icon: UserCircle,
  },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-full
          w-64
          min-w-[256px]
          bg-zinc-900
          border-r border-zinc-800
          z-40
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-zinc-800 pl-14 lg:pl-4">
          <h2 className="text-base md:text-lg font-bold text-blue-400 break-words whitespace-normal">Admin Panel</h2>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/40'
                        : 'text-gray-300 hover:bg-zinc-800 hover:text-gray-200'
                    }
                  `
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium break-words">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
