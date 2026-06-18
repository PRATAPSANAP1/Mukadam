const express = require('express');
const router = express.Router();
const Koyta = require('../models/Koyta');

// Get all Koytas with basic stats
router.get('/', async (req, res) => {
  try {
    const seasonId = req.headers['x-season-id'];
    const query = seasonId ? { seasonId } : {};
    const koytas = await Koyta.find(query).lean();
    
    // For advanced filters we need: dhanda, uchal, baki, khade
    const Settlement = require('../models/Settlement');
    const Advance = require('../models/Advance');
    const Khade = require('../models/Khade');

    const enhancedKoytas = await Promise.all(koytas.map(async (k) => {
      const settlement = await Settlement.findOne({ koytaId: k._id });
      const advances = await Advance.find({ koytaId: k._id });
      const totalUchal = advances.reduce((acc, curr) => acc + curr.amount, 0);
      
      const khades = await Khade.find({ koytaId: k._id });
      const totalKhade = khades.reduce((acc, curr) => acc + curr.khadeCount, 0);

      // We approximate dhanda as baki + uchal + khade_fine if settlement exists
      // Real dhanda is easier:
      const dhanda = settlement ? (settlement.balance + totalUchal + (totalKhade * 400)) : 0;

      return {
        ...k,
        baki: settlement ? settlement.balance : 0,
        totalUchal,
        totalKhade,
        dhanda
      };
    }));

    res.json(enhancedKoytas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new Koyta
router.post('/', async (req, res) => {
  const koytaData = { ...req.body };
  if (req.headers['x-season-id']) {
    koytaData.seasonId = req.headers['x-season-id'];
  }
  const koyta = new Koyta(koytaData);
  try {
    const newKoyta = await koyta.save();
    res.status(201).json(newKoyta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single Koyta
router.get('/:id', async (req, res) => {
  try {
    const koyta = await Koyta.findById(req.params.id);
    if (!koyta) return res.status(404).json({ message: 'Koyta not found' });
    res.json(koyta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Koyta
router.put('/:id', async (req, res) => {
  try {
    const oldKoyta = await Koyta.findById(req.params.id);
    if (!oldKoyta) return res.status(404).json({ message: 'Not found' });

    const updates = req.body;
    
    // Check if status or type changed to log history
    if (updates.status && updates.status !== oldKoyta.status) {
      oldKoyta.history.push({
        event: 'Status Change',
        details: `Status changed from ${oldKoyta.status} to ${updates.status}`
      });
    }
    if (updates.koytaType && updates.koytaType !== oldKoyta.koytaType) {
      oldKoyta.history.push({
        event: 'Type Conversion',
        details: `Type changed from ${oldKoyta.koytaType} to ${updates.koytaType}`
      });
    }

    Object.assign(oldKoyta, updates);
    const updatedKoyta = await oldKoyta.save();
    
    res.json(updatedKoyta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
