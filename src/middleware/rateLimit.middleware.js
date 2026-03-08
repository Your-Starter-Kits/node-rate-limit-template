// Rate limiting middleware - protects API from abuse by limiting requests per IP address
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Global rate limiter - hard limit on requests per IP
// Blocks requests after limit is reached within the time window
const globalLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000, // Time window
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Max requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 'Check Retry-After header'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Custom key generator - identifies users by IP address
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  // Skip rate limiting for certain conditions (e.g., whitelisted IPs)
  skip: (req) => {
    // Add your whitelist logic here if needed
    // Example: return req.ip === '127.0.0.1';
    return false;
  }
});

// Speed limiter - gradually slows down responses before blocking
// Adds delay to responses after threshold is reached (softer approach)
const speedLimiter = slowDown({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  delayAfter: parseInt(process.env.SLOWDOWN_DELAY_AFTER) || 50, // Start slowing after this many requests
  delayMs: () => parseInt(process.env.SLOWDOWN_DELAY_MS) || 500, // Delay per request (v2 syntax)
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  // Custom key generator - identifies users by IP address
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Strict limiter for sensitive endpoints (login, register, password reset)
// More restrictive limits for authentication-related routes
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 requests per window
  message: {
    success: false,
    message: 'Too many attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  globalLimiter,
  speedLimiter,
  strictLimiter
};
