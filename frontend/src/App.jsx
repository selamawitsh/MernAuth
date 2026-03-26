import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUP';
import SignIn from './components/SignIn';
import Welcome from './components/Welcome';
import VerifyEmail from './components/VerifyEmail';
import VerifyEmailPending from './components/VerifyEmailPending';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import OAuthSuccess from './components/OAuthSuccess'; 

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Auth routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        
        {/* Email verification routes */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-pending" element={<VerifyEmailPending />} />
        
        {/* Password reset routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* NEW: OAuth success route */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        
        {/* Protected route */}
        <Route 
          path="/welcome" 
          element={
            isAuthenticated() ? <Welcome /> : <Navigate to="/login" />
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;