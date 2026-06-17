const express = require('express');
const router = express.Router();
const Advance = require('../models/Advance');
const Settlement = require('../models/Settlement');
const Khade = require('../models/Khade');
const Muster = require('../models/Muster');
const Koyta = require('../models/Koyta');

// Get Ledger for a specific Koyta
router.get('/:koytaId', async (req, res) => {
  try {
    const koytaId = req.params.koytaId;
    const koyta = await Koyta.findById(koytaId);
    if (!koyta) return res.status(404).json({ message: 'Koyta not found' });

    // 1. Fetch Advances (Negative)
    const advances = await Advance.find({ koytaId });
    const advanceEntries = advances.map(adv => ({
      date: adv.date,
      type: 'Advance',
      description: adv.remark ? `Advance (${adv.remark})` : 'Advance / उचल',
      amount: -Math.abs(adv.amount),
    }));

    // 2. Fetch Earnings from Settlement logic
    // Currently, Settlement is a single aggregated document. To show Muster-wise ledger,
    // we need to either calculate it dynamically per muster or fetch the aggregate.
    // The user wants: "15/11 मस्टर 1 +12000"
    // Since our Settlement currently does a global settlement, let's recalculate per muster 
    // to generate the ledger accurately if required, or we can just show the aggregated 
    // Settlement as a single entry for now, but the user explicitly requested muster-wise.
    // Let's implement dynamic calculation per muster.

    const musters = await Muster.find({ status: 'Closed' }).sort({ startDate: 1 });
    const Earnings = require('../models/Earnings');
    const allEarnings = await Earnings.find();
    
    // Total active koytas at the time of each muster? For simplicity, we use current total koytas.
    const allKoytas = await Koyta.find({ isActive: true });
    const totalKoytas = allKoytas.length || 1;
    const KHADE_FINE_PER_DAY = 400;

    const musterEntries = [];
    for (const muster of musters) {
      const musterEarningDoc = allEarnings.find(e => e.musterId.toString() === muster._id.toString());
      if (!musterEarningDoc) continue;

      const musterBaseShare = musterEarningDoc.totalAmount / totalKoytas;
      
      const Attendance = require('../models/Attendance');
      const absences = await Attendance.countDocuments({ musterId: muster._id, koytaId, status: 'A' });
      const halfDays = await Attendance.countDocuments({ musterId: muster._id, koytaId, status: 'H' });
      const khadeCount = absences + (halfDays * 0.5);
      
      const khadaFee = muster.khadaFee || 400;
      const khadeFine = khadeCount * khadaFee;

      // Bonus: total fine collected in this muster divided by totalKoytas
      const allAbsences = await Attendance.countDocuments({ musterId: muster._id, status: 'A' });
      const allHalfDays = await Attendance.countDocuments({ musterId: muster._id, status: 'H' });
      const totalMusterKhade = allAbsences + (allHalfDays * 0.5);
      const totalFineForMuster = totalMusterKhade * khadaFee;
      const bonusForMuster = totalFineForMuster / totalKoytas;

      const netMusterEarning = musterBaseShare - khadeFine + bonusForMuster;

      musterEntries.push({
        date: muster.endDate, // Use muster end date as the transaction date
        type: 'Muster',
        description: `Muster ${muster.musterNo} Earnings`,
        amount: netMusterEarning,
      });
    }

    // Combine and sort by date
    let ledger = [...advanceEntries, ...musterEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let balance = 0;
    ledger = ledger.map(entry => {
      balance += entry.amount;
      return {
        ...entry,
        balance
      };
    });

    res.json({ koyta, ledger, finalBalance: balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
