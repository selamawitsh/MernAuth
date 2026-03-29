import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './config/database.js';
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

// Connect to PostgreSQL
await connectDB();

// Configure Passport
configurePassport();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
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

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(generalRateLimiter);
app.use(...bodyParserMiddleware);
app.use(mongoSanitizeMiddleware);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: 'PostgreSQL',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRateLimiter, authRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: PostgreSQL`);
});