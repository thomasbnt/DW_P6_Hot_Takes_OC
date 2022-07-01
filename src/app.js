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

// Simplement pour tester la route /devto
const fetch = require("node-fetch");


/*
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
*/

// Toutes les routes
app.use((req, res, next) => {
    console.log('Request received');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/auth/signup', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    console.log('Signup request received');
    console.log(req);
    res.status(201).json({
        message: 'Signup request received'
    })
    next();
});

// Pour les tests de JSON avec l'API de dev.to
app.use('/devto', (req, res, next) => {
    // Récupère depuis https://dev.to/api/articles/latest?username=thomasbnt
    fetch('https://dev.to/api/articles/latest?username=thomasbnt')
        .then(response => response.json())
        .then(data => {
            let allArticles = [];
            data.forEach(article => {
                allArticles.push({
                    title: article.title,
                    url: article.url,
                    description: article.description,
                    published_at: article.published_at,
                    tags: article.tag_list
                });
            })
            res.status(200).json(allArticles);
            next();
        });
})

/*app.use((req, res, next) => {
    res.json({message: 'Hello World !'});
})*/

module.exports = app;
