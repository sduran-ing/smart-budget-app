// Import mongoose for schema creation
const mongoose = require('mongoose');

// Define a schema for expense categories
const categorySchema = new mongoose.Schema({
  // Reference to the user who created this category
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Links to User collection
    required: true,
  },

  // Name of the category (e.g. Food, Utilities, Rent)
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Export the model so it can be used elsewhere
module.exports = mongoose.model('Category', categorySchema);
