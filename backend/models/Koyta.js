const mongoose = require('mongoose');

const koytaSchema = new mongoose.Schema({
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  koytaNo: { type: Number, required: true },
  husbandName: { type: String, required: true },
  wifeName: { type: String, required: true },
  mobile: { type: String },
  village: { type: String },
  aadharNo: { type: String },
  koytaType: { type: String, enum: ['Full', 'Half'], default: 'Full' },
  status: { type: String, enum: ['Active', 'गावाला गेला', 'टोळी सोडली', 'नवीन आला'], default: 'Active' },
  history: [{
    date: { type: Date, default: Date.now },
    event: { type: String },
    details: { type: String }
  }],
  password: { type: String, default: '1234' }, // Default password for koytawala login
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Koyta', koytaSchema);
