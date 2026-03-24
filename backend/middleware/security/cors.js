import cors from 'cors';
import { securityConfig } from '../../config/security.js';

// Configure CORS with allowed origins
export const corsMiddleware = cors(securityConfig.cors);