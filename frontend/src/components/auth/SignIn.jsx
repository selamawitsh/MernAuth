import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Alert from './Alert';
import * as rateLimiter from '../../services/rateLimiter';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
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
      
      window.location.href = '/tourism';
      
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
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        
        <CardContent>
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
              <Button
                onClick={handleResendVerification}
                variant="link"
                className="text-blue-600 text-sm hover:underline"
              >
                Resend verification email
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="block text-gray-700 mb-2">
                Username / Email / Phone Number
              </Label>
              <Input
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className="w-full"
                placeholder="Enter username, email, or phone"
              />
            </div>

            <div className="mb-6">
              <Label className="block text-gray-700 mb-2">Password</Label>
              <Input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || isBlocked}
                className="w-full"
                placeholder="Enter your password"
              />
              <div className="mt-2 text-right">
                <Button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  variant="link"
                  className="text-sm text-blue-600 hover:underline"
                  disabled={isLoading || isBlocked}
                >
                  Forgot Password?
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isBlocked}
              className="w-full"
              variant="default"
            >
              {isLoading ? 'Signing in...' : 
               isBlocked ? `Please wait ${waitMinutes} min` : 
               'Sign In'}
            </Button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleGoogleLogin}
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
                Sign in with Google
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Button
              onClick={() => navigate('/signup')}
              variant="link"
              className="text-blue-600 hover:underline font-medium p-0"
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;