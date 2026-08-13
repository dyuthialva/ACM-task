require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database (which auto-initializes and seeds)
const db = require('./backend/database');

const productRoutes = require('./backend/routes/productRoutes');
const authRoutes = require('./backend/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors());

// Parse JSON payloads
app.use(express.json());

// Register routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Root route welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NICEMART API. Backend is running successfully!' });
});

// 404 Route handler for unregistered routes
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}. Route not found.` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message || err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
