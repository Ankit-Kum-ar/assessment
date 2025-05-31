const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
})

const {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    NODE_ENV = 'development', // Default to 'development' if not set
} = process.env;

module.exports = {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    NODE_ENV,
}; 