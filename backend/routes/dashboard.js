const express = require('express');
const router = express.Router();
const Koyta = require('../models/Koyta');
const Muster = require('../models/Muster');
const Advance = require('../models/Advance');
const Settlement = require('../models/Settlement');

// Get Dashboard Metrics
router.get('/metrics', async (req, res) => {
  try {
    const seasonId = req.headers['x-season-id'];
    const query = seasonId ? { seasonId } : {};
    
    // Total Koytas for this season (not considering isActive of koyta globally, just checking season)
    // Wait, previous logic was { isActive: true } for Koytas. Let's combine:
    const koytaQuery = { ...query, isActive: true };
    const totalKoytas = await Koyta.countDocuments(koytaQuery);
    
    const musterQuery = { ...query, status: 'Open' };
    const openMusters = await Muster.countDocuments(musterQuery);
    
    const advances = await Advance.find(query);
    const totalAdvances = advances.reduce((acc, curr) => acc + curr.amount, 0);

    const settlements = await Settlement.find(query);
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
