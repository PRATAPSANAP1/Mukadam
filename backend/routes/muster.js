const express = require('express');
const router = express.Router();
const Muster = require('../models/Muster');

// Get all Musters
router.get('/', async (req, res) => {
  try {
    const seasonId = req.headers['x-season-id'];
    const query = seasonId ? { seasonId } : {};
    const musters = await Muster.find(query).sort({ musterNo: 1 });
    res.json(musters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new Muster
router.post('/', async (req, res) => {
  const musterData = { ...req.body };
  if (req.headers['x-season-id']) {
    musterData.seasonId = req.headers['x-season-id'];
  }
  const muster = new Muster(musterData);
  try {
    const newMuster = await muster.save();
    res.status(201).json(newMuster);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Close Muster
router.put('/:id/close', async (req, res) => {
  try {
    const muster = await Muster.findByIdAndUpdate(req.params.id, { status: 'Closed' }, { new: true });
    res.json(muster);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
