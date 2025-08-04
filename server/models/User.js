// Import Mongoose to define a schema and interact with MongoDB
const mongoose = require('mongoose');

// Import bcryptjs to securely hash passwords before saving them
const bcrypt = require('bcryptjs');

// Define the structure of the User document for MongoDB
const userSchema = new mongoose.Schema(
  {
    // First name field: required, and whitespace will be trimmed
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    // Last name field: required, and whitespace will be trimmed
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    // Email field: required, unique, lowercase, and must match basic email pattern
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // prevents duplicate users with the same email
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },

    // Password field: required and must be at least 6 characters
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

  // Preferred currency for budgeting (default: CAD)
    currency: {
      type: String,
      enum: ['USD', 'CAD', 'EUR', 'GBP', 'NGN', 'INR', 'BRL'], // Add more as needed
      default: 'CAD',
    },

    // Monthly income (will be updated in profile later)
    monthlyIncome: {
      type: Number,
      default: 0, // Start at zero — user will enter it later
    },

    // Saving goal (optional, for investment suggestions)
    savingGoal: {
      type: Number,
      default: 0, // Start at zero — user sets this later
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` timestamps to each user document
    timestamps: true,
  }
);

// Middleware that runs **before saving** a user to the database
// This will hash the password to protect it from being stored in plain text
userSchema.pre('save', async function (next) {
  // If the password hasn't changed (e.g. updating user info), skip this step
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt (random string) to add complexity to the hash
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt and overwrite the plain password
    this.password = await bcrypt.hash(this.password, salt);

    // Proceed to save the user
    next();
  } catch (err) {
    // If an error occurs during hashing, pass it to the next middleware
    next(err);
  }
});

// Export the User model so it can be used in controllers/routes
module.exports = mongoose.model('User', userSchema);
