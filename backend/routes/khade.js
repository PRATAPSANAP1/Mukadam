const express = require('express');
const router = express.Router();
const Khade = require('../models/Khade');

// Log Khade
router.post('/', async (req, res) => {
  const { koytaId, musterId, khadeCount } = req.body;
  try {
    let khade = await Khade.findOne({ koytaId, musterId });
    if (khade) {
      khade.khadeCount = khadeCount;
      await khade.save();
    } else {
      khade = new Khade({ koytaId, musterId, khadeCount });
      await khade.save();
    }
    res.json(khade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Khade by muster
router.get('/muster/:musterId', async (req, res) => {
  try {
    const khades = await Khade.find({ musterId: req.params.musterId }).populate('koytaId', 'koytaNo husbandName');
    res.json(khades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Khade by koyta
router.get('/koyta/:koytaId', async (req, res) => {
  try {
    const khades = await Khade.find({ koytaId: req.params.koytaId }).populate('musterId', 'musterNo');
    res.json(khades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
