// Main application configuration - sets up Express app with all middleware and routes
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const securityMiddleware = require('./middleware/security.middleware');
const rateLimitMiddleware = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');
const routes = require('./routes');

const app = express();

// Security middleware - protects against common vulnerabilities
app.use(helmet());

// CORS - controls which domains can access the API
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Request logging - tracks all incoming requests for debugging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing - enables JSON request body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response compression - reduces response size for better performance
app.use(compression());

// Custom security headers and sanitization
app.use(securityMiddleware);

// Rate limiting - prevents API abuse by limiting requests per IP
app.use(rateLimitMiddleware.globalLimiter);
app.use(rateLimitMiddleware.speedLimiter);

// API routes - all application endpoints
app.use(process.env.API_PREFIX || '/api/v1', routes);

// Health check endpoint - used to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler - catches requests to non-existent routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Global error handler - catches and formats all errors
app.use(errorHandler);

module.exports = app;
