import logger from '../config/logger.js';

// Hindi Comment: Centralized Error Handler Middleware jo unhandled exceptions ko safe JSON response me convert karta hai
export const errorHandler = (err, req, res, next) => {
  // Winston logger me complete error details aur stack trace log kiya
  logger.error(`[${req.method}] ${req.originalUrl || req.url} - ${err.message} \nStack: ${err.stack}`);

  // Status code determine kiya (Default: 500 Internal Server Error)
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  // MongoDB Duplicate Key Error (Jaise unique email already exist karta ho)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `Duplicate value entered for '${field}'. Please use another value.`,
    });
  }

  // Mongoose CastError (Jab invalid MongoDB ObjectId pass kiya jaye)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid identifier format: '${err.value}'`,
    });
  }

  // JWT Token Invalid / Expired Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token provided.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired. Please login again.',
    });
  }

  // Final sanitized JSON response (Production me raw stack trace hide rakha gaya hai security ke liye)
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
