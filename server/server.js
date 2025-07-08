
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow CORS for deployed frontend
const corsOptions = {
  origin: ['https://quiz-maker-frontend.onrender.com', 'http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const quizRoutes = require('./routes/quiz');
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Quiz Maker Backend Running ✅');
});

// Port and DB URI
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("📡 Connecting to MongoDB:", MONGO_URI);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
