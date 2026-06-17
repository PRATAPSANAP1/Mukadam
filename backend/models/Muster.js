const mongoose = require('mongoose');

const musterSchema = new mongoose.Schema({
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  musterNo: { type: Number, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  khadaFee: { type: Number, default: 400 },
}, { timestamps: true });

module.exports = mongoose.model('Muster', musterSchema);
