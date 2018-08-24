const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

function verifyToken(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token){
        return res.status(403).json({
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

        req.userId = data.id;
        next();
    });
}

module.exports = verifyToken;
