import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || '/api'
    : 'http://localhost:5001/api', // Point to backend server in development
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Axios interceptor error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 error detected');
      // Only remove token if it's a specific auth endpoint that indicates invalid token
      const isAuthEndpoint = error.config.url?.includes('/auth/');
      const isLoginEndpoint = error.config.url?.includes('/auth/login');
      const isMeEndpoint = error.config.url?.includes('/auth/me');
      
      // Only remove token for login failures or /me endpoint failures (not for missing tokens)
      if (isAuthEndpoint && (isLoginEndpoint || isMeEndpoint)) {
        console.log('Removing token due to auth endpoint 401');
        localStorage.removeItem('token');
        // Don't redirect immediately, let the component handle it
      }
    }
    return Promise.reject(error);
  }
);

export default api; 