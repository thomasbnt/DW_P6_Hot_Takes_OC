const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

// On se connecte à la base de donnée mongoDB Atlas.
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.zhjwmay.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log(err));

app.disable("x-powered-by");

function error(message, res) {
    return res.status(400).json({
        error: message
    });
}

function success(message, res) {
    return res.status(200).json({
        success: message
    });
}

// Pour avoir le body dans le request
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Simplement pour tester la route /devto
const fetch = require("node-fetch");

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
    const email = req.body.email;
    const password = req.body.password;

    // Vérifier si l'adresse email est valide
    function checkEmail(email) {
        if (email === undefined || email === '') {
            return false;
        }
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Vérifier si le password est valide
    function checkPassword(password) {
        if (password === undefined || password === '') {
            return false;
        }
        // Simple système de Regex pour vérifier le mot de passe avec un minimum de 6 caractères.
        const regPassword = /^[A-Za-z0-9]\w{6,}$/;
        return regPassword.test(password);
    }

    const emailIsValid = checkEmail(email);
    const passwordIsValid = checkPassword(password);

    if (emailIsValid && passwordIsValid) {
        // On crée un nouvel utilisateur
        const userSchema = new mongoose.Schema({
            userId: {type: Number, unique: true},
            email:  {type: String, required: true},
            password: {type: String, required: true}
        });
        // On le sauvegarde dans la base de donnée
        mongoose.model('user', userSchema);


        console.log('A new user has been created');
        success('Success: You are now signed up on Hot Takes.', res);

    } else {
        !emailIsValid ? error('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? error('Error: Password is required (Make sure that you put at least 6 characters for security reasons).', res) : null;
    }
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
