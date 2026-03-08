// Main router - aggregates all route modules
const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

// Mount route modules on their respective paths
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// API info endpoint - provides API documentation link
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Rate Limiting Template',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      auth: '/auth'
    }
  });
});

module.exports = router;
