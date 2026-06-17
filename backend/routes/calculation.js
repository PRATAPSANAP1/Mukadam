const express = require('express');
const router = express.Router();
const Koyta = require('../models/Koyta');
const Muster = require('../models/Muster');
const Advance = require('../models/Advance');
const Attendance = require('../models/Attendance');
const Earnings = require('../models/Earnings');
const Settlement = require('../models/Settlement');

router.get('/', async (req, res) => {
  try {
    const settlements = await Settlement.find().populate('koytaId', 'koytaNo husbandName');
    res.json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/settle', async (req, res) => {
  try {
    const koytas = await Koyta.find({ isActive: true });
    const musters = await Muster.find({ status: 'Closed' });
    const earnings = await Earnings.find();
    
    // Total Advances per Koyta
    const advances = await Advance.find();
    
    // Clear previous settlements
    await Settlement.deleteMany();

    const settlements = [];
    let grandTotalEarnings = 0;

    for (const koyta of koytas) {
      let totalBusinessShare = 0;
      let totalKhadeDeduction = 0;
      let totalBonus = 0;

      for (const muster of musters) {
        const musterEarning = earnings.find(e => e.musterId.toString() === muster._id.toString());
        if (!musterEarning) continue;

        const baseShare = musterEarning.totalAmount / koytas.length;
        totalBusinessShare += baseShare;
        if (koyta === koytas[0]) grandTotalEarnings += musterEarning.totalAmount;

        const khadaFee = muster.khadaFee || 400;

        // Calculate khade count from Attendance for this Koyta in this Muster
        const absences = await Attendance.countDocuments({ musterId: muster._id, koytaId: koyta._id, status: 'A' });
        const halfDays = await Attendance.countDocuments({ musterId: muster._id, koytaId: koyta._id, status: 'H' });
        const khadeCount = absences + (halfDays * 0.5);
        
        const khadeFine = khadeCount * khadaFee;
        totalKhadeDeduction += khadeFine;

        // Calculate total fine collected in this muster to redistribute as bonus
        const allAbsences = await Attendance.countDocuments({ musterId: muster._id, status: 'A' });
        const allHalfDays = await Attendance.countDocuments({ musterId: muster._id, status: 'H' });
        const totalMusterKhade = allAbsences + (allHalfDays * 0.5);
        const totalMusterFine = totalMusterKhade * khadaFee;
        
        const bonus = totalMusterFine / koytas.length;
        totalBonus += bonus;
      }

      const koytaAdvances = advances.filter(a => a.koytaId.toString() === koyta._id.toString());
      const totalAdvance = koytaAdvances.reduce((sum, a) => sum + a.amount, 0);

      const balance = totalBusinessShare - totalKhadeDeduction - totalAdvance + totalBonus;

      const newSettlement = new Settlement({
        seasonId: musters.length > 0 ? musters[0].seasonId : null,
        koytaId: koyta._id,
        totalBusiness: totalBusinessShare,
        advance: totalAdvance,
        khadeDeduction: totalKhadeDeduction,
        bonus: totalBonus,
        balance
      });

      await newSettlement.save();
      settlements.push({
        name: koyta.husbandName,
        koytaNo: koyta.koytaNo,
        baseShare: totalBusinessShare,
        khadeDeduction: totalKhadeDeduction,
        advance: totalAdvance,
        bonus: totalBonus,
        balance
      });
    }

    res.json({
      summary: {
        totalEarnings: grandTotalEarnings,
        totalKoytas: koytas.length,
        baseShare: koytas.length ? grandTotalEarnings / koytas.length : 0,
      },
      settlements
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
