const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

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

// Toutes les routes
app.use((req, res, next) => {
    console.log('Request received');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next();
});

// Route de test avec l'API de dev.to
const devtoRoute = require('./routes/devto');
app.use('/devto', devtoRoute);

// Route SIGNUP
const signupRoute = require('./routes/signup');
app.use('/auth/signup', signupRoute);



module.exports = app;
