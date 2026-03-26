import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Alert from './Alert';

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
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Forgot Password?</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <Alert type={messageType} message={message} onClose={() => setMessage('')} />
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline text-sm"
              >
                Back to Login
              </button>
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
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;