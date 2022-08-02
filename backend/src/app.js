const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

// On se connecte à la base de donnée mongoDB Atlas.
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zhjwmay.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log(err));

app.disable("x-powered-by");

// Pour avoir le body dans le request
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors({origin: process.env.FRONT_DOMAIN || 'same-origin'}));

app.use('/images', express.static(path.join(__dirname, 'images')));

// Toutes les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Accept', 'application/json, multipart/form-data');
    next();
});

// Route SIGNUP
const signupRoute = require('./routes/signup');
app.use('/auth/signup', signupRoute);

// Route LOGIN
const loginRoute = require('./routes/login');
app.use('/auth/login', loginRoute);

// Route Sauces
const saucesRoute = require('./routes/sauces');
app.use('/api/sauces', saucesRoute);


module.exports = app;
