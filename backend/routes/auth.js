const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database'); // Assuming you have a DB connection module

router.post('/register', async (req, res) => {
  const { username, email, password, role, expertise } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword, role, expertise });
    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({ id: user.id, role: user.role, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'expertise', 'email'], 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's details (including expertise)
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});




module.exports = router;