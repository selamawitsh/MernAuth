import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import { 
  helmetMiddleware, 
  corsMiddleware, 
  mongoSanitizeMiddleware,
  bodyParserMiddleware,
  generalRateLimiter, 
  authRateLimiter 
} from './middleware/security/index.js';

dotenv.config();

connectDB();

const app = express();

// 1. Security headers and CORS FIRST
app.use(helmetMiddleware);           
app.use(corsMiddleware);             

// 2. Apply general rate limiting to ALL requests
app.use(generalRateLimiter);  

// 3. Body parsing
app.use(...bodyParserMiddleware);    

// 4. NoSQL injection prevention
app.use(mongoSanitizeMiddleware);     

// ROUTES
app.use('/api/auth', authRateLimiter, authRoutes); 


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});