import express from 'express';
import { securityConfig } from '../../config/security.js';

// Limit JSON and URL-encoded body sizes
export const bodyParserMiddleware = [
  express.json({ limit: securityConfig.request.jsonLimit }),
  express.urlencoded({ extended: true, limit: securityConfig.request.urlencodedLimit })
];