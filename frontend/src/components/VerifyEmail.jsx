import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Alert from './Alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      
      setStatus('success');
      setMessage(response.data.message);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/welcome');
      }, 2000);
      
    } catch (error) {
      setStatus('error');
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to verify email. Please try again.');
      }
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      setMessage('Please enter your email in the form below to resend verification.');
    } catch (error) {
      setMessage('Failed to resend verification email.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        
        <CardContent>
          {status === 'verifying' && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <Alert type="success" message={message} onClose={() => {}} />
              <p className="text-gray-600 mt-4">Redirecting to dashboard...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div>
              <div className="text-red-600 text-6xl mb-4"></div>
              <Alert type="error" message={message} onClose={() => {}} />
              
              <Button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="mt-4 w-full"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="mt-2 w-full"
              >
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;