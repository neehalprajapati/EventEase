const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connection = mongoose.connect(process.env.mongodb_id);

module.exports = connection;