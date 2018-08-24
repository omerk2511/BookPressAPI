const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    if(!req.body.Name || !req.body.Email || !req.body.Password){
        return res.status(400).json({
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

            return res.status(200).json({
                Auth: true,
                Id: user._id,
                Name: user.Name,
                Email: user.Email,
                Books: user.Books
            });
        });
    });
});

router.get('/user/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if(err)
            return res.status(500).json({ Message: 'There was a problem finding the user.' });

        if(!user)
            return res.status(404).json({ Message: 'No user found.' });

        return res.status(200).json({
            Id: user._id,
            Name: user.Name,
            Books: user.Books
        });
    });
});

module.exports = router;
