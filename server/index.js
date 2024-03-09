// server.js
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({extended: true}))

// Enable CORS for all routes
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.pjwwrw7.mongodb.net/short_url', { useNewUrlParser: true, useUnifiedTopology: true });

// Define URL schema
const urlSchema = new mongoose.Schema({
    url: String,
    shortUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

// Middleware to parse JSON
app.use(express.json());

// Endpoint for shortening URLs
app.post('/shorten', async (req, res) => {
    const {url} = req.body;
    const shortUrl = shortid.generate();
    try {
        // Save the URL in the database
        await Url.create({url, shortUrl});
        // Send the short URL back to the client
        res.redirect('http://localhost:3000')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res)=>{
    res.send('Server running');
})

app.get('/getallUrl', async (req, res) => {
    const allUrlDocuments = await Url.find();
    res.json(allUrlDocuments);
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
