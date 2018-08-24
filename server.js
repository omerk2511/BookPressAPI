const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require('./config/db.config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(db.url,  {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database.");
}).catch(err => {
    console.log('Could not connect to the database.');
    process.exit();
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Some initial stuff' });
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
