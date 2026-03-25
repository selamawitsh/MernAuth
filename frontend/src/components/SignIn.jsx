import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import rateLimiter from '../services/rateLimiter';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remainingAttempts: 5,
    isLimited: false,
    waitTime: 0
  });

  // Check rate limit on component mount
  useEffect(() => {
    const checkRateLimit = () => {
      const endpoint = '/auth/login';
      const limitCheck = rateLimiter.isAllowed(endpoint);
      setRateLimitInfo({
        remainingAttempts: limitCheck.remainingAttempts,
        isLimited: !limitCheck.allowed,
        waitTime: limitCheck.waitTime
      });
    };
    checkRateLimit();
    
    // Update rate limit info periodically
    const interval = setInterval(checkRateLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check rate limit before making request
    const endpoint = '/auth/login';
    const limitCheck = rateLimiter.isAllowed(endpoint);
    
    if (!limitCheck.allowed) {
      setError(`Too many login attempts. Please wait ${limitCheck.waitTime} minutes before trying again.`);
      setRateLimitInfo({
        remainingAttempts: 0,
        isLimited: true,
        waitTime: limitCheck.waitTime
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      // Reset rate limit on successful login
      rateLimiter.reset(endpoint);
      setRateLimitInfo({
        remainingAttempts: 5,
        isLimited: false,
        waitTime: 0
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/welcome');
    } catch (error) {
      if (error.rateLimited) {
        setError(error.message);
        setRateLimitInfo({
          remainingAttempts: 0,
          isLimited: true,
          waitTime: error.waitTime || 15
        });
      } else if (error.response) {
        const { data } = error.response;
        
        if (data.errors) {
          // Validation errors
          const errorMessages = data.errors.map(err => err.message).join(', ');
          setError(errorMessages);
        } else if (data.message) {
          setError(data.message);
        }
        
        // Record failed attempt
        rateLimiter.recordAttempt(endpoint);
        const remaining = rateLimiter.getRemainingAttempts(endpoint);
        setRateLimitInfo(prev => ({
          ...prev,
          remainingAttempts: remaining
        }));
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {/* Rate limit warning */}
        {rateLimitInfo.isLimited && (
          <Alert 
            type="warning" 
            message={`Rate limit reached. Please wait ${rateLimitInfo.waitTime} minutes before trying again.`}
            onClose={() => {}}
          />
        )}
        
        {!rateLimitInfo.isLimited && rateLimitInfo.remainingAttempts <= 2 && (
          <Alert 
            type="warning" 
            message={`Warning: Only ${rateLimitInfo.remainingAttempts} login attempts remaining. Too many failed attempts will temporarily block login.`}
            onClose={() => {}}
          />
        )}
        
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Username / Email / Phone Number
            </label>
            <input
              type="text"
              name="identifier"
              required
              value={formData.identifier}
              onChange={handleChange}
              disabled={isLoading || rateLimitInfo.isLimited}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                (isLoading || rateLimitInfo.isLimited) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter username, email, or phone"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading || rateLimitInfo.isLimited}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                (isLoading || rateLimitInfo.isLimited) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || rateLimitInfo.isLimited}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing in...' : 
             rateLimitInfo.isLimited ? `Please wait ${rateLimitInfo.waitTime} minutes` : 
             'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;