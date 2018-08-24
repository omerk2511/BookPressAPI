const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/auth.config');

const express = require('express');
const router = express.Router();

module.exports = router;
