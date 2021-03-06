const Book = require('../models/book.model');
const User = require('../models/user.model');

const verifyToken = require('../common/verify-token.function');

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/:bookId', (req, res) => {
    Book.findById(req.params.bookId, (err, book) => {
        if(err)
            return res.status(500).json({ Message: 'There was an error finding this book.' });

        if(!book)
            return res.status(404).json({ Message: 'No books found.' });

        return res.status(200).json({
            Id: book._id,
            Title: book.Title,
            SubTitle: book.SubTitle,
            ImageURL: book.ImageURL,
            Categories: book.Categories,
            Authors: book.Authors,
            ISBN: book.ISBN
        });
    });
});

router.post('/', verifyToken, (req, res, next) => {
    Book.create({
        Title: req.body.Title,
        SubTitle: req.body.SubTitle,
        ImageURL: req.body.ImageURL,
        Categories: req.body.Categories,
        Authors: req.body.Authors,
        ISBN: req.body.ISBN
    }, (err, book) => {
        if(err)
            return res.status(500).json({ Message: 'There was a problem creating a book.' });

        User.findOneAndUpdate({ _id: req.userId }, { $push: { Books: mongoose.Types.ObjectId(book._id) } }, (err2, doc, user) => {
            if(err2)
                return res.status(500).json({ Message: 'There was a problem assigning the book to the user.' });

            return res.status(201).json({
                Id: book._id,
                Title: book.Title,
                SubTitle: book.SubTitle,
                ImageURL: book.ImageURL,
                Categories: book.Categories,
                Authors: book.Authors,
                ISBN: book.ISBN
            });
        });
    });
});

router.delete('/:bookId', verifyToken, (req, res) => {
    Book.deleteOne({ _id: req.params.bookId }, (err) => {
        if(err)
            return res.status(500).json({ Message: 'There was a problem removing the user.' });

        return res.status(204).json(); 
    });
});

module.exports = router;
