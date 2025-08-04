// Import core packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load environment variables from .env
dotenv.config();

// Create the Express app
const app = express();

// Middleware to handle JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Allow requests from frontend (React runs on port 3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // allow cookies to be sent across domains
}));

// Import DB connection function
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Routes (Mounting the routes in server.js)
// Authentication routes (log in, sing in, log out)
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// CRUD routes for categories
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

// CRUD routes for expenses
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Smart Budget API is running ✅');
});

// Define server port (fallback to 5000 if not in .env)
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
