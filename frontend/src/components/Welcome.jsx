import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from storage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // If no token or user, go to login
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    // Get user info
    const userInfo = JSON.parse(userData);
    setUser(userInfo);
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Show loading message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome, {user.fullName}!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            You are now logged in
          </p>
          
          {/* User Information */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            
            <div className="space-y-3">
              <p>
                <strong>Full Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;