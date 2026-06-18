const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., '2026-27'
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Season', SeasonSchema);
