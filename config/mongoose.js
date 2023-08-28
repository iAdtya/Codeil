const mongoose = require('mongoose');

const mongoURL = 'mongodb://127.0.0.1:27017/codeil_development';

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = { db, mongoURL }; // Export the db and mongoURL
