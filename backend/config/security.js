// Centralized security configuration
export const securityConfig = {
  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // Helmet Configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
  },

    
  // Rate Limiting Configuration
    rateLimit: {
        general: {
        windowMs: 5 * 60 * 1000, 
        max: 10, 
        message: 'Too many requests from this IP, please try again after 5 minutes',
        standardHeaders: true, 
        legacyHeaders: false, 
        },
      
        auth: {
        windowMs: 5 * 60 * 1000,
        max: 5, 
        message: 'Too many authentication attempts, please try again after 5 minutes',
        skipSuccessfulRequests: true, 
        standardHeaders: true,
        legacyHeaders: false,
        },
    },
  
  // Request limits
  request: {
    jsonLimit: '10kb',
    urlencodedLimit: '10kb'
  }
};