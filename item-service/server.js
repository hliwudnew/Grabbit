// server.js for item service
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./models/user'); // Ensure user model is registered
const itemRoutes = require('./routes/itemRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Item service running on port ${PORT}`));