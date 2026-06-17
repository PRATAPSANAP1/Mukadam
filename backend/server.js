require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/us_todni_toli')
  .then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/koytas', require('./routes/koyta'));
app.use('/api/musters', require('./routes/muster'));
app.use('/api/advances', require('./routes/advance'));
app.use('/api/khade', require('./routes/khade'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/calculation', require('./routes/calculation'));
app.use('/api/ledger', require('./routes/ledger'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/koytawala', require('./routes/koytawala'));
app.use('/api/season', require('./routes/season'));
app.use('/api/attendance', require('./routes/attendance'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Us Todni Toli API is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
