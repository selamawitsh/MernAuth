import axios from 'axios';
import rateLimiter from './rateLimiter';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with rate limiting
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Check rate limit for auth endpoints
    if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
      const rateLimitCheck = rateLimiter.isAllowed(config.url);
      
      if (!rateLimitCheck.allowed) {
        const error = new Error(`Rate limit exceeded. Please wait ${rateLimitCheck.waitTime} minutes before trying again.`);
        error.rateLimited = true;
        error.waitTime = rateLimitCheck.waitTime;
        throw error;
      }
      
      // Attach rate limit info to config
      config.rateLimitInfo = {
        endpoint: config.url,
        remainingAttempts: rateLimitCheck.remainingAttempts
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to track rate limits from server
api.interceptors.response.use(
  (response) => {
    // Record successful attempt
    if (response.config.url.includes('/auth/login') || response.config.url.includes('/auth/register')) {
      rateLimiter.recordAttempt(response.config.url);
    }
    return response;
  },
  (error) => {
    // Handle rate limit errors from server
    if (error.response && error.response.status === 429) {
      const waitTime = error.response.data.waitTime || 15;
      error.rateLimited = true;
      error.message = error.response.data.message || `Too many attempts. Please wait ${waitTime} minutes.`;
      error.waitTime = waitTime;
    }
    return Promise.reject(error);
  }
);

export default api;