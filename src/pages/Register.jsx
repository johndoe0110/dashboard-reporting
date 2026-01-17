import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Lock, User, Mail, Phone, Calendar } from 'lucide-react';
import Button from '../components/common/Button';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    age: '',
    gender: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // ========== DUMMY REGISTER (CURRENTLY ACTIVE) ==========
    const result = register(formData);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error || 'Registration failed');
    }

    // ========== API REGISTER (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
    /*
    try {
      const result = await register(formData);
      
      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    */
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4 border border-blue-500/40">
            <UserPlus className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">
            Sign up to access the admin dashboard
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  minLength={6}
                />
              </div>
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
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
                  placeholder="Enter your age"
                  required
                  min="1"
                  max="120"
                />
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-2.5
                  bg-zinc-800
                  border border-zinc-700
                  rounded-lg
                  text-gray-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/50
                  focus:border-blue-500/50
                  transition
                "
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
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
                  placeholder="Enter your phone number"
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

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* Register Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-gray-500 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
