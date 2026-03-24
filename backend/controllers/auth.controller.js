import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
      $or: [{ email }, { username }, { phoneNumber }]
    });

    if (existingUser) {
      // Determine which field already exists
      let field = '';
      if (existingUser.email === email) field = 'email';
      if (existingUser.username === username) field = 'username';
      if (existingUser.phoneNumber === phoneNumber) field = 'phoneNumber';
      
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      grandfatherName: grandfatherName.trim(),
      username: username.toLowerCase(),
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      location: location.trim(),
      birthDate
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
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

    // Find user by identifier
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
        { phoneNumber: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
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