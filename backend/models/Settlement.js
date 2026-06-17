const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  koytaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Koyta', required: true },
  totalBusiness: { type: Number, required: true },
  advance: { type: Number, required: true },
  khadeDeduction: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  balance: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Settlement', settlementSchema);
