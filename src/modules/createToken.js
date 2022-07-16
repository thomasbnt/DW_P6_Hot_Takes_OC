const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

class createToken {
    // Création d'un token pour l'utilisateur
    gen(userId) {
        return jwt.sign(
            {userId: userId},
            process.env.KEY,
            {expiresIn: '1800s'}
        )

    }
}

module.exports = new createToken();
