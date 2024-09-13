const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', productRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
