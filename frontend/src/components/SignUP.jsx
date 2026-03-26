import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import * as rateLimiter from '../services/rateLimiter';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    grandfatherName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    location: '',
    birthDate: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [waitMinutes, setWaitMinutes] = useState(0);

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
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const check = rateLimiter.canTry();
    
    if (!check.allowed) {
      setGeneralError(`Too many registration attempts! Please wait ${check.waitMinutes} minute${check.waitMinutes !== 1 ? 's' : ''}.`);
      setIsBlocked(true);
      setWaitMinutes(check.waitMinutes);
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      const response = await api.post('/auth/register', formData);
      
      // Store email for resend functionality
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
      // Reset rate limiter on success
      rateLimiter.resetAttempts();
      
      // Navigate to pending verification page
      navigate('/verify-email-pending', { 
        state: { 
          email: formData.email,
          message: response.data.message 
        } 
      });
      
    } catch (error) {
      if (error.isRateLimited) {
        setGeneralError(error.message);
        setIsBlocked(true);
        setWaitMinutes(error.waitMinutes || 5);
      } else if (error.response) {
        const { data } = error.response;
        
        if (data.errors) {
          const fieldErrors = {};
          data.errors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else if (data.message) {
          setGeneralError(data.message);
          rateLimiter.recordFailedAttempt();
          
          const remaining = rateLimiter.getRemainingAttempts();
          setRemainingAttempts(remaining);
          
          const checkAgain = rateLimiter.canTry();
          if (!checkAgain.allowed) {
            setIsBlocked(true);
            setWaitMinutes(checkAgain.waitMinutes);
            setGeneralError(`Too many registration attempts! Please wait ${checkAgain.waitMinutes} minutes.`);
          }
        }
      } else if (error.request) {
        setGeneralError('Network error. Cannot connect to server. Please check your connection.');
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {isBlocked && (
          <Alert 
            type="warning" 
            message={`Too many registration attempts! Please wait ${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''} before trying again.`}
            onClose={() => {}}
          />
        )}
        
        {!isBlocked && remainingAttempts <= 2 && remainingAttempts > 0 && (
          <Alert 
            type="warning" 
            message={`Warning: Only ${remainingAttempts} registration attempt${remainingAttempts === 1 ? '' : 's'} remaining. After ${remainingAttempts} more failure${remainingAttempts === 1 ? '' : 's'}, you'll be blocked for 5 minutes.`}
            onClose={() => {}}
          />
        )}

        {generalError && !generalError.includes('attempts') && (
          <Alert 
            type="error" 
            message={generalError} 
            onClose={() => setGeneralError('')}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Grandfather Name *</label>
              <input
                type="text"
                name="grandfatherName"
                required
                value={formData.grandfatherName}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.grandfatherName ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.grandfatherName && (
                <p className="text-red-500 text-sm mt-1">{errors.grandfatherName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Birth Date *</label>
              <input
                type="date"
                name="birthDate"
                required
                value={formData.birthDate}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300'
                } ${(isLoading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isBlocked}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium transition duration-200"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : isBlocked ? (
              `Please wait ${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''}`
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;