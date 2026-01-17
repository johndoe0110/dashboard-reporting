// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://wmpjagztriou5wtqealj7zpcte0ywuyd.lambda-url.ap-southeast-1.on.aws',
  BASIC_USERNAME: import.meta.env.VITE_BASIC_USERNAME || 'dashboard',
  BASIC_PASSWORD: import.meta.env.VITE_BASIC_PASSWORD || '7ujBjghu71BDF321',
};

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token_dashboard') || '';
};

// Set auth token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('token_dashboard', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('token_dashboard');
};

// Create Basic Auth header
export const getBasicAuthHeader = () => {
  const credentials = btoa(`${API_CONFIG.BASIC_USERNAME}:${API_CONFIG.BASIC_PASSWORD}`);
  return `Basic ${credentials}`;
};

// Create Bearer Auth header
export const getBearerAuthHeader = () => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : '';
};
