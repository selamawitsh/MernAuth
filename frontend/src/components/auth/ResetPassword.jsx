import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import Alert from './Alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage('No reset token provided');
      setMessageType('error');
      setIsValidToken(false);
    }
  }, [token]);

  const validatePassword = (password) => {
    const errors = {};
    
    if (password.length < 8) {
      errors.length = 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      errors.number = 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.special = 'Password must contain at least one special character (!@#$%^&*)';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    // Validate password strength
    const passwordErrors = validatePassword(formData.newPassword);
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    setIsLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });
      
      setMessage(response.data.message);
      setMessageType('success');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
        setMessageType('error');
      } else {
        setMessage('Network error. Please try again.');
        setMessageType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="text-red-600 text-5xl mb-4"></div>
            <CardTitle className="mb-4">Invalid Reset Link</CardTitle>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Button
              onClick={() => navigate('/forgot-password')}
              className="w-full"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center mb-6">
          <CardTitle>Reset Password</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your new password below.
          </p>
        </CardHeader>

        <CardContent>
          {message && (
            <Alert type={messageType} message={message} onClose={() => setMessage('')} />
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="block text-gray-700 mb-2">New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full ${
                  errors.newPassword || errors.length || errors.uppercase || errors.lowercase || errors.number || errors.special
                    ? 'border-red-500'
                    : ''
                }`}
                placeholder="Enter new password"
                required
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2">
                  <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    One number
                  </li>
                  <li className={/[!@#$%^&*]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <Label className="block text-gray-700 mb-2">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
                placeholder="Confirm new password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              variant="default"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>

            <div className="mt-4 text-center">
              <Button
                onClick={() => navigate('/login')}
                variant="link"
                className="text-blue-600 hover:underline text-sm"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;