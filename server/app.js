const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PORT } = require('./config/env');
const authRouter = require('./routes/auth.route');
const chargingStationRouter = require('./routes/chargingStation.route');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

// Middleware to handle CORS
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// This is a simple route for demonstration
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stations', chargingStationRouter);  // Add charging station routes

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on URL: http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process with failure
});