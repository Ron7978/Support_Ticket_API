require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const ticketsRoute = require('./routes/tickets');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files

// API Routes
app.use('/tickets', ticketsRoute);

// Connect to DB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB connection failed:', err));
