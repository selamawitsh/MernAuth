import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Register
router.post('/register', validateRegister, handleValidationErrors, register);

// Login 
router.post('/login', validateLogin, handleValidationErrors, login);

export default router;