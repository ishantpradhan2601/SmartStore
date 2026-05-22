const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connect using the URI from .env. For local development, use MongoDB Compass/local MongoDB.
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.db.databaseName}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\nTroubleshoot:');
    console.error('  1. Verify MongoDB is running locally');
    console.error('  2. Open MongoDB Compass and connect to mongodb://localhost:27017');
    console.error('  3. Ensure MONGO_URI in .env is set to mongodb://localhost:27017/smartstore');
    console.error('  4. Check that port 27017 is not blocked or used by another service');
    process.exit(1);
  }
};

module.exports = connectDB;
