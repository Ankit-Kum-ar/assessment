const dotenv = require('dotenv');
dotenv.config({
    path: '.env'
})

const {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    NODE_ENV
} = process.env;

module.exports = {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    NODE_ENV,
}; 