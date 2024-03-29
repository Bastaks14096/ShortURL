const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const mongoose = require('./databaseConnect');
const host = 'https://short-url-61bg.vercel.app/'

// Define URL schema
const urlSchema = new mongoose.Schema({
    url: String,
    shortUrl: String,
    click: Number
});

const Url = mongoose.model('Url', urlSchema);


// Endpoint for shortening URLs
router.post('/shorten', async (req, res) => {
    const { url } = req.body;
    const shortUrl = shortid.generate();
    const click = 0;
    try {
        // Save the URL in the database
        await Url.create({ url, shortUrl, click });
        // Send the short URL back to the client
        res.redirect(host);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get all URLs
router.get('/getallUrl', async (req, res) => {
    try {
        const allUrlDocuments = await Url.find();
        res.json(allUrlDocuments);
    } catch (error) {
        console.error('Error retrieving all URLs:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

// Endpoint to redirect short URLs to the original URL
router.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    try {
        const result = await Url.findOne({ shortUrl });
        if (result) {
            result.click++;
            result.save();
            res.redirect(result.url);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error('Error finding URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;