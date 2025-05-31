import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Login route with automatic registration
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found, creating new user:', email);
      // Create new user (password hashing is handled by User model's pre-save middleware)
      user = await User.create({
        email,
        password,
        role: 'user',
      });
      console.log('New user created:', email);
    } else {
      // Check password for existing user
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password',
        });
      }
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    console.log('Login successful for:', email);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login/Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing login',
      error: error.message,
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;