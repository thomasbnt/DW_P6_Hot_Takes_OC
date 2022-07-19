const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

class CreateToken {
    // Création d'un token pour l'utilisateur
    gen(userId) {
        return jwt.sign(
            {userId: userId},
            process.env.KEY,
            {expiresIn: '1d'}
        )

    }
}

module.exports = new CreateToken();
