import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Lock, User } from 'lucide-react';
import Button from '../components/common/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ========== DUMMY LOGIN (CURRENTLY ACTIVE) ==========
    const result = login(username, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Login failed');
    }

    // ========== API LOGIN (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
    /*
    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    */
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4 border border-blue-500/40">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
            WowGroup Admin
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full
                    pl-10 pr-4
                    py-2.5
                    bg-zinc-800
                    border border-zinc-700
                    rounded-lg
                    text-gray-200
                    placeholder-gray-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500/50
                    focus:border-blue-500/50
                    transition
                  "
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    pl-10 pr-4
                    py-2.5
                    bg-zinc-800
                    border border-zinc-700
                    rounded-lg
                    text-gray-200
                    placeholder-gray-500
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500/50
                    focus:border-blue-500/50
                    transition
                  "
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Create account here
              </Link>
            </p>
            <p className="text-xs text-gray-500 text-center">
              Just want to view the dashboard?{' '}
              <Link
                to="/dashboard"
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Go to Dashboard
              </Link>
            </p>
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: <span className="text-gray-400">admin</span> / <span className="text-gray-400">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
