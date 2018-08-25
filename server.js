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

const auth = require('./controllers/auth.controller');
app.use('/api/auth', auth);

const books = require('./controllers/books.controller');
app.use('/api/books', books);

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
