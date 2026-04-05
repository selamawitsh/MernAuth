import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from '../components/Alert';
import * as rateLimiter from '../services/rateLimiter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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

  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
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
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
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
                <Label className="block text-gray-700 mb-2">Full Name *</Label>
                <Input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Grandfather Name *</Label>
                <Input
                  type="text"
                  name="grandfatherName"
                  required
                  value={formData.grandfatherName}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.grandfatherName ? 'border-red-500' : ''}`}
                />
                {errors.grandfatherName && (
                  <p className="text-red-500 text-sm mt-1">{errors.grandfatherName}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Username *</Label>
                <Input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Phone Number *</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Email *</Label>
                <Input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Password *</Label>
                <Input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
                </p>
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Location *</Label>
                <Input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.location ? 'border-red-500' : ''}`}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <Label className="block text-gray-700 mb-2">Birth Date *</Label>
                <Input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  disabled={isLoading || isBlocked}
                  className={`w-full ${errors.birthDate ? 'border-red-500' : ''}`}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isBlocked}
              className="w-full mt-6"
              variant="default"
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
            </Button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading || isBlocked}
                variant="outline"
                className="w-full flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Button
              onClick={() => navigate('/login')}
              variant="link"
              className="text-blue-600 hover:underline font-medium p-0"
              disabled={isLoading}
            >
              Sign In
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;