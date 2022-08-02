const jwt = require('jsonwebtoken');

class CreateToken {
    // Création d'un token pour l'utilisateur
    gen(findEmail) {
        return jwt.sign(
            {userId: findEmail._id},
            process.env.KEY,
            {expiresIn: '1d'}
        );
    }
}

module.exports = new CreateToken();
