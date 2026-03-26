import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Alert from './Alert';

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
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
          
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
          
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 mb-3"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full text-gray-600 py-2 hover:text-gray-800"
          >
            Back to Login
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or click "Resend".
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPending;