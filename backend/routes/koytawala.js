const express = require('express');
const router = express.Router();
const Koyta = require('../models/Koyta');
const Muster = require('../models/Muster');
const Advance = require('../models/Advance');
const Khade = require('../models/Khade');
const Earnings = require('../models/Earnings');
const Settlement = require('../models/Settlement');

router.get('/dashboard/:koytaId', async (req, res) => {
  try {
    const { koytaId } = req.params;
    const koyta = await Koyta.findById(koytaId);
    if (!koyta) return res.status(404).json({ message: 'Koyta not found' });

    // 1. Current Muster
    const currentMuster = await Muster.findOne({ status: 'Open' }).sort({ startDate: -1 });

    // 2. Attendance/Khade for current muster
    let currentKhadeCount = 0;
    let attendanceCalendar = [];
    if (currentMuster) {
      const khadeDoc = await Khade.findOne({ koytaId, musterId: currentMuster._id });
      currentKhadeCount = khadeDoc ? khadeDoc.khadeCount : 0;
      
      // Simulate calendar
      const start = new Date(currentMuster.startDate);
      const end = new Date(currentMuster.endDate);
      const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      let khadeLeft = currentKhadeCount;
      for (let i = 0; i < totalDays; i++) {
        let status = 'P';
        if (khadeLeft > 0) {
          status = 'A';
          khadeLeft--;
        }
        attendanceCalendar.push({ day: i + 1, status });
      }
    }

    // 3. Advance History
    const advances = await Advance.find({ koytaId }).sort({ date: -1 });
    const totalAdvances = advances.reduce((acc, curr) => acc + curr.amount, 0);

    // 4. Muster-wise History & Dhanda
    const musters = await Muster.find({ status: 'Closed' }).sort({ startDate: 1 });
    const allEarnings = await Earnings.find();
    const allKoytasCount = await Koyta.countDocuments({ isActive: true });
    
    const KHADE_FINE_PER_DAY = 400; // Will be overridden by muster specific fee
    let totalDhanda = 0;
    let totalKhadeDeduction = 0;
    const musterHistory = [];

    for (const muster of musters) {
      const earningDoc = allEarnings.find(e => e.musterId.toString() === muster._id.toString());
      if (!earningDoc) continue;

      const baseShare = earningDoc.totalAmount / (allKoytasCount || 1);
      
      const khadaFee = muster.khadaFee || KHADE_FINE_PER_DAY;
      
      const absences = await Attendance.countDocuments({ musterId: muster._id, koytaId, status: 'A' });
      const halfDays = await Attendance.countDocuments({ musterId: muster._id, koytaId, status: 'H' });
      const khadeCount = absences + (halfDays * 0.5);
      const khadeFine = khadeCount * khadaFee;
      
      const allAbsences = await Attendance.countDocuments({ musterId: muster._id, status: 'A' });
      const allHalfDays = await Attendance.countDocuments({ musterId: muster._id, status: 'H' });
      const totalMusterKhade = allAbsences + (allHalfDays * 0.5);
      const bonus = (totalMusterKhade * khadaFee) / (allKoytasCount || 1);

      const netEarnings = baseShare - khadeFine + bonus;
      totalDhanda += baseShare; // Or netEarnings based on definition
      totalKhadeDeduction += khadeFine;

      // Find advances for this muster period roughly
      const musterAdvances = await Advance.find({ 
        koytaId, 
        date: { $gte: muster.startDate, $lte: muster.endDate } 
      });
      const musterAdvanceTotal = musterAdvances.reduce((acc, curr) => acc + curr.amount, 0);

      musterHistory.push({
        musterNo: muster.musterNo,
        dhanda: baseShare,
        uchal: musterAdvanceTotal,
        khadeCount: khadeCount,
        baki: netEarnings - musterAdvanceTotal
      });
    }

    // 5. Settlement Summary
    const settlementDoc = await Settlement.findOne({ koytaId });
    const settlementSummary = {
      dhanda: totalDhanda,
      uchal: totalAdvances,
      khade: totalKhadeDeduction,
      baki: settlementDoc ? settlementDoc.balance : 0
    };

    // 6. Notifications (Mock)
    const notifications = [
      { id: 1, text: `आज उचल जमा झाली ₹${advances.length > 0 ? advances[0].amount : 0}`, type: 'success' },
      { id: 2, text: 'नवीन हिशोब तयार झाला', type: 'info' }
    ];

    res.json({
      profile: koyta,
      currentMuster: currentMuster ? {
        musterNo: currentMuster.musterNo,
        startDate: currentMuster.startDate,
        endDate: currentMuster.endDate,
        totalDays: attendanceCalendar.length,
        present: attendanceCalendar.length - currentKhadeCount,
        absent: currentKhadeCount,
        calendar: attendanceCalendar
      } : null,
      dhanda: {
        total: totalDhanda,
        history: musterHistory.map(m => ({ musterNo: m.musterNo, amount: m.dhanda }))
      },
      uchal: {
        total: totalAdvances,
        history: advances
      },
      khadeDeduction: {
        count: currentKhadeCount + (totalKhadeDeduction / KHADE_FINE_PER_DAY),
        fee: KHADE_FINE_PER_DAY,
        total: totalKhadeDeduction + (currentKhadeCount * KHADE_FINE_PER_DAY)
      },
      settlementSummary,
      musterHistory,
      notifications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
