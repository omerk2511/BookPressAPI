const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    Title: String,
    SubTitle: String,
    Categories: [String],
    Authors: [String],
    ISBN: String
});

module.exports = mongoose.model('Book', bookSchema);