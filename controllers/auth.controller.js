const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
    if(!req.body.Name || !req.body.Email || !req.body.Password){
        res.status(400).json({
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
            res.status(500).json({
                Auth: false,
                Message: 'There was a problem registering the user.'
            });
        }

        const token = jwt.sign({ id: user._id }, config.secret);
        res.status(201).json({ Auth: true, Token: token });
    });
});

router.get('/current', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token){
        res.status(401).json({
            Auth: false,
            Message: 'No token provided.'
        });
    }

    jwt.verify(token, config.secret, (err, data) => {
        if(err){
            res.status(500).json({
                Auth: false,
                Message: 'Failed to authenticate token.'
            });
        }

        User.findById(data.id, (err, user) => {
            if(err){
                res.status(500).json({
                    Auth: false,
                    Message: 'There was a problem finding the user.'
                });
            }

            if(!user){
                res.status(404).json({
                    Auth: false,
                    Message: 'No user found.'
                });
            }

            res.status(200).json({
                Auth: true,
                User: user
            });
        });
    });
});

module.exports = router;
