// Security middleware - adds additional security measures beyond helmet
const securityMiddleware = (req, res, next) => {
  // Remove sensitive headers that expose server information
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
  res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Enable XSS filter
  
  // Sanitize request body to prevent injection attacks
  if (req.body) {
    sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  next();
};

// Recursively sanitize objects by removing potentially dangerous characters
// Helps prevent NoSQL injection and XSS attacks
function sanitizeObject(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove common injection patterns
      obj[key] = obj[key]
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/\$/g, '') // Remove $ (MongoDB operator)
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]); // Recursively sanitize nested objects
    }
  }
}

module.exports = securityMiddleware;
