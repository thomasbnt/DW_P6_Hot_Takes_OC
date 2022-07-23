const resp = require('../modules/responses');
const jwt = require('jsonwebtoken');

class AuthenticateToken {
    authToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (token == null) return resp.invalidCredentials(res); // If there is no token, send error

        jwt.verify(token, process.env.KEY, (err, user) => {
            if (err) return res.sendStatus(403); // If token is not valid, send error
            req.user = user;
        });
    }
}

module.exports = new AuthenticateToken();
