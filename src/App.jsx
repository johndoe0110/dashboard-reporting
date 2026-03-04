import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/admin/AdminLayout';
import Profiles from './pages/admin/Profiles';
import AdSpendHourly from './pages/admin/AdSpendHourly';
import RpaRunAccounts from './pages/admin/RpaRunAccounts';
import RpaRuns from './pages/admin/RpaRuns';
import Brands from './pages/admin/Brands';
import BrandDailyStats from './pages/admin/BrandDailyStats';
import ProfileAdAccounts from './pages/admin/ProfileAdAccounts';
import Profile from './pages/admin/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/profiles" replace />} />
            <Route path="profiles" element={<Profiles />} />
            <Route path="ad-spend-hourly" element={<AdSpendHourly />} />
            <Route path="rpa-run-accounts" element={<RpaRunAccounts />} />
            <Route path="rpa-runs" element={<RpaRuns />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brand-daily-stats" element={<BrandDailyStats />} />
            <Route path="profile-ad-accounts" element={<ProfileAdAccounts />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
