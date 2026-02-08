import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response
    if (response.data.message) {
      // Optionally show success toast for mutations
      // toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error(data.message || 'Unauthorized! Please login again.');
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error(data.message || 'Permission denied!');
          break;
        case 404:
          toast.error(data.message || 'Resource not found!');
          break;
        case 500:
          toast.error('Server error! Please try again later.');
          break;
        default:
          toast.error(data.message || 'Something went wrong!');
      }
    } else if (error.request) {
      toast.error('Network error! Please check your connection.');
    } else {
      toast.error('An error occurred!');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
