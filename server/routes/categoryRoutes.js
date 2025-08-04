// Import Express to create routes
const express = require('express');

// Import all controller functions for categories
const {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Import the middleware that checks if the user is logged in
// The 'protect' middleware runs first in every route to verify the token
const { protect } = require('../middleware/authMiddleware');

// Create a router object from Express
const router = express.Router();

// POST /api/categories
// Create a new category for the logged-in user
// Private (must be logged in)
router.post('/', protect, createCategory);

// GET /api/categories
// Retrieve all categories for the logged-in user
// Private (must be logged in)
router.get('/', protect, getUserCategories);

// PUT /api/categories/:id
// Update a category’s name (only if user owns it)
// Private (must be logged in)
router.put('/:id', protect, updateCategory);

// DELETE /api/categories/:id
// Delete a category (only if user owns it)
// Private (must be logged in)
router.delete('/:id', protect, deleteCategory);

// Export the router to be used in server.js
module.exports = router;
