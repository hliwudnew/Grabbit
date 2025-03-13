// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


// Ensure that the User model is loaded so that it can be used by the controllers
require('./models/user');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

connectDB();

const app = express();

//Allows communication from one host/server to another, Should specify which at somepoint
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Mount user-related endpoints under /api/users
app.use('/api/users', userRoutes);

// Mount messaging endpoints under /api/messages
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));