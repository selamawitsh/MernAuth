import axios from 'axios';
import * as rateLimiter from './rateLimiter';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - check rate limit before sending
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Check rate limit for login and register
    const isAuthEndpoint = config.url.includes('/auth/login') || 
                          config.url.includes('/auth/register');
    
    if (isAuthEndpoint) {
      const check = rateLimiter.canTry();
      
      if (!check.allowed) {
        const error = new Error(`Too many attempts. Please wait ${check.waitMinutes} minutes.`);
        error.isRateLimited = true;
        error.waitMinutes = check.waitMinutes;
        throw error;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle rate limit from server
api.interceptors.response.use(
  (response) => {
    if (response.config.url.includes('/auth/login') && response.status === 200) {
      rateLimiter.resetAttempts();
    }
    return response;
  },
  (error) => {
    // Handle rate limit from server (429 status)
    if (error.response && error.response.status === 429) {
      error.isRateLimited = true;
      error.message = error.response.data.message || 'Too many attempts. Please wait.';
      
      // Extract wait time from message if present
      const match = error.message.match(/(\d+)/);
      if (match) {
        error.waitMinutes = parseInt(match[1]);
      }
    }
    return Promise.reject(error);
  }
);

export default api;