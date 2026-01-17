import { API_CONFIG, getAuthToken, setAuthToken, removeAuthToken, getBasicAuthHeader, getBearerAuthHeader } from '../config/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  const token = getAuthToken();
  if (token) {
    defaultHeaders['Authorization'] = getBearerAuthHeader();
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Admin API
export const adminAPI = {
  // Login
  login: async (username, password) => {
    const credentials = btoa(`${API_CONFIG.BASIC_USERNAME}:${API_CONFIG.BASIC_PASSWORD}`);
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/v1/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok && data.data?.accessToken) {
      setAuthToken(data.data.accessToken);
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/v1/logout`, {
      method: 'POST',
      headers: {
        'Authorization': getBearerAuthHeader(),
      },
    });

    if (response.ok) {
      removeAuthToken();
    }

    return response.json();
  },

  // Get Profile
  getProfile: async () => {
    return apiRequest('/admin/v1/profile');
  },

  // Register
  register: async (userData) => {
    return apiRequest('/admin/v1/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Change Password
  changePassword: async (oldPassword, newPassword) => {
    return apiRequest('/admin/v1/password/change', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  // Admin List
  list: async (page = 1, limit = 10) => {
    return apiRequest(`/admin/v1/list?page=${page}&limit=${limit}`);
  },
};

// Facebook Accounts API
export const facebookAccountsAPI = {
  list: async () => {
    return apiRequest('/facebook-accounts/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/facebook-accounts/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/facebook-accounts/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/facebook-accounts/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/facebook-accounts/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Profiles API
export const profilesAPI = {
  list: async () => {
    return apiRequest('/profiles/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/profiles/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/profiles/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/profiles/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/profiles/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Ad Spend Hourly API
export const adSpendHourlyAPI = {
  list: async () => {
    return apiRequest('/ad-spend-hourly/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/ad-spend-hourly/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/ad-spend-hourly/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/ad-spend-hourly/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/ad-spend-hourly/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// RPA Run Accounts API
export const rpaRunAccountsAPI = {
  list: async () => {
    return apiRequest('/rpa-run-accounts/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/rpa-run-accounts/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/rpa-run-accounts/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/rpa-run-accounts/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/rpa-run-accounts/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// RPA Runs API
export const rpaRunsAPI = {
  list: async () => {
    return apiRequest('/rpa-runs/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/rpa-runs/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/rpa-runs/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/rpa-runs/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/rpa-runs/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

// Profile Ad Accounts API
export const profileAdAccountsAPI = {
  list: async () => {
    return apiRequest('/profile-ad-accounts/v1/list');
  },

  getDetail: async (id) => {
    return apiRequest(`/profile-ad-accounts/v1/detail/${id}`);
  },

  create: async (data) => {
    return apiRequest('/profile-ad-accounts/v1/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/profile-ad-accounts/v1/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/profile-ad-accounts/v1/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
