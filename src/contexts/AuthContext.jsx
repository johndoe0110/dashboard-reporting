import { createContext, useContext, useState, useEffect } from 'react';
// ========== API IMPORTS (COMMENTED - UNCOMMENT WHEN CORS IS FIXED) ==========
import { adminAPI } from '../services/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await adminAPI.login(username, password);
      
      if (response.data?.accessToken) {
        // Get user profile
        try {
          const profileResponse = await adminAPI.getProfile();
          const userData = {
            username: profileResponse.data?.username || username,
            role: 'admin',
            name: profileResponse.data?.name || profileResponse.data?.username || 'Administrator',
            ...profileResponse.data,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return { success: true };
        } catch (profileError) {
          // If profile fetch fails, still allow login with basic info
          const userData = {
            username: username,
            role: 'admin',
            name: username,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          return { success: true };
        }
      }
      
      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid username or password' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await adminAPI.register(userData);
      
      if (response.data) {
        return { success: true, message: response.message || 'Registration successful' };
      }
      
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      removeAuthToken();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
