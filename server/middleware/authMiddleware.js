// Import JWT to verify the user's token
const jwt = require('jsonwebtoken');
// Import User model
const User = require('../models/User'); 

// Auth middleware to protect private routes
const protect = async (req, res, next) => {
  try {
    // Read the token from the cookie
    const token = req.cookies.token;

    // If no token, block access
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }
  
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    
    // Get full user info from DB and attach to req.user
    // Attaching the full user document (excluding password) to req.user after fetching it from the DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach full user info to the request so controllers can use it

    // Move to the next middleware or route
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Export the middleware function
module.exports = { protect };
