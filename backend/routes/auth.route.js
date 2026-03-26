import express from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  googleAuthSuccess,
  googleAuthFailure
} from '../controllers/auth.controller.js';
import { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Local auth routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/google/failure',
    session: false 
  }),
  googleAuthSuccess
);

router.get('/google/failure', googleAuthFailure);

export default router;