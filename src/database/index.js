const mongoose = require('mongoose');
require('dotenv').config();

const mongo_url = process.env.MONGODB_URL;

const connect = (url) => {
    mongoose.connect(url || mongo_url);
    mongoose.connection.on("connected", () => {
        console.log("Connected to DB Successfully");
    });

    mongoose.connection.on("error", () => {
        console.log("Connection error")
    });

}

module.exports = connect;