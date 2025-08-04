// Import the User model to create and check users in MongoDB
const User = require('../models/User');

// Import bcrypt to compare hashed passwords for login sessions
const bcrypt = require('bcryptjs');

// Import jsonwebtoken to generate a signed token for login sessions
const jwt = require('jsonwebtoken');

// REGISTER USER
// Register controller function to handle POST /register
const registerUser = async (req, res) => {
  // Extract user data from the request body
  const { firstName, lastName, email, password, repeatPassword } = req.body;

  // Validate required fields on the server-side
  if (!firstName || !lastName || !email || !password || !repeatPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== repeatPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create and save a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // The password will be automatically hashed in User.js before saving
    });

    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    // Catch any server errors and return error response
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// SIGN IN USER
// Sign-in controller function
const loginUser = async (req, res) => {
  // Extract email, password, and stayLoggedIn from request body
  const { email, password, stayLoggedIn } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists with that email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password with the hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a signed JWT token with user info (excluding password)
    const token = jwt.sign(
      {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: stayLoggedIn ? '7d' : '1h', // long or short session depending on checkbox
      }
    );

    // Set token in HTTP-only cookie (cannot be accessed by JavaScript)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      sameSite: 'Lax',

      // If stayLoggedIn = true, a maxAge is set, which makes the cookie persistent
      // It will remain even after closing the browser and the user stays logged in
      maxAge: stayLoggedIn ? 7 * 24 * 60 * 60 * 1000 : null, // 7 days if stayLoggedIn

      // If stayLoggedIn = false, maxAge is set to null. No maxAge means the cookie is a session cookie 
      // It disappears when the browser is closed
    });

    // Send back success response with welcome message
    res.status(200).json({
      message: `Welcome, ${user.firstName}`,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// LOG OUT USER
// Logout controller function: clears the cookie
const logoutUser = (req, res) => {
  res.clearCookie('token'); // Remove the token cookie
  res.status(200).json({ message: 'User logged out successfully' });
};

// PROFILE INFO
// Controller to return logged-in user's profile info
const getProfile = (req, res) => {

  // The protect middleware attaches decoded token info to req.user
  // In the protected route of "profile" the middelware "protect" will run before "getProfile"
  // The result of "protect" will be the condition for the decision
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Return the user data (from the token, not the DB)
  res.status(200).json({
    user: req.user,
    message: `Welcome, ${req.user.name}`,
  });
};


// Update user's profile (basic info, currency, income, saving goal)
// route: PUT /api/profile
// access: Private
const updateProfile = async (req, res) => {
  try {
    // Find user by ID (set by protect middleware)
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update only allowed fields if provided
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.currency = req.body.currency || user.currency;
    user.monthlyIncome = req.body.monthlyIncome ?? user.monthlyIncome;
    user.savingGoal = req.body.savingGoal ?? user.savingGoal;

    const updatedUser = await user.save();

    // Return updated user info (omit password)
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        currency: updatedUser.currency,
        monthlyIncome: updatedUser.monthlyIncome,
        savingGoal: updatedUser.savingGoal,
      },
    });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};


// Export the controller and its functions so it can be used in routes
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
};