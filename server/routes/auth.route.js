const express = require('express');
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/me', authMiddleware, getMe);

module.exports = authRouter;