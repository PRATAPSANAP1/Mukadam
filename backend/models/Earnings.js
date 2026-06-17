const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  musterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Muster', required: true },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Earnings', earningsSchema);
