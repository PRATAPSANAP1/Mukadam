const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get attendance for a specific muster and date
router.get('/', async (req, res) => {
  try {
    const { musterId, date } = req.query;
    if (!musterId || !date) return res.status(400).json({ message: 'musterId and date required' });
    
    // Parse the date to match the exact day, ignoring time
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23,59,59,999);

    const records = await Attendance.find({ 
      musterId, 
      date: { $gte: startOfDay, $lte: endOfDay } 
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save bulk attendance for a date
router.post('/bulk', async (req, res) => {
  try {
    const { musterId, seasonId, date, records } = req.body;
    // records: [{ koytaId, status }]

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23,59,59,999);

    // Delete existing records for that day and muster to replace them
    await Attendance.deleteMany({
      musterId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const newRecords = records.map(r => ({
      koytaId: r.koytaId,
      musterId,
      seasonId,
      date: startOfDay,
      status: r.status
    }));

    await Attendance.insertMany(newRecords);
    res.status(201).json({ message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper route to get total Khade for a Koyta in a Muster
router.get('/khade/:musterId/:koytaId', async (req, res) => {
  try {
    const { musterId, koytaId } = req.params;
    const absences = await Attendance.countDocuments({ musterId, koytaId, status: 'A' });
    const halfDays = await Attendance.countDocuments({ musterId, koytaId, status: 'H' });
    // Assuming H = 0.5 absent
    const totalKhade = absences + (halfDays * 0.5);
    res.json({ khadeCount: totalKhade });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
