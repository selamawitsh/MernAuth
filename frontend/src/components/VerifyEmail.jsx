import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Alert from './Alert';

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
      // You would need to get email from somewhere (maybe from URL or state)
      // For now, we'll show a message
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
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
          
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
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <Alert type="error" message={message} onClose={() => {}} />
              
              <button
                onClick={handleResendVerification}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="mt-2 w-full text-blue-600 py-2 hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;