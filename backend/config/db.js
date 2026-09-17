const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // UPDATED: Fixed the casing to match your existing database cluster namespace exactly
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TaskForge');
    console.log(`MongoDB Connected Database Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;