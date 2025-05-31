const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password // Note: Password should be hashed before saving in production
        });

        const validationError = newUser.validateSync();
        if (validationError) {
            return res.status(400).json({ message: validationError.message });
        }

        // generate token and save in cookie
        generateToken(newUser._id, res);

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        user.comparePassword(password, async (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // User authenticated successfully
            await user.save(); // Save user to update last login time or other fields if needed
        });

        // generate token and save in cookie
        generateToken(user._id, res);

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

const logoutUser = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};