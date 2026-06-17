const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;
    let user = await User.findOne({ mobile });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, mobile, password: hashedPassword, role });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

const Koyta = require('../models/Koyta');

// Simulate OTP Store (In-memory for prototype)
const otpStore = {};

router.post('/request-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    const koyta = await Koyta.findOne({ mobile });
    if (!koyta) return res.status(400).json({ message: 'Koyta not found with this mobile number' });

    // Generate random 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[mobile] = otp;
    
    // In production, send SMS here
    console.log(`[SIMULATED SMS] OTP for ${mobile} is ${otp}`);
    
    // For demo purposes, we return the OTP in the response
    res.json({ message: 'OTP sent successfully', devOtp: otp });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const koyta = await Koyta.findOne({ mobile });
    if (!koyta) return res.status(400).json({ message: 'Koyta not found' });

    if (otpStore[mobile] !== otp && otp !== '1234') { // Fallback 1234 for easy testing
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP
    delete otpStore[mobile];

    const payload = { user: { id: koyta.id, role: 'Koytawala' } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: koyta.id, name: koyta.husbandName, role: 'Koytawala' } });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
