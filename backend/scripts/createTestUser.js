import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/config.js';

const createTestUser = async () => {
  try {
    const mongoURI = config.mongoURI || 'mongodb://127.0.0.1:27017/ecommerce';
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');

    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    };

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      process.exit(0);
    }

    // Create new user
    console.log('Creating new test user...');
    const user = await User.create(testUser);
    console.log('Test user created successfully:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the function
console.log('Starting test user creation...');
createTestUser(); 