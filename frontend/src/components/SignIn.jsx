import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import * as rateLimiter from '../services/rateLimiter';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [waitMinutes, setWaitMinutes] = useState(0);
  const [showResendOption, setShowResendOption] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  useEffect(() => {
    const checkLimit = () => {
      const check = rateLimiter.canTry();
      setRemainingAttempts(check.remaining);
      setIsBlocked(!check.allowed);
      setWaitMinutes(check.waitMinutes);
    };
    
    checkLimit();
    const interval = setInterval(checkLimit, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    setShowResendOption(false);
  };

  const handleResendVerification = async () => {
    try {
      const response = await api.post('/auth/resend-verification', { email: unverifiedEmail });
      setError(response.data.message);
      setShowResendOption(false);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Failed to resend verification email. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const check = rateLimiter.canTry();
    if (!check.allowed) {
      setError(`Too many attempts! Please wait ${check.waitMinutes} minutes.`);
      setIsBlocked(true);
      setWaitMinutes(check.waitMinutes);
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResendOption(false);

    try {
      const response = await api.post('/auth/login', formData);
      
      console.log('Login response:', response.data);
      
      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('User stored:', localStorage.getItem('user'));
      
      rateLimiter.resetAttempts();
      
      window.location.href = '/welcome';
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.isRateLimited) {
        setError(error.message);
        setIsBlocked(true);
        setWaitMinutes(error.waitMinutes || 5);
      } else if (error.response) {
        const { status, data } = error.response;
        
        if (status === 403 && data.requiresVerification) {
          setError(data.message);
          setUnverifiedEmail(data.email);
          setShowResendOption(true);
        } else if (status === 401) {
          setError('Invalid username/email or password');
          rateLimiter.recordFailedAttempt();
          
          const remaining = rateLimiter.getRemainingAttempts();
          setRemainingAttempts(remaining);
          
          const checkAgain = rateLimiter.canTry();
          if (!checkAgain.allowed) {
            setIsBlocked(true);
            setWaitMinutes(checkAgain.waitMinutes);
            setError(`Too many failed attempts! Please wait ${checkAgain.waitMinutes} minutes.`);
          }
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Login failed. Please try again.');
        }
      } else if (error.request) {
        setError('Network error. Cannot connect to server.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        
        {isBlocked && (
          <Alert 
            type="warning" 
            message={`Too many attempts! Please wait ${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''} before trying again.`}
            onClose={() => {}}
          />
        )}
        
        {!isBlocked && remainingAttempts <= 2 && remainingAttempts > 0 && (
          <Alert 
            type="warning" 
            message={`Warning: ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining. After ${remainingAttempts} more failure${remainingAttempts === 1 ? '' : 's'}, you'll be blocked for 5 minutes.`}
            onClose={() => {}}
          />
        )}
        
        {error && !error.includes('attempts') && !error.includes('Too many') && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        
        {showResendOption && (
          <div className="mt-2 text-center">
            <button
              onClick={handleResendVerification}
              className="text-blue-600 text-sm hover:underline"
            >
              Resend verification email
            </button>
          </div>
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
              disabled={isLoading || isBlocked}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                (isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''
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
              disabled={isLoading || isBlocked}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                (isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter your password"
            />
            {/* Forgot Password Link - NEW */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:underline"
                disabled={isLoading || isBlocked}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isBlocked}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing in...' : 
             isBlocked ? `Please wait ${waitMinutes} min` : 
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