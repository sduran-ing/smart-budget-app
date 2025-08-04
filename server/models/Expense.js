// Import mongoose for schema creation
const mongoose = require('mongoose');

// Define a schema for expenses
const expenseSchema = new mongoose.Schema({
  // Reference to the user who owns this expense
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

    // Reference to the category the expense falls under
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },

  // Amount spent (must be positive)
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be a positive number'],
  },

  // Short description or title of the expense
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },

  // Date of the expense (default is today)
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Export the model
module.exports = mongoose.model('Expense', expenseSchema);
