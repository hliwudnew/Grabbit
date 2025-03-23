require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./models/user');

const itemRoutes = require('./routes/itemRoutes');

connectDB();

const app = express();

// Enable CORS for all origins (or restrict as needed)
app.use(cors());

// Parse JSON bodies (and optionally increase size limits if needed)
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Item service running on port ${PORT}`));