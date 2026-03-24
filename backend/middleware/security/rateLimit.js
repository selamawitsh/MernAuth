import rateLimit from 'express-rate-limit';
import { securityConfig } from '../../config/security.js';

// General rate limiter - applies to all routes
export const generalRateLimiter = rateLimit(securityConfig.rateLimit.general);

// Strict rate limiter for authentication routes
export const authRateLimiter = rateLimit(securityConfig.rateLimit.auth);