import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';  
import passport from 'passport';     
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
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

// Configure Passport (Google OAuth setup)
configurePassport();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


// 1. Security headers and CORS
app.use(helmetMiddleware);           
app.use(corsMiddleware);             

// 2. Rate limiting (prevents brute force attacks)
app.use(generalRateLimiter);  

// 3. Body parsing (limits request size)
app.use(...bodyParserMiddleware);    

// 4. NoSQL injection prevention
app.use(mongoSanitizeMiddleware);     


app.use('/api/auth', authRateLimiter, authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});