// Global error handler - catches and formats all errors consistently
const errorHandler = (err, req, res, next) => {
  // Log error for debugging (in production, use proper logging service)
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Send formatted error response
  res.status(statusCode).json({
    success: false,
    message: message,
    // Only include stack trace in development mode for security
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
