import helmet from 'helmet';
import { securityConfig } from '../../config/security.js';

// Configure Helmet with security best practices
export const helmetMiddleware = helmet(securityConfig.helmet);