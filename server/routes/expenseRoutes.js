const express = require('express');

// Import controller functions
const {
  createExpense,
  getUserExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');

// Import the middleware that checks if the user is logged in
// The 'protect' middleware runs first in every route to verify the token
const { protect } = require('../middleware/authMiddleware');

// Create router
const router = express.Router();

// POST /api/expenses
// Add a new expense
// Private (must be logged in)
router.post('/', protect, createExpense);

// GET /api/expenses
// Get all expenses for logged-in user
// Private (must be logged in)
router.get('/', protect, getUserExpenses);

// PUT /api/expenses/:id
// Update an expense
// Private (must be logged in)
router.put('/:id', protect, updateExpense);

// DELETE /api/expenses/:id
// Delete an expense
// Private (must be logged in)
router.delete('/:id', protect, deleteExpense);

// GET /api/expenses/summary
// Route to get monthly summary
// Private (must be logged in)
router.get('/summary', protect, getExpenseSummary);

// Export router
module.exports = router;
