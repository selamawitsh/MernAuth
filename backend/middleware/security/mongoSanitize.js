import mongoSanitize from 'express-mongo-sanitize';

export const mongoSanitizeMiddleware = (req, res, next) => {
  // Only sanitize body and params (SAFE)
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);

  next();
};