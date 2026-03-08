// Authentication routes - handles auth endpoints with strict rate limiting
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { strictLimiter } = require('../middleware/rateLimit.middleware');

// POST /api/v1/auth/login - User login (strict rate limit applied)
// Strict limiter prevents brute force attacks on login
router.post('/login', strictLimiter, authController.login);

// POST /api/v1/auth/register - User registration (strict rate limit applied)
// Strict limiter prevents spam account creation
router.post('/register', strictLimiter, authController.register);

// POST /api/v1/auth/forgot-password - Password reset request (strict rate limit applied)
// Strict limiter prevents abuse of password reset functionality
router.post('/forgot-password', strictLimiter, authController.forgotPassword);

module.exports = router;
