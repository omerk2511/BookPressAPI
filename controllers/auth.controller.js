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
                Message: 'There was a problem registering the user.'
            });
        }

        const token = jwt.sign({ id: user._id }, config.secret);
        res.status(201).json({ auth: true, token: token });
    });
});

module.exports = router;
