const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const user = require('../models/user');

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

router.post('/', (req, res, next) => {
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
        // si l'email est déjà dans la base de donnée, alors erreur
        user.findOne({
            email: email
        }).then(findEmail => {
            if (findEmail) {
                console.log('Email already exists');
                return error('Email already exists', res);
            }
            if (findEmail === null) {
                // si l'email n'est pas dans la base de donnée, alors on crée un nouvel utilisateur
                const newUser = new user({
                    email: email,
                    password: password
                });
                newUser.save()
                    .then(() => {
                        console.log('A new user has been created');
                        success('Success: You are now signed up on Hot Takes.', res);
                    })
                    .catch(err => {
                        console.error(err);
                        error("An error occurred while creating a new user", res);
                    });
            }
        })
    } else {
        console.log('Email or password is not valid');
        !emailIsValid ? error('Error: Email is required or you typed it wrong.', res) : null;
        !passwordIsValid ? error('Error: Password is required (Make sure that you put at least 6 characters for security reasons).', res) : null;
    }
});


module.exports = router;
