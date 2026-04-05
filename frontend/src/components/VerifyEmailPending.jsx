import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Alert from './Alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const VerifyEmailPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem('pendingVerificationEmail') || '';
  
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('Email not found. Please sign up again.');
      setMessageType('error');
      return;
    }

    setIsResending(true);
    setMessage('');

    try {
      const response = await api.post('/auth/resend-verification', { email });
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to resend verification email. Please try again.');
      }
      setMessageType('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Email</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to:
          </p>
          <p className="font-bold text-blue-600 mb-4">{email}</p>
          
          <p className="text-gray-600 mb-6">
            Please check your inbox and click the verification link to activate your account.
          </p>
          
          {message && (
            <Alert type={messageType} message={message} onClose={() => setMessage('')} />
          )}
          
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full mb-3"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full"
          >
            Back to Login
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or click "Resend".
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPending;