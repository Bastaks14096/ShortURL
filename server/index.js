// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const router = require('./router')

// Enable CORS for all routes
app.use(cors());
app.use(router);
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
