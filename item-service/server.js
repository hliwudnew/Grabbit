// server.js
require('dotenv').config();
// Register the User model so Mongoose knows about it
require('./models/user');
const express = require('express');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');

connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the item routes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Item service running on port ${PORT}`));