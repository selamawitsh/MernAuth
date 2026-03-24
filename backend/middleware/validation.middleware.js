import { body, validationResult } from 'express-validator';

// Validation rules for registration
export const validateRegister = [
  body('fullName')
    .isString().withMessage('Email must be a string') 
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name can only contain letters and spaces'),
  
  body('grandfatherName')
    .trim()
    .notEmpty().withMessage('Grandfather name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Grandfather name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Grandfather name can only contain letters and spaces'),
  
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),
  
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10,15}$/).withMessage('Phone number must be 10-15 digits'),
  
  // In validation.middleware.js, update email validation:
body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Email must have a valid domain extension')
    .normalizeEmail()
    .toLowerCase()
    .custom((value) => {
        // Block common disposable email domains
        const disposableDomains = ['tempmail.com', 'guerrillamail.com', 'mailinator.com'];
        const domain = value.split('@')[1];
        if (disposableDomains.includes(domain)) {
        throw new Error('Please use a valid email address, not a temporary one');
        }
        return true;
    }),

  body('password')
    .isString().withMessage('Password must be a string') 
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
  
  body('birthDate')
    .notEmpty().withMessage('Birth date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) throw new Error('You must be at least 13 years old');
      if (age > 120) throw new Error('Invalid age');
      return true;
    })
];

// Validation rules for login
export const validateLogin = [
  body('identifier')
    .isString().withMessage('identifier must be a string') 
    .trim()
    .notEmpty().withMessage('Username, email, or phone is required'),
  
  body('password')
    .isString().withMessage('Password must be a string') 
    .notEmpty().withMessage('Password is required')
];

// Middleware to check validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};