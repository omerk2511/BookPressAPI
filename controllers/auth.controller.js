const User = require('../models/user.model');
const Book = require('../models/book.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    if(!req.body.Name || !req.body.Email || !req.body.Password){
        return res.status(400).json({
            Auth: false,
            Message: 'You must enter all fields.'
        });
    }

    const hashedPassword = bcrypt.hashSync(req.body.Password, 8);

    User.create({
        Name: req.body.Name,
        Email: req.body.Email,
        Password: hashedPassword
    }, (err, user) => {
        if(err){
            return res.status(500).json({
                Auth: false,
                Message: 'There was a problem registering the user.'
            });
        }

        const token = jwt.sign({ id: user._id }, config.secret);
        return res.status(201).json({ Auth: true, Token: token });
    });
});

router.post('/login', (req, res) => {
    if(!req.body.Email || !req.body.Password){
        return res.status(400).json({
            Auth: false,
            Message: 'You must enter all fields.'
        });
    }

    User.findOne({ Email: req.body.Email }, (err, user) => {
        if(err){
            return res.status(500).json({
                Auth: false,
                Message: 'There was a problem finding the user.' 
            });
        }

        if(!user){
            return res.status(404).json({
                Auth: false,
                Message: 'No user found.'
            });
        }

        const isPasswordValid = bcrypt.compareSync(req.body.Password, user.Password);
        if(!isPasswordValid)
            return res.status(401).json({ Auth: false, Token: null });
    
        const token = jwt.sign({ id: user._id }, config.secret);
        return res.status(200).json({ Auth: true, Token: token });
    });
});

router.get('/current', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token){
        return res.status(401).json({
            Auth: false,
            Message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, (err, data) => {
        if(err){
            return res.status(500).json({
                Auth: false,
                Message: 'Failed to authenticate token.'
            });
        }

        User.findById(data.id, (err, user) => {
            if(err){
                return res.status(500).json({
                    Auth: false,
                    Message: 'There was a problem finding the user.'
                });
            }

            if(!user){
                return res.status(404).json({
                    Auth: false,
                    Message: 'No user found.'
                });
            }

            Book.find({ _id: { $in: user.Books } }, (err2, books) => {
                return res.status(200).json({
                    Id: user._id,
                    Name: user.Name,
                    Email: user.Email,
                    Books: books.map(book => {
                        return {
                            Id: book._id,
                            Title: book.Title,
                            SubTitle: book.SubTitle,
                            ImageURL: book.ImageURL,
                            Categories: book.Categories,
                            Authors: book.Authors,
                            ISBN: book.ISBN
                        };
                    })
                });
            });
        });
    });
});

router.get('/users', (req, res) => {
    User.find((err, users) => {
        if(err)
            return res.status(500).json({ Message: 'There was a problem finding the users.' });

        const getBooks = (user) => {
            return new Promise(resolve => {
                Book.find({ _id: { $in: user.Books } }, (err2, books) => {
                    resolve({
                        Id: user._id,
                        Name: user.Name,
                        Books: books.map(book => {
                            return {
                                Id: book._id,
                                Title: book.Title,
                                SubTitle: book.SubTitle,
                                ImageURL: book.ImageURL,
                                Categories: book.Categories,
                                Authors: book.Authors,
                                ISBN: book.ISBN
                            };
                        })
                    });
                }); 
            });
        };

        const usersOutput = users.map(getBooks);
        const usersResult = Promise.all(usersOutput);

        usersResult.then(data => {
            return res.status(200).json(data);
        });
    });
});

router.get('/user/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if(err)
            return res.status(500).json({ Message: 'There was a problem finding the user.' });

        if(!user)
            return res.status(404).json({ Message: 'No user found.' });
        
        Book.find({ _id: { $in: user.Books } }, (err2, books) => {
            return res.status(200).json({
                Id: user._id,
                Name: user.Name,
                Books: books.map(book => {
                    return {
                        Id: book._id,
                        Title: book.Title,
                        SubTitle: book.SubTitle,
                        ImageURL: book.ImageURL,
                        Categories: book.Categories,
                        Authors: book.Authors,
                        ISBN: book.ISBN
                    };
                })
            });
        });
    });
});

module.exports = router;
