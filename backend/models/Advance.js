const mongoose = require('mongoose');

const advanceSchema = new mongoose.Schema({
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  koytaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Koyta', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  remark: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Advance', advanceSchema);
