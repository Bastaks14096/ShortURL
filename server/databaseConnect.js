const mongoose = require('mongoose');

const localDB = 'mongodb+srv://admin:1234@cluster0.pjwwrw7.mongodb.net/'; // your mongodb database link

const dbURL = process.env.MONGODB_URI || localDB;

// Connect to MongoDB
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection; // get the reference to the database
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


module.exports = mongoose;