import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a new telemetry user profile
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All essential registration profiles are required' });
    }

    // check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      location: location || ''
    });

    await newUser.save();

    // security token creation for session management
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account provisioned successfully',
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        location: newUser.location 
      }
    });

  } catch (error) {
    console.error('Exception found during registration processing:', error.message);
    res.status(500).json({ error: 'Failed to complete registration transaction' });
  }
};

// @desc    Authenticate existing entity credentials
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Credentials criteria missing' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid identification credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid identification credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Authentication handshake completed',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        location: user.location 
      }
    });

  } catch (error) {
    console.error('Exception found during credential verification loop:', error.message);
    res.status(500).json({ error: 'Authentication engine encountered an error' });
  }
};