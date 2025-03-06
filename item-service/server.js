require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// **Add this line to register the User model**
require('./models/user'); // Ensure that the user model file exists in the 'models' folder

const itemRoutes = require('./routes/itemRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files for uploads (if needed)
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Item service running on port ${PORT}`));

app.use('/uploads', express.static('uploads'));