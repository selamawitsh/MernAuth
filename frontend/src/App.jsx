import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/auth/SignUP';
import SignIn from './components/auth/SignIn';
import Tourism from './pages/TourismLanding';
import VerifyEmail from './components/auth/VerifyEmail';
import VerifyEmailPending from './components/auth/VerifyEmailPending';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import OAuthSuccess from './components/auth/OAuthSuccess'; 


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
          path="/tourism" 
          element={
            isAuthenticated() ? <Tourism /> : <Navigate to="/login" />
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;