const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = require('./app');
const DB = process.env.DB_USER

mongoose.connect(DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Mongodb Successfully!!"))
    .catch((err) => console.log(err.message));
const PORT = 4000
// process.env.PORT ||
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}


app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}...`)
})


exports.module = DB;