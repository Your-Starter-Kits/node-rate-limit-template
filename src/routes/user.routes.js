// User routes - handles user-related endpoints with standard rate limiting
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// GET /api/v1/users - Get all users (example endpoint)
router.get('/', userController.getAllUsers);

// GET /api/v1/users/:id - Get single user by ID
router.get('/:id', userController.getUserById);

// POST /api/v1/users - Create new user
router.post('/', userController.createUser);

// PUT /api/v1/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
