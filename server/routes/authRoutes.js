// Import Express to create routes for the backend
const express = require('express');

// Import controller functions that contain the logic for each route
const {
  registerUser,  // Handles user registration logic
  loginUser,     // Handles user login logic
  logoutUser,    // Handles user logout logic
  getProfile,    // Returns the currently logged-in user's profile info
  updateProfile, // Updated the profile info
} = require('../controllers/authController');

// Import middleware that protects routes by verifying JWT tokens
const { protect } = require('../middleware/authMiddleware');

// Create a new Express router instance to define route endpoints
const router = express.Router();

// PUBLIC ROUTES
// These routes can be accessed without being logged in

// Register a new user
router.post('/register', registerUser);

// Authenticate user and set token cookie
router.post('/login', loginUser);

// Clear the token cookie and log out user, is public because anyone can try to logout
router.post('/logout', logoutUser);

// PROTECTED ROUTES
// These routes require a valid JWT token to access (must be logged in)

// Get logged-in user's profile info
// The 'protect' middleware runs first to verify the token and attach user info to req.user
// Then 'getProfile' reads req.user and returns the user's name/email
router.get('/profile', protect, getProfile);

// Updating profile
router.put('/profile', protect, updateProfile);

// Export the router so it can be used in server.js (as middleware under /api)
module.exports = router;
