import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.route.js';
import { 
  helmetMiddleware, 
  corsMiddleware, 
  mongoSanitizeMiddleware,
  bodyParserMiddleware 
} from './middleware/security/index.js';

dotenv.config();

connectDB();

const app = express();

// 1. Security headers and CORS FIRST
app.use(helmetMiddleware);           
app.use(corsMiddleware);             

// 2. Body parsing SECOND (needed for reading request bodies)
app.use(...bodyParserMiddleware);    

// 3. NoSQL injection prevention THIRD
app.use(mongoSanitizeMiddleware);    

// ROUTES
app.use('/api/auth', authRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});