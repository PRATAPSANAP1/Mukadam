const express = require('express');
const router = express.Router();
const Earnings = require('../models/Earnings');

// Add or update earnings for a muster
router.post('/', async (req, res) => {
  const { musterId, totalAmount } = req.body;
  try {
    let earnings = await Earnings.findOne({ musterId });
    if (earnings) {
      earnings.totalAmount = totalAmount;
      await earnings.save();
    } else {
      earnings = new Earnings({ musterId, totalAmount });
      await earnings.save();
    }
    res.json(earnings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get earnings by muster
router.get('/muster/:musterId', async (req, res) => {
  try {
    const earnings = await Earnings.findOne({ musterId: req.params.musterId });
    if (!earnings) return res.status(404).json({ message: 'Earnings not found' });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
