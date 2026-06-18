const express = require('express');
const router = express.Router();
const Advance = require('../models/Advance');

// Get advances for a Koyta
router.get('/koyta/:koytaId', async (req, res) => {
  try {
    const advances = await Advance.find({ koytaId: req.params.koytaId }).sort({ date: -1 });
    res.json(advances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add advance
router.post('/', async (req, res) => {
  const advanceData = { ...req.body };
  if (req.headers['x-season-id'] && !advanceData.seasonId) {
    advanceData.seasonId = req.headers['x-season-id'];
  }
  const advance = new Advance(advanceData);
  try {
    const newAdvance = await advance.save();
    res.status(201).json(newAdvance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all advances
router.get('/', async (req, res) => {
  try {
    const seasonId = req.headers['x-season-id'];
    const query = seasonId ? { seasonId } : {};
    const advances = await Advance.find(query).populate('koytaId', 'koytaNo husbandName');
    res.json(advances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
