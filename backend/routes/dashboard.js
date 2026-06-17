const express = require('express');
const router = express.Router();
const Koyta = require('../models/Koyta');
const Muster = require('../models/Muster');
const Advance = require('../models/Advance');
const Settlement = require('../models/Settlement');

// Get Dashboard Metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalKoytas = await Koyta.countDocuments({ isActive: true });
    
    const openMusters = await Muster.countDocuments({ status: 'Open' });
    
    const advances = await Advance.find();
    const totalAdvances = advances.reduce((acc, curr) => acc + curr.amount, 0);

    const settlements = await Settlement.find();
    const totalBalance = settlements.reduce((acc, curr) => acc + curr.balance, 0);

    res.json({
      totalKoytas,
      openMusters,
      totalAdvances,
      totalBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
