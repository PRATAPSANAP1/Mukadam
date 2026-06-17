const express = require('express');
const router = express.Router();
const Season = require('../models/Season');

router.get('/', async (req, res) => {
  try {
    const seasons = await Season.find().sort({ startDate: -1 });
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    // Set all others to inactive
    await Season.updateMany({}, { isActive: false });
    const newSeason = new Season(req.body);
    await newSeason.save();
    res.status(201).json(newSeason);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/activate', async (req, res) => {
  try {
    await Season.updateMany({}, { isActive: false });
    const season = await Season.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
