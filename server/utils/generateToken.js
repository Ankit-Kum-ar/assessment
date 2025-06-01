const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../config/env');

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '1d',
    });
    res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
    });
    return token;
}

module.exports = generateToken;