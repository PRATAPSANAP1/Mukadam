const mongoose = require('mongoose');
require('dotenv').config();

const Season = require('./models/Season');
const Koyta = require('./models/Koyta');
const Muster = require('./models/Muster');
const Advance = require('./models/Advance');
const Khade = require('./models/Khade');
const Earnings = require('./models/Earnings');
const Settlement = require('./models/Settlement');
const Attendance = require('./models/Attendance');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/us_todni_toli')
  .then(async () => {
    console.log('Connected to DB. Clearing collections for fresh Phase 4 start...');
    
    await Season.deleteMany({});
    await Koyta.deleteMany({});
    await Muster.deleteMany({});
    await Advance.deleteMany({});
    await Khade.deleteMany({});
    await Earnings.deleteMany({});
    await Settlement.deleteMany({});
    await Attendance.deleteMany({});
    
    console.log('Collections cleared.');

    const newSeason = new Season({
      name: '2026-27',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2027-05-31'),
      isActive: true
    });
    
    await newSeason.save();
    console.log('Default Season 2026-27 created successfully.');
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
