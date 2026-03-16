import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Registers global handler for 401 responses. On 401, logs out and redirects to /login.
 * Must be mounted inside AuthProvider and BrowserRouter.
 */
export default function UnauthorizedHandler() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.__onUnauthorized = async () => {
      await logout();
      navigate('/login', { replace: true });
    };
    return () => {
      window.__onUnauthorized = null;
    };
  }, [logout, navigate]);

  return null;
}
