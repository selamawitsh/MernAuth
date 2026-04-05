import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Alert from './Alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      setMessage(response.data.message);
      setMessageType('success');
      setEmailSent(true);
      
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center mb-6">
          <CardTitle>Forgot Password?</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </CardHeader>

        <CardContent>
          {message && (
            <Alert type={messageType} message={message} onClose={() => setMessage('')} />
          )}

          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label className="block text-gray-700 mb-2">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                variant="default"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to:
              </p>
              <p className="font-bold text-blue-600 mb-4">{email}</p>
              <p className="text-gray-600 mb-6">
                Please check your email and click the link to reset your password.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;