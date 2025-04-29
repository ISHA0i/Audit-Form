const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, err);
  
  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  // If in development, send the full error stack
  const error = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  res.status(statusCode).json(error);
};

module.exports = errorHandler; 