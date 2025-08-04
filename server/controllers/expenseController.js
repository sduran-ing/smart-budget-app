// Import the Expense model to interact with the expenses collection
const Expense = require('../models/Expense');

// Import the Category model to validate category usage
const Category = require('../models/Category');

// Create a new expense for the logged-in user
// route: POST /api/expenses
// access: Private
const createExpense = async (req, res) => {
  const { amount, description, category, date } = req.body;

  // Validate required fields
  if (!amount || !description || !category) {
    return res.status(400).json({ message: 'Amount, description, and category are required' });
  }

  try {
    // Make sure the category belongs to the user
    const validCategory = await Category.findOne({ _id: category, user: req.user.id });
    if (!validCategory) {
      return res.status(404).json({ message: 'Invalid category or not owned by user' });
    }

    // Create and save new expense
    const newExpense = await Expense.create({
      user: req.user.id,
      amount,
      description,
      category,
      date: date || Date.now(), // default to now if no date provided
    });

    // Respond with the created expense
    res.status(201).json(newExpense);    
  } catch (error) {
    console.error('Create Expense Error:', error.message);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

// Get all expenses for the logged-in user
// GET /api/expenses
// access: Private
const getUserExpenses = async (req, res) => {
  try {
    // Find all expenses for the user, and populate category names
    const expenses = await Expense.find({ user: req.user.id })
      .populate('category', 'name') // replaces category ID with name
      .sort({ date: -1 }); // sort by newest first

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Get Expenses Error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve expenses' });
  }
};

// Update an expense
// route: PUT /api/expenses/:id
// access: Private
const updateExpense = async (req, res) => {
  const { amount, description, category, date } = req.body;

  try {
    // Find the expense by ID and ensure it belongs to the user
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If a new category is provided, ensure it belongs to the user
    if (category) {
      const validCategory = await Category.findOne({ _id: category, user: req.user.id });
      if (!validCategory) {
        return res.status(404).json({ message: 'Invalid category' });
      }
      expense.category = category;
    }

    // Update other fields if provided
    if (amount !== undefined) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (date !== undefined) expense.date = date;

    // Save the updated expense
    await expense.save();

    // Return the updated expense
    res.status(200).json(expense);
  } catch (error) {
    console.error('Update Expense Error:', error.message);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// Delete an expense
// route: DELETE /api/expenses/:id
// access: Private
const deleteExpense = async (req, res) => {
  try {
    // Find and delete the expense that belongs to the user
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    // If not found or already deleted, return error
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or already deleted' });
    }

    // Return success message
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete Expense Error:', error.message);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

// Get expense summary for the current month
// route: GET /api/expenses/summary
// access: Private
const getExpenseSummary = async (req, res) => {
  try {
    
    // 1. Get user's income and savings goal
    const monthlyIncome = req.user.monthlyIncome || 0;
    const savingGoal = req.user.savingGoal || 0;

    // 2. Define current month range
    const { month } = req.query; // From frontend (e.g. "2025-06")

    // Fallback to current month if not provided
    const selectedMonth = month || new Date().toISOString().slice(0, 7);

    const [year, monthIndex] = selectedMonth.split('-').map(Number);

    const startOfMonth = new Date(year, monthIndex - 1, 1);
    const endOfMonth = new Date(year, monthIndex, 0, 23, 59, 59); // end of month

    // 3. AGGREGATE TOTAL SPENT THIS MONTH
    const totalThisMonthResult = await Expense.aggregate([
      {
        // Match all expenses for this user and this month
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        // Group all matching documents into one group and sum the "amount"
        $group: {
          _id: null,                 // No group-by field; just sum all
          totalSpent: { $sum: "$amount" }, // Sum of expense amounts
        },
      },
    ]);

    // Get the total spent (default to 0 if nothing returned)
    const totalSpent = totalThisMonthResult[0]?.totalSpent || 0;

    // 4. AGGREGATE TOTAL PER CATEGORY
    const spendingByCategory = await Expense.aggregate([
      {
        // Match user's expenses from this month
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        // Group by category and sum amounts per group
        $group: {
          _id: "$category",             // Group by category ID
          total: { $sum: "$amount" },   // Sum of expense amounts per category
        },
      },
      {
        // Join (lookup) category info (name) from Category collection
        $lookup: {
          from: "categories",           // Collection name in MongoDB
          localField: "_id",            // category ID in Expense
          foreignField: "_id",          // category ID in Category
          as: "categoryInfo",           // Output array with joined data
        },
      },
      {
        // Since categoryInfo is an array, convert to single object
        $unwind: "$categoryInfo",
      },
      {
        // Format the output fields
        $project: {
          _id: 0,                        // Exclude MongoDB internal _id
          category: "$categoryInfo.name", // Show category name
          total: 1,                      // Include total
        },
      },
    ]);

    // 5. Calculate savings and compare to goal
    const savings = monthlyIncome - totalSpent;

    // Only suggest investment if user saved at least what they set as goal
    const suggestInvestment = savings >= savingGoal && (savingGoal > 0);

    // 6. Return the full summary
    res.status(200).json({
      totalSpent,
      monthlyIncome,
      savingGoal,
      savings,
      suggestInvestment,
      spendingByCategory,
    });

    // This console logs help us debug if the information is being retrieved and processed correctly
    console.log({
      userId,
      selectedMonth,
      startOfMonth,
      endOfMonth,
      totalSpent,
      monthlyIncome,
      savingGoal,
      savings,
      suggestInvestment,
      spendingByCategory,
    });

  } catch (error) {
    console.error("Expense Summary Error:", error.message);
    res.status(500).json({ message: "Failed to generate summary" });
  }
};


// Export all controller functions to use in routes
module.exports = {
  createExpense,
  getUserExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
