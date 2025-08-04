// Library to interact with MongoDB using models/schemas
const mongoose = require('mongoose');

// This function connects to MongoDB using the URI from .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // stop the server if DB fails to connect
  }
};

module.exports = connectDB;
