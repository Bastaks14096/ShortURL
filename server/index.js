// server.js
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection; // get the reference to the database
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define URL schema
const urlSchema = new mongoose.Schema({
    url: String,
    shortUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Endpoint for shortening URLs
app.post('/shorten', async (req, res) => {
    const { url } = req.body;
    const shortUrl = shortid.generate();
    try {
        // Save the URL in the database
        await Url.create({ url, shortUrl });
        // Send the short URL back to the client
        res.redirect('http://localhost:3000/')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get all URLs
app.get('/getallUrl', async (req, res) => {
    try {
        const allUrlDocuments = await Url.find();
        res.json(allUrlDocuments);
    } catch (error) {
        console.error('Error retrieving all URLs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res)=>{
    res.send('run at path /');
})

// Endpoint to redirect short URLs to the original URL
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    try {
        const result = await Url.findOne({ shortUrl });

        if (result) {
            res.redirect(result.url);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error finding URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
