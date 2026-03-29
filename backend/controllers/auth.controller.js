import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { 
  generateVerificationToken, 
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
} from '../services/emailService.js';

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullName, grandfatherName, username, phoneNumber, email, password, location, birthDate } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username },
          { phoneNumber }
        ]
      }
    });

    if (existingUser) {
      let field = '';
      if (existingUser.email === email) field = 'email';
      if (existingUser.username === username) field = 'username';
      if (existingUser.phoneNumber === phoneNumber) field = 'phoneNumber';
      
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      grandfatherName: grandfatherName?.trim(),
      username: username.toLowerCase(),
      phoneNumber,
      email: email.toLowerCase(),
      password,
      location: location?.trim(),
      birthDate,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    await sendWelcomeEmail(user);

    const authToken = generateToken(user.id);

    res.json({
      success: true,
      message: 'Email verified successfully!',
      token: authToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isEmailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: identifier.toLowerCase() },
          { email: identifier.toLowerCase() },
          { phoneNumber: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address'
      });
    }

    const resetToken = generateVerificationToken(); // Reuse token generator
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset email sent!'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await sendPasswordResetConfirmation(user);

    res.json({
      success: true,
      message: 'Password has been reset successfully!'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// RESEND VERIFICATION EMAIL
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    res.json({
      success: true,
      message: 'Verification email sent!'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// GOOGLE OAUTH SUCCESS
export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
    
    const token = generateToken(req.user.id);
    
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user.id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      provider: req.user.provider
    }))}`);
    
  } catch (error) {
    console.error('Google auth success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

export const googleAuthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
};