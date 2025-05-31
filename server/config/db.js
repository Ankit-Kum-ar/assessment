const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected successfully at ${new Date().toLocaleString()}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;