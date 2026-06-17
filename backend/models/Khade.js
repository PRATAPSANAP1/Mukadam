const mongoose = require('mongoose');

const khadeSchema = new mongoose.Schema({
  koytaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Koyta', required: true },
  musterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Muster', required: true },
  khadeCount: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Khade', khadeSchema);
