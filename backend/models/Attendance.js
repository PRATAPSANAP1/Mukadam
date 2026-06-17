const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  koytaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Koyta', required: true },
  musterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Muster', required: true },
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['P', 'A', 'H'], required: true } // Present, Absent, Half
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
