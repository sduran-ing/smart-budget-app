// Import the Category model to interact with the database
const Category = require('../models/Category');

//  We use the Expense model to prevent deletion of a category with linked expenses and maintaining database integrity
const Expense = require('../models/Expense');

// Create a new category for the logged-in user
// route: POST /api/categories
// access: Private
const createCategory = async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Check if the user already created a category with this name
    const exists = await Category.findOne({ user: req.user.id, name });
    if (exists) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    // Create a new category document after veryfing the existing categories
    const newCategory = await Category.create({
      name,
      user: req.user.id, // Link category to logged-in user
    });

    // Respond with the created category
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Create Category Error:', error.message);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// Get all categories for the logged-in user
// route: GET /api/categories
// access: Private
const getUserCategories = async (req, res) => {
  try {
    // Fetch all categories that belong to the logged-in user
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });

    // Return the list
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve categories' });
  }
};

// Update a category’s name (owned by the user)
// route: PUT /api/categories/:id
// access: Private
const updateCategory = async (req, res) => {
  const { name } = req.body;

  try {
    // Find the category that matches the ID and belongs to the user
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });

    // If not found or not owned by user, return error
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update name if provided
    category.name = name || category.name;

    // Save changes
    await category.save();

    // Return the updated category
    res.status(200).json(category);
  } catch (error) {
    console.error('Update Category Error:', error.message);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Delete a category by ID if it belongs to the user
// route: DELETE /api/categories/:id
// access: Private
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;

    // 1. Check if the category belongs to the logged-in user
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found or not authorized' });
    }

    // 2. Check if any expenses are linked to this category
    const relatedExpenses = await Expense.findOne({ category: categoryId });
    if (relatedExpenses) {
      return res.status(400).json({ message: 'Cannot delete a category with linked expenses' });
    }

    // 3. Proceed to delete the category
    await category.deleteOne();

    res.status(200).json({ message: 'Category deleted successfully ✅' });
  } catch (err) {
    console.error('Delete Category Error:', err.message);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
};

// Export all controller functions to be used in routes
module.exports = {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
};
